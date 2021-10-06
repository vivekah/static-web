import * as components from "../components";
import BaseImpactWidget from "./BaseImpactWidget";

class GoalImpactWidget extends BaseImpactWidget {
  constructor(
    options = {
      themeConfig: {},
    }
  ) {
    super(options);
    this.maxContainerWidth = 570;
  }

  async getData(data) {
    this.data = data;
    return data;
  }

  async render(data) {
    if (
      data.nonprofits.every((nonprofit) => !nonprofit.community_goal_completion)
    ) {
      return;
    }
    await super.render(data, () => {
      return this.isMobile ? this.buildMobileView() : this.buildDesktopView();
    });
  }

  headerComponent(mainTitle, subTitle) {
    return new components.BeamContainer({
      children: [
        new components.BeamText({
          text: mainTitle,
          fontFamily: this.options.themeConfig.fontFamily,
          fontWeight: this.options.themeConfig.mainTitleFontWeight || "bold",
          fontSize: this.options.themeConfig.mainTitleFontSize || "16px",
          color: this.options.themeConfig.textColor,
          textAlign: "center",
        }),
        new components.BeamText({
          text: subTitle,
          fontFamily: this.options.themeConfig.fontFamily,
          fontWeight: this.options.themeConfig.subTitleFontWeight || "normal",
          fontSize: this.options.themeConfig.subTitleFontSize || "14px",
          color: this.options.themeConfig.textColor,
          textAlign: "center",
        }),
      ],
    });
  }

  tileComponent(nonprofit) {
    return new components.BeamContainer({
      width: "100%",
      padding: "15px",
      children: [
        new components.BeamText({
          text: nonprofit.cause,
          fontFamily: this.options.themeConfig.fontFamily,
          fontWeight: this.options.themeConfig.causeTextFontWeight || "normal",
          fontSize: this.options.themeConfig.causeTextFontSize || "14px",
          textTransform: "uppercase",
          letterSpacing: this.options.themeConfig.causeTextLetterSpacing,
          color: this.options.themeConfig.textColor,
          margin: "0 0 10px",
        }),
        new components.BeamFlexWrapper({
          alignItem: "center",
          margin: "0 10px 0 0",
          children: [
            new components.BeamFlexWrapper({
              cornerRadius: '50%',
              border: '1px solid #000',
              margin: "0 15px 0 0",
              padding: "15px",
              minWidth: "77px",
              height: "77px",
              centerItems: true,
              alignItems: "center",
              children: [
                new components.BeamCardImage({
                  src: nonprofit.cause_icon,
                  height: "100%",
                  width: "auto",
                }),
              ]
            }),
            
            new components.BeamContainer({
              height: "50px",
              children: [
                new components.BeamText({
                  text: `<b>${nonprofit.community_goal_completion.summary}</b> via ${nonprofit.name}`
                    .replace(
                      "{value}",
                      nonprofit.community_goal_completion.value
                    )
                    .replace(
                      "{unit}",
                      nonprofit.community_goal_completion.unit
                    ),
                  fontFamily: this.options.themeConfig.fontFamily,
                  fontWeight:
                    this.options.themeConfig.causeTextFontWeight || "normal",
                  fontSize:
                    this.options.themeConfig.causeTextFontSize || "14px",
                  color: this.options.themeConfig.textColor,
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  buildMobileView() {
    let container = new components.BeamContainer({
      width: "100%",
      children: [
        this.headerComponent(
          "What we've unded so far",
          "See the impact we are all making together. Place an order to help us reach goals faster."
        ),
        new components.BeamContainer({
          children: [
            ...this.data.nonprofits
              .filter((nonprofit) => nonprofit.community_goal_completion)
              .map(
                (nonprofit) =>
                  new components.BeamContainer({
                    margin: "0 0 20px 0",
                    children: [this.tileComponent(nonprofit)],
                  })
              ),
          ],
        }),
      ],
    });
    return container.view;
  }

  buildDesktopView() {
    let container = new components.BeamContainer({
      width: "100%",
      children: [
        this.headerComponent(
          "What we've unded so far",
          "See the impact we are all making together. Place an order to help us reach goals faster."
        ),
        new components.BeamContainer({
          children: [
            ...this.data.nonprofits
              .filter((nonprofit) => nonprofit.community_goal_completion)
              .map((nonprofit1, index, nonprofits) => {
                if ((index + 1) % 2 !== 0) {
                  let nonprofit2 = nonprofits[index + 1];
                  return new components.BeamFlexWrapper({
                    centerItems: true,
                    margin: "0 0 20px 0",
                    children: [
                      this.tileComponent(nonprofit1),
                      this.tileComponent(nonprofit2),
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

export default GoalImpactWidget;
