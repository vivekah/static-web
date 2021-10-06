import BaseImpactWidget from "./BaseImpactWidget";
import * as components from "../components";

class TextCommunityImpactWidget extends BaseImpactWidget {
  constructor(
    options = {
      themeConfig: {
        backgroundColor: "#fff",
        borderRadius: "10px",
        titleTextTransform: "none",
        hideBorders: false,
        hideTabs: false,
        hideLogo: false,
        percentageTextColor: undefined,
        showLink: false,
        linkTextFontSize: "small",
        progressBarWidth: "85%",
      },
    }
  ) {
    super(options);
    this.currentCause = null;
    this.maxContainerWidth = 570;
    this.options.regionsToIgnore =  this.options.regionsToIgnore || ['DNS'];

  }

  get causes() {
    return [null, ...new Set(this.data.nonprofits.map((x) => x.cause))];
  }

  get nonprofits() {
    let visibleNonprofits = this.data.nonprofits.filter((x) => {
      return !x.regions?.find(region => this.options.regionsToIgnore?.includes(region))
    });

    // console.log(" filters ", this.options.regionsToIgnore)
    // console.log(" nonprofits ", this.data.nonprofits)
    // console.log(" visible nonprofits ", visibleNonprofits)
    return this.currentCause
      ? visibleNonprofits.filter((x) => x.cause === this.currentCause)
      : visibleNonprofits;
  }

  async render(nonprofit = null) {
    await super.render({nonprofit, user: null}, () => {
      return this.isMobile ? this.buildMobileView() : this.buildDesktopView();
    });
  }

  link(text, href) {
    return new components.BeamContainer({
      textAlign: "center",
      style: {
        alignSelf: 'center',
        ...this.options.themeConfig.linkContainer?.style
      },
      children: [
        new components.BeamAnchor({
          text: `${text}`,
          asLink: true,
          borderBottom: "1px solid",
          textAlign: "center",
          fontFamily: this.options.themeConfig.fontFamily,
          fontSize: this.options.themeConfig.linkTextFontSize || "small",
          margin: "20px 0 0",
          href: href,
          color: this.options.themeConfig.textColor,
          style: {
            ...this.options.themeConfig.link?.style
          }
        }),
      ],
    });
  }

  outerCard(nonprofit) {

    return new components.BeamCard({
      padding: !this.options.themeConfig.hideBorders && "10px",
      border: this.options.themeConfig.border || "none",
      margin: "0",
      style: {
        minHeight: '276px',
        ...this.options.themeConfig.outerCard?.style
      },
      children: [
        // card body
        new components.BeamCardBody({
          backgroundColor: this.options.themeConfig.backgroundColor || "#fff",
          cornerRadius: `0 0 ${this.options.themeConfig.borderRadius || "10px"} 
            ${this.options.themeConfig.borderRadius || "10px"}`,
          padding: "15px",
          textAlign: "center",
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            ...this.options.themeConfig.cardBody?.style
          },
          children: [
            // card image
            new components.BeamCardImage({
              src: nonprofit.cause_icon,
              height: "60px",
              width: "auto",
            }),
            // title
            new components.BeamText({
              tag: "h4",
              text: nonprofit.name,
              textTransform:
                this.options.themeConfig.titleTextTransform || "uppercase",
              textAlign: "center",
              fontFamily: this.options.themeConfig.fontFamily,
              fontSize: this.options.themeConfig.titleFontSize || "small",
              color: "#000",
              margin: "10px 0",
            }),
            // cause
            new components.BeamText({
              text: nonprofit.cause,
              textTransform: "capitalize",
              color: "#000",
              letterSpacing: "1px",
              fontFamily: this.options.themeConfig.fontFamily,
              fontSize: "11px",
              textAlign: "center",
            }),
            // flex wrapper
            new components.BeamContainer({
              margin: "10px 0 10px",
              padding: "0 7%",
              centerItems: true,
              minHeight: "35px",
              children: [
                // impact info
                new components.BeamText({
                  text: this.options.lan ? nonprofit.impact_description : nonprofit.impact_description
                    .toLowerCase()
                    .startsWith("fund")
                    ? nonprofit.impact_description
                    : "Fund " + nonprofit.impact_description,
                  fontFamily: this.options.themeConfig.fontFamily,
                  fontSize: this.options.themeConfig.impactInfoFontSize || "small",
                  color: this.options.themeConfig.textColor || "#000",
                  textAlign: "center",
                  margin: "0",
                }),
              ],
            }),
            // progress wrapper
            new components.BeamFlexWrapper({
              noWrap: true,
              flexDirection: 'row',
              style: {
                marginTop: 'auto',
                alignSelf: 'flex-end',
                width: '100%',
                ...this.options.themeConfig.progressBarWrapper?.style
              },
              children: [
                // block wrapper
                new components.BeamProgressWrapper({
                  percentage: nonprofit.impact.percentage,
                  width: this.options.themeConfig.progressBarWidth,
                  height: "7px",
                  style: {
                    ...this.options.themeConfig.progressBar?.style
                  },
                }),
                // percentage text
                new components.BeamText({
                  tag: "h6",
                  text: `${nonprofit.impact.percentage}%`,
                  fontFamily: this.options.fontFamily,
                  color: this.options.tileTextColor || "#000",
                  // fontSize: this.options.tilePercentageFontSize || "x-small",
                  textAlign: "right",
                  whiteSpace: "nowrap",
                  fontWeight: "bold",
                  margin: "0 0 0 auto",
                  padding: "0 0 0 10px",
                }),
              ],
            }),
            this.options.themeConfig.showLink &&
            this.link(
              `LEARN MORE`, nonprofit?.website
            ),
          ],
        }),
      ],
    });
  }

  tabs(cause = null) {
    return new components.BeamContainer({
      margin: "0 20px 0 0",
      children: [
        new components.BeamText({
          text: !cause ? "See All" : cause,
          fontFamily: this.options.themeConfig.fontFamily,
          fontSize: "small",
          fontWeight: cause === this.currentCause ? "bold" : "normal",
          color: this.options.themeConfig.textColor || "#000",
          cursor: "pointer",
          clickListener: () => {
            this.currentCause = cause;
            this.render(this.input.nonprofit);
          },
        }),
        new components.BeamDivider({
          borderColor:
            cause === this.currentCause
              ? this.options.themeConfig.textColor || "#000"
              : "transparent",
        }),
      ],
    });
  }

  buildMobileView() {
    let container = new components.BeamContainer({
      children: [
        new components.BeamContainer({
          margin: "0 0 10px",
          padding: "0 35px",
          children: !this.options.themeConfig.hideLogo && [
            this.headerLogoComponent(
              this.data.chain.rect_logo
                ? this.data.chain.rect_logo
                : this.data.chain.logo
            ),
          ],
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
      children: [
        new components.BeamContainer({
          margin: "0 0 10px",
          padding: "0 35px",
          children: !this.options.themeConfig.hideLogo && [
            this.headerLogoComponent(
              this.data.chain.rect_logo
                ? this.data.chain.rect_logo
                : this.data.chain.logo
            ),
          ],
        }),
        // tabs
        new components.BeamFlexWrapper({
          wrap: true,
          padding: "0 35px",
          children: !this.options.themeConfig.hideTabs && [
            // causes
            ...this.causes.map((cause) => this.tabs(cause)),
          ],
        }),
        // nonprofits
        new components.BeamFlexWrapper({
          margin: "10px 0 0 0",
          alignItems: "stretch",
          wrap: true,
          style: {...this.options.themeConfig.nonprofitsContainer?.style},
          children: [
            ...this.nonprofits.map(
              (nonprofit, index) =>
                new components.BeamContainer({
                  width: this.options.themeConfig.numberOfColumns ? `calc(calc(100%/${this.options.themeConfig.numberOfColumns}) - 1%)` : "32%",
                  margin: "0 10px 0 0",
                  alignSelf:
                    index + 1 === this.nonprofits.length
                      ? "stretch"
                      : undefined,
                  style: {
                    ...this.options.themeConfig.nonprofitsContainer?.style
                  },
                  children: [this.outerCard(nonprofit)],
                })
            )
          ]
        }),
      ],
    });

    return container.view;
  }
}

export default TextCommunityImpactWidget;
