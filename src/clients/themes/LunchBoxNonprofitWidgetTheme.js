import * as components from "../../components";
import BaseTheme from "./BaseTheme";

class LunchBoxNonprofitWidgetTheme extends BaseTheme {
  constructor(options = {}) {
    super(options);
  }

  static get id() {
    return "lunchbox-nonprofit";
  }

  headerText(text) {
    return new components.BeamText({
      padding: "10px",
      text: text,
      color: this.options.textColor,
      fontFamily: this.options.fontFamily,
      fontSize: "0.7rem",
      fontWeight: "normal",
      textAlign: "center",
    });
  }

  headerBackButton() {
    return new components.BeamContainer({
      pos: {
        position: "relative",
        top: "0",
        left: "0",
      },
      children: [
        new components.BeamText({
          text: this.options.showBackButton
            ? this.options.backButton ||
              `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="24px" height="24px">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
          </svg>
          `
            : "",
          color: "orange",
          fontWeight: "bold",
          clickListener: this.options.backButtonCallback || null,
        }),
      ],
    });
  }

  headerLine() {
    return new components.BeamDivider({
      borderWidth: "0.1rem",
      borderColor: this.options.headerLineColor || "white",
    });
  }

  headerComponent({ headerLogo, text }) {
    return new components.BeamContainer({
      id: "beam-nonprofit-header",
      backgroundColor: "#fff",
      width: "100%",
      padding: "10px 0 0 0",
      children: [
        this.headerBackButton(),
        headerLogo,
        this.headerText(text),
        this.headerLine(),
      ],
    });
  }

  card(nonprofit, margin = "0 0 1px 0") {
    return new components.BeamCard({
      width: "100%",
      height: "150px",
      cornerRadius: "0",
      overflow: "hidden",
      margin: margin,
      border: "none",
      cursor: "pointer",
      clickListener: nonprofit.onClick,
      children: [
        // card image
        new components.BeamCardImage({ src: nonprofit.image }),
        // overlay
        new components.BeamCardOverlay({
          children: [
            // cause
            new components.BeamText({
              text: nonprofit.cause,
              textTransform: "uppercase",
              color: "#fff",
              letterSpacing: "2px",
              fontFamily: this.options.fontFamily,
              fontSize: "x-small",
            }),
            // content wrapper
            new components.BeamContainer({
              padding: "1.25rem",
              pos: {
                position: "absolute",
                right: "0",
                bottom: "0",
                left: "0",
              },
              children: [
                // text wrapper
                new components.BeamContainer({
                  width: "70%",
                  children: [
                    // title
                    new components.BeamText({
                      tag: "h4",
                      text: nonprofit.name,
                      fontFamily: this.options.fontFamily,
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      color: "#fff",
                      margin: "10px 0 0 0",
                    }),
                  ],
                }),
                // progress
                new components.BeamProgressWrapper({
                  width: "75%",
                  percentage: nonprofit.impact.percentage,
                  height: "6px",
                  backgroundColor: "rgba(255, 255, 255, 0.14)",
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
      maxWidth: "400px",
      border: "none",
      cornerRadius: "0",
      padding: "5px",
      backgroundImage:
        lastNonprofit?.id === nonprofit.id &&
        `linear-gradient(to right, ${this.gradientColors})`,
      margin: "3px",
      children: [this.card(nonprofit, "0")],
    });
  }

  mobileListComponent(nonprofits, navarrow = null) {
    return new components.BeamContainer({
      id: "beam-nonprofit-list",
      margin: "0",
      children: nonprofits.map((nonprofit) => {
        return new components.BeamContainer({
          className: "beam-nonprofit-card-container",
          overflow: "hidden",
          margin: "0 0 1px",
          padding: "0",
          children: [
            this.card(nonprofit, "0"),
            new components.BeamCard({
              width: "100%",
              height: "150px",
              cornerRadius: "0",
              overflow: "hidden",
              margin: "-150px 0 1px",
              border: "none",
              cursor: "pointer",
              transition: "left 0.3s linear",
              backgroundColor: this.options.descriptionBackgroundColor,
              children: [
                new components.BeamFlexWrapper({
                  height: "150px",
                  centerItems: true,
                  children: [
                    new components.BeamText({
                      text: nonprofit.description,
                      color: this.options.descriptionTextColor,
                      fontSize: "small",
                      fontFamily: this.options.fontFamily,
                      textAlign: "center",
                      padding: "0 2rem",
                    }),
                  ],
                }),
              ],
            }),
            new components.BeamContainer({
              margin: "-150px 0 1px",
              height: "150px",
              padding: "63px 20px 0",
              pos: {
                position: "absolute",
                right: "0",
              },
              clickListener: (e) => {
                let nav = e.target;

                let container;
                let nonprofitCard;
                let descriptionCard;

                let navDiv = nav.nodeName === "IMG" ? nav.parentNode : nav;
                let navImg = nav.nodeName === "IMG" ? nav : nav.children[0];

                container =
                  nav.nodeName === "IMG"
                    ? nav.parentNode.parentNode
                    : nav.parentNode;

                nonprofitCard = container.children[0];
                descriptionCard = container.children[1];

                const { width } = container.getBoundingClientRect();

                if (descriptionCard.style.left !== "0px") {
                  descriptionCard.style.left = `${Math.ceil(width)}px`;
                  descriptionCard.style.left = "0px";
                  navImg.style.transform = "rotate(180deg)";
                } else {
                  descriptionCard.style.left = `${Math.ceil(width)}px`;
                  navImg.style.transform = "rotate(0deg)";
                }
              },
              children: [
                new components.BeamImage({
                  src: navarrow,
                  transition: "transform 0.3s linear",
                }),
              ],
            }),
          ],
        });
      }),
    });
  }

  mobileSelectedComponent(lastNonprofit, text, onChange) {
    return new components.BeamCard({
      flexDirection: "row",
      cornerRadius: "5px",
      border: "1px solid rgba(0,0,0,0.1)",
      pos: {
        zIndex: "1000",
      },
      children: [
        new components.BeamContainer({
          height: "auto",
          pos: {
            position: "relative",
            flexBasis: "30%",
          },
          children: [
            new components.BeamContainer({
              backgroundSize: "cover",
              backgroundPosition: "left",
              backgroundImage: `url(${lastNonprofit.image})`,
              cornerRadius: "5px 0 0 5px",
              pos: {
                position: "absolute",
                top: "0",
                right: "0",
                bottom: "0",
                left: "0",
              },
            }),
          ],
        }),
        new components.BeamContainer({
          cornerRadius: "0 5px 5px 0",
          padding: "1rem",
          backgroundColor: "#fff",
          pos: {
            position: "relative",
            flexBasis: "70%",
          },
          children: [
            new components.BeamText({
              margin: "0 0 5px 0",
              textAlign: "left",
              fontSize: "x-small",
              fontFamily: this.options.fontFamily,
              color: this.options.goalTextColor,
              text: text,
            }),
            new components.BeamDivider({
              vertical: false,
              borderWidth: "1px",
              borderColor: "rgba(0,0,0,0.1)",
            }),
            new components.BeamText({
              textAlign: "center",
              text: "change",
              textTransform: "uppercase",
              fontSize: "small",
              fontFamily: this.options.fontFamily,
              color: this.options.changeButtonColor || "orange",
              cursor: "pointer",
              clickListener: onChange,
              margin: "5px 0 0",
            }),
          ],
        }),
      ],
    });
  }

  // desktopListComponent(nonprofits, lastNonprofit) {
  //   return new components.BeamContainer({
  //     id: "beam-nonprofit-list",
  //     margin: "5px 0 0 0",
  //     children: nonprofits.map((nonprofit, index) => {
  //       if ((index + 1) % 2 !== 0) {
  //         let nonprofit2 = nonprofits[index + 1];
  //         return new components.BeamFlexWrapper({
  //           centerItems: true,
  //           children: [
  //             // column 1
  //             this.column(nonprofit, lastNonprofit),
  //             // column 2
  //             nonprofit2 && this.column(nonprofit2, lastNonprofit),
  //           ],
  //         });
  //       }
  //     }),
  //   });
  // }
}

export default LunchBoxNonprofitWidgetTheme;
