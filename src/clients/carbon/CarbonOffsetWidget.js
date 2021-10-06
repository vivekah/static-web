import * as components from "../../components";
import BaseWidget from "../BaseWidget";

class CarbonOffsetWidget extends BaseWidget {
    constructor(options = {
        isPreCheckout: false,
        hidePoweredBy: true,
        selectedNonprofitCallback: (nonprofit, store) => {
            console.log("selected nonprofit:", nonprofit);
            console.log("store info:", store);
        },
        nonprofitChangedCallback: () => {
            console.log("nonprofit changed");
        },
        themeConfig: {
            submitButtonBackgroundColor: "rgb(104, 99, 75)",
            submitButtonCornerRadius: "",
            submitButtonMargin: "auto",
            submitButtonPadding: "7px 15px",
            submitButtonTextColor: "white",
            submitButtonTextWeight: "normal",
            submitButtonTextSize: "17px",
        }
    }) {
        super(options);

        this.input = {
            store: null,
            user: null,
            postalCode: null,
            countryCode: null,
            showCommunityImpact: null,
        };

        this.cartTotal = 0.0;
    }

    getProjects() {
            return this.data.nonprofits.map((nonprofit) => {
                return {
                    ...nonprofit,
                    onClick: async () => {
                        if (this.lastNonprofit && this.options.selectedNonprofitCallback) {
                            this.options.selectedNonprofitCallback(nonprofit, this.data.store);
                            if (!this.options.renderAfterSelection) return;
                        }
                        this.lastNonprofit = nonprofit;
                        await this.render({ ...this.input });
                    },
                };
            });
    }

    headerText(text) {
        return new components.BeamText({
            text: this.options.themeConfig.headerText ? this.options.themeConfig.headerText : text,
            textAlign: this.options.themeConfig.headerTextAlign || "center",
            padding: this.options.themeConfig.headerTextPadding || "10px 0",
            color: this.options.themeConfig.headerTextFontColor || this.options.themeConfig.tileTextColor || "#000",
            fontFamily: this.options.themeConfig.headerFontFamily || this.options.themeConfig.fontFamily,
            border: this.options.themeConfig.headerTextBorder,
            margin: this.options.themeConfig.headerTextMargin,
            fontSize: this.options.themeConfig.headerTextFontSize || "small",
        });
    }

    emmissionsText(amount = "10 kgs", text = "&nbspof carbon emmissions were created in the manufacturing of your purchase.") {
        return new components.BeamFlexWrapper({
            justifyContent: "center",
            centerItems: true,
            children: [
                new components.BeamText({
                    text: amount,
                    fontFamily: this.options.themeConfig.emmissionsStatFontFamily || this.options.themeConfig.headerFontFamily || this.options.themeConfig.fontFamily,
                    fontSize: this.options.themeConfig.emmissionsTotalFontSize || "55px",
                    fontWeight: this.options.themeConfig.emmissionsTotalFontWeight || "bold",
                    margin: this.options.themeConfig.emmissionsTextMargin || "0px 16px 0px 0px",

                }),
                new components.BeamContainer({
                    width: this.options.themeConfig.emmissionsDescriptionWidth || "45%",
                    children: [
                        new components.BeamText({
                            text: text,
                            fontSize: "16px",
                            fontFamily: this.options.themeConfig.fontFamily,
                        })
                    ]
                }),
            ]
        })
    }

    projectTile(project, selected = false, lastItem = false) {
        return new components.BeamContainer({
            border: selected ? this.options.themeConfig.selectedBorder || "1px solid #000" : this.options.themeConfig.tileButtonBorder || "1px solid #f2f2f2",
            cornerRadius: this.options.themeConfig.tileCornerRadius || "50%",
            height: this.options.themeConfig.tileHeight || "145px",
            width: this.options.themeConfig.tileWidth || "145px",
            backgroundColor: selected  
            ? this.options.themeConfig.selectedProjectBackgroundColor || `#${project.cause_selected_color || 'fff'}`
            : this.options.themeConfig.tileButtonBackgroundColor || "rgba(0,0,0,0)",
            clickListener: project.onClick,
            margin: this.options.themeConfig.tileButtonMargin, // lastItem ? "0" : "0 15px 0 0",
            cursor: "pointer",
            overflow: "hidden",
            textAlign: "center",
            alignSelf: lastItem ? "stretch" : undefined,
            padding: this.options.themeConfig.tileButtonPadding || "10px",
            children: [
                new components.BeamText({
                    text: project.cause,
                    textAlign: "center",
                    color: this.options.themeConfig.tileTextColor || "#FFF",
                    fontFamily: this.options.themeConfig.fontFamily,
                    fontSize: this.options.themeConfig.tileCauseFontSize || "16px",
                    fontWeight: this.options.themeConfig.tileCauseFontWeight || "normal",
                    letterSpacing: this.options.themeConfig.tileCauseLetterSpacing || "2px",
                    margin: this.options.themeConfig.tileCauseMargin || "20px auto 10px",
                    textTransform: this.options.themeConfig.tileCauseTextTransform || "uppercase",
                }),
                new components.BeamImage({
                    src: project.cause_selected_image, //selected ? project.cause_selected_image : project.cause_icon,
                    height: this.options.themeConfig.tileImageHeight || "55px",
                    width: "auto",
                    margin: this.options.themeConfig.tileImageHeight || "0px auto"
                })
            ]
        });
    }

    selectedProject(project) {
        const impact = project.impact_description;
        const multiplierTemplate = impact.substring(impact.lastIndexOf("<"), impact.lastIndexOf(">") + 1);
        const offsetMultiplier = parseFloat(multiplierTemplate.substring(1, multiplierTemplate.length - 1));
        const offsetImpact = (this.cartTotal * offsetMultiplier).toFixed(2);

        return new components.BeamContainer({
            id: 'beam-carbon-selection-text-container',
            backgroundColor: this.options.themeConfig.selectedTextBackgroundColor || "rgb(104, 100, 175)",
            padding: this.options.themeConfig.selectedTextPadding || "7px 15px",
            margin: this.options.themeConfig.selectedTextMargin || "5px",
            cornerRadius: this.options.themeConfig.selectedTextCornerRadius || "8px",
            children: [
                new components.BeamText({
                    fontFamily: this.options.themeConfig.fontFamily,
                    text: `We will offset your carbon by: ${project.impact_description.replace(multiplierTemplate, offsetImpact)}`,
                    color: this.options.themeConfig.selectedTextColor,
                    fontSize: this.options.themeConfig.selectedTextSize,
                    fontWeight: this.options.themeConfig.selectedTextWeight,
                    textAlign: this.options.themeConfig.selectedTextAlign || "center"
                })
            ]
        })
    }


    getCacheKey(input) {
        let str = `${input.store || ""}${input.user || ""}${input.postal_code || ""
            }${input.country_code || ""}`;
        return super.getCacheKey(str);
    }

    getCartTotal(inputTotal) {
        let cartTotal =
            inputTotal && !isNaN(inputTotal)
                ? parseFloat(inputTotal)
                : this.cartTotal;

        if (cartTotal !== this.cartTotal && this.userDidMatch && this.lastNonprofit)
            this.invokeUserDidMatchCallback = true;

        return cartTotal;
    }

    handleSubmission(e) {
        console.log("selection");

        if (this.options.selectedNonprofitCallback) {
            this.options.selectedNonprofitCallback(nonprofit, this.data.store);
        }
    }

    async getData(args = {}) {
        // prep data inputs
        let queryParams = {
            store: args.store || null,
            user: args.user || null,
            postal_code: args.postalCode || null,
            country_code: args.countryCode || null,
            show_community_impact: args.showCommunityImpact || null,
        };

        // set cart total
        this.cartTotal = this.getCartTotal(args.cartTotal);

        // check if inputs are already cached
        let cacheKey = this.getCacheKey(queryParams);

        // set cache as data
        let data = this.data;

        if (cacheKey !== this.cacheKey) {
            // set new entries
            this.cacheKey = cacheKey;
            this.input.store = queryParams.store;
            this.input.user = queryParams.user;
            this.input.postalCode = queryParams.postal_code;
            this.input.countryCode = queryParams.country_code;
            this.input.showCommunityImpact = queryParams.show_community_impact;

            // get data from backend
            data = await this.makeAPIRequest("/api/v1/nonprofits/", queryParams);

            // get last nonprofit
            if (data && data.last_nonprofit)
                this.lastNonprofit = data.nonprofits.find(
                    (x) => x.id === data.last_nonprofit
                );
        }

        return data;
    }

    buildMobileView(projects, selectedProject = null) {
        let container =  new components.BeamContainer({
            children: [
                // header text
                this.headerText(
                    `We offset the carbon emmissions from every purchase`
                ),
                // emmissions text
                this.emmissionsText(`${this.cartTotal} kg${this.cartTotal != 1 ? 's': ''}` || "10 kgs"),
                // selection text
                new components.BeamText({
                    text: "<b>Choose</b> a type of carbon offset project for us to invest in to offset that impact", 
                    margin: this.options.themeConfig.callToActionTextMargin || "10px 0px",
                    fontSize: this.options.themeConfig.callToActionTextSize || "medium",
                    textAlign: this.options.themeConfig.callToActionTextAlign || "center",
                    fontFamily: this.options.themeConfig.fontFamily,
                }),
                // carbon offset project list
                new components.BeamFlexWrapper({
                    margin: "15px 0px",
                    noWrap: true,
                    alignItems: "flex-end",
                    justifyContent: "space-evenly",
                    children: [
                        ...projects.map((project, index) =>
                            this.projectTile(
                                project,
                                selectedProject && project.id === selectedProject.id,
                                index + 1 === projects.length
                            )
                        ),
                    ]
                }),
                selectedProject && this.selectedProject(selectedProject),
                selectedProject &&
                    new components.BeamContainer({
                        width: "100%",
                        // margin: "0px auto",
                        textAlign: "center",
                        children: [
                            new components.BeamButton({
                                id: 'beam-carbon-offset-submission-button',
                                text: "Submit",
                                fontFamily: this.options.themeConfig.fontFamily,
                                clickListener: () => {
                                    this.options.submitCarbonSelectionCallback(selectedProject, this.data.store)
                                },
                                color: this.options.themeConfig.submitButtonTextColor || "#FFF",
                                backgroundColor: this.options.themeConfig.submitButtonBackgroundColor || "green",
                                padding: this.options.themeConfig.submitButtonPadding,
                                fontWeight: this.options.themeConfig.submitButtonTextWeight,
                                fontSize: this.options.themeConfig.submitButtonTextSize,
                                cornerRadius: this.options.themeConfig.submitButtonCornerRadius || "30px",
                                margin: this.options.themeConfig.submitButtonMargin,

                            })
                        ]
                    })
            ],
        });

        return container.view;
    }

    buildDesktopView(projects, selectedProject = null) {
        return this.buildMobileView(projects, selectedProject);
    }


    async render(args = {}) {
        await super.render(args, () => {
            let projects = this.getProjects();
            // projects = projects.filter(x => {
            //     return ["Food Relief", "Education", "Sustainability"].includes(x.cause)
            //   });
            
            if (this.isMobile) {
                return this.buildMobileView(projects, this.lastNonprofit);
            } else {
                return this.buildDesktopView(projects, this.lastNonprofit);
            }
        });
    }

}

export default CarbonOffsetWidget;