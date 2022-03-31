import BaseWidget from "./BaseWidget";
import * as components from "../components";
import {
  DefaultNonprofitWidgetTheme,
  LunchBoxNonprofitWidgetTheme,
  MinimalUINonprofitWidgetTheme,
  ModernUINonprofitWidgetTheme
} from "./themes";

const CENT_RATE = 100.0;
const THEMES_WITH_LISTS_IN_MOBILE_VIEW = [MinimalUINonprofitWidgetTheme.id, ModernUINonprofitWidgetTheme.id];

class NonprofitWidget extends BaseWidget {
  constructor(
    options = {
      isPreCheckout: false,
      hidePoweredBy: true,
      selectedNonprofitCallback: (nonprofit, store) => {
        console.log("selected nonprofit:", nonprofit);
        console.log("store info:", store);
      },
      userDidMatchCallback: (matched, amount) =>
        console.log(`matched: ${matched}, amount: ${amount.toFixed(2)}`),
      nonprofitChangedCallback: () => {
        console.log("nonprofit changed");
      },
    }
  ) {
    super(options);
    this.input = {
      store: null,
      user: null,
      postalCode: null,
      countryCode: null,
      showCommunityImpact: null,
    };
    this.lastNonprofit = null;
    this.userDidMatch = this.options.userDidMatch || false;
    this.cartTotal = 0.0;
    this.invokeUserDidMatchCallback = false;

    let themeSkin = this.skins[this.options.themeConfig.id];
    if (!themeSkin) {
      this.options.themeConfig.id = DefaultNonprofitWidgetTheme.id;
      themeSkin = this.skins[this.options.themeConfig.id];
    }

    this.theme = new themeSkin(this.options.themeConfig);
    this.maxContainerWidth = this.options.themeConfig.maxContainerWidth || 600;
  }

  getCacheKey(input) {
    let str = `${input.store || ""}${input.user || ""}${
      input.postal_code || ""
    }${input.country_code || ""}`;
    return super.getCacheKey(str);
  }

  getCartTotal(inputTotal) {
    let cartTotal =
      inputTotal && !isNaN(inputTotal)
        ? parseFloat(inputTotal)
        : this.cartTotal;

    if (cartTotal !== this.cartTotal && this.userDidMatch && this.lastNonprofit)
      this.invokeUserDidMatchCallback = true;

    return cartTotal;
  }

  async getData(args = {}) {

    if (this.options.lan) {
      this.options.themeConfig.lan = this.options.lan
    }

    // prep data inputs
    let queryParams = {
      chain: args.chain || null,
      store: args.store || null,
      user: args.user || null,
      postal_code: args.postalCode || null,
      country_code: args.countryCode || null,
      show_community_impact: args.showCommunityImpact || null,
      lan: this.options.lan || null,
    };

    // set cart total
    this.cartTotal = this.getCartTotal(args.cartTotal);

    // check if inputs are already cached
    let cacheKey = this.getCacheKey(queryParams);

    // set cache as data
    let data = this.data;

    if (cacheKey !== this.cacheKey) {
      // set new entries
      this.cacheKey = cacheKey;
      this.input.chain = queryParams.chain;
      this.input.store = queryParams.store;
      this.input.user = queryParams.user;
      this.input.postalCode = queryParams.postal_code;
      this.input.countryCode = queryParams.country_code;
      this.input.showCommunityImpact = queryParams.show_community_impact;

      // get data from backend
      data = await this.makeAPIRequest("/api/v2/chains/nonprofits", queryParams);

      // get last nonprofit
      if (data && data.last_nonprofit)
        this.lastNonprofit = data.nonprofits.find(
          (x) => x.id === data.last_nonprofit
        );
    }
    return data;
  }

  get transactionData() {
    let tranData = this.data
      ? {
        store: this.input.store,
        cart_total: this.cartTotal,
      }
      : null;

    if (tranData) {
      if (this.lastNonprofit) tranData["nonprofit"] = this.lastNonprofit.id;
      if (this.data.user) tranData["user"] = this.data.user;
      if (this.data.user_can_match && this.userDidMatch) {
        tranData["user_did_match"] = true;
        tranData["user_match_amount"] = this.donationAmount;
      }
    }
    return tranData;
  }

  get isNewUser() {
    return this.data.last_nonprofit === null;
  }

  get isPercentBasedChain() {
    return this.data.store.donation_percentage ? true : false;
  }

  get percentageLabel() {
    return `${parseInt(
      parseFloat(this.data.store.donation_percentage) * 100
    )}&percnt;`;
  }

  get donationAmount() {
    if (this.isPercentBasedChain) {
      return (this.options.matchDonationAmount
          ? this.options.matchDonationAmount
          : (parseFloat(this.data.store.donation_percentage) * parseFloat(this.cartTotal)).toFixed(2)
      );
    }
    return parseFloat(this.data.store.donation_amount).toFixed(2);
  }

  get donationAmountLabel() {
    let amount = this.options.matchDonationAmount ? this.options.matchDonationAmount : this.donationAmount;
    return amount < 1.0
      ? `${Math.floor(amount * CENT_RATE)}&cent;`
      : `$${amount.toFixed(2)}`
    // : `$${Math.floor(amount)}`;
  }

  get headerText() {
    return this.options.themeConfig.id === LunchBoxNonprofitWidgetTheme.id
      //   ? this.data.store.chain_donation_type.description_web.replace(
      //       "<b>name</b>",
      //       `<b>${this.data.store.chain_donation_type.name}</b>`
      //     )
      //   : `Select a nonprofit and ${this.data.store.chain_name} will donate ${this.data.store.chain_donation_type.name}
      // of your purchase there for you.`;
      ? `<b>Thanks for your order</b><br /><br />
      We will donate  <b>${this.data.store.chain_donation_type.name}</b> to a nonprofit every time you order with us!<br />
      Don't worry you can change this with any order.<br /><br />
      Just tap below to select your nonprofit, or tap on the arrow to learn more.`
      : `${this.options.themeConfig.headerText ?
        this.options.themeConfig.headerText
        : `Select a nonprofit and ${this.data.store.chain_name} will donate ${this.data.store.chain_donation_type.name}
    of your purchase there for you.`}`;
  }

  get unlockMatchText() {
    return this.data.store.match_donation_type &&
    this.data.store.match_donation_type.title &&
    this.data.store.match_donation_type.title != "" &&
    this.data.store.match_donation_type.description &&
    this.data.store.match_donation_type.description != ""
      ? `<b>${this.data.store.match_donation_type.title}</b><br />` +
      this.data.store.match_donation_type.description
        .replace(/<%Chain%>/g, this.data.store.chain_name)
        .replace(/<%Nonprofit%>/g, this.lastNonprofit.name)
      : this.options.themeConfig.unlockMatchText || `<b>Unlocked: Make a bigger impact</b> <br />
      I'd like to match ${this.data.store.chain_name}'s donation to 
      ${this.lastNonprofit.name} to get closer to funding my goal.`;
  }

  async render(args = {}) {
    await super.render(args, () => {

      // invoke callback if use did match
      if (
        this.data.user_can_match &&
        this.lastNonprofit &&
        this.invokeUserDidMatchCallback &&
        this.options.userDidMatchCallback
      ) {
        this.invokeUserDidMatchCallback = false;

        this.options.userDidMatchCallback(
          this.userDidMatch,
          this.userDidMatch ? this.donationAmount : 0.0
        );
      }

      // render last selected nonprofit if a nonprofit id assigned to brand is passed in render arguments
      if (args.lastNonprofitId) {
        this.lastNonprofit = this.data.nonprofits.filter(x => x.id == args.lastNonprofitId)[0] || null
      }

      // show last selected nonprofit if pre checkout is true
      if (this.options.isPreCheckout) {
        return this.lastNonprofit ? this.buildMobileSelectedView() : null;
      }

      // set community impact show value in themeConfig
      this.options.themeConfig.showCommunityImpact = args.showCommunityImpact
        ? true
        : false;

      if (this.isMobile) {
        return this.lastNonprofit
          ? THEMES_WITH_LISTS_IN_MOBILE_VIEW.includes(this.options.themeConfig.id)
            ? this.buildMobileListView()
            : this.buildMobileSelectedView()
          : this.buildMobileListView();
      } else {
        return this.buildDesktopListView();
      }
    });
  }

  buildMobileSelectedView() {
    let donationText = `<b>${this.data.store.chain_donation_type.name}</b> is going to 
    ${this.lastNonprofit.name}, funding ${this.lastNonprofit.impact_description}`;
    let onChange = async () => {
      this.options.isPreCheckout = false;
      this.lastNonprofit = null;
      this.options.nonprofitChangedCallback &&
      this.options.nonprofitChangedCallback();
      await this.render({...this.input});
    };

    let onMatch = (e) => {
      let userDidMatch = e.target.checked;

      if (userDidMatch !== this.userDidMatch)
        this.invokeUserDidMatchCallback = true;

      this.userDidMatch = userDidMatch;
      this.render({...this.input});
    };

    let container = new components.BeamContainer({
      children: [
        this.theme.mobileSelectedComponent(
          this.lastNonprofit,
          donationText,
          onChange
        ),
        this.options.themeConfig.id === DefaultNonprofitWidgetTheme.id &&
        this.lastNonprofit != null &&
        this.data.user_can_match &&
        this.theme.matchDonationComponent({
          text: this.unlockMatchText,
          userDidMatch: this.userDidMatch,
          donationAmount: this.donationAmountLabel,
          onMatch: onMatch,
          checkMark: this.options.themeConfig.useBlueMatchCheckmark ? this.getAsset("checkmark_blue.png") : this.getAsset("checkmark.png"),
        }),
      ],
    });

    return container.view;
  }

  getNonprofits() {
    return this.data.nonprofits.map((nonprofit) => {
      return {
        ...nonprofit,
        onClick: async () => {
          this.lastNonprofit = nonprofit;
          if (this.options.selectedNonprofitCallback) {
            this.options.selectedNonprofitCallback(nonprofit, this.data.store);
            if (!this.options.renderAfterSelection) return;
          }
          await this.render({...this.input});
        },
      };
    });
  }

  buildMobileListView() {
    let nonprofits = this.getNonprofits();

    const isLunchboxTheme =
      this.options.themeConfig.id === LunchBoxNonprofitWidgetTheme.id;

    if (THEMES_WITH_LISTS_IN_MOBILE_VIEW.includes(this.options.themeConfig.id)) {
      const component = this.theme.mobileComponent(nonprofits, this.lastNonprofit).view;
      if (this.options.themeConfig.showLogo)
        component.prepend(this.headerLogoComponent(this.data.store?.logo).view)
      return component
    }

    let container = new components.BeamContainer({
      width: "100%",
      children: [
        this.theme.headerComponent({
          headerLogo: this.headerLogoComponent(
            isLunchboxTheme && this.data.store.rect_logo
              ? this.data.store.rect_logo
              : this.data.store?.logo,
            null,
            isLunchboxTheme
          ),
          text: this.headerText,
        }),
        this.theme.mobileListComponent(
          nonprofits,
          this.getAsset("navarrowwhite.png")
        ),
      ],
    });
    return container.view;
  }

  buildDesktopListView() {
    if (!this.theme.desktopListComponent)
      throw ReferenceError("Desktop version not implemented.");

    let nonprofits = this.getNonprofits();

    if (this.options.themeConfig.id === MinimalUINonprofitWidgetTheme.id) {
      const component = this.theme.mobileComponent(nonprofits, this.lastNonprofit).view;
      if (this.options.themeConfig.showLogo)
        component.prepend(this.headerLogoComponent(this.data.store?.logo).view)
      return component
    }


    let onMatch = (e) => {
      let userDidMatch = e.target.checked;

      if (userDidMatch !== this.userDidMatch)
        this.invokeUserDidMatchCallback = true;

      this.userDidMatch = userDidMatch;
      this.render({...this.input});
    };

    let container = new components.BeamContainer({
      children: [
        this.theme.headerComponent({
          headerLogo: this.headerLogoComponent(this.data.store?.logo),
          text: this.headerText,
        }),
        // nonprofits
        this.theme.desktopListComponent(nonprofits, this.lastNonprofit),


        // match card
        this.options.themeConfig.id === DefaultNonprofitWidgetTheme.id &&
        this.lastNonprofit != null &&
        this.data.user_can_match &&
        this.options.themeConfig.renderMatchFirst &&
        this.theme.matchDonationComponent({
          text: this.unlockMatchText,
          userDidMatch: this.userDidMatch,
          donationAmount: this.donationAmountLabel,
          onMatch: onMatch,
          checkMark: this.options.themeConfig.useBlueMatchCheckmark ? this.getAsset("checkmark_blue.png") : this.getAsset("checkmark.png"),
          maxWidth: this.options.themeConfig.matchCardContainerWidth || "810px",
        }),

        // user nonprofit selection text
        this.lastNonprofit && this.options.themeConfig.displayThankYouMessageForSelectingNonProfit &&
        new components.BeamText({
          maxWidth: this.options.themeConfig.selectedTextContainerWidth || "810px",
          text: this.options.themeConfig.nonprofitSelectionTextTemplate
            ? this.options.themeConfig.nonprofitSelectionTextTemplate.replace(/<cause>/g, this.lastNonprofit.cause).replace(/<nonprofit>/g, this.lastNonprofit.name)
            : `<b>Thanks for supporting ${this.lastNonprofit.cause} with ${this.lastNonprofit.name}!
            </b> <br />${this.data.store.chain_donation_type.name} of this purchase, 
            and all future purchases, will be donated there for you. Don’t worry, 
            there’s no extra cost to you and you can change your nonprofit with any order.`,
          fontFamily: this.options.fontFamily,
          fontSize: this.options.themeConfig.nonprofitSelectionTextTemplateFontSize || "small",
          fontWeight: "normal",
          color: this.options.textColor,
          textAlign: "left",
          padding: "10px",
        }),

        // match card
        this.options.themeConfig.id === DefaultNonprofitWidgetTheme.id &&
        this.lastNonprofit != null &&
        this.data.user_can_match &&
        !this.options.themeConfig.renderMatchFirst &&
        this.theme.matchDonationComponent({
          text: this.unlockMatchText,
          userDidMatch: this.userDidMatch,
          donationAmount: this.donationAmountLabel,
          onMatch: onMatch,
          checkMark: this.options.themeConfig.useBlueMatchCheckmark ? this.getAsset("checkmark_blue.png") : this.getAsset("checkmark.png"),
          maxWidth: this.options.themeConfig.matchCardContainerWidth || "810px",
        }),
      ],
    });
    return container.view;
  }
}

export default NonprofitWidget;
