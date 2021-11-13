import * as components from "../../components";
import BaseTheme from "./BaseTheme";
import { translations } from '../../utils';

class MinimalUIImpactOverviewWidgetTheme extends BaseTheme {
  constructor(options = {}) {
    super(options);
  }
  static get id() {
    return "minimal-ui-impact-overview";
  }

  headerText(text) {
    return new components.BeamText({
      padding: this.options.headerTextPadding || "10px",
      text: text,
      color: this.options.textColor,
      fontFamily: this.options.fontFamily,
      fontSize: "small",
      fontWeight: this.options.headerTextFontWeight,
      textTransform: this.options.headerTextTransform,
    });
  }

  purchaseMessage(data) {
    return new components.BeamText({
      padding: "10px 0 0 0",
      text: this.options.promoText ? `${this.options.promoText.replace(/BEAM_NONPROFIT/g, data.personal?.name)}` : `You just made an impact for ${data.personal.name}${this.options.hidePurchaseMessageChainName ? "!" :` with your ${data.chain.name} purchase!`} ${this.options.purchaseMessageText || ''}`,
      color: this.options.purchaseMessageTextColor || this.options.textColor || "#000",
      fontFamily: this.options.fontFamily,
      fontWeight: this.options.purchaseMessageFontWeight || "normal",
      fontSize: this.options.purchaseMessageFontSize || "small",
      margin: this.options.purchaseMessageMargin || "0px"
    });
  }

  getPersonalHeaderText() {
    return this.headerText(this.options.personalHeaderText || "Your Impact:");
  }

  getCommunityHeaderText(data) {
    return this.headerText(
      this.options.communityHeaderText ||
        `The ${data.chain.name} Community's Impact:`
    );
  }

  link(text, href) {
    return new components.BeamAnchor({
      text: `
        <div style="diplay: -ms-flexbox !important;display: flex !important;-ms-flex-direction: row !important;flex-direction: row !important;-ms-flex-align: center;align-items: center;">
          ${text} 
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </div>`,
      fontFamily: this.options.fontFamily,
      fontSize: this.options.linkTextFontSize || "small",
      margin: "0",
      href: href,
      asLink: true,
      color: this.options.textColor,
    });
  }

  getPersonalLinkText(data) {
    return this.link(
      this.options.personalLinkText ||
        `Learn more about ${data.personal?.name} `,
      data.personal.website
    );
  }

  getCommunityLinkText(data, url) {
      return this.link(
        this.options.communityLinkText ||
          `See all the impact by the ${data.chain.name} community `,
        url
      );
    }

  card(nonprofit, isCommunity = false) {
    return new components.BeamCard({
      border: `${this.options.tileBorderThickness || "1px"} solid ${
        this.options.tileBorderColor || "#000"
      }`,
      padding: "15px 15px",
      cornerRadius: this.options.tileBorderRadius || undefined,
      children: [
        // card body
        new components.BeamCardBody({
          backgroundColor: this.options.backgroundColor || "#fff",
          children: [
            // cause text
            new components.BeamText({
              text: nonprofit.cause,
              textTransform:
                this.options.tileCauseTextTransform || "capitalize",
              color: this.options.tileTextColor || "#000",
              fontFamily: this.options.fontFamily,
              fontSize: this.options.tileCauseFontSize || "small",
            }),
            // funding text
            new components.BeamText({
              text: `<b>${this.options.lan ? '' : 'Fund'} ${nonprofit.impact_description}</b> <em>via ${nonprofit.name}</em>`,
              fontFamily: this.options.fontFamily,
              fontSize: this.options.tileDescriptionFontSize || "small",
              margin: "0",
              color: this.options.tileTextColor || "#000",
            }),
            // progress wrapper
            new components.BeamFlexWrapper({
              margin: "5px 0",
              justifyContent: "space-between",
              children: [
                // block wrapper
                new components.BeamBlockWrapper({
                  width: this.options.progressBarWidth || "calc(100% - 105px)", //"100%",
                  children: [
                    // progress
                    new components.BeamProgressWrapper({
                      percentage: nonprofit?.impact?.percentage,
                      height: "7px",
                    }),
                  ],
                }),
                // percentage text
                new components.BeamText({
                  text: `${nonprofit?.impact?.percentage}% ${this.options.lan ? translations.translateFunded(this.options.lan) : 'funded'}`,
                  fontFamily: this.options.fontFamily,
                  color: this.options.tileTextColor || "#000",
                  fontSize: this.options.tilePercentageFontSize || "x-small",
                  margin: "0 0 0 10px",
                  textAlign: "right",
                  whiteSpace: "nowrap",
                }),
              ],
            }),
            isCommunity &&
              nonprofit.impact.goal_completion > 0 &&
              new components.BeamText({
                text: `Funded <b>${nonprofit?.impact?.goal_completion || 0}</b> time${
                  nonprofit.impact.goal_completion > 1 ? "s" : ""
                } so far`,
                fontFamily: this.options.fontFamily,
                fontSize: this.options.tileDescriptionFontSize || "small",
                margin: "0",
                // color: this.options.goalCompletionTextColor || "#999",
                color: this.options.tileTextColor || "#000",
              }),  
              // progress wrapper
              // new components.BeamFlexWrapper({
              //   justifyContent: "space-between",
              //   children: [
              //     // block wrapper
              //     new components.BeamBlockWrapper({
              //       width: "85%",
              //       children: [
              //         // progress
              //         new components.BeamProgressWrapper({
              //           percentage: nonprofit.impact.percentage,
              //           height: "7px",
              //         }),
              //       ],
              //     }),
              //     // percentage text
              //     new components.BeamText({
              //       text: `| ${nonprofit.impact.percentage}% funded`,
              //       fontFamily: this.options.fontFamily,
              //       color: this.options.tileTextColor || "#000",
              //       fontSize: this.options.tilePercentageFontSize || "x-small",
              //       margin: "0 0 0 auto",
              //       padding: "0 0 0 5px",
              //     }),
              //   ],
              // }),
          ],
        }),
      ],
    });
  }

  personalCard(data) {
    return new components.BeamContainer({
      children: [
        this.getPersonalHeaderText(),
        this.card(data.personal),
        new components.BeamContainer({
          margin: "10px 0 0 0",
          textAlign: "right",
          children: [
            !this.options.hidePersonalImpactLink &&
              this.getPersonalLinkText(data),
          ],
        }),
      ],
    });
  }

  communityCard(data, url) {
    return new components.BeamContainer({
      children: [
        this.getCommunityHeaderText(data),
        this.card(data.community, true),
        new components.BeamContainer({
          margin: "10px 0 0 0",
          textAlign: "right",
          children: [
            !this.options.hideCommunityImpactLink &&
              this.getCommunityLinkText(data, url),
          ],
        }),
      ],
    });
  }

  mobileComponent(data, communityImpactUrl) {
    return new components.BeamContainer({
      children: [
        
        // this.headerText(
        //   this.options.headerText || `You made an impact for ${data.personal.name} with your ${data.chain.name} purchase!`
        // ),
        this.purchaseMessage(data),
        this.personalCard(data),
        this.communityCard(data, communityImpactUrl),
      ],
    });
  }

  desktopComponent(data, communityImpactUrl) {
    return this.mobileComponent(data, communityImpactUrl);
  }
}

export default MinimalUIImpactOverviewWidgetTheme;
