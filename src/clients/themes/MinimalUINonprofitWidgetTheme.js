import * as components from "../../components";
import BaseTheme from "./BaseTheme";
import {translations, nonprofitUtil} from '../../utils';

class MinimalUINonprofitWidgetTheme extends BaseTheme {
  constructor(options = {}) {
    super(options);
  }

  static get id() {
    return "minimal-ui-nonprofit";
  }

  headerText(text) {
    return new components.BeamText({
      padding: this.options.headerTextPadding || "10px 0",
      text: this.options.headerText ? this.options.headerText : text,
      textAlign: this.options.headerTextAlign || "left",
      color: this.options.headerTextFontColor || this.options.tileTextColor || "#000",
      fontFamily: this.options.headerTextFontFamily || this.options.fontFamily,
      border: this.options.headerTextBorder,
      margin: this.options.headerTextMargin,
      fontSize: this.options.headerTextFontSize || "small",
      fontWeight: this.options.headerTextFontWeight || "normal",
      style: {
        ...this.options.headerTextStyle,
        ...this.isMobile ? this.options.headerTextMobileStyle : {},
      }
    });
  }

  nonprofitCard(nonprofit, selected = false, lastItem = false) {
    return new components.BeamCard({
      border: selected ? this.options.selectedBorder || "1px solid #000" : this.options.iconButtonBorder || "1px solid #f2f2f2",
      cornerRadius: this.options.nonprofitCornerRadius || "0",
      height: this.options.tileHeight || "40px",
      backgroundColor: selected
        // ? this.options.selectedNonprofitBackgroundColor || "#fff"
        ? this.options.selectedNonprofitBackgroundColor || `#${nonprofit.cause_selected_color || 'fff'}`
        : this.options.iconButtonBackgroundColor || "rgba(0,0,0,0)",
      clickListener: nonprofit.onClick,
      margin: lastItem ? "0" : this.options.nonprofitCardMargin || "0 15px 0 0",
      width: "100%",
      cursor: "pointer",
      overflow: "hidden",
      alignSelf: lastItem ? "stretch" : undefined,
      children: [
        new components.BeamCardImage({
          src: selected ? nonprofit.cause_selected_image : nonprofit.cause_icon,
          height: this.options.tileImageHeight || "60%",
          width: this.options.tileImageWidth || "auto",
          margin: this.options.tileImageWidth || "auto",
          cornerRadius: this.options.nonprofitCardImageCornerRadius,
        })
      ]
    });
  }

  selectedCard(nonprofit) {
    return new components.BeamCard({
      border: `${this.options.tileBorderThickness || "1px"} solid ${this.options.tileBorderColor || "#000"}`,
      // padding: "15px 15px",
      cornerRadius: this.options.tileBorderRadius || undefined,
      backgroundImage: this.options.showNonprofitBanner && `url("${nonprofit.image}")`,
      backgroundSize: 'contain',
      children: [
        // card body
        new components.BeamCardBody({
          backgroundColor: this.options.backgroundColor || "#fff",
          cornerRadius: this.options.tileBorderRadius || undefined,
          padding: this.options.tilePadding || "15px",
          children: this.options.compactView ? this.compactCard(nonprofit) : [
            new components.BeamFlexWrapper({
              wrap: true,
              justifyContent: "space-between",
              children: [
                // cause text
                new components.BeamText({
                  text: nonprofit.cause,
                  margin: "0px auto 0px 0px",
                  textTransform: this.options.tileCauseTextTransform || "uppercase",
                  color: this.options.tileTextColor || "#000",
                  letterSpacing: this.options.tileCauseLetterSpacing || "2px",
                  fontFamily: this.options.fontFamily,
                  fontSize: this.options.tileCauseFontSize || "small",
                  fontWeight: this.options.tileCauseFontWeight,
                  style: {...this.options.cause?.style}
                }),
                // powered by
                !this.options.hidePoweredBy &&
                new components.BeamContainer({
                  // pos: {
                  //     position: "absolute",
                  //     top: this.options.poweredByPadding || "15px",
                  //     right: this.options.poweredByPadding || "15px"
                  // },
                  children: [
                    new components.BeamText({
                      text: "Powered by Beam",
                      color: this.options.poweredByTextColor || "#999",
                      fontFamily: this.options.fontFamily,
                      fontSize: this.options.poweredByFontSize || "11px",// this.options.tileCauseFontSize || "small",
                      style: {...this.options.poweredBy?.style}
                    })
                  ]
                }),
              ]
            }),
            // funding text
            new components.BeamText({
              text: `<span style="font-weight: ${this.options.fundingTextFontWeight || "bold"};"> ${this.options.lan ? '' : `${this.options.isInKind || nonprofitUtil.isInKind(nonprofit.id) ? 'Provide' : 'Fund'}`} ${nonprofit.impact_description}</span> <span style="font-weight: ${this.options.fundingViaTextFontWeight || 'normal'}">via</span> <span style="font-weight: ${this.options.fundingNonprofitNameTextFontWeight || 'normal'}">${nonprofit.name}</span>`,
              fontFamily: this.options.fontFamily,
              fontSize: this.options.tileDescriptionFontSize || "small",
              margin: "0",
              padding: "10px 0",
              color: this.options.tileTextColor || "#000",
              style: {...this.options?.impact?.style},
            }),
            // progress wrapper
            new components.BeamFlexWrapper({
              noWrap: true,
              justifyContent: "space-between",
              children: [
                // block wrapper
                new components.BeamBlockWrapper({
                  width: this.options.progressBarWidth || "calc(100% - 105px)", //"100%",
                  children: [
                    // progress
                    new components.BeamProgressWrapper({
                      percentage: nonprofit.impact.percentage,
                      height: this.options.progressBarHeight || "7px",
                      cornerRadius: this.options.progressBarBorderRadius || undefined,
                      backgroundColor: this.options.progressBarBackgroundColor,
                      border: this.options.progressBarBorder,
                      style: {...this.options?.progressBar?.style},
                    }),
                  ],
                }),
                // block wrapper
                new components.BeamBlockWrapper({
                  width: this.options.tilePercentageWidth || "20%",
                  children: [
                    // percentage text
                    new components.BeamText({
                      text: `${nonprofit.impact.percentage}% ${this.options.lan ? translations.translateFunded(this.options.lan) : 'funded'}`,
                      fontFamily: this.options.fontFamily,
                      textAlign: this.options.tilePercentageTextAlign || "left",
                      color: this.options.tilePercentageTextColor || this.options.tileTextColor || "#000",
                      fontWeight: this.options.tilePercentageFontWeight || "bold",
                      fontSize: this.options.tilePercentageFontSize || "x-small",
                      margin: this.options.tilePercentageMargin || "0 0 0 auto",
                      padding: "0 0 0 5px",
                      style: {...this.options?.progressBartext?.style},
                      // minWidth: "105px"
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

  compactCard(nonprofit) {
    const causeText = `<span style="font-family: ${this.options.fontFamily};font-weight: ${this.options.tileCauseFontWeight};font-size: ${this.options.tileCauseFontSize || "small"}; color: ${this.options.tileTextColor || "#000"};letter-spacing: ${this.options.tileCauseLetterSpacing || "2px"};text-transform: ${this.options.tileCauseTextTransform || "uppercase"};">${nonprofit.cause}: </span>`
    return [
      new components.BeamFlexWrapper({
        wrap: true,
        justifyContent: "space-between",
        children: [
          // cause text
          // new components.BeamText({
          //   text: nonprofit.cause,
          //   margin: "0px auto 0px 0px",
          //   textTransform: this.options.tileCauseTextTransform || "uppercase",
          //   color: this.options.tileTextColor || "#000",
          //   letterSpacing: this.options.tileCauseLetterSpacing || "2px",
          //   fontFamily: this.options.fontFamily,
          //   fontSize: this.options.tileCauseFontSize || "small",
          //   fontWeight: this.options.tileCauseFontWeight
          // }),
          // cause + funding text
          new components.BeamText({
            text: this.options.lan ? nonprofit.impact_description : `${causeText}<span style="font-weight: ${this.options.fundingTextFontWeight || "bold"};"> ${this.options.isInKind || nonprofitUtil.isInKind(nonprofit.id) ? 'Provide' : 'Fund'} ${nonprofit.impact_description}</span> via ${nonprofit.name}`,
            fontFamily: this.options.fontFamily,
            fontSize: this.options.tileDescriptionFontSize || "small",
            margin: "0",
            padding: "10px 0",
            color: this.options.tileTextColor || "#000",
          }),
        ]
      }),
      // progress wrapper
      new components.BeamFlexWrapper({
        noWrap: true,
        justifyContent: "space-between",
        children: [
          // block wrapper
          new components.BeamBlockWrapper({
            width: this.options.progressBarWidth || "calc(100% - 105px)", //"100%",
            children: [
              // progress
              new components.BeamProgressWrapper({
                percentage: nonprofit.impact.percentage,
                height: this.options.progressBarHeight || "7px",
                cornerRadius: this.options.progressBarBorderRadius || undefined,
                backgroundColor: this.options.progressBarBackgroundColor,
                border: this.options.progressBarBorder,
              }),
            ],
          }),
          // block wrapper
          new components.BeamBlockWrapper({
            width: this.options.tilePercentageWidth || "20%",
            children: [
              // percentage text
              new components.BeamText({
                text: `${nonprofit.impact.percentage}% ${this.options.lan ? translations.translateFunded(this.options.lan) : 'funded'}`,
                fontFamily: this.options.fontFamily,
                textAlign: this.options.tilePercentageTextAlign || "left",
                color: this.options.tilePercentageTextColor || this.options.tileTextColor || "#000",
                fontWeight: this.options.tilePercentageFontWeight || "bold",
                fontSize: this.options.tilePercentageFontSize || "x-small",
                margin: this.options.tilePercentageMargin || "0 0 0 auto",
                padding: "0 0 0 5px",
                // minWidth: "105px"
              }),
            ],
          }),
        ],
      })
    ]
  }

  mobileComponent(nonprofits, selectedNonprofit = null) {
    return new components.BeamContainer({
      children: [
        this.headerText(this.options.headerText || `Select a cause and <b>we'll donate 1%</b> of your purchase there for you.`),
        new components.BeamFlexWrapper({
          margin: "0 0 15px",
          noWrap: true,
          alignItems: "flex-end",
          borderRadius: '0px',
          children: nonprofits.map((nonprofit, index) => this.nonprofitCard(nonprofit,
            selectedNonprofit && nonprofit.id === selectedNonprofit.id, index + 1 === nonprofits.length))
        }),
        // percentage text
        new components.BeamText({
          text: `${nonprofit.impact.percentage}% ${
            this.options.hideFundedText ? "" : `${this.options.lan ? translations.translateFunded(this.options.lan) : "funded"}`
          }`,
          fontFamily: this.options.fontFamily,
          color: this.options.tileTextColor || "#000",
          fontSize: this.options.tilePercentageFontSize || "x-small",
          fontWeight: this.options.tilePercentageFontWeight || "normal",
          margin: "0 0 0 10px",
          textAlign: "right",
          whiteSpace: "nowrap",
        }),
      ],
    })
    //       ],
    //     }),
    //   ],
    // });
  }

  mobileComponent(nonprofits, selectedNonprofit = null) {
    return new components.BeamContainer({
      children: [
        this.headerText(
          `Select a cause and <b>we will donate 1%</b> of your purchase there for you.`
        ),
        new components.BeamFlexWrapper({
          margin: "0 0 15px",
          noWrap: true,
          alignItems: "flex-end",
          borderRadius: '0px',
          children: nonprofits.map((nonprofit, index) =>
            this.nonprofitCard(
              nonprofit,
              selectedNonprofit && nonprofit.id === selectedNonprofit.id,
              index + 1 === nonprofits.length
            )
          ),
        }),
        selectedNonprofit && this.selectedCard(selectedNonprofit),
      ],
    });
  }

  desktopComponent(nonprofits, selectedNonprofit = null) {
    return this.mobileComponent(nonprofits, selectedNonprofit);
  }
}

export default MinimalUINonprofitWidgetTheme;