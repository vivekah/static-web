import * as components from "../../components";
import BaseTheme from "./BaseTheme";
import { nonprofitUtil } from '../../utils';
class DefaultImpactOverviewWidgetTheme extends BaseTheme {
  constructor(options = {}) {
    super(options);
  }

  static get id() {
    return "default-impact-overview";
  }

  headerText(text, margin = "0") {
    return new components.BeamText({
      text: text,
      fontFamily: this.options.fontFamily,
      fontSize: this.options.headerTextFontSize || "small",
      fontWeight: this.options.headerTextFontWeight || "normal",
      textTransform: this.options.headerTextTranform || "none",
      color: this.options.headerTextColor || "#000".
      margin,
    });
  }

  purchaseMessage(data) {
    return new components.BeamText({
      padding: this.options.purchaseMessagePadding || "10px 0 0 0",
      text: this.options.promoText ? `${this.options.promoText.replace(/BEAM_NONPROFIT/g, data.personal.name)}` : `You just made an impact for ${data.personal.name}${this.options.hidePurchaseMessageChainName ? "!" :` with your ${data.chain.name} purchase!`} ${this.options.purchaseMessageText || ''}`,
      color: this.options.purchaseMessageTextColor || this.options.textColor || "#000",
      fontFamily: this.options.fontFamily,
      fontWeight: this.options.purchaseMessageFontWeight || "normal",
      fontSize: this.options.purchaseMessageFontSize || "small",
      textAlign: this.options.purchaseMessageTextAlign || "left",
      margin: this.options.purchaseMessageMargin || "0px"
    });
  }

  getPersonalHeaderText(margin = "0") {
    return this.headerText(
      this.options.personalHeaderText || "Your Impact:",
      this.options.personalHeaderMargin || margin
    );
  }

  getCommunityHeaderText(data, margin = "0") {
    return this.headerText(
      this.options.communityHeaderText ||
        `The ${data.chain.name} Community's Impact:`,
        this.options.communityHeaderMargin || margin
    );
  }

  link(text, href, target) {
    return new components.BeamAnchor({
      text: text,
      // this.options.useArrowInLinkText
      //   ? `${text}>`
      //   : `
      // <div style="diplay: -ms-flexbox !important;display: flex !important;-ms-flex-direction: row !important;flex-direction: row !important;-ms-flex-align: center;align-items: center;">
      //   ${text} 
      //   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px">
      //     <path d="M0 0h24v24H0V0z" fill="none"/>
      //     <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
      //   </svg>
      // </div>`,
      fontFamily: this.options.fontFamily,
      fontWeight: this.options.linkFontWeight || "bold",
      fontSize: this.options.linkTextFontSize || "small",
      color: this.options.linkTextColor || "#000",
      asLink: this.options.underlineLink || false,
      margin: "0",
      href: href,
      target
    });
  }

  getPersonalLinkText(data) {
    return this.link(
      this.options.personalLinkText ? this.options.personalLinkText.replace(/<cause>/g, data.personal.name) :
        `Learn more about ${data.personal.name} `,
      data.personal.website
    );
  }

  getCommunityLinkText(data, url) {
    return this.link(
      this.options.communityLinkText ||
        `See all of the impact by ${data.chain.name} community `,
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
      border: "0",
      backgroundColor: this.options.innerCardBackgroundColor || "#F7F7F7",
      children: [
        // card image
        new components.BeamCardImage({
          src: isCommunity ? nonprofit.chain_target_image : nonprofit.image,
          height,
          objectFit: "cover",
        }),
        // overlay
        new components.BeamCardOverlay({
          backgroundColor: this.options.innerCardBackgroundColor || "#F7F7F7",
          children: [
            // text
            new components.BeamContainer({
              padding: "1rem",
              pos: {
                position: "absolute",
                right: "0",
                bottom: "0",
                left: "0",
              },
              children: [
                // cause
                new components.BeamText({
                  text: nonprofit.cause,
                  textTransform: "uppercase",
                  color: "#fff",
                  letterSpacing: this.options.tileCauseLetterSpacing || "3px",
                  fontFamily: this.options.fontFamily,
                  fontWeight: this.options.tileCauseFontWeight,
                  fontSize: this.options.tileCauseFontSize || "small",
                }),
                // title
                new components.BeamText({
                  tag: "h4",
                  text: nonprofit.name,
                  fontFamily: this.options.fontFamily,
                  fontWeight: this.options.tileNameFontWeight || "bold",
                  fontSize: this.options.tileNameFontSize || "large",
                  color: "#fff",
                  margin: this.options.tileNameMargin || "0",
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  personalCard(data, padding = "0") {
    return new components.BeamCard({
      border: "none",
      padding: this.options.hideCommunityImpactBorder ? "0" : this.options.personalCardPadding || "0px",
      // cornerRadius: this.options.tileBorderRadius || "10px",
      height: this.options.personalCardHeight || "275px",
      width: this.options.personalCardWidth,
      // backgroundColor:
      //   this.options.personalImpactBackgroundColor || "transparent",
      margin: this.options.personalCardMargin || "0px 0px 10px 0px",
      children: [
        // card img description
        this.innerCard(data.personal),
        // card body
        new components.BeamCardBody({
          padding: "15px 20px",
          backgroundColor: this.options.personalImpactBackgroundColor || "#fff",
          cornerRadius: this.options.tileBorderRadius || "0 0 10px 10px",
          border: this.options.impactDetailsBorder,
          borderWidth: this.options.impactDetailsBorderWidth,
          children: [
            // progress wrapper
            new components.BeamProgressWrapper({
              percentage: data.personal.impact.percentage,
              height: this.options.progressBarHeight || "7px",
              cornerRadius: this.options.progressBarBorderRadius || undefined,
              backgroundColor: this.options.progressBarBackgroundColor || undefined,
              border: this.options.progressBarBorder,
            }),
            new components.BeamFlexWrapper({
              margin: this.options.personalCardContentMargin || "",
              children: [
                // impact info
                new components.BeamText({
                  text: this.options.lan ? data.personal.impact_description : `<span style="font-weight: ${this.options.impactFontWeight || "bold"}">${data.personal.impact.percentage}% of the way to 
                  ${this.options.isInKind || nonprofitUtil.isInKind(data.personal.id) ? "providing" : "funding"}</span> 
                  ${data.personal.impact_description}`,
                  fontFamily: this.options.fontFamily,
                  fontSize: this.options.impactFontSize || "small",
                  lineHeight: this.options.impactLineHeight,
                  margin: "10px 0 0 0",
                  color: this.options.personalImpactTextColor || "#000",
                  width: this.options.showPersonalImpactPercentage
                    ? "80%"
                    : "100%",
                }),
                this.options.showPersonalImpactPercentage && // percent text
                  new components.BeamText({
                    tag: "h6",
                    text: data.personal.impact.percentage + "&#37;",
                    fontFamily: this.options.fontFamily,
                    fontWeight: this.options.percentageFontWeight || "bold",
                    color: this.options.personalImpactPercentageColor || this.defaultColor || "#000",
                    margin: this.options.personalImpactPercentageMargin || "0 0 0 auto",
                    padding: "0",
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
      border: "none",
      height: this.options.communityCardHeight || "275px",
      width: this.options.communityCardWidth,
      // cornerRadius: this.options.tileBorderRadius || "10px",
      backgroundImage: this.options.hideCommunityImpactBorder ? "none" : `linear-gradient(to right, ${this.gradientColors})`,
      margin: this.options.communityCardMargin || "0px 0px 10px 0px",
      // backgroundColor: this.options.communityImpactBackgroundColor || "transparent",
      children: [
        // inner card
        this.innerCard(data.community, true),
        // card body
        new components.BeamCardBody({
          padding: "15px 20px",
          backgroundColor:
            this.options.communityImpactBackgroundColor || "#fff",
          cornerRadius: this.options.tileBorderRadius || "0 0 10px 10px",
          border: this.options.impactDetailsBorder,
          borderWidth: this.options.impactDetailsBorderWidth,
          children: [
            // progress wrapper
            new components.BeamProgressWrapper({
              percentage: data.community.impact.percentage,
              height: "7px",
              cornerRadius: this.options.progressBarBorderRadius || undefined,
              backgroundColor: this.options.progressBarBackgroundColor || undefined,
              border: this.options.progressBarBorder,
            }),
            // flex wrapper
            new components.BeamFlexWrapper({
              margin: this.options.communityCardContentMargin || "10px 0 0",
              children: [
                // impact info
                new components.BeamText({
                  text: this.options.lan ? data.community.impact_description :  `<span style="font-weight: ${this.options.impactFontWeight || "bold"}">${this.options.isInKind || nonprofitUtil.isInKind(data.personal.id) ? "Provide" : "Fund"} ${data.community.impact_description}</span>`,
                  fontFamily: this.options.fontFamily,
                  fontSize: this.options.impactFontSize || "small",
                  color: this.options.communityImpactTextColor || "#000",
                  lineHeight: this.options.impactLineHeight,
                  margin: "0",
                  width: "80%",
                }),
                // percent text
                new components.BeamText({
                  tag: "h6",
                  text: data.community.impact.percentage + "&#37;",
                  fontFamily: this.options.fontFamily,
                  fontWeight: this.options.percentageFontWeight || "bold",
                  fontSize: this.options.impactPercentageFontSize,
                  color: this.options.communityImpactPercentageColor || this.defaultColor || "#000",
                  margin: this.options.communityImpactPercentageMargin || "0 0 0 auto",
                  padding: "0",
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
            data.personal && this.getPersonalHeaderText("0 0 10px 0"),
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
            data.community && this.getCommunityHeaderText(data, "0 0 10px"),
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
      
      children: 
          [
            this.options.showPurchaseMessage && this.purchaseMessage(data),
            // headers
            new components.BeamFlexWrapper({
              margin: "10px 0 10px 0",
              alignItems: this.options.headerTextFlexAlign || "center",          
              children: [
                data.personal &&
                  new components.BeamContainer({
                    width: data.community ? "47%" : "100%",
                    margin:  this.options.personalHeaderMargin || "0 10px 0px 0px",
                    children: [
                      // personal header
                      data.personal && this.getPersonalHeaderText(),
                    ],
                  }),
                new components.BeamContainer({
                  width: data.personal ? "47%" : "100%",
                  margin:  this.options.communityHeaderMargin || "0 0px 10px 0px",
                  children: [
                    // community header
                    data.community && this.getCommunityHeaderText(data),
                  ],
                }),
              ],
            }),
            new components.BeamFlexWrapper({
              alignItems: "none",
              children: [
                new components.BeamContainer({
                  width: data.community ? "47%" : "100%",
                  height: this.options.communityCardHeight,
                  margin: "0 10px 0 0",
                  cornerRadius: this.options.tileBorderRadius || "10px",
                  // backgroundColor:
                  //   this.options.personalImpactBackgroundColor || "transparent",
                  children: [
                    data.personal && this.personalCard(data, "10px 10px 10px 0"),
                  ],
                }),
                new components.BeamContainer({
                  width: data.personal ? "47%" : "100%",
                  height: this.options.personalCardHeight,
                  padding: "0 0px 10px 0px",
                  cornerRadius: this.options.tileBorderRadius || "10px",
                  // backgroundColor:
                  //   this.options.communityImpactBackgroundColor || "transparent",
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

export default DefaultImpactOverviewWidgetTheme;
