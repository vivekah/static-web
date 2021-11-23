import BaseImpactWidget from "./BaseImpactWidget";
import * as components from "../components";
import {nonprofitUtil, translations} from '../utils/';

class InstacartCommunityImpactWidget extends BaseImpactWidget {
  constructor(
    options = {
      beamCommunityData: null,
      themeConfig: {
        backgroundColor: "#fff",
        borderRadius: "10px",
        causeTypeLetterSpacing: "3px",
        causeTypeFontSize: "small",
        causeTypeTransform: "uppercase",
        causeTitleFontSize: "large",
        impactDetailsFontSize: "small",
        impactDetailsFontWeight: "normal",
        impactDetailsLineHeight: "normal",
        titleTextTransform: "none",
        hideBorders: false,
        hideTabs: true,
        filterByRegion: false,
        hideLogo: false,
        percentageTextColor: undefined,
        showLink: false,
        showGoalCompletionCount: true,
        wrapOverflow: false,
        linkTextFontSize: "small",
        progressBarWidth: "85%",
        progressBarBorder: "none",
        tileHeight: '300px',
        showNational: false
      },
    }
  ) {
    super(options);
    this.currentTabData = null;
    this.maxContainerWidth = 570;
    this.options.regionsToIgnore = this.options.regionsToIgnore || ['DNS'];
    this.regions = null;
  }


  get causes() {
    // return [null, ...new Set(this.data.nonprofits.map((x) => x.cause))];
    return [null, ...new Set(this.options.impactData.community_impact.map((x) => x.cause))];
  }

  async fetchRegions() {
    // console.log(" OPTIONS", this.options)
    const data = await this.makeAPIRequest("api/v2/chains/impact/regional", {
      chain: this.options.chainId,
    }, this.options.webBaseUrl );

    // console.log(" REGIONS ", Object.keys(data))

    return [null, ...new Set(Object.keys(data))]
  }

  get nonprofits() {
    return this.options.impactData.community_impact

  }

  async render(args) {

    await super.render(args, () => {
      return this.buildDesktopView(this.isMobile, args.impactData);
    });
  }

  link(text, href) {
    return new components.BeamContainer({
      textAlign: "right",
      width: "100%",
      children: [
        new components.BeamAnchor({
          text: `${text}`,
          asLink: (this.options.themeConfig.learnMoreAsLink !== undefined) ? this.options.themeConfig.learnMoreAsLink : true,
          fontFamily: this.options.themeConfig.fontFamily,
          fontWeight: this.options.themeConfig.learnMoreFontWeight || "bold",
          fontSize: this.options.themeConfig.linkTextFontSize || "small",
          margin: "0",
          href: href,
          color: this.options.themeConfig.learnMoreTextColor || this.options.themeConfig.textColor,
          style: {...this.options.themeConfig?.link?.style}
        }),
      ],
    });
  }

  innerCard(nonprofit) {
    const height = this.options.themeConfig.impactImageHeight || "150px";
    return new components.BeamCard({
      border: "none",
      height,
      cornerRadius: `${this.options.themeConfig.borderRadius || "10px"} 
        ${this.options.themeConfig.borderRadius || "10px"} 0 0`,
      overflow: "hidden",
      margin: "0",
      style: {
        ...this.options?.themeConfig?.innerCard?.style,
        ...this.isMobile ? this.options.themeConfig.innerCard?.mobileStyle : {}

      },
      children: [
        // card image
        new components.BeamCardImage({
          src: nonprofit.image,
          height,
          objectFit: "cover",
          style: {
            ...this.options?.themeConfig?.cardImage?.style,
            ...this.isMobile ? this.options.themeConfig.cardImage?.mobileStyle : {}
          },
        }),
        // overlay
        new components.BeamCardOverlay({
          background: this.options.themeConfig.tileOverlayBackground,
          style: {
            ...this.options?.themeConfig?.cardOverlay?.style,
            ...this.isMobile ? this.options.themeConfig.cardOverlay?.mobileStyle : {}
          },
          children: [
            // text
            new components.BeamContainer({
              padding: this.options.themeConfig.tileOverlayPadding || "1.25rem 2.25rem",
              pos: {
                position: "absolute",
                right: "0",
                bottom: "0",
                left: "0",
              },
              style: {
                ...this.options?.themeConfig?.textContainer?.style,
                ...this.isMobile ? this.options.themeConfig.textContainer?.mobileStyle : {}
              },
            }),
          ],
        }),
      ],
    });
  }

  outerCard(nonprofit) {
    const tileHeight = this.options.themeConfig.tileHeight || "300px";
    return new components.BeamCard({
      padding: !this.options.themeConfig.hideBorders && "10px",
      border: this.options.themeConfig.border || "none",
      cornerRadius: this.options.themeConfig.borderRadius || "10px",
      backgroundImage:
        !this.options.themeConfig.hideBorders &&
        `linear-gradient(to right, ${this.gradientColors})`,
      margin: "0",
      height: tileHeight,
      style: {
        margin: "10px 10px 10px 10px",
        ...this.options?.themeConfig?.outerCard?.style,
        ...this.isMobile ? this.options.themeConfig.outerCard?.mobileStyle : {}

      },
      children: [
        // inner card
        nonprofit && this.innerCard(nonprofit),
        // card body
        nonprofit && this.cardBody(nonprofit)
      ],
    });
  }

  cardBody(nonprofit) {
    const tileHeight = this.options.themeConfig.tileHeight || "300px";
    const height = parseInt(tileHeight.replace("px", ""));
    const percentageTextBottom = `${(height - 150) / 2 - 7}px`;

    return new components.BeamCardBody({
      backgroundColor: this.options.themeConfig.backgroundColor || "#fff",
      cornerRadius: `0 0 ${this.options.themeConfig.borderRadius || "10px"} 
            ${this.options.themeConfig.borderRadius || "10px"}`,
      padding: "5px 15px 15px 15px",
      border: this.options.themeConfig.impactBorder,
      style: {
        ...this.options?.themeConfig?.cardbody?.style,
        ...this.isMobile ? this.options.themeConfig.cardbody?.mobileStyle : {}
      },
      children: [
        region(this.options, nonprofit, this.isMobile),
        nonprofitName(this.options, nonprofit, this.isMobile),
        cause(this.options, nonprofit, this.isMobile),
        impactDescription(this.options, nonprofit, this.isMobile),
        progressBar(this.options, nonprofit, this.isMobile),
        devider(this.options, this.isMobile),
        // moreInfo(this.options, nonprofit)
        goalInfo(this.options, nonprofit, this.isMobile)
      ],
    });

    function region(options, nonprofit, isMobile) {
      return new components.BeamText({
        text: nonprofit.badge,
        fontFamily: options.themeConfig.fontFamily,
        style: {
          ...options.themeConfig.region?.style,
          ...isMobile ? options.themeConfig.region?.mobileStyle : {}
        },
      })
    }

    function cause(options, nonprofit, isMobile) {
      return new components.BeamText({
        text: options.themeConfig.causeUpperCase ? nonprofit.cause.toUpperCase() : nonprofit.cause,
        textTransform: options.themeConfig.causeTypeTransform,
        color: "#fff",
        letterSpacing: options.themeConfig.causeTypeLetterSpacing,
        fontFamily: options.themeConfig.fontFamily,
        fontSize: options.themeConfig.causeTypeFontSize,
        fontWeight: options.themeConfig.causeTypeFontWeight,
        lineHeight: options.themeConfig.causeTypeLineHeight,
        margin: options.themeConfig.causeTypeMargin || "0",
        style: {
          ...options?.themeConfig?.cause?.style,
          ...isMobile ? options.themeConfig.cause?.mobileStyle : {}
        },
      });
    }

    function nonprofitName(options, nonprofit, isMobile) {
      return new components.BeamText({
        tag: "h4",
        text: nonprofit.name,
        textTransform:
          options.themeConfig.titleTextTransform || "none",
        color: options.themeConfig.nonprofitTextColor || "#fff",
        fontFamily: options.themeConfig.nonprofitTextFontFamily || options.themeConfig.fontFamily,
        fontWeight: options.themeConfig.nonprofitTextFontWeight || "bold",
        lineHeight: options.themeConfig.nonprofitTextLineHeight,
        fontSize: options.themeConfig.causeTitleFontSize,
        margin: options.themeConfig.nonprofitTextMargin || "0",
        style: {
          ...options?.themeConfig?.title?.style,
          ...isMobile ? options.themeConfig.title?.mobileStyle : {}
        },
      });
    }

    function impactDescription(options, nonprofit, isMobile) {
      return new components.BeamContainer({
        margin: "5px 0 0",
        children: [
          // impact info
          new components.BeamText({
            text: (options.lan ? nonprofit?.impact_description : nonprofit?.impact_description
              .toLowerCase()
              .startsWith("fund")
              ? nonprofit?.impact_description
              : `${options.themeConfig.isInKind || nonprofitUtil.isInKind(nonprofit?.id) ? "Provide " : "Fund "}${nonprofit?.impact_description}`),
            fontFamily: options.themeConfig.fontFamily,
            fontSize: options.themeConfig.impactDetailsFontSize,
            fontWeight: options.themeConfig.impactDetailsFontWeight,
            lineHeight: options.themeConfig.impactDetailsLineHeight,
            color: options.themeConfig.textColor || "#000",
            margin: options.themeConfig.impactDetailsMargin || "0",
            width: "85%",
            style: {
              ...options.themeConfig?.impact?.style,
              ...isMobile ? options.themeConfig.impact?.mobileStyle : {}
            },
          }),
        ],
      });
    }

    function progressBar(options, nonprofit, isMobile) {
      return new components.BeamFlexWrapper({
        noWrap: true,
        children: [
          new components.BeamBlockWrapper({
            width: options.themeConfig.progressBarWidth,
            children: [
              // progress wrapper
              new components.BeamProgressWrapper({
                percentage: nonprofit?.impact?.percentage,
                height: options.themeConfig.progressBarHeight || "7px",
                backgroundColor: options.themeConfig.progressBarBackgroundColor,
                border: options.themeConfig.progressBarBorder,
                cornerRadius: options.themeConfig.progressBarBorderRadius || undefined,
                style: {
                  ...options?.themeConfig?.progressBar?.style,
                  ...isMobile ? options.themeConfig.progressBar?.mobileStyle : {}
                },
              }),
            ],
          }),
          // percent text
          new components.BeamText({
            tag: "h6",
            text: nonprofit?.impact?.percentage + "&#37;",
            fontFamily: options.themeConfig.fontFamily,
            fontWeight: options.themeConfig.percentageFontWeight || "bold",
            fontSize: options.themeConfig.percentageFontSize || undefined,
            color:
            options.themeConfig.percentageTextColor,
            margin: options.themeConfig.percentageTextMargin || "0 0 0 auto",
            padding: "0 0 0 10px",
            style: {...options?.themeConfig?.progressBar?.textStyle},
          }),
        ],
      });
    }

    function devider(options, isMobile) {
      return new components.BeamDivider({
        borderColor: options.themeConfig?.devider?.style?.color,
        style: {
          ...options.themeConfig?.devider?.style,
          ...isMobile ? options.themeConfig.devider?.mobileStyle : {}
        },
        mobileStyle: {...options.themeConfig.devider?.mobileStyle},
      });
    }

    function moreInfo(options, nonprofit, isMobile) {
      function link(text, href) {
        return new components.BeamContainer({
          textAlign: "right",
          width: "100%",
          children: [
            new components.BeamAnchor({
              text: `${text}`,
              asLink: (options.themeConfig.learnMoreAsLink !== undefined) ? options.themeConfig.learnMoreAsLink : true,
              fontFamily: options.themeConfig.fontFamily,
              fontWeight: options.themeConfig.learnMoreFontWeight || "bold",
              fontSize: options.themeConfig.linkTextFontSize || "small",
              margin: "0",
              href: href,
              color: options.themeConfig.learnMoreTextColor || options.themeConfig.textColor,
              style: {
                ...options.themeConfig?.link?.style,
                ...isMobile ? options.themeConfig.link?.mobileStyle : {}
              },
            }),
          ],
        });
      }

      return new components.BeamFlexWrapper({
        alignItems: "flex-end",
        // width: "100%",
        noWrap: true,
        pos: {},
        children: [
          nonprofit?.impact?.goal_completion > 0 && options.themeConfig.showGoalCompletionCount &&
          new components.BeamText({
            width: "100%",
            text: `<span style="font-style: ${options.themeConfig.goalCompletitionTextFontStyle || 'italic'};">Funded <b style="color: ${
              options.themeConfig.goalCompletionNumberTextColor ||
              options.themeConfig.progressBarColors[0]?.color
            }">${nonprofit?.impact?.goal_completion}</b> time${
              nonprofit?.impact?.goal_completion > 1 ? "s" : ""
            } so far</span>`,
            fontFamily: options.themeConfig.fontFamily,
            color: options.themeConfig.goalCompletionTextColor || "#fff",
            fontSize: options.themeConfig.goalCompletionTextFontSize || "x-small",
            textTransform: options.themeConfig.goalCompletionTextTransform,
            // padding: "0 0 4px 0"
            style: {
              ...options.themeConfig.goalCompletionTextStyle
            }
          }),
          options.themeConfig.showLink &&
          link(options.themeConfig.linkText || `Learn more`, nonprofit?.website),
        ],
      })

    }

    function goalInfo(options, nonprofit, isMobile) {
      return new components.BeamText({
        clickListener: options.themeConfig.goalInfo.clickListener,
        clickListenerParams: {nonprofit: nonprofit.nonprofit_id},
        text: nonprofit && nonprofit.impact ? `<a href='#' style='text-decoration: none; color: ${options.themeConfig.goalInfo.style.color}'>${nonprofit.impact.impact_cta}</a>` : '',
        tag: 'div',
        href: 'nonprofit',
        fontFamily: options.themeConfig.fontFamily,
        style: {
          paddingTop: '8px',
          fontSize: '12px'
        }
        // style: {
        //   display: options.themeConfig.showNational ? 'none' : 'flex',
        //   ...options.themeConfig.goalInfo?.style,
        //   ...isMobile ? options.themeConfig.goalInfo?.mobileStyle : {}
        // },
      })
    }
  }

  titleDevider() {
    return new components.BeamDivider({
      style: {
        margin: '15px 20px 5px 20px',
        borderTop: `1px solid ${this.options.themeConfig.textColor} `,
        borderBottom: '0',
        maxWidth: '700px',
        ...this.options.themeConfig.titleDevider?.style
      }
    });
  }

  titleNonprofits() {
    return new components.BeamText({
      text: this.options.themeConfig.titleNonprofits?.text || 'National',
      style: {...this.options.themeConfig.titleNonprofits?.style}
    })
  }

  tab(tabData = null) {
    return new components.BeamContainer({
      margin: "0 20px 0 0",
      style: {...this.options.themeConfig.tabContainer?.style},
      children: [
        new components.BeamText({
          text: !tabData ? `${this.options.lan ? translations.translateSeeAll(this.options.lan) : "See All"}` : tabData,
          fontFamily: this.options.themeConfig.fontFamily,
          fontSize: "small",
          fontWeight: tabData === this.currentTabData ? "bold" : "normal",
          cursor: "pointer",
          style: {
            textColor: "black",
            ...this.options?.themeConfig?.tab?.style
          },
          clickListener: () => {
            this.currentTabData = tabData;
            this.render({nonprofit: this.input.nonprofit, user: null, chain: this.input.chain});
          },
        }),
        new components.BeamDivider({
          style: {
            borderColor:
              tabData === this.currentTabData
                ? this.options.themeConfig.textColor || "#000"
                : "transparent",
            ...this.options.themeConfig.tab?.underline?.style
          }
        }),
      ],
    });
  }

  buildMobileView() {
    // return this.buildDesktopView();
  }

  buildDesktopView(isMobile) {
    let container = new components.BeamContainer({
      style: {
        ...this.options?.themeConfig?.widgetContainer?.style,
        ...isMobile ? this.options.themeConfig.widgetContainer?.mobileStyle : {}
      },
      children: [
        // header wrapper
        new components.BeamContainer({
          style: {
            display: 'flex',
            flexDirection: 'column-reverse',
            margin: "30px 0 30px 10px",
            ...this.options?.themeConfig?.headerContainer?.style,
            ...isMobile ? this.options.themeConfig.headerContainer?.mobileStyle : {}
          },
          children: [
            //logo container
            new components.BeamContainer({
              margin: "0 0 0px 10px",
              style: {
                ...this.options?.themeConfig?.logoContainer?.style,
                display: this.options.themeConfig.hideLogo ? 'none' : 'inherit',
                ...isMobile ? this.options.themeConfig.logoContainer?.mobileStyle : {}
              },
              children: [
                // TODO: if chain logos are needed, add them to impact/instacart endpoint
                // this.headerLogoComponent(
                //   this.options.themeConfig.usePartnerRectLogo
                //     ? this.data.chain.rect_logo
                //     : this.data.chain.logo),
              ],
            }),
            // tabs
            !this.options.themeConfig.hideTabs && new components.BeamFlexWrapper({
              wrap: true,
              style: {
                alignItems: 'center',
                margin: '0px 90px 50px 90px',
                justifyContent: 'center',
                ...this.options?.themeConfig?.tabsSection?.style,
                ...isMobile ? this.options.themeConfig.tabsSection?.mobileStyle : {}
              },
              children: !this.options.themeConfig.hideTabs && [
                // causes
                new components.BeamFlexWrapper({
                  style: {
                    alignItems: 'center',
                    margin: '0px 90px 50px 90px',
                    justifyContent: 'center',
                    ...this.options?.themeConfig?.tabsContainer?.style,
                    ...isMobile ? this.options.themeConfig.tabsContainer?.mobileStyle : {}
                  },
                  children: [
                    ...(this.options.themeConfig?.filterByRegion ?
                      this.regions : this.causes).map((tabData) => this.tab(tabData)),
                  ]
                }),
                this.options.themeConfig.showNational && this.titleDevider(),
                this.options.themeConfig.showNational && this.titleNonprofits(),
              ],
            }),
          ]
        }),
        // Header
        this.options.themeConfig.showCommunityImpactHeader && new components.BeamText({
          text: this.options.themeConfig.communityImpactTitle?.text,
          fontFamily: this.options.themeConfig.fontFamily,
          fontSize: "23px",
          lineHeight: "28px",
          textAlign: "center",
          color: "#343538",
          fontWeight: 700,
          style: {
            ... this.options.themeConfig.communityImpactTitle?.style
          }
        }),
        // nonprofits
        new components.BeamFlexWrapper({
          alignItems: "flex-start",
          style: {
            ...this.options.themeConfig.nonprofitsContainer?.style,
            ...isMobile ? this.options.themeConfig.nonprofitsContainer?.mobileStyle : {}
          },
          children:
            this.options.themeConfig.noWrap
              ? this.nonprofits.map(
              (nonprofit, index) =>
                new components.BeamContainer({
                  width: "100%",
                  margin: "0 10px 0 0",
                  style: {
                    ...this.options.themeConfig.nonprofitRow?.style,
                    ...isMobile ? this.options.themeConfig.nonprofitRow?.mobileStyle : {}
                  },
                  alignSelf:
                    index + 1 === this.nonprofits.length
                      ? "stretch"
                      : undefined,
                  children: [this.outerCard(nonprofit)],
                })
              )
              : [
                ...this.nonprofits.map((nonprofit1, index) => {
                  // let nonprofit2 = this.nonprofits[index + 1];
                  // if ((index + 1) % 2 !== 0) {
                  return new components.BeamFlexWrapper({
                    margin: "0 0 10px",
                    noWrap: this.options.themeConfig.noWrap,
                    width: this.options.themeConfig.impactRowWidth || undefined,
                    style: {
                      ...this.options.themeConfig.nonprofitRow?.style,
                      ...isMobile ? this.options.themeConfig.nonprofitRow?.mobileStyle : {}
                    },
                    children: [
                      // column1
                      nonprofit1 &&
                      new components.BeamContainer({
                        width: this.options.themeConfig.impactCardWidth || "400px",
                        margin: this.options.themeConfig.impactCardColumn1Margin || "0 10px 0",
                        style: {
                          ...this.options.themeConfig.impactCard?.style,
                          ...isMobile ? this.options.themeConfig.impactCard?.mobileStyle : {}
                        },
                        children: [this.outerCard(nonprofit1)],
                      }),
                      // column2 will add an empty card if number of nonprofits is odd, in order to keep styling consistent
                      // new components.BeamContainer({
                      //   width: this.options.themeConfig.impactCardWidth || "400px",
                      //   margin: this.options.themeConfig.impactCardColumn2Margin || "0",
                      //   border: '0px',
                      //   children: [this.outerCard(nonprofit2)],
                      // }),
                    ],
                  });
                  // }
                }),
              ],
        }),

      ],
    });

    return container.view;
  }
}

export default InstacartCommunityImpactWidget;
