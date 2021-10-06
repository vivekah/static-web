import * as components from "../../components";
import BaseWidget from "../BaseWidget";

class CarbonOffsetSuccessWidget extends BaseWidget {
    constructor(options = {}) {
        super(options);
        this.input = {
            user: null,
            nonprofit: null,
        };
    }

    async getData(args) {
        let cacheKey = this.getCacheKey(args);
    
        let data = this.data;
    
        if (args.impact)
            return args.impact;
        
        if (cacheKey !== this.cacheKey) {
          this.cacheKey = cacheKey;
          this.input.user = args.user;
          this.input.nonprofit = args.nonprofit;
    
          data = await this.makeAPIRequest("/api/v1/impact/all/", {
            nonprofit: args.nonprofit,
            user: args.user,
          });
        }
        return data;
      }

    headerText(text) {
        return new components.BeamText({
            text: this.options.themeConfig.headerText ? this.options.themeConfig.headerText : text,
            padding: this.options.themeConfig.headerTextPadding || "10px 0",
            color: this.options.themeConfig.headerTextFontColor || this.options.themeConfig.tileTextColor || "#000",
            fontFamily: this.options.themeConfig.fontFamily,
            border: this.options.themeConfig.headerTextBorder,
            margin: this.options.themeConfig.headerTextMargin,
            fontSize: this.options.themeConfig.headerTextFontSize || "small",
        });
    }

    projectTile(project, selected = false, lastItem = false) {
        return new components.BeamContainer({
            border: this.options.themeConfig.tileButtonBorder || "1px solid #f2f2f2",
            cornerRadius: this.options.themeConfig.tileCornerRadius || "50%",
            height: this.options.themeConfig.tileHeight || "145px",
            width: this.options.themeConfig.tileWidth || "145px",
            backgroundColor: this.options.themeConfig.tileButtonBackgroundColor ||
             `#${project.cause_selected_color || 'fff'}` || "rgba(0,0,0,0)",
            margin: lastItem ? "0" : "0 15px 0 0",
            cursor: "pointer",
            overflow: "hidden",
            alignSelf: lastItem ? "stretch" : undefined,
            padding: this.options.themeConfig.tileButtonPadding || "10px",
            textAlign: "center",
            children: [
                new components.BeamText({
                    text: project.cause,
                    textAlign: "center",
                    color: this.options.themeConfig.tileTextColor || "#000",
                    fontFamily: this.options.themeConfig.fontFamily,
                    fontSize: this.options.themeConfig.tileCauseFontSize || "16px",
                    fontWeight: this.options.themeConfig.tileCauseFontWeight || "normal",
                    letterSpacing: this.options.themeConfig.tileCauseLetterSpacing || "2px",
                    margin: this.options.themeConfig.tileCauseMargin || "20px auto 10px",
                    textTransform: this.options.themeConfig.tileCauseTextTransform || "uppercase",
                }),
                new components.BeamImage({
                    src: project.cause_icon,
                    height: this.options.themeConfig.tileImageHeight || "60%",
                    width: "auto",
                    margin: "auto"
                })
            ]
        });
    }

    link(text, href, target) {
        return new components.BeamAnchor({
            text: this.options.themeConfig.useArrowInLinkText
                ? `${text}>`
                : `
        <div style="diplay: -ms-flexbox !important;display: flex !important;-ms-flex-direction: row !important;flex-direction: row !important;-ms-flex-align: center;align-items: center;">
            ${text} 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
        </div>`,
            fontFamily: this.options.themeConfig.fontFamily,
            fontWeight: this.options.themeConfig.linkFontWeight || "normal",
            fontSize: this.options.themeConfig.linkTextFontSize || "small",
            color: this.options.themeConfig.linkTextColor || "#000",
            asLink: this.options.themeConfig.underlineLink || false,
            margin: "0",
            href: href,
            target
        });
    }

    buildMobileView(project) {
        let container = new components.BeamContainer({
            children: [
                // header text
                this.headerText(
                    `We offest the carbon emissions from every purchase`
                ),
                new components.BeamFlexWrapper({
                    noWrap: true,
                    children: [
                        // project tile
                        this.projectTile(project),

                        // project details
                        new components.BeamContainer({
                            children: [
                                // prooject impact
                                new components.BeamText({
                                    text: `Thanks for being a part in our mission to be climate beneficial. Your purchase's <span style="font-weight: ${this.options.themeConfig.offsetTotal || "bold"};">${'10 kgs'}</span> of carbon impact will be offset by ${project.impact_details}`,
                                    margin: this.options.themeConfig.successTextMargin || "0px 0px 7px 0px",
                                    fontSize: this.options.themeConfig.successTextSize || "medium",
                                }),

                                // learn more links
                                this.link("Learn more about calculating carbon impact", this.options.themeConfig.calculateImpactLink || "#"),
                                this.link("See all of the impact by the Mate community", this.options.themeConfig.communityImpactLink || "#")

                            ]
                        })
                    ]
                })
            ],
        });

        return container.view;
    }

    buildDesktopView(project, selectedProject = null) {
        return this.buildMobileView(project, selectedProject);
    }

    async render(args = {}) {

        await super.render(args, () => {
            if (this.isMobile) {
                return this.buildMobileView(args.impact);
            } else {
                return this.buildDesktopView(args.impact);
            }
        });
    }
}

export default CarbonOffsetSuccessWidget;