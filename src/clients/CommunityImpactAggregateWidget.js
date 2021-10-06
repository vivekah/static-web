import BaseImpactWidget from "./BaseImpactWidget";
import * as components from "../components";

class CommunityImpactAggregateWidget extends BaseImpactWidget {
  constructor(
    options = {
      themeConfig: {
        backgroundColor: "#fff",
        borderRadius: "10px",
        titleTextTransform: "none",
        headerTextTransform: "uppercase",
        headertTextMargin: "0 0 10px",
        headerTextWeight: "600",
        hideBorders: false,
        hideTabs: false,
        hideLogo: false,
        percentageTextColor: undefined,
        showLink: false,
        linkTextFontSize: "small",
        impactBannerHeight: "700px",
        impactBannerWidth: "40%",
        impactDetailsHeight: "700px",
        impactDetailsWidth: "60%",
        impactDetailsAlignItems: "center",
      },
    }
  ) {
    super(options);
    this.currentCause = null;
    this.maxContainerWidth = 570;
  }

  get causes() {
    return [null, ...new Set(this.data.nonprofits.map((x) => x.cause))];
  }

  get nonprofits() {
    return this.currentCause
      ? this.data.nonprofits.filter((x) => x.cause === this.currentCause)
      : this.data.nonprofits;
  }

  async render(nonprofit = null) {
    await super.render({ nonprofit, user: null }, () => {
      return this.isMobile ? this.buildMobileView() : this.buildDesktopView();
    });
  }

  convertToNumber(a) {
    a = a.replace(/\,/g,'');
    a = parseInt(a,10);
    return a;
  }

  animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (start + end) - start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  innerTile(nonprofit) {
      return new components.BeamContainer({
          children: [
              new components.BeamFlexWrapper({
                  children: [
                        new components.BeamContainer({
                            width: "30%",
                            children: [
                                new  components.BeamContainer({
                                    width: "70%",
                                    borderBottom: "3px solid #000",
                                    margin: "0 0 10px",
                                    children: [
                                        new components.BeamText({
                                            text: this.convertToNumber(nonprofit.community_goal_completion.value),
                                            textAlign: "center",
                                            fontSize: this.options.themeConfig.tileNumberFontSize || "1.7em",
                                            fontFamily: this.options.themeConfig.fontFamily,
                                            color: this.options.themeConfig.textColor || "#000",
                                            addAttribute: true,
                                            dataStart: 0,
                                            dataEnd: this.convertToNumber(nonprofit.community_goal_completion.value),
                                            className: "stepUpCounter"
                                        })
                                    ]
                                })
                            ]
                        }),
                        new components.BeamContainer({
                            width: "70%",
                            padding: "0 10px 0 0",
                            children: [
                                // impact info
                                new components.BeamText({
                                    text: `${nonprofit.community_goal_completion.summary} through ${nonprofit.name}`
                                    .replace(
                                      "{value}",
                                      nonprofit.community_goal_completion.value
                                    )
                                    .replace(
                                      "{unit}",
                                      nonprofit.community_goal_completion.unit
                                    ),
                                    fontSize: this.options.themeConfig.tileFontSize || "medium",
                                    fontFamily: this.options.themeConfig.fontFamily,
                                    color: this.options.themeConfig.textColor || "#000",
                                    margin: "0",
                                    lineHeight: "20px",
                                }),
                            ]
                        })
                  ]
              })
          ]
      })
  }

  buildMobileView() {
    let container = new components.BeamContainer({
      children: [
        new components.BeamContainer({
          margin: "30px 0 0",
          children: [
            new components.BeamContainer({
                children: [
                    new components.BeamCard({
                        height: "300px",
                        width: "100%",
                        overflow: "hidden",
                        margin: "0",
                        border: "0",
                        cornerRadius: "0",
                        backgroundColor: "#000",
                        children: [
                            // card image
                            new components.BeamCardImage({
                                src: this.options.themeConfig.sectionImageUrl,
                                height: this.options.themeConfig.sectionImageHeight || "100%",
                                objectFit: "cover",
                            }),
                        ],

                    }),
                    new components.BeamContainer({
                        padding: "15px",
                        children: [
                            new components.BeamContainer({
                                children: [
                                    new components.BeamContainer({
                                        children: [
                                            new components.BeamText({
                                                tag: "h1",
                                                fontSize: this.options.themeConfig.headerMobileFontSize || "2em",
                                                textTransform: "uppercase",
                                                text: this.options.themeConfig.headerText || "What we've unded so far",
                                                fontWeight: "600",
                                                fontFamily: this.options.themeConfig.fontFamily,
                                                color: this.options.themeConfig.textColor || "#000",
                                                margin: "0",
                                            }),
                                            new components.BeamText({
                                                tag: "h6",
                                                text: this.options.themeConfig.subHeaderText || "See the impact we are all making together. Place an order to help us reach goals faster.",
                                                margin: "0",
                                                fontFamily: this.options.themeConfig.fontFamily,
                                                fontSize: this.options.themeConfig.subHeaderFontSize || "16px",
                                                color: this.options.themeConfig.textColor || "#000",
                                                letterSpacing: "1px",
                                            }),
                                        ]
                                    }),
                                    new components.BeamContainer({
                                        margin: "60px 0 0",
                                        children: [
                                            ...this.data.nonprofits
                                            .filter((nonprofit) => nonprofit.community_goal_completion)
                                            .map(
                                                (nonprofit) =>
                                                    new components.BeamContainer({
                                                    margin: "30px 0",
                                                    children: [this.innerTile(nonprofit)],
                                                })
                                            ),
                                        ]
                                    }),
                                ]
                            })
                        ]
                    })
                ]
            }),
          ],
        }),
      ],
    });

    return container.view;
  }

  buildDesktopView() {
    let container = new components.BeamContainer({
        margin: "50px 0 0",
        children: [
            new components.BeamFlexWrapper({
                children: [
                    new components.BeamCard({
                        height: this.options.themeConfig.sectionImageHeight || "525px",
                        width: "40%",
                        overflow: "hidden",
                        margin: "0",
                        border: "0",
                        cornerRadius: "0",
                        backgroundColor: "#000",
                        children: [
                            // card image
                            new components.BeamCardImage({
                                src: this.options.themeConfig.sectionImageUrl,
                                height: "100%",
                                objectFit: "cover",
                            }),
                        ],

                    }),
                    new components.BeamFlexWrapper({
                        height: "700px",
                        width: "60%",
                        padding: "15px",
                        centerItems: true,
                        alignItems: this.options.themeConfig.impactDetailsAlignItems,
                        children: [
                            new components.BeamContainer({
                                maxWidth: "500px",
                                children: [
                                    new components.BeamContainer({
                                        children: [
                                            new components.BeamText({
                                                tag: "h1",
                                                fontSize: this.options.themeConfig.headerDesktopFontSize || "2.4em",
                                                textTransform: this.options.themeConfig.headerTextTransform,
                                                text: this.options.themeConfig.headerText || "What we've funded so far",
                                                fontWeight: this.options.themeConfig.headerTextWeight,
                                                fontFamily: this.options.themeConfig.headerFontFamily || this.options.themeConfig.fontFamily,
                                                color: this.options.themeConfig.textColor || "#000",
                                                margin: this.options.themeConfig.headertTextMargin
                                            }),
                                            new components.BeamText({
                                                tag: "h6",
                                                text: this.options.themeConfig.subHeaderText || "See the impact we are all making together. Place an order to help us reach goals faster.",
                                                margin: "0",
                                                fontSize: this.options.themeConfig.subHeaderFontSize || "16px",
                                                fontFamily: this.options.themeConfig.subHeaderFontFamily || this.options.themeConfig.fontFamily,
                                                color: this.options.themeConfig.textColor || "#000",
                                                letterSpacing: "1px",
                                            }),
                                        ]
                                    }),
                                    new components.BeamContainer({
                                        margin: "60px 0 0",
                                        children: [
                                            ...this.data.nonprofits
                                            .filter((nonprofit) => nonprofit.community_goal_completion)
                                            .map(
                                                (nonprofit) =>
                                                    new components.BeamContainer({
                                                    margin: "30px 0",
                                                    children: [this.innerTile(nonprofit)],
                                                })
                                            ),
                                        ]
                                    }),
                                ]
                            })
                        ]
                    })
                ]
            })
        ],
    });

    return container.view;
  }
}

export default CommunityImpactAggregateWidget;
