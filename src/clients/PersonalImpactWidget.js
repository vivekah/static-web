import BaseImpactWidget from "./BaseImpactWidget";
import * as components from "../components";

class PersonalImpactWidget extends BaseImpactWidget {
  constructor(options = {}) {
    super(options);
    this.maxContainerWidth = 400;
  }

  async render(user, nonprofit = null) {
    if (!user) throw new Error("Provide user beam ID");

    await super.render({ nonprofit, user }, () => {
      return this.isMobile ? this.buildMobileView() : this.buildDesktopView();
    });
  }

  link(nonprofit) {
    return new components.BeamAnchor({
      text: `
      <div style="diplay: -ms-flexbox !important;display: flex !important;-ms-flex-direction: row !important;flex-direction: row !important;-ms-flex-align: center;align-items: center;">
        Learn more about ${nonprofit.name}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
        </svg>
      </div>`,
      fontFamily: this.options.fontFamily,
      fontWeight: "bold",
      fontSize: "small",
      margin: "0",
      href: nonprofit.website,
    });
  }

  innerCard(nonprofit) {
    return new components.BeamCard({
      height: "150px",
      cornerRadius: "10px 10px 0 0",
      overflow: "hidden",
      margin: "0",
      children: [
        // card image
        new components.BeamCardImage({ src: nonprofit.image }),
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
                // cause
                new components.BeamText({
                  text: nonprofit.cause,
                  textTransform: "uppercase",
                  color: "#fff",
                  letterSpacing: "3px",
                  fontFamily: this.options.fontFamily,
                  fontSize: "small",
                }),
                // title
                new components.BeamText({
                  tag: "h4",
                  text: nonprofit.name,
                  fontFamily: this.options.fontFamily,
                  fontWeight: "bold",
                  fontSize: "large",
                  color: "#fff",
                  margin: "0",
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  outerCard(nonprofit, showDiv = false) {
    return new components.BeamCard({
      border: "none",
      padding: "10px",
      children: [
        // card img description
        this.innerCard(nonprofit),
        // card body
        new components.BeamCardBody({
          padding: "15px 20px",
          backgroundColor: "#fff",
          children: [
            // progress wrapper
            new components.BeamProgressWrapper({
              percentage: nonprofit.impact.percentage,
              height: "7px",
            }),
            // impact info
            new components.BeamText({
              text: `<b>${nonprofit.impact.percentage}% of the way to funding</b> 
              ${nonprofit.impact_description}`,
              fontFamily: this.options.fontFamily,
              fontSize: "small",
              color: this.options.textColor,
              margin: "10px 0 0 0",
            }),
          ],
        }),
        new components.BeamContainer({
          margin: "20px 0 0",
          textAlign: "center",
          children: [this.link(nonprofit)],
        }),
        showDiv &&
          new components.BeamContainer({
            margin: "0 25px",
            children: [
              new components.BeamDivider({
                vertical: false,
                borderColor: "rgba(0, 0, 0, 0.1)",
                margin: "20px 0 0",
                borderWidth: "1px",
              }),
            ],
          }),
      ],
    });
  }

  cardList() {
    return new components.BeamContainer({
      children: this.data.nonprofits.map((nonprofit, index) =>
        this.outerCard(nonprofit, index + 1 < this.data.nonprofits.length)
      ),
    });
  }

  buildMobileView() {
    let container = new components.BeamContainer({
      maxWidth: "100%",
      children: [
        this.headerLogoComponent(
          this.data.chain.rect_logo
            ? this.data.chain.rect_logo
            : this.data.chain.logo
        ),
        this.cardList(),
      ],
    });

    return container.view;
  }

  buildDesktopView() {
    let container = new components.BeamContainer({
      width: "400px",
      children: [
        this.headerLogoComponent(
          this.data.chain.rect_logo
            ? this.data.chain.rect_logo
            : this.data.chain.logo
        ),
        this.cardList(),
      ],
    });

    return container.view;
  }
}

export default PersonalImpactWidget;
