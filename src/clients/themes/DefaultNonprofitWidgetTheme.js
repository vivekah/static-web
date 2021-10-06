import * as components from "../../components";
import BaseTheme from "./BaseTheme";

class DefaultNonprofitWidgetTheme extends BaseTheme {
  constructor(options = {}) {
    super(options);
    this.showProgress = false;
  }

  static get id() {
    return "default-nonprofit";
  }

  headerText(text) {
    return new components.BeamText({
      padding: "10px",
      text: text,
      color: this.options.textColor,
      fontFamily: this.options.fontFamily,
      fontSize: this.options.headerTextFontSize || "small",
      fontWeight: this.options.headTextFontWeight || "bold",
    });
  }

  card(nonprofit, margin = "0") {
    const height = this.options.tileHeight || "170px";
    return new components.BeamCard({
      width: "100%",
      height,
      cornerRadius: this.options.tileBorderRadius || "10px",
      overflow: "hidden",
      margin: margin,
      clickListener: nonprofit.onClick,
      cursor: "pointer",
      backgroundColor: this.options.tileBackgroundColor || "transparent",
      children: [
        // card image
        !this.options.tileBackgroundColor &&
          new components.BeamCardImage({
            src: nonprofit.image,
            height,
            objectFit: "cover",
          }),
        // overlay
        new components.BeamCardOverlay({
          background: this.options.tileOverlayBackground,
          padding: "1.25rem 0.8rem",
          children: [
            // cause
            new components.BeamText({
              text: nonprofit.cause,
              textTransform: this.options.tileCauseTextTransform || "uppercase",
              color: this.options.tileTextColor || "#fff",
              letterSpacing: this.options.tileCauseLetterSpacing || "2px",
              fontFamily: this.options.fontFamily,
              fontSize: this.options.tileCauseFontSize || "x-small",
            }),
            // content wrapper
            new components.BeamContainer({
              padding: "0.8rem",
              pos: {
                position: "absolute",
                right: "0",
                bottom: "0",
                left: "0",
              },
              children: [
                // text wrapper
                new components.BeamContainer({
                  width: "100%",
                  children: [
                    // title
                    new components.BeamText({
                      tag: "h4",
                      text: nonprofit.name,
                      fontFamily: this.options.fontFamily,
                      fontWeight: this.options.tileNameFontWeight || "bold",
                      fontSize: this.options.tileNameFontSize || "medium",
                      color: this.options.tileTextColor || "#fff",
                      margin: "10px 0 0 0",
                    }),
                    // description
                    new components.BeamText({
                      text: this.options.lan ? nonprofit.impact_description : "Fund " + nonprofit.impact_description,
                      fontFamily: this.options.fontFamily,
                      fontSize: this.options.tileDescriptionFontSize || "small",
                      lineHeight: "1.4em",
                      color: this.options.tileTextColor || "#fff",
                    }),
                  ],
                }),
                // progress wrapper
                this.showProgress &&
                  new components.BeamFlexWrapper({
                    justifyContent: "space-between",
                    children: [
                      // block wrapper
                      new components.BeamBlockWrapper({
                        width: this.options.progressBarWidth || "85%",
                        children: [
                          // progress
                          new components.BeamProgressWrapper({
                            percentage: nonprofit.impact.percentage,
                            height: this.options.progressBarHeight || "7px",
                            backgroundColor: this.options
                              .progressBarBackgroundColor,
                          }),
                        ],
                      }),
                      // percentage text
                      new components.BeamText({
                        text: `${nonprofit.impact.percentage}%`,
                        textAlign: this.options.tilePercentageTextAlign || "left",
                        fontFamily: this.options.fontFamily,
                        color: this.options.tileTextColor || "#fff",
                        fontWeight: this.options.tilePercentageFontWeight || "bold",
                        fontSize:
                          this.options.tilePercentageFontSize || "medium",
                        margin: this.options.tilePercentageMargin || "0 0 0 auto",
                        padding: "0 0 0 5px",
                      }),
                    ],
                  }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  column(nonprofit, lastNonprofit) {
    return new components.BeamCard({
      width: "400px",
      border: "none",
      cornerRadius: "10px",
      padding: "5px",
      backgroundImage:
        lastNonprofit?.id === nonprofit.id &&
        `linear-gradient(to right, ${this.gradientColors})`,
      margin: "3px",
      children: [this.card(nonprofit)],
    });
  }

  headerComponent({ headerLogo, text }) {
    return new components.BeamContainer({
      width: "100%",
      children: [headerLogo, this.headerText(text)],
    });
  }

  mobileListComponent(nonprofits) {
    this.showProgress = this.options.showCommunityImpact
      ? true
      : nonprofits.some(
          (nonprofit) => parseInt(nonprofit.impact.percentage) > 0
        );

    return new components.BeamContainer({
      margin: "5px 0 0 0",
      children: nonprofits.map((nonprofit) =>
        this.card(nonprofit, "0 0 5px 0")
      ),
    });
  }

  mobileSelectedComponent(lastNonprofit, text, onChange) {
    const height = "150px";
    return new components.BeamCard({
      width: "100%",
      height,
      cornerRadius: this.options.selectedTileBorderRadius || "10px",
      margin: "0 0 3px 0",
      overflow: "hidden",
      backgroundColor:
        this.options.selectedTileBackgroundColor || "transparent",
      children: [
        // card image
        !this.options.selectedTileBackgroundColor &&
          new components.BeamCardImage({
            src: lastNonprofit.image,
            height,
            objectFit: "cover",
          }),
        // card overlay
        new components.BeamCardOverlayFlex({
          children: [
            // left content
            new components.BeamContainer({
              width: "60%",
              children: [
                // description
                new components.BeamText({
                  text: text,
                  fontFamily: this.options.fontFamily,
                  fontSize:
                    this.options.selectedTileDescriptionFontSize || "0.95em",
                  color: this.options.selectedTileTextColor || "#fff",
                }),
              ],
            }),
            new components.BeamButton({
              text: "Change",
              fontFamily: this.options.fontFamily,
              fontWeight: "bold",
              fontSize: "small",
              color: "#fff",
              borderColor: "#fff",
              cornerRadius: "20px",
              padding: "10px 15px",
              margin: "0 0 0 auto",
              clickListener: onChange,
            }),
          ],
        }),
      ],
    });
  }

  matchDonationComponent({
    text,
    userDidMatch,
    donationAmount,
    onMatch,
    checkMark,
    maxWidth,
  }) {
    return new components.BeamCard({
      maxWidth: maxWidth || "100%",
      backgroundColor: "#fff",
      children: [
        // flex wrapper
        new components.BeamFlexWrapper({
          children: [
            // text wrapper
            new components.BeamContainer({
              width: "62%",
              children: [
                // info text
                new components.BeamText({
                  text: text,
                  fontFamily: this.options.fontFamily,
                  fontSize: this.options.matchDonationTextSize || "x-small",
                  color: this.options.textColor,
                  padding: "10px 0 10px 10px",
                }),
              ],
            }),
            // checkbox
            new components.BeamCheckBox({
              text: `+${donationAmount}`,
              textLeft: true,
              fontFamily: this.options.fontFamily,
              fontSize: this.options.matchDonationAmountTextSize ||  "larger",
              fontWeight: this.options.matchDonationAmountFontWeightSize || "bold",
              checked: userDidMatch,
              color: userDidMatch
                ? this.options.gradientColors[0]
                : this.options.textColor,
              margin: "0 0 0 auto",
              padding: "0 10px 0 0",
              width: "30px",
              height: "30px",
              labelCheckSpace: "10px",
              backgroundImage: userDidMatch && checkMark,
              changeListener: onMatch,
            }),
          ],
        }),
      ],
    });
  }

  desktopListComponent(nonprofits, lastNonprofit) {
    this.showProgress = this.options.showCommunityImpact
      ? true
      : nonprofits.some(
          (nonprofit) => parseInt(nonprofit.impact.percentage) > 0
        );

    const isLastItem = (nonprofit, index) => (
      lastNonprofit && nonprofit.id === lastNonprofit.id,
      index + 1 === nonprofits.length
    );

    const column = (nonprofit, lastNonprofit, margin, lastItem = false) => {
      return new components.BeamCard({
        width: "100%",
        border: "none",
        cornerRadius: this.options.tileBorderRadius,
        padding: "5px",
        backgroundImage:
          lastNonprofit?.id === nonprofit.id &&
          `linear-gradient(to right, ${this.gradientColors})`,
        margin: margin,
        alignSelf: lastItem ? "stretch" : undefined,
        children: [this.card(nonprofit)],
      });
    };

    return new components.BeamContainer({
      margin: "5px 0 0 0",
      children: this.options.noWrap
        ? [
            new components.BeamFlexWrapper({
              margin: "0 0 15px",
              noWrap: true,
              alignItems: "flex-end",
              children: nonprofits.map((nonprofit, index) =>
                column(
                  nonprofit,
                  lastNonprofit,
                  isLastItem(nonprofit, index)
                    ? "0"
                    : `0 ${this.options.tileMargin || "15px"} 0 0`,
                  isLastItem(nonprofit, index)
                )
              ),
            }),
          ]
        : nonprofits.map((nonprofit, index) => {
            if ((index + 1) % 2 !== 0) {
              let nonprofit2 = nonprofits[index + 1];
              return new components.BeamFlexWrapper({
                centerItems: false,
                children: [
                  // column 1
                  this.column(nonprofit, lastNonprofit),
                  // column 2
                  nonprofit2 && this.column(nonprofit2, lastNonprofit),
                ],
              });
            }
          }),
    });
  }
}

export default DefaultNonprofitWidgetTheme;
