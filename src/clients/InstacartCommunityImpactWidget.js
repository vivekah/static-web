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
        tileHeight: '300px'
      },
    }
  ) {
    super(options);
    this.currentTabData = null;
    this.maxContainerWidth = 570;
    this.options.regionsToIgnore = this.options.regionsToIgnore || ['DNS'];
  }

  get causes() {
    return [null, ...new Set(this.data.nonprofits.map((x) => x.cause))];
  }

  get regions() {
    const regions = [].concat(this.data.nonprofits.map((x) => x.regions)).flat(1).filter(e => e);
    return [null, ...new Set(regions)];
  }

  get nonprofits() {
    let visibleNonprofits = this.data.nonprofits.filter((x) => {
      return !x.regions?.find(region => this.options.regionsToIgnore?.includes(region))
    });

    // console.log(" filters ", this.options.regionsToIgnore)
    // console.log(" nonprofits ", this.data.nonprofits)
    // console.log(" visible nonprofits ", visibleNonprofits)

    if (!this.currentTabData) {
      return visibleNonprofits;
    } else {
      return this.options.themeConfig?.filterByRegion
        ? visibleNonprofits.filter((x) => x.regions?.includes(this.currentTabData))
        : visibleNonprofits.filter((x) => x.cause === this.currentTabData);
    }

  }

  async render(args) {
    await super.render(args, () => {
      return this.isMobile ? this.buildMobileView() : this.buildDesktopView();
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
      style: {...this.options?.themeConfig?.innerCard?.style},
      mobileStyle: {...this.options.themeConfig.innerCard?.mobileStyle},
      children: [
        // card image
        new components.BeamCardImage({
          src: nonprofit.chain_target_image,
          height,
          objectFit: "cover",
          style: {...this.options?.themeConfig?.cardImage?.style},
        }),
        // overlay
        new components.BeamCardOverlay({
          background: this.options.themeConfig.tileOverlayBackground,
          style: {...this.options?.themeConfig?.cardOverlay?.style},
          mobileStyle: {...this.options.themeConfig.cardOverlay?.mobileStyle},
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
              style: {...this.options?.themeConfig?.textContainer?.style},
              mobileStyle: {...this.options.themeConfig.textContainer?.mobileStyle},
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
        ...this.options?.themeConfig?.outerCard?.style
      },
      mobileStyle: {...this.options.themeConfig.outerCard?.mobileStyle},
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
      style: {...this.options?.themeConfig?.cardbody?.style},
      mobileStyle: {...this.options.themeConfig.cardbody?.mobileStyle},
      children: [
        region(this.options, nonprofit),
        nonprofitName(this.options, nonprofit),
        cause(this.options, nonprofit),
        impactDescription(this.options, nonprofit),
        progressBar(this.options, nonprofit),
        devider(this.options),
        // moreInfo(this.options, nonprofit)
        goalInfo(this.options, nonprofit)
      ],
    });

    function region(options, nonprofit) {
      return new components.BeamText({
        text: nonprofit.regions?.first || 'Local Nonprofit',
        style: {...options.themeConfig.region?.style},
        mobileStyle: {...options.themeConfig.region?.mobileStyle},
      })
    }

    function cause(options, nonprofit) {
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
        style: {...options?.themeConfig?.cause?.style},
        mobileStyle: {...options.themeConfig.cause?.mobileStyle},
      });
    }

    function nonprofitName(options, nonprofit) {
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
        style: {...options?.themeConfig?.title?.style},
        mobileStyle: {...options.themeConfig.title?.mobileStyle},
      });
    }

    function impactDescription(options, nonprofit) {
      return new components.BeamContainer({
        margin: "5px 0 0",
        children: [
          // impact info
          new components.BeamText({
            text: options.lan ? nonprofit?.impact_description : nonprofit?.impact_description
              .toLowerCase()
              .startsWith("fund")
              ? nonprofit?.impact_description
              : `${options.themeConfig.isInKind || nonprofitUtil.isInKind(nonprofit?.id) ? "Provide " : "Fund "}${nonprofit?.impact_description}`,
            fontFamily: options.themeConfig.fontFamily,
            fontSize: options.themeConfig.impactDetailsFontSize,
            fontWeight: options.themeConfig.impactDetailsFontWeight,
            lineHeight: options.themeConfig.impactDetailsLineHeight,
            color: options.themeConfig.textColor || "#000",
            margin: options.themeConfig.impactDetailsMargin || "0",
            width: "85%",
            style: {...options.themeConfig?.impact?.style},
            mobileStyle: {...options.themeConfig.impact?.mobileStyle},
          }),
        ],
      });
    }

    function progressBar(options, nonprofit) {
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
                style: {...options?.themeConfig?.progressBar?.style},
                mobileStyle: {...options.themeConfig.progressBar?.mobileStyle},
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

    function devider(options) {
      return new components.BeamDivider({
        borderColor: options.themeConfig?.devider?.style?.color,
        style: {...options.themeConfig?.devider?.style},
        mobileStyle: {...options.themeConfig.devider?.mobileStyle},
      });
    }

    function moreInfo(options, nonprofit) {
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
              style: {...options.themeConfig?.link?.style},
              mobileStyle: {...options.themeConfig.link?.mobileStyle},
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

    function goalInfo(options, nonprofit) {
      return new components.BeamText({
        text: (nonprofit?.impact?.percentage === 100 ? options.themeConfig.goalInfo?.completedText : options.themeConfig.goalInfo?.text) + options.themeConfig.goalInfo?.contributeText,
        style: {...options.themeConfig.goalInfo?.style},
        mobileStyle: {...options.themeConfig.goalInfo?.mobileStyle},

      })
    }
  }

  tabs(tabData = null) {
    return new components.BeamContainer({
      margin: "0 20px 0 0",
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
            console.log(" NONNN PROFITTT:", this.input.nonprofit)
            this.render({nonprofit: this.input.nonprofit, user: null, chain: this.input.chain});
          },
        }),
        new components.BeamDivider({
          borderColor:
            tabData === this.currentTabData
              ? this.options.themeConfig.textColor || "#000"
              : "transparent",
        }),
      ],
    });
  }

  buildMobileView() {
    return this.buildDesktopView();
  }

  buildDesktopView() {
    let container = new components.BeamContainer({
      style: {
        ...this.options?.themeConfig?.widgetContainer?.style
      },
      mobileStyle: {...this.options.themeConfig.widgetContainer?.mobileStyle},
      children: [
        // header wrapper
        new components.BeamContainer({
          style: {
            display: 'flex',
            flexDirection: 'column-reverse',
            margin: "40px 0 40px 10px",
            ...this.options?.themeConfig?.headerContainer?.style
          },
          mobileStyle: {...this.options.themeConfig.headerContainer?.mobileStyle},
          children: [
            //logo container
            new components.BeamContainer({
              margin: "0 0 0px 10px",
              style: {
                ...this.options?.themeConfig?.logoContainer?.style,
                display: this.options.themeConfig.hideLogo ? 'none' : 'inherit'
              },
              mobileStyle: {...this.options.themeConfig.logoContainer?.mobileStyle},
              children: [
                this.headerLogoComponent(
                  this.options.themeConfig.usePartnerRectLogo
                    ? this.data.chain.rect_logo
                    : this.data.chain.logo),
              ],
            }),
            // tabs
            !this.options.themeConfig.hideTabs && new components.BeamFlexWrapper({
              wrap: true,
              style: {
                alignItems: 'center',
                margin: '0px 90px 50px 90px',
                justifyContent: 'center',
                ...this.options?.themeConfig?.tabsContainer?.style
              },
              mobileStyle: {...this.options.themeConfig.tabsContainer?.mobileStyle},
              children: !this.options.themeConfig.hideTabs && [
                // causes
                ...(this.options.themeConfig?.filterByRegion ?
                  this.regions : this.causes).map((tabData) => this.tabs(tabData)),
              ],
            }),
          ]
        }),
        // nonprofits
        new components.BeamFlexWrapper({
          alignItems: "flex-end",
          style: {
            ...this.options.themeConfig.nonprofitsContainer?.style
          },
          mobileStyle: {...this.options.themeConfig.nonprofitsContainer?.mobileStyle},
          children:
            this.options.themeConfig.noWrap
              ? this.nonprofits.map(
              (nonprofit, index) =>
                new components.BeamContainer({
                  width: "100%",
                  margin: "0 10px 0 0",
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
                    style: {...this.options.themeConfig.nonprofitRow?.style},
                    children: [
                      // column1
                      nonprofit1 &&
                      new components.BeamContainer({
                        width: this.options.themeConfig.impactCardWidth || "400px",
                        margin: this.options.themeConfig.impactCardColumn1Margin || "0 10px 0",
                        style: {...this.options.themeConfig.impactCard?.style},
                        mobileStyle: {...this.options.themeConfig.impactCard?.mobileStyle},
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
