import * as components from "../../components";
import BaseTheme from "./BaseTheme";

class LunchBoxImpactOverviewWidgetTheme extends BaseTheme {
  constructor(options = {}) {
    super(options);
  }

  static get id() {
    return "lunchbox-impact-overview";
  }

  personalCard(data, seeMoreButtonCallback) {
    return new components.BeamCard({
      border: "none",
      children: [
        // card img description
        new components.BeamCard({
          height: "120px",
          cornerRadius: "0",
          overflow: "hidden",
          margin: "0",
          children: [
            // card image
            new components.BeamCardImage({ src: data.personal.image }),
            // overlay
            new components.BeamCardOverlay({
              children: [
                // text
                new components.BeamContainer({
                  padding: "1.25rem 2.25rem",
                  pos: {
                    position: "absolute",
                    right: "0",
                    bottom: "0",
                    left: "0",
                  },
                  children: [
                    // progress wrapper
                    new components.BeamContainer({
                      pos: {
                        position: "absolute",
                        right: "0",
                        bottom: "0",
                        left: "0",
                        zIndex: "1000",
                      },
                      padding: "0 28px",
                      margin: "0",
                      children: [
                        new components.BeamProgressWrapper({
                          percentage: data.personal.impact.percentage,
                          height: "6px",
                          backgroundColor: "rgba(255,255,255,0.5)",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        // card body
        new components.BeamCardBody({
          padding: "15px 28px 28px 28px",
          backgroundColor: "#f5f5f5",
          textAlign: "center",
          children: [
            // nonprofit name
            new components.BeamText({
              text: data.personal.name,
              fontFamily: this.options.fontFamily,
              textTransform: "uppercase",
              textAlign: "center",
              margin: "10px 0 0",
              color: this.options.textColor || "blue",
            }),
            // impact info
            new components.BeamText({
              text: `<b>${data.personal.impact.percentage}% of the way to funding</b> ${data.personal.impact_description}`,
              fontFamily: this.options.fontFamily,
              fontSize: "small",
              color: "#a1a3a6",
              margin: "10px 0 0 0",
              textAlign: "center",
            }),
            new components.BeamButton({
              text: "See more impact",
              cornerRadius: this.options.seeMoreButtonBorderRadius || "5px",
              backgroundColor: this.options.seeMoreButtonColor || "orange",
              color: this.options.seeMoreButtonTextColor || "blue",
              margin: "20px 0 0",
              padding: "5px 30px",
              fontFamily: this.options.fontFamily,
              fontWeight: "bold",
              textTransform: "uppercase",
              clickListener: seeMoreButtonCallback,
            }),
          ],
        }),
      ],
    });
  }

  mobileComponent(data, seeMoreButtonCallback) {
    return new components.BeamContainer({
      children: [
        //personal
        new components.BeamContainer({
          margin: "0",
          maxWidth: "100%",
          children: [
            data.personal && this.personalCard(data, seeMoreButtonCallback),
          ],
        }),
      ],
    });
  }
}

export default LunchBoxImpactOverviewWidgetTheme;
