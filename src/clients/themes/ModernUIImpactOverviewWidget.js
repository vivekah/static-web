import * as components from "../../components";
import BaseTheme from "./BaseTheme";
import {translations} from "../../utils";

class ModernUIImpactOverviewWidgetTheme extends BaseTheme {
  constructor(options = {}) {
    super(options);
    this.showProgress = true;
  }

  static get id() {
    return "modern-ui-impact-overview";
  }

  headerText(text, margin = "0", fontFamily) {
    return new components.BeamText({
      text: text,
      fontFamily: fontFamily || this.options.fontFamily,
      fontSize: this.options.headerTextFontSize || "small",
      fontWeight: this.options.headerTextFontWeight || "normal",
      textTransform: this.options.headerTextTranform || "none",
      color: this.options.headerTextColor || "#000".margin,
    });
  }

  purchaseMessage(data) {
    return this.options.separateImpactTitles ? this.getSeparatePromoAndPurchaseMessage(data) :
      new components.BeamText({
        padding: "10px 0 0 0",
        text: this.options.promoCode ? `You just made 2x as much impact for ${data.personal.name} with code ${this.options.promoCode}!` : this.options.promoText ? `${this.options.promoText.replace(/BEAM_NONPROFIT/g, data.personal.name)}` : `You just made an impact for ${data.personal.name}${this.options.hidePurchaseMessageChainName ? "!" : ` with your ${data.chain.name} purchase!`} ${this.options.purchaseMessageText || ''}`,
        color: this.options.purchaseMessageTextColor || this.options.textColor || "#000",
        fontFamily: this.options.fontFamily,
        fontWeight: this.options.purchaseMessageFontWeight || "normal",
        fontSize: this.options.purchaseMessageFontSize || "small",
        margin: this.options.purchaseMessageMargin || "0px",
        style: {...this.options.purchaseMessage?.style}
      });
  }

  getSeparatePromoAndPurchaseMessage(data) {
    const promoText = new components.BeamText({
      padding: "10px 0 0 0",
      text: this.options.promoCode ? `You just made 2x as much impact for ${data.personal.name} with code ${this.options.promoCode}!` : this.options.promoText ? `${this.options.promoText.replace(/BEAM_NONPROFIT/g, data.personal.name)}` :
        `You just made an impact for ${data.personal.name}${this.options.hidePurchaseMessageChainName ? "!" :
          ` with your ${data.chain.name} purchase!`}`,
      color: this.options.purchaseMessageTextColor || this.options.textColor || "#000",
      fontFamily: this.options.promoTextFontFamily || this.options.fontFamily,
      fontWeight: this.options.promoTextFontWeight || this.options.purchaseMessageFontWeight || "normal",
      fontSize: this.options.promoTextFontSize || this.options.purchaseMessageFontSize || "small",
      margin: this.options.promoTextMargin || " 0px",
    });

    const purchaseMessage = new components.BeamText({
      padding: "10px 0 0 0",
      text: this.options.purchaseMessageText || '',
      color: this.options.purchaseMessageTextColor || this.options.textColor || "#000",
      fontFamily: this.options.purchaseMessageFontFamily || this.options.fontFamily,
      fontWeight: this.options.purchaseMessageFontWeight || "normal",
      fontSize: this.options.purchaseMessageFontSize || "small",
      margin: this.options.purchaseMessageMargin || " 0px",
    });

    return new components.BeamContainer({
      margin: this.options.promoTextContainerMargin || " 0px",
      children: [promoText, purchaseMessage]
    })
  }

  getPersonalHeaderText(margin = "0") {
    return this.headerText(
      this.options.personalHeaderText || "Your Impact:",
      margin,
      this.options.personalHeaderFontFamily,
    );
  }

  getCommunityHeaderText(data, margin = "0") {
    return this.headerText(
      this.options.communityHeaderText ||
      `The ${data.chain.name} Community's Impact:`,
      margin,
      this.options.communityHeaderFontFamily
    );
  }

  link(text, href, target) {
    return new components.BeamAnchor({
      text: this.options.useArrowInLinkText
        ? `${text} >`
        : `
      <div style="diplay: -ms-flexbox !important;display: flex !important;-ms-flex-direction: row !important;flex-direction: row !important;-ms-flex-align: center;align-items: center;">
        ${text} 
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
        </svg>
      </div>`,
      fontFamily: this.options.fontFamily,
      fontWeight: this.options.linkFontWeight || "bold",
      fontSize: this.options.linkTextFontSize || "small",
      color: this.options.linkTextColor || "#000",
      asLink: this.options.underlineLink || false,
      margin: "0",
      href: href,
      target,
      style: {...this.options?.link?.style}
    });
  }

  getPersonalLinkText(data) {
    return this.link(
      this.options.personalLinkText ? this.options.personalLinkText.replace(/<cause>/g, data.personal.name) :
        `${this.options.lan ? translations.translateLearnMoreAbout(this.options.lan) : 'Learn more about'}` +  ` ${data.personal.name} `,
      data.personal.website
    );
  }

  getCommunityLinkText(data, url) {
    return this.link(
      this.options.communityLinkText ||
       `${this.options.lan ? translations.translateSeeAllImpact(this.options.lan) : `See all of the impact by ${data.chain.name} community`}`,
      url,
      "_self"
    );
  }

  innerCard(nonprofit, isCommunity = false) {
    const height = this.options.impactImageHeight || "150px";
    return new components.BeamCard({
      height,
      cornerRadius: this.options.overlayCornerRadius || this.options.tileBorderRadius || "10px 10px 0 0",
      overflow: "hidden",
      margin: "0",
      // border: "0",
      backgroundColor: this.options.innerCardBackgroundColor || "#F7F7F7",
      border: this.options.cardOverlayBorder,
      borderWidth: this.options.cardOverlayBorderWidth,
      children: [
        // card image
        new components.BeamCardImage({
          src: isCommunity ? nonprofit.chain_target_image : nonprofit.image,
          height,
          objectFit: "cover",
        }),
      ],
    });
  }

  personalCard(data, padding = "0") {
    return new components.BeamCard({
      padding: this.options.hideCommunityImpactBorder ? "0" : this.options.personalCardPadding || "0px",
      height: this.options.personalCardHeight || this.options.tileCardHeight || "275px",
      width: this.options.personalCardWidth,
      border: this.options.impactCardBorder || "none",
      cornerRadius: this.options.tileBorderRadius || "0px",
      borderWidth: this.options.impactCardBorderWidth,
      margin: this.options.personalCardMargin || "0px 0px 10px 0px",
      children: [
        // inner card
        this.innerCard(data.personal),
        new components.BeamContainer({
          width: "100%",
          margin: this.options.personalHeaderMargin || "0 10px 0px 0px",
          padding: this.options.personalHeaderPadding || this.options.impactHeaderPadding || "0px",
          children: [
            // personal header
            data.personal && this.getPersonalHeaderText(),
          ],
        }),
        // card body
        new components.BeamCardBody({
          padding: this.options.personalCardPadding || this.options.impactCardPadding || "10px 10px 0px 0px",
          backgroundColor: this.options.personalImpactBackgroundColor || "#fff",
          cornerRadius: this.options.tileBorderRadius || "0 0 10px 10px",
          border: this.options.impactDetailsBorder,
          borderWidth: this.options.impactDetailsBorderWidth,
          children: [
            // progress wrapper
            new components.BeamFlexWrapper({
              noWrap: true,
              justifyContent: "space-between",
              children: [
                // block wrapper
                new components.BeamBlockWrapper({
                  width: this.options.showPersonalImpactPercentage ? this.options.progressBarWidth || "calc(100% - 105px)" : "100%", //"100%",
                  children: [
                    // progress
                    new components.BeamProgressWrapper({
                      percentage: data.personal.impact.percentage,
                      height: this.options.progressBarHeight || "7px",
                      cornerRadius: this.options.progressBarBorderRadius || undefined,
                      backgroundColor: this.options.progressBarBackgroundColor,
                      border: this.options.progressBarBorder,
                    }),
                  ],
                }),
                // block wrapper
                new components.BeamBlockWrapper({
                  width: this.options.showPersonalImpactPercentage ? this.options.tilePercentageWidth || "20%" : "auto",
                  children: [
                    this.options.showPersonalImpactPercentage && // percent text
                    new components.BeamText({
                      tag: "h6",
                      text: data.personal.impact.percentage + "&#37;",
                      fontFamily: this.options.fontFamily,
                      textAlign: this.options.tilePercentageTextAlign || "left",
                      color: this.options.personalImpactPercentageColor || this.options.tilePercentageTextColor || this.options.tileTextColor || "#000",
                      fontWeight: this.options.tilePercentageFontWeight || "bold",
                      fontSize: this.options.tilePercentageFontSize || "x-small",
                      margin: this.options.personalImpactPercentageMargin || this.options.tilePercentageMargin || "0 0 0 auto",
                      padding: "0 0 0 5px",
                      style: {...this.options?.progressBartext?.style},
                    }),
                  ],
                }),
              ]
            }),
            new components.BeamFlexWrapper({
              margin: this.options.personalCardContentMargin || "10px 0 0",
              children: [
                // impact info
                new components.BeamText({
                  text: this.options.lan ? data.personal.impact_description : `<span style="font-weight: ${this.options.impactFontWeight || "bold"}"> ${this.options.isInKind ? "Provide" : "Fund"}</span> 
                  ${data.personal.impact_description}`,
                  fontFamily: this.options.fontFamily,
                  fontSize: this.options.impactFontSize || "small",
                  lineHeight: this.options.impactLineHeight,
                  margin: "10px 0 0 0",
                  color: this.options.personalImpactTextColor || "#000",
                  style: {...this.options?.impact?.style}
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  communityCard(data) {
    return new components.BeamCard({
      padding: this.options.hideCommunityImpactBorder ? "0" : this.options.communityCardPadding || "10px 10px 0px 0px",
      height: this.options.communityCardHeight || this.options.tileCardHeight || "275px",
      width: this.options.communityCardWidth,
      border: this.options.impactCardBorder || "none",
      cornerRadius: this.options.tileBorderRadius || "0px",
      borderWidth: this.options.impactCardBorderWidth,
      margin: this.options.communityCardMargin || "0px 0px 10px 0px",
      children: [
        // inner card
        this.innerCard(data.community, true),
        new components.BeamContainer({
          width: "100%",
          margin: this.options.communityHeaderMargin || "0 0px 10px 0px",
          padding: this.options.communityHeaderPadding || this.options.impactHeaderPadding || "0px",
          children: [
            // community header
            data.community && this.getCommunityHeaderText(data),
          ],
        }),
        // card body
        new components.BeamCardBody({
          //   padding: "15px 20px",
          padding: this.options.communityCardPadding || this.options.impactCardPadding || "10px 10px 0px 0px",
          backgroundColor:
            this.options.communityImpactBackgroundColor || "#fff",
          cornerRadius: this.options.tileBorderRadius || "0 0 10px 10px",
          border: this.options.impactDetailsBorder,
          borderWidth: this.options.impactDetailsBorderWidth,
          children: [
            // progress wrapper
            // new components.BeamProgressWrapper({
            //   percentage: data.community.impact.percentage,
            //   height: "7px",
            //   backgroundColor: this.options.progressBarBackgroundColor || undefined,
            //   border: this.options.progressBarBorder,
            // }),

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
                      percentage: data.community.impact.percentage,
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
                      text: `${data.community.impact.percentage}%`,
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
              ]
            }),
            // flex wrapper
            new components.BeamFlexWrapper({
              margin: this.options.communityCardContentMargin || "10px 0 0",
              children: [
                // impact info
                new components.BeamText({
                  text: this.options.lan ? data.community.impact_description : `<span style="font-weight: ${this.options.impactFontWeight || "bold"}">${this.options.isInKind ? "Provide" : "Fund"} ${data.community.impact_description}</span>`,
                  fontFamily: this.options.fontFamily,
                  fontSize: this.options.impactFontSize || "small",
                  color: this.options.communityImpactTextColor || "#000",
                  lineHeight: this.options.impactLineHeight,
                  margin: this.options.communityImpactWrapper || "10px 0 0 0",
                  //   width: "80%",
                }),
              ],
            }),
            data.community.impact.goal_completion > 0 &&
            new components.BeamText({
              text: `<i>Funded <b style="color: ${
                this.options.goalCompletionNumberTextColor ||
                this.options.progressBarColors[0].color
              }">${data.community.impact.goal_completion}</b> time${
                data.community.impact.goal_completion > 1 ? "s" : ""
              } so far</i>`,
              fontFamily: this.options.fontFamily,
              color: this.options.goalCompletionTextColor || "#fff",
              fontSize: "x-small",
              margin: "10px 0 0 0",
            }),
          ],
        }),
      ],
    });
  }

  mobileComponent(data, communityImpactUrl) {
    return new components.BeamContainer({
      children: [
        this.options.showPurchaseMessage && this.purchaseMessage(data),
        //personal
        new components.BeamContainer({
          margin: this.options.mobileLinkContainerMargin || "10px 0 0 0",
          maxWidth: "100%",
          children: [
            data.personal && this.personalCard(data),
            data.personal &&
            new components.BeamContainer({
              margin: "10px 0 0",
              textAlign: this.options.linkTextAlign || "right",
              children: [
                !this.options.hidePersonalImpactLink &&
                this.getPersonalLinkText(data),
              ],
            }),
          ],
        }),
        data.personal &&
        new components.BeamDivider({
          vertical: false,
          borderColor: "rgba(0,0,0,0.1)",
          margin: "10px 0",
        }),
        // community
        new components.BeamContainer({
          margin: "0",
          children: [
            data.community && this.communityCard(data),
            data.community &&
            new components.BeamContainer({
              margin: this.options.mobileLinkContainerMargin || "10px 0 0",
              textAlign: this.options.linkTextAlign || "right",
              children: [
                !this.options.hideCommunityImpactLink &&
                this.getCommunityLinkText(data, communityImpactUrl),
              ],
            }),
          ],
        }),
      ],
    });
  }

  desktopComponent(data, communityImpactUrl) {
    return new components.BeamContainer({
      margin: this.options.desktopContainerMargin,
      children:
        [
          this.options.showPurchaseMessage && this.purchaseMessage(data),

          new components.BeamFlexWrapper({
            alignItems: "none",
            children: [
              new components.BeamContainer({
                width: data.community ? "47%" : "100%",
                height: this.options.communityCardHeight,
                margin: "0 10px 0 0",
                cornerRadius: this.options.tileBorderRadius || "10px",
                children: [
                  data.personal && this.personalCard(data, "10px 10px 10px 0"),
                ],
              }),
              new components.BeamContainer({
                width: data.personal ? "47%" : "100%",
                height: this.options.personalCardHeight,
                padding: "0 0px 10px 0px",
                cornerRadius: this.options.tileBorderRadius || "10px",
                children: [data.community && this.communityCard(data)],
              }),
            ],
          }),
          // links
          new components.BeamFlexWrapper({
            margin: this.options.linkContainerMargin || "10px 0 0 0",
            alignItems: 'flex-start',
            children: [
              data.personal &&
              new components.BeamContainer({
                width: data.community ? "47%" : "100%",
                margin: "0 10px 0 0",
                textAlign: this.options.linkTextAlign || "right",
                children: [
                  // more impact link
                  data.personal && this.getPersonalLinkText(data),
                ],
              }),
              new components.BeamContainer({
                width: data.personal ? "47%" : "100%",
                margin: "0 0px 10px 0px",
                textAlign: this.options.linkTextAlign || "right",
                children: [
                  // see more link
                  data.community && !this.options.hideCommunityImpactLink &&
                  this.getCommunityLinkText(data, communityImpactUrl),
                ],
              }),
            ],
          }),

        ]
    });
  }
}

export default ModernUIImpactOverviewWidgetTheme;