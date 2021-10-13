import BaseImpactWidget from "./BaseImpactWidget";
import * as components from "../components";
import {nonprofitUtil, translations} from '../utils/';

class CommunityImpactWidget extends BaseImpactWidget {
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
              children: [
                // cause
                new components.BeamText({
                  text: this.options.themeConfig.causeUpperCase ? nonprofit.cause.toUpperCase() : nonprofit.cause,
                  textTransform: this.options.themeConfig.causeTypeTransform,
                  color: "#fff",
                  letterSpacing: this.options.themeConfig.causeTypeLetterSpacing,
                  fontFamily: this.options.themeConfig.fontFamily,
                  fontSize: this.options.themeConfig.causeTypeFontSize,
                  fontWeight: this.options.themeConfig.causeTypeFontWeight,
                  lineHeight: this.options.themeConfig.causeTypeLineHeight,
                  margin: this.options.themeConfig.causeTypeMargin || "0",
                  style: {...this.options?.themeConfig?.cause?.style},
                }),
                // title
                new components.BeamText({
                  tag: "h4",
                  text: nonprofit.name,
                  textTransform:
                    this.options.themeConfig.titleTextTransform || "none",
                  color: this.options.themeConfig.nonprofitTextColor || "#fff",
                  fontFamily: this.options.themeConfig.nonprofitTextFontFamily || this.options.themeConfig.fontFamily,
                  fontWeight: this.options.themeConfig.nonprofitTextFontWeight || "bold",
                  lineHeight: this.options.themeConfig.nonprofitTextLineHeight,
                  fontSize: this.options.themeConfig.causeTitleFontSize,
                  margin: this.options.themeConfig.nonprofitTextMargin || "0",
                  style: {...this.options?.themeConfig?.title?.style},
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  outerCard(nonprofit) {
    const tileHeight = this.options.themeConfig.tileHeight || "300px";
    const height = parseInt(tileHeight.replace("px", ""));
    const percentageTextBottom = `${(height - 150) / 2 - 7}px`;

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
      children: [
        // inner card
        nonprofit && this.innerCard(nonprofit),
        // card body
        nonprofit && new components.BeamCardBody({
          backgroundColor: this.options.themeConfig.backgroundColor || "#fff",
          cornerRadius: `0 0 ${this.options.themeConfig.borderRadius || "10px"} 
            ${this.options.themeConfig.borderRadius || "10px"}`,
          padding: "5px 15px 15px 15px",
          border: this.options.themeConfig.impactBorder,
          style: {...this.options?.themeConfig?.cardbody?.style},
          children: [
            new components.BeamFlexWrapper({
              noWrap: true,
              children: [
                new components.BeamBlockWrapper({
                  width: this.options.themeConfig.progressBarWidth,
                  children: [
                    // progress wrapper
                    new components.BeamProgressWrapper({
                      percentage: nonprofit?.impact?.percentage,
                      height: this.options.themeConfig.progressBarHeight || "7px",
                      backgroundColor: this.options.themeConfig
                        .progressBarBackgroundColor,
                      border: this.options.themeConfig.progressBarBorder,
                      cornerRadius: this.options.themeConfig.progressBarBorderRadius || undefined,
                      style: {...this.options?.themeConfig?.progressBar?.style},
                    }),
                  ],
                }),
                // percent text
                new components.BeamText({
                  tag: "h6",
                  text: nonprofit?.impact?.percentage + "&#37;",
                  fontFamily: this.options.themeConfig.fontFamily,
                  fontWeight: this.options.themeConfig.percentageFontWeight || "bold",
                  fontSize: this.options.themeConfig.percentageFontSize || undefined,
                  color:
                    this.options.themeConfig.percentageTextColor ||
                    this.defaultColor,
                  margin: this.options.themeConfig.percentageTextMargin || "0 0 0 auto",
                  padding: "0 0 0 10px",
                  style: {...this.options?.themeConfig?.progressBartext?.style},
                }),
              ],
            }),
            new components.BeamContainer({
              pos: {
                position: "absolute",
                right: "15px",
                bottom: percentageTextBottom,
              },
              children: [],
            }),
            // flex wrapper
            new components.BeamContainer({
              margin: "5px 0 0",
              children: [
                // impact info
                new components.BeamText({
                  text: this.options.lan ? nonprofit?.impact_description : nonprofit?.impact_description
                    .toLowerCase()
                    .startsWith("fund")
                    ? nonprofit?.impact_description
                    : `${this.options.themeConfig.isInKind || nonprofitUtil.isInKind(nonprofit?.id) ? "Provide " : "Fund "}${nonprofit?.impact_description}`,
                  fontFamily: this.options.themeConfig.fontFamily,
                  fontSize: this.options.themeConfig.impactDetailsFontSize,
                  fontWeight: this.options.themeConfig.impactDetailsFontWeight,
                  lineHeight: this.options.themeConfig.impactDetailsLineHeight,
                  color: this.options.themeConfig.textColor || "#000",
                  margin: this.options.themeConfig.impactDetailsMargin || "0",
                  width: "85%",
                  style: {...this.options.themeConfig?.impact?.style}
                }),
              ],
            }),
            new components.BeamFlexWrapper({
              alignItems: "flex-end",
              // width: "100%",
              noWrap: true,
              pos: {},
              children: [
                nonprofit?.impact?.goal_completion > 0 && this.options.themeConfig.showGoalCompletionCount &&
                // new components.BeamContainer({
                //   children: [
                new components.BeamText({
                  width: "100%",
                  text: `<span style="font-style: ${this.options.themeConfig.goalCompletitionTextFontStyle || 'italic'};">Funded <b style="color: ${
                    this.options.themeConfig.goalCompletionNumberTextColor ||
                    this.options.themeConfig.progressBarColors[0]?.color
                  }">${nonprofit?.impact?.goal_completion}</b> time${
                    nonprofit?.impact?.goal_completion > 1 ? "s" : ""
                  } so far</span>`,
                  fontFamily: this.options.themeConfig.fontFamily,
                  color: this.options.themeConfig.goalCompletionTextColor || "#fff",
                  fontSize: this.options.themeConfig.goalCompletionTextFontSize || "x-small",
                  textTransform: this.options.themeConfig.goalCompletionTextTransform,
                  // padding: "0 0 4px 0"
                  style: {
                    ...this.options.themeConfig.goalCompletionTextStyle
                  }
                })
                //   ]
                // })
                ,
                this.options.themeConfig.showLink &&
                this.link(this.options.themeConfig.linkText || `Learn more`, nonprofit?.website),
              ],
            }),
          ],
        }),
      ],
    });
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
    let container = new components.BeamContainer({
      style: {
        ...this.options?.themeConfig?.widgetContainer?.mobileStyle
      },
      children: [
        new components.BeamContainer({
          margin: "0 0 20px",
          style: {...this.options?.themeConfig?.logoContainer?.mobileStyle},
          children: [
            // header wrapper
            new components.BeamContainer({
              style: {
                display: 'flex',
                flexDirection: 'column-reverse',
                margin: "0 0 20px 10px",
                ...this.options?.themeConfig?.headerContainer?.style
              },
              children: [
                //logo container
                new components.BeamContainer({
                  margin: "0 0 0px 10px",
                  style: {
                    ...this.options?.themeConfig?.logoContainer?.style
                  },
                  children: !this.options.themeConfig.hideLogo && [
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
                    margin: '0px 5px 50px 5px',
                    justifyContent: 'center',
                    ...this.options?.themeConfig?.tabsContainer?.style
                  },
                  children: !this.options.themeConfig.hideTabs && [
                    // causes
                    ...(this.options.themeConfig?.filterByRegion ?
                      this.regions : this.causes).map((tabData) => this.tabs(tabData)),
                  ],
                }),
              ]
            }),
          ]
        }),
        ...this.nonprofits.map(
          (nonprofit) =>
            new components.BeamContainer({
              margin: "10px",
              children: [this.outerCard(nonprofit)],
            })
        ),
      ],
    });

    return container.view;
  }

  buildDesktopView() {
    let container = new components.BeamContainer({
      style: {
        ...this.options?.themeConfig?.widgetContainer?.style
      },
      children: [
        // header wrapper
        new components.BeamContainer({
          style: {
            display: 'flex',
            flexDirection: 'column-reverse',
            margin: "40px 0 40px 10px",
            ...this.options?.themeConfig?.headerContainer?.style
          },
          children: [
            //logo container
            new components.BeamContainer({
              margin: "0 0 0px 10px",
              style: {
                ...this.options?.themeConfig?.logoContainer?.style
              },
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
          // wrap: !this.options.themeConfig.noWrap,
          children: this.options.themeConfig.noWrap
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
                let nonprofit2 = this.nonprofits[index + 1];
                if ((index + 1) % 2 !== 0) {
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
                        children: [this.outerCard(nonprofit1)],
                      }),
                      // column2 will add an empty card if number of nonprofits is odd, in order to keep styling consistent
                      new components.BeamContainer({
                        width: this.options.themeConfig.impactCardWidth || "400px",
                        margin: this.options.themeConfig.impactCardColumn2Margin || "0",
                        border: '0px',
                        children: [this.outerCard(nonprofit2)],
                      }),
                    ],
                  });
                }
              }),
            ],
        }),

      ],
    });

    return container.view;
  }
}

export default CommunityImpactWidget;
