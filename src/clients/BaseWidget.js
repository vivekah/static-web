import crypto from "crypto";
import * as components from "../components";
import * as themes from "./themes";

class BaseWidget {
  constructor(options = {}) {
    this.options = {
      containerId: "beam-widget-container",
      themeConfig: {
        id: null,
        textColor: "#737373",
        gradientColors: ["#F7CE68", "#FF944B"],
        progressBarColors: [
          {color: "#85bcd7", offset: "0%"},
          {color: "#fbeb63", offset: "50%"},
          {color: "#ff944b", offset: "100%"},
        ],
        fontFamily: "poppins",
        displayThankYouMessageForSelectingNonProfit: true
      },
      widgetId: null,
      forceMobileView: false,
      loadingScreenContent: "Please wait...",
    };

    // extend default options
    this.options = {
      ...this.options,
      ...options,
      textColor:
        options.textColor ||
        options.themeConfig.textColor ||
        this.options.themeConfig.textColor,
      fontFamily:
        options.fontFamily ||
        options.themeConfig.fontFamily ||
        this.options.themeConfig.textColor,
      themeConfig: {
        ...this.options.themeConfig,
        ...options.themeConfig,
        textColor:
          options.textColor ||
          options.themeConfig.textColor ||
          this.options.themeConfig.textColor,
        fontFamily:
          options.fontFamily ||
          options.themeConfig.fontFamily ||
          this.options.themeConfig.textColor,
      },
    };

    // check widget ID
    // if (!this.options.widgetId) throw ReferenceError("Provide widget ID");

    // initialize widget wrapper
    this.widgetWrapper = document.getElementById(this.options.containerId);
    if (!this.widgetWrapper) throw ReferenceError("Cannot find widget wrapper");

    // setup loading screen
    this.loadingScreen = document.createElement("p");
    this.loadingScreen.innerHTML = this.options.loadingScreenContent;
    this.loadingScreen.id = "beam-loading-screen";
    this.widgetWrapper.appendChild(this.loadingScreen);

    // install default font
    (!this.options.themeConfig.fontFamily ||
      this.options.themeConfig.fontFamily === "poppins") &&
    document.head.appendChild(
      new components.BeamLink({
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800&display=swap",
      }).view
    );

    // themes
    this.skins = {
      [themes.DefaultNonprofitWidgetTheme.id]:
      themes.DefaultNonprofitWidgetTheme,
      [themes.LunchBoxNonprofitWidgetTheme.id]:
      themes.LunchBoxNonprofitWidgetTheme,
      [themes.DefaultImpactOverviewWidgetTheme.id]:
      themes.DefaultImpactOverviewWidgetTheme,
      [themes.LunchBoxImpactOverviewWidgetTheme.id]:
      themes.LunchBoxImpactOverviewWidgetTheme,
      [themes.MinimalUIImpactOverviewWidgetTheme.id]:
      themes.MinimalUIImpactOverviewWidgetTheme,
      [themes.MinimalUINonprofitWidgetTheme.id]:
      themes.MinimalUINonprofitWidgetTheme,
      [themes.ModernUIImpactOverviewWidgetTheme.id]:
      themes.ModernUIImpactOverviewWidgetTheme,
      [themes.ModernUINonprofitWidgetTheme.id]:
      themes.ModernUINonprofitWidgetTheme,
    };

    // widget data
    this.data = null;
    this.cacheKey = null;
    this.baseUrl = process.env.BEAM_BACKEND_BASE_URL;
    this.webBaseUrl = process.env.WEB_BASE_URL;
    this.renderViewRef = null;
    this.maxContainerWidth = 400;
  }

  async getData(args = {}) {
    throw Error("Not implemented");
  }

  async render(args = {}, renderCallback) {
    this.isBusy(true);
    try {
      this.data = this.options.noAjax ? this.data : await this.getData(args);
      if (this.data) {
        if (this.renderViewRef) {
          window.removeEventListener("resize", this.renderViewRefs);
        }
        this.renderViewRef = () => {
          let view = renderCallback();
          view && this.updateDOM(view);
          view && this.recalibrate();
        };
        this.renderViewRef();
        window.addEventListener("resize", this.renderViewRef);
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.isBusy(false);
    }
  }

  updateDOM(component) {
    while (
      this.widgetWrapper.lastChild &&
      this.widgetWrapper.lastChild != this.loadingScreen
      )
      this.widgetWrapper.removeChild(this.widgetWrapper.lastChild);

    this.widgetWrapper.append(component);
  }

  getContainerWidth() {
    let widgetContainer = document.body;
    const {width} = widgetContainer.getBoundingClientRect();
    return width;
  }

  getAsset(fileName) {
    console.log("assets: ", `${this.webBaseUrl}/assets/img/${fileName}`)
    return `${this.webBaseUrl}/assets/img/${fileName}`;
  }

  get isMobile() {
    const containerWidth = this.getContainerWidth();
    return this.options.forceMobileView
      ? true
      : /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent) ? true : containerWidth < this.maxContainerWidth;
  }

  recalibrate() {
    let progressWrappers = document.querySelectorAll(".beam-progress");
    let nonprofitCardContainers = document.querySelectorAll(
      ".beam-nonprofit-card-container"
    );

    if (progressWrappers) {
      progressWrappers.forEach((progressWrapper) => {
        progressWrapper.innerHTML = null;
        progressWrapper.appendChild(
          new components.BeamProgressBar(
            progressWrapper,
            this.options.themeConfig.progressBarColors
          ).view
        );
      });
    }

    if (nonprofitCardContainers) {
      nonprofitCardContainers.forEach((container) => {
        const {width} = container.getBoundingClientRect();
        let descriptionCard = container.children[1];
        descriptionCard.style.left = `${Math.ceil(width)}px`;
      });
    }
  }

  get defaultColor() {
    let numberOfColors = this.options.themeConfig.gradientColors
      ? this.options.themeConfig.gradientColors.length
      : 0;
    return numberOfColors > 0
      ? this.options.themeConfig.gradientColors[numberOfColors - 1]
      : "#FF944B";
  }

  get gradientColors() {
    let numberOfColors = this.options.themeConfig.gradientColors
      ? this.options.themeConfig.gradientColors.length
      : 0;
    return numberOfColors > 0
      ? numberOfColors > 1
        ? this.options.themeConfig.gradientColors.join(", ")
        : `${this.options.themeConfig.gradientColors[0]}, ${this.options.themeConfig.gradientColors[0]}`
      : "#F7CE68, #FBAB7E";
  }

  buildPoweredByComponent() {
    return new components.BeamFlexWrapper({
      margin: "40px 0 0 0",
      children: [
        new components.BeamText({
          text: `Powered by <br /><img src="${this.getAsset(
            "beam64x25.png"
          )}" height="30" alt="beam logo" />`,
          fontFamily: this.options.themeConfig.fontFamily,
          fontSize: "xx-small",
          color: this.options.themeConfig.textColor,
          textAlign: "center",
        }),
      ],
    });
  }

  headerLogoComponent(chainLogo, divider = null, center = false) {
    return new components.BeamFlexWrapper({
      height: this.options.themeConfig.headerText ? "auto" : this.options.themeConfig.headerLogoContainerHeight || "30px",
      centerItems: center,
      alignItems: this.options.themeConfig.inlineHeaderLogo && this.options.themeConfig.headerText ?
        this.options.themeConfig.inlineHeaderLogoAlign || "flext-start"
        : this.options.themeConfig.headerLogoAlign,
      justifyContent: "space-between",
      children:
        this.options.themeConfig.inlineHeaderLogo && this.options.themeConfig.headerText ?
          [
            new components.BeamText({
              text: this.options.themeConfig.headerText,
              width: this.options.themeConfig.headerTextWidth || undefined,
              margin: this.options.themeConfig.headerTextMargin || "0px auto 0px 0px",
              fontFamily: this.options.themeConfig.headerFontFamily || "inherit"
            }),
            // inline header
            new components.BeamContainer({
              id: 'beam-logo-header',
              children: [
                new components.BeamImage({
                  src: chainLogo,
                  width: this.options.themeConfig.headerPartnerLogoWidth || "80px",
                  height: this.options.themeConfig.headerPartnerLogoHeight || "auto",
                  margin: this.options.themeConfig.headerPartnerLogoMargin || "0 0 3px",
                  alt: "Chain",
                }),
                divider
                  ? divider
                  : new components.BeamDivider({
                    vertical: true,
                    height: "30px",
                    margin: "0 5px",
                  }),
                new components.BeamAnchor({
                  href: "https://beamimpact.com/",
                  target: "_blank",
                  text: "",
                  children: [
                    new components.BeamImage({
                      alt: "Beam Logo",
                      src: "https://d1jhb45gnbgj0c.cloudfront.net/beam_images/Beam+Logo_Vector.png", //this.getAsset("beam_logo_vector.png"),
                      width: this.options.themeConfig.headerBeamLogoWidth || "80px",
                      height: this.options.themeConfig.headerBeamLogoHeight || "auto",
                      margin: this.options.themeConfig.headerBeamLogoMargin || undefined,
                    }),
                  ]
                })
              ]
            }),
          ] : this.options.themeConfig.centerHeader ? [
            // centered header
            new components.BeamContainer({
              margin: this.options.themeConfig.headerLogoContainerMargin || "auto",
              children: [
                new components.BeamImage({
                  src: chainLogo,
                  width: this.options.themeConfig.headerPartnerLogoWidth || "80px",
                  height: this.options.themeConfig.headerPartnerLogoHeight || "auto",
                  margin: this.options.themeConfig.headerPartnerLogoMargin || "0 0 3px",
                  alt: "Chain",
                }),
                divider
                  ? divider
                  : new components.BeamDivider({
                    vertical: true,
                    height: "30px",
                    margin: "0 5px",
                  }),
                new components.BeamAnchor({
                  href: "https://beamimpact.com/",
                  target: "_blank",
                  text: "",
                  children: [
                    new components.BeamImage({
                      alt: "Beam Logo",
                      src: "https://d1jhb45gnbgj0c.cloudfront.net/beam_images/Beam+Logo_Vector.png", //this.getAsset("beam_logo_vector.png"),
                      width: this.options.themeConfig.headerBeamLogoWidth || "80px",
                      height: this.options.themeConfig.headerBeamLogoHeight || "auto",
                      margin: this.options.themeConfig.headerBeamLogoMargin || undefined,
                    }),
                  ]
                }),
              ]
            }),
          ] : [
            new components.BeamContainer({
              id: 'beam-logo-header',
              children: [
                new components.BeamImage({
                  src: chainLogo,
                  width: this.options.themeConfig.headerPartnerLogoWidth || "80px",
                  height: this.options.themeConfig.headerPartnerLogoHeight || "auto",
                  margin: this.options.themeConfig.headerPartnerLogoMargin || "0 0 3px",
                  alt: "Chain",
                }),
                divider
                  ? divider
                  : new components.BeamDivider({
                    vertical: true,
                    height: "30px",
                    margin: "0 5px",
                  }),
                new components.BeamAnchor({
                  href: "https://beamimpact.com/",
                  target: "_blank",
                  text: "",
                  children: [
                    new components.BeamImage({
                      src: this.getAsset("beam_logo_vector.png"),
                      width: this.options.themeConfig.headerBeamLogoWidth || "80px",
                      height: this.options.themeConfig.headerBeamLogoHeight || "auto",
                      margin: this.options.themeConfig.headerBeamLogoMargin || undefined,
                    }),
                  ]
                })
              ]
            })
          ],
    });

  }

  isBusy(busy = true) {
    if (!this.loadingScreen) return;

    busy
      ? (this.loadingScreen.style.display = "block")
      : (this.loadingScreen.style.display = "none");
  }

  getCacheKey(str) {
    return crypto.createHash("sha1").update(str).digest("hex");
  }

  async makeAPIRequest(path, params = null) {
    let beam_url = new URL(path, this.baseUrl);
    if (params)
      beam_url.search = new URLSearchParams(params)
        .toString()
        .replace(/null/g, "")
        .replace(/undefined/g, "");

    try {
      let response = await window.fetch(beam_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 200) return await response.json();
    } catch (err) {
      console.error(err);
    }
    return null;
  }
}

export default BaseWidget;
