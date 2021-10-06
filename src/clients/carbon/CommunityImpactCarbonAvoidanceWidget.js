import * as components from "../../components";
import BaseImpactWidget from "../BaseImpactWidget";

class CommunityImpactCarbonAvoidanceWidget extends BaseImpactWidget {
  constructor(options = {
    beamCommunityData: null,
    themeConfig: {
      textCololr: "#FFF",
      avoidanceTotalRowWidth: "555px",
      avoidanceTotalFontSize: "36px",
      avoidanceTotalFontWeight: "400",
      avoidanceTotalFontMargin: "0px 10px 0px 80px",
      avoidanceTotalText: "3,490,390",
      avoidanceLabelText: " kgs of CO2 emission prevented",
      avoidanceLabelFontSize: "18px",
    }
  }) {
    super(options);
  }

  calculcateMiles(avoidance_total) {
    // average vehicle emits about 404 grams of CO2 per mile
    return (avoidance_total / 0.404).toFixed(2)
  }

  calculcateLights(avoidance_total) {
    // average coal powered lightbulb emits 870 grams of CO2 per 1KWh
    return (avoidance_total / 0.870).toFixed(2)
  }

  calculcateLaptopCharge(avoidance_total) {
    // average aptop that is on for eight hours a day uses between
    // 150 and 300 kWh and emits between 44 and 88 kg of CO2 per year.
    return (avoidance_total / 0.088).toFixed(2)
  }

  async getData(args) {
    let cacheKey = this.getCacheKey(args);

    let data = this.data;

    if (this.options.beamCommunityData){
      return this.options.beamCommunityData
    }
    
    if (cacheKey !== this.cacheKey) {
      this.cacheKey = cacheKey;
      this.input.user = args.user;
      this.input.nonprofit = args.nonprofit;

      data = await this.makeAPIRequest("/api/v1/impact/carbon", {
        nonprofit: args.nonprofit,
        user: args.user,
      });
    }

    return data;
  }

  buildMobileView() {
    let container = new components.BeamContainer({
      children: [
        new components.BeamContainer({
          margin: "0 0 10px",
          children: !this.options.themeConfig.hideLogo && [
            this.headerLogoComponent(
              this.options.themeConfig.usePartnerRectLogo
                ? this.data.chain.rect_logo
                : this.data.chain.logo),
          ],
        }),
        ...this.data.nonprofits.map(
          (project) =>
            new components.BeamContainer({
              margin: "10px",
              children: [this.outerCard(project)],
            })
        ),
      ],
    });

    return container.view;
  }

  buildDesktopView() {
    let data = this.beamCommunityData ? this.beamCommunityData : this.data;
    let container = new components.BeamContainer({
      children: [
        // prevented CO2 text
        new components.BeamFlexWrapper({
          width: this.options.themeConfig.avoidanceTotalRowWidth,
          justifyContent: "center",
          children: [
            new components.BeamContainer({
              borderBottom: `3px solid ${this.options.themeConfig.textColor || '#000'}`,
              margin: this.options.themeConfig.avoidanceTotalContainerMargin || "0px 0px 10px 25%", //"0 0 10px",
              children: [
                new components.BeamText({
                  text: data.match_cumulative_impact ? Math.floor(data.match_cumulative_impact.value) : "34,201",
                  color: this.options.themeConfig.textColor,
                  fontFamily: this.options.themeConfig.fontFamily,
                  fontSize: this.options.themeConfig.avoidanceTotalFontSize,
                  fontWeight: this.options.themeConfig.avoidanceTotalFontWeight,
                  padding: "0px 0px, 5px",
                  margin: this.options.themeConfig.avoidanceTotalFontMargin,
                }),
              ]
            }),
            new components.BeamText({
              text: this.options.themeConfig.avoidanceLabelText || "kgs of CO2 emission prevented",
              color: this.options.themeConfig.textColor,
              fontFamily: this.options.themeConfig.fontFamily,
              fontSize: this.options.themeConfig.avoidanceLabelFontSize,
              margin: this.options.themeConfig.avoidanceLabelMargin || "0px 0px 0px 15px"
            }),

          ]
        }),
        new components.BeamText({
          text: `...that's like`,
          color: "#FFF",
          fontFamily: this.options.themeConfig.headerText,
          fontSize: this.options.themeConfig.snippetTextSize || "22px",
          margin: this.options.themeConfig.snippetTextMargin || "15px 0px",
          textAlign: "center",
          fontWeight: "bold"
        }),
        // projects
        new components.BeamFlexWrapper({
          margin: "10px 0 0 0",
          alignItems: "flex-end",
          // wrap: !this.options.themeConfig.noWrap,
          children: [
            // Driving stats
              new components.BeamContainer({
                backgroundColor: this.options.themeConfig.tileBackgroundColor,
                width: this.options.themeConfig.tileWidth || "255px",
                margin: "auto",
                children: [
                  //cause Icon
                  new components.BeamImage({
                    src: "https://d1jhb45gnbgj0c.cloudfront.net/cause_logo/noun_Car_584789.png",
                    width: this.options.themeConfig.tileCauseIconWidth || "auto",
                    height: this.options.themeConfig.tileCauseIconHeight || "auto"
                  }),
                  // project stats
                  new components.BeamContainer({
                    width: "auto",
                    margin: "auto",
                    children: [
                      new components.BeamText({
                        text: `Driving <b>${this.calculcateMiles(data.match_cumulative_impact ? data.match_cumulative_impact.value : 34,201)}</b> miles`,
                        color: this.options.themeConfig.textColor,
                        fontFamily: this.options.themeConfig.fontFamily,
                        fontSize: this.options.themeConfig.tileStatFontSize,
                        fontWeight: this.options.themeConfig.tileStatFontWeight,
                        padding: this.options.themeConfig.tileStatFontPadding || "0px 0px, 5px",
                        margin: this.options.themeConfig.avoidanceTotalFontMargin,
                        textAlign: "center"
                      }),
                    ]
                  }),
                ],
              }),

            // running a light stats
            new components.BeamContainer({
              backgroundColor: this.options.themeConfig.tileBackgroundColor,
              width: this.options.themeConfig.tileWidth || "255px",
              margin: "auto",
              children: [
                //cause Icon
                new components.BeamImage({
                  src: "https://d1jhb45gnbgj0c.cloudfront.net/cause_logo/noun_lightbulb_1263016.png",
                  width: "auto",
                  height: this.options.themeConfig.tileCauseIconHeight
                }),
                // project stats
                new components.BeamContainer({
                  width: "auto",
                  margin: "auto",
                  children: [
                    new components.BeamText({
                      text: `Running the lights in 1 room for <b>${this.calculcateLights(data.match_cumulative_impact ? data.match_cumulative_impact.value : "34,201")}</b> months`,
                      color: this.options.themeConfig.textColor,
                      fontSize: this.options.themeConfig.tileStatFontSize,
                      fontFamily: this.options.themeConfig.fontFamily,
                      fontWeight: this.options.themeConfig.tileStatFontWeight,
                      padding: this.options.themeConfig.tileStatFontPadding || "0px 0px, 5px",
                      margin: this.options.themeConfig.avoidanceTotalFontMargin,
                      textAlign: "center"
                    }),
                  ]
                }),
              ],
            }),

            // laptop charging stats
            new components.BeamContainer({
              backgroundColor: this.options.themeConfig.tileBackgroundColor,
              width: this.options.themeConfig.tileWidth || "255px",
              margin: "auto",
              children: [
                //cause Icon
                new components.BeamImage({
                  src: "https://d1jhb45gnbgj0c.cloudfront.net/cause_logo/noun_laptop+charge_820171.png",
                  width: "auto",
                  height: this.options.themeConfig.tileCauseIconHeight
                }),
                // project stats
                new components.BeamContainer({
                  width: "auto",
                  margin: "auto",
                  children: [
                    new components.BeamText({
                      text: `Charging 1 laptop for <b>${data.match_cumulative_impact ? data.match_cumulative_impact.value : "34,201"}</b> days`,
                      color: this.options.themeConfig.textColor,
                      fontSize: this.options.themeConfig.tileStatFontSize,
                      fontFamily: this.options.themeConfig.fontFamily,
                      fontWeight: this.options.themeConfig.tileStatFontWeight,
                      padding: this.options.themeConfig.tileStatFontPadding || "0px 0px, 5px",
                      margin: this.options.themeConfig.avoidanceTotalFontMargin,
                      textAlign: "center"
                    }),
                  ]
                }),
              ],
            })
          ]
          // data.map(
          //   (project, index) =>
          //     new components.BeamContainer({
          //       backgroundColor: this.options.themeConfig.tileBackgroundColor,
          //       width: "auto",
          //       margin: "auto",
          //       alignSelf:
          //         index + 1 === data.length
          //           ? "stretch"
          //           : undefined,
          //       children: [
          //         //cause Icon
          //         new components.BeamImage({
          //           src: project.cause_icon,
          //           width: "auto",
          //           height: this.options.themeConfig.tileCauseIconHeight
          //         }),
          //         // project stats
          //         new components.BeamContainer({
          //           width: "auto",
          //           margin: "auto",
          //           children: [
          //             new components.BeamText({
          //               text: this.options.themeConfig[`avoidanceStat${index}stat`] || "300",
          //               color: this.options.themeConfig.textColor,
          //               fontSize: this.options.themeConfig.tileStatFontSize,
          //               fontWeight: this.options.themeConfig.tileStatFontWeight,
          //               padding: this.options.themeConfig.tileStatFontPadding || "0px 0px, 5px",
          //               margin: this.options.themeConfig.avoidanceTotalFontMargin,
          //               textAlign: "center"
          //             }),
          //             // new components.BeamText({
          //             //   text: this.options.themeConfig[`avoidanceStat${index}Text`] || "300",
          //             // }),

          //           ]
          //         }),
          //       ],
          //     })
          // ),
        }),
      ],
    });

    return container.view;
  }

  async render(nonprofit = null) {
    await super.render({ nonprofit, user: null }, () => {
      return this.isMobile ? this.buildMobileView() : this.buildDesktopView();
    });
  }
  
}

export default CommunityImpactCarbonAvoidanceWidget;