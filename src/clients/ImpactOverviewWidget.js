import BaseWidget from "./BaseWidget";
import * as components from "../components";
import DefaultImpactOverviewWidgetTheme from "./themes/DefaultImpactOverviewWidgetTheme";
import LunchBoxImpactOverviewWidgetTheme from "./themes/LunchBoxImpactOverviewWidgetTheme";

class ImpactOverviewWidget extends BaseWidget {
  constructor(options = { communityImpactUrl: "#" }) {
    super(options);

    this.input = {
      user: null,
      nonprofit: null,
    };

    let themeSkin = this.skins[this.options.themeConfig.id];
    if (!themeSkin) {
      this.options.themeConfig.id = DefaultImpactOverviewWidgetTheme.id;
      themeSkin = this.skins[this.options.themeConfig.id];
    }

    this.theme = new themeSkin(this.options.themeConfig);
    this.maxContainerWidth = this.options.maxContainerWidth || 570;
  }

  getCacheKey(input) {
    let str = `${input.nonprofit || ""}${input.user || ""}`;
    return super.getCacheKey(str);
  }

  async getData(args) {
    let cacheKey = this.getCacheKey(args);

    let data = this.data;


    if (this.options.lan){
      this.options.themeConfig.lan = this.options.lan
    }

    if (cacheKey !== this.cacheKey) {
      this.cacheKey = cacheKey;
      this.input.user = args.user;
      this.input.nonprofit = args.nonprofit;
      
      data = await this.makeAPIRequest("/api/v1/impact/all/", {
        nonprofit: args.nonprofit,
        user: args.user,
        lan: this.options.lan
      });
    }
    return data;
  }

  async render(user, nonprofit = null) {
    if (!user) throw ReferenceError("Provide user beam ID");

    await super.render({ nonprofit, user }, () => {
      return this.isMobile && !this.options.themeConfig.noWrap
        ? this.buildMobileView()
        : this.buildDesktopView();
    });
  }

  buildMobileView() {
    let container = this.theme.mobileComponent(
      this.data,
      this.options.themeConfig.id === LunchBoxImpactOverviewWidgetTheme.id
        ? this.options.seeMoreButtonCallback
        : this.options.communityImpactUrl
    );

    const isLunchboxTheme =
      this.options.themeConfig.id === LunchBoxImpactOverviewWidgetTheme.id;

    container.view.prepend(
      new components.BeamContainer({
        margin: "0 0 10px",
        children: [
          this.headerLogoComponent(
            isLunchboxTheme && this.data.chain.rect_logo
              ? this.data.chain.rect_logo
              : this.data.chain.logo
          ),
        ],
      }).view
    );

    return container.view;
  }

  buildDesktopView() {
    if (!this.theme.desktopComponent)
      throw ReferenceError("Desktop version not implemented.");

    const isLunchboxTheme =
      this.options.themeConfig.id === LunchBoxImpactOverviewWidgetTheme.id;

    let container = this.theme.desktopComponent(
      this.data,
      this.options.communityImpactUrl
    );
    container.view.prepend(
      this.headerLogoComponent(
        isLunchboxTheme && this.data.chain.rect_logo
          ? this.data.chain.rect_logo
          : this.data.chain.logo
      ).view
    );
    return container.view;
  }
}

export default ImpactOverviewWidget;
