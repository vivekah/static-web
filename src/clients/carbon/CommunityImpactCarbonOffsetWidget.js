import * as components from "../../components";
import BaseImpactWidget from "../BaseImpactWidget";

class CommunityImpactCarbonOffsetWidget extends BaseImpactWidget {
  constructor(options = {
    beamCommunityData: null,
    themeConfig: {
      tileBackgroundColor: "rgba(0,0,0,0)",
      tileCauseFontSize: "16px",
      tileCauseFontWeight: "300",
      tileCauseIconHeight: "255px",
    }
  }) {
    super(options);
  }

  buildMobileView() {
    let container = new components.BeamContainer({
      children: [
        new components.BeamContainer({
          margin: "0 0 10px",
          children: !this.options.themeConfig.hideLogo && [
            this.headerLogoComponent(
              this.options.themeConfig.usePartnerRectLogo
                ? this.data.chain.rect_logo
                : this.data.chain.logo),
          ],
        }),
        ...this.data.nonprofits.map(
          (project) =>
            new components.BeamContainer({
              margin: "10px",
              // children: [this.outerCard(project)],
            })
        ),
      ],
    });

    return container.view;
  }

  buildDesktopView() {
    let data = this.beamCommunityData ? this.beamCommunityData : this.data.nonprofits
    let container = new components.BeamContainer({
      children: [
        new components.BeamContainer({
          margin: "0 0 10px",
          children: !this.options.themeConfig.hideLogo && [
            this.headerLogoComponent(
              this.options.themeConfig.usePartnerRectLogo
                ? this.data.chain.rect_logo
                : this.data.chain.logo),
          ],
        }),
        // projects
        new components.BeamFlexWrapper({
          margin: "10px 0 0 0",
          alignItems: "flex-end",
          justifyContent: "center",
          // wrap: !this.options.themeConfig.noWrap,
          children: data.map(
            (project, index) =>
              new components.BeamFlexWrapper({
                backgroundColor: this.options.themeConfig.tileBackgroundColor,
                width: this.options.themeConfig.tileWidth || "225px",
                margin: "auto",
                alignItems: "flext-start",
                justifyContent: "center",
                children: [
                  // cause Text
                  new components.BeamText({
                    text: project.cause,
                    fontSize: this.options.themeConfig.tileCauseFontSize,
                    fontWeight: this.options.themeConfig.tileCauseFontWeight,
                    textAlign: "center",
                    fontFamily: this.options.themeConfig.fontFamily,
                  }),
                  //cause Icon
                  new components.BeamImage({
                    src: project.cause_icon,
                    width: this.options.themeConfig.tileCauseIconWidth || "auto",
                    height: this.options.themeConfig.tileCauseIconHeight,
                    margin: this.options.themeConfig.tileCauseIconMargin || "10px",
                  }),
                  // project stats
                  new components.BeamContainer({
                    width: "auto",
                    margin: "auto",
                    children: [
                      new components.BeamText({
                        asLink: true,
                        text: project.community_goal_completion ? project.community_goal_completion.value : "300",
                        color: this.options.themeConfig.textColor,
                        fontSize: this.options.themeConfig.tileStatFontSize,
                        fontFamily: this.options.themeConfig.fontFamily,
                        fontWeight: this.options.themeConfig.tileStatFontWeight || "bold",
                        padding: this.options.themeConfig.tileStatFontPadding || "0px 0px 5px",
                        margin: this.options.themeConfig.avoidanceTotalFontMargin,
                        textAlign: "center"
                      }),
                      new components.BeamText({
                        text: project.community_goal_completion ? project.community_goal_completion.summary : "Saved", //this.options.themeConfig[`offsetStat${index}Text`] || "Saved",
                        color: this.options.themeConfig.textColor,
                        fontFamily: this.options.themeConfig.fontFamily,
                        fontSize: this.options.themeConfig.tileStatSubTextSize,
                        fontWeight: this.options.themeConfig.tileStatSubTextWeight,
                        textAlign: "center"
                      }),

                    ]
                  }),
                ],
              })
          ),
        }),
      ],
    });

    return container.view;
  }

  async render(nonprofit = null) {
    await super.render({ nonprofit, user: null }, () => {
      return this.buildDesktopView(); //this.isMobile ? this.buildMobileView() : this.buildDesktopView();
    });
  }
}

export default CommunityImpactCarbonOffsetWidget;