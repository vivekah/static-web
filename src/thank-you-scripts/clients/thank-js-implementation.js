import * as App from 'widgets';

const WebSdkConfig = {
  apiUrls: {
    main: 'https://ppc.sdk.beamimpact.com',
    transaction: {
      create: 'api/v1/shopify/transaction/post/',
      update: 'api/v1/shopify/transaction/update/'
    }
  }
}
const checkout = {
  order_id: "3819122720902",
  line_items_subtotal_price: "$121.7",
  customer: {
    id: "5182663262342",
    first_name: "Alexandra",
    last_name: "Salvatore",
    email: "alex+30@beamimpact.com",
    phone: "",
    default_address: {
      zip: "10013",
      country_code: "US"
    }
  }
}
const shopBeamConfig = {
  widgetId: "afd026de7827482db4adc69080e4a587",
  storeId: "51",
  shopName: "Superette",
  shopDomain: "superette-shop.myshopify.com",
  beamUser: "Kew7WPBTlND12C1H3UF27KQIt".trim()
}

const successMsgConsoleLogCss = 'background: green; color: white; display: block;';
const errorMsgConsoleLogCss = 'background: red; color: white; display: block;';
const infoMsgConsoleLogCss = 'background: blue; color: white; display: block;';
console.log("Loaded widgets in thank you script: ", beamApps);
console.log("window.beamApps: ", window.beamApps);

let isBeamWidgetLoaded = false;
const thankYouContainer = document.querySelector("[data-step='thank_you']");

console.log("%c Loaded Thank you container", infoMsgConsoleLogCss)

let observer = createObserver("section__content");
observer.observe(thankYouContainer, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false,
});

//Todo: rename method and extract logic for prepanding
function createObserver(classOfNodeBeamWidget) {
  return new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (!mutation.addedNodes) return;

      mutation.addedNodes.forEach((node) => {
        if (isBeamWidgetLoaded) {
          observer.disconnect();
          return;
        }
        if (node.className === classOfNodeBeamWidget) {
          const beamContentBox = createBeamContentBox();
          node.prepend(beamContentBox);
          executeBeamWidget(shopBeamConfig, checkout);
          isBeamWidgetLoaded = true;
          console.log("%c Loaded Beam Content Box", successMsgConsoleLogCss)
        }
      });
    })
  });
}

function createBeamContentBox() {
  const beamContentBox = document.createElement("div");
  beamContentBox.className = "content-box";
  beamContentBox.innerHTML = `
                                    <div class="content-box__row">
                                        <span id="beam-widget-header" style="display: none;">
                                        </span>
                                        <div id="beam-widget-wrapper"></div>
                                        <div style="text-align: right;margin-top: 10px;">
                                            <a href="#" id="beam-post-transaction-button" class="button" style="display: none; min-width: 155px;">Checkout</a>
                                        </div>
                                        <div id="beam-loading-content" style="display: none;"></div>
                                    </div>
                                `
  return beamContentBox;
}

function stripHtml(str) {
  const isHtml = /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i.test(str);
  if (isHtml) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = str;
    const child = wrapper.firstElementChild;
    if (child) {
      return child.innerHTML;
    }
  }
  return str;
}

function createTransaction(containerId, contentType, shopBeamConfig, checkout) {
  const transactionKey = `beam_transaction_key_${shopBeamConfig.widgetId}`;
  const transactionId = window.localStorage.getItem(transactionKey);
  const cartTotal = parseFloat(stripHtml(checkout.line_items_subtotal_price).replace("$", "")); //$121.7

  console.debug("cartTotal(raw):", checkout.line_items_subtotal_price);
  console.debug("cartTotal(refined):", cartTotal);

  fetch(`${WebSdkConfig.apiUrls.main}/${WebSdkConfig.apiUrls.transaction.create}`, {
    method: "POST",
    headers: {
      "Content-Type": contentType,
      "x-widget-id": shopBeamConfig.widgetId,
      "x-shopify-shop-domain": shopBeamConfig.shopDomain,
    },
    body: JSON.stringify({
      order_id: checkout.order_id,
      cart_total: cartTotal,
      transaction_id: transactionId || null,
      customer_beam_user: shopBeamConfig.beamUser,
      customer_id: checkout.customer.id,
      customer_first_name: checkout.customer.first_name,
      customer_last_name: checkout.customer.last_name,
      customer_email: checkout.customer.email,
      customer_phone: checkout.customer.phone,
      customer_zip_code: checkout.customer.default_address.zip,
      customer_country_code: checkout.customer.default_address.countryCode,
      default_to_last_nonprofit: false,
      transaction_data: {
        store: shopBeamConfig.storeId,
        cart_total: cartTotal,
        default_to_last_nonprofit: false,
      }
    }),
  })
    .then(async (response) => {
      if (response.ok) {
        window.localStorage.removeItem(`beam_transaction_key_${widgetId}`);
        const responseData = await response.json();
        console.debug(responseData);
        console.debug(responseData.nonprofit);

        const {transaction_id} = responseData;
        const loadingContent = document.querySelector("#beam-loading-content");
        const postTransactionButton = document.querySelector("#beam-post-transaction-button");
        let currentNonprofit;
        let currentStore;

        //Todo: decouple show loading  vs content
        function showLoadingContent(enable = true) {
          const display = enable ? "none" : "";
          widgetWrapper.style.display = display;
          postTransactionButton.style.display = enable ? "" : "none";
          loadingContent.style.display = enable ? "" : "none";
        }

        loadingContent.innerHTML = ` ${
          currentNonprofit && currentStore && `
                              You just made an impact for ${currentNonprofit && currentNonprofit.name} with your Rainbo purchase!
                            `
        }`

        if (responseData.nonprofit) {
          showLoadingContent(false)
          await buildImpactOverviewWidget().render(responseData.user || shopBeamConfig.beamUser);
        } else {
          let currentNonprofit;
          let currentStore;

          function updateTransaction(e) {
            e.preventDefault()
            window.fetch(`${WebSdkConfig.apiUrls.main}/${WebSdkConfig.apiUrls.transaction.update}`, {
              method: "POST",
              headers: {
                "Content-Type": contentType,
                "x-widget-id": shopBeamConfig.widgetId,
                "x-shopify-shop-domain": shopBeamConfig.shopDomain
              },
              body: JSON.stringify({
                transaction_id: transaction_id,
                nonprofit: currentNonprofit.id
              })
            }).then(async (response) => {
              if (response.ok) {
                const data = await response.json();
                widgetWrapper.innerHTML = "";
                showLoadingContent(false);
                console.debug(data);
                await buildImpactOverviewWidget().render(responseData.user || shopBeamConfig.beamUser);
              } else {
                showLoadingContent(false);
              }
            }).catch((error) => {
              console.error(error);
              showLoadingContent(false);
            });
          }

          const nonprofitWidget = new beamApps.NonprofitWidget({
            widgetId: shopBeamConfig.widgetId,
            containerId: containerId,
            renderAfterSelection: true,
            selectedNonprofitCallback: (nonprofit, store) => {
              console.debug(nonprofit);
              console.debug(store);
              currentNonprofit = nonprofit;
              currentStore = store;
              if (nonprofit)
                postTransactionButton.style.display = "";
              else
                postTransactionButton.style.display = "none";
            },
            userDidMatchCallback: (matched, amount) => {
            },
            isPreCheckout: false,
            forceMobileView: false,
            loadingScreenContent: `${shopBeamConfig.shopName} is donating 1% of your purchase to a nonprofit you choose! Loading nonprofits now...`,
            themeConfig: {
              id: "minimal-ui-nonprofit",
              textColor: "#000",
              fontFamily: "Helvetica Neue LT Std, sans-serif",
              backgroundColor: "#fff", //"rgba(0,0,0,0)",
              tileTextColor: "#000",
              hidePoweredBy: true,
              selectedNonprofitBackgroundColor: "#fff",
              iconButtonBackgroundColor: "#ff2a00", //"rgba(0,0,0,0)",
              iconButtonBorder: "1px #ff2a00 solid",
              selectedBorder: "1px solid #ff2a00", //"2px #FC2091 solid",
              progressBarBorder: "1px #ff2a00 solid",
              progressBarBackgroundColor: "rgba(0,0,0,0)",
              tileBorderColor: "#d3d3d3",
              tileBorderThickness: "1px",
              tilePercentageFontSize: "small",
              tileDescriptionFontSize: "normal",
              tilePercentageTextColor: "#000",
              tilePercentageTextAlign: "end",
              progressBarColors: [
                {color: "#ff2a00", offset: "100%"},
              ],
              tileBorderRadius: "5px",
              showLogo: true,
              headerTextMargin: "-15px 0px 0px",
              headerText: "1% of your purchase is going to a nonprofit you choose",
              poweredByTextColor: "#645FAA",
              poweredByFontSize: "11px",
              headerTextFontSize: "normal",
              tileCauseFontSize: "14px",
              nonprofitCornerRadius: "5px",
              tileCauseLetterSpacing: "0px",
              headerPartnerLogoMargin: "0px 4px 0px",
              headerPartnerLogoWidth: "90px",
              headerBeamLogoMargin: "0px 0px 12px 10px", //"0px 0px 30px 2px",
              tilePercentageFontWeight: "600",
              progressBarWidth: "calc(100% - 108px)",
              tilePercentageWidth: "108px",
              tileCauseFontWeight: "900",
              fundingTextFontWeight: "600",
              fundingViaTextFontWeight: "600",
              fundingNonprofitNameTextFontWeight: "600",
              headerTextFontWeight: "900",
            },
          });


          await nonprofitWidget.render({
            store: shopBeamConfig.storeId,
            cartTotal: 10,
            postalCode: customerZipCode,
            countryCode: customerCountryCode,
            showCommunityImpact: true,
          });
          postTransactionButton.addEventListener('click', updateTransaction)
          console.debug(nonprofitWidget.transactionData);
        }
      } else {
        console.error(`status: ${response.status} \n`);
      }
    })
    .catch((error) => console.error(error));
}

function executeBeamWidget(shopBeamConfig, checkout) {

  const containerId = "beam-widget-wrapper";
  const contentType = "application/json";
  const widgetHeader = document.querySelector("#beam-widget-header");
  const widgetWrapper = document.querySelector("#beam-widget-wrapper");

  function buildImpactOverviewWidget(content = "Getting your impact...") {
    widgetWrapper.innerHTML = "";
    widgetHeader.style.display = "";
    return new beamApps.ImpactOverviewWidget({
      containerId: "beam-widget-wrapper",
      widgetId: shopBeamConfig.widgetId,
      communityImpactUrl: "https://superetteshop.com/pages/about#community",
      loadingScreenContent: content,
      maxContainerWidth: 500,
      hidePoweredBy: true,
      isMobile: true,
      themeConfig: {
        id: "modern-ui-impact-overview",
        textColor: "#000",
        fontFamily: "Helvetica Neue LT Std, sans-serif",
        personalImpactTextColor: "#000",
        communityImpactTextColor: "#000",
        headerTextTranform: "capitalize",
        showPurchaseMessage: true,
        tileBorderRadius: "0px",
        overlayCornerRadius: "0px",
        hidePurchaseMessageChainName: true,
        purchaseMessageText: "<br />Check out the impact your Superette purchase made below.",
        promoText: `<span style="font-weight: bold; font-size: 14px;">You just made an impact for BEAM_NONPROFIT.</span><br/>Check out the impact your Superette purchase made below.`,
        impactFontSize: "14px",
        communityHeaderMargin: "10px 0px 10px",
        personalImpactBackgroundColor: "#fff",
        communityImpactBackgroundColor: "#fff",
        progressBarColors: [
          {color: "#ff2a00", offset: "100%"},
        ],
        goalCompletionTextColor: "#d3d3d3",
        showPersonalImpactPercentage: true,
        showCommunityImpactPercentage: true,
        underlineLink: false,
        useArrowInLinkText: true,
        linkFontWeight: "normal",
        progressBarBackgroundColor: "rgba(0, 0, 0, 0)",
        linkTextAlign: "left",
        linkTextColor: "#ff2a00",
        purchaseMessageTextColor: "#000",
        purchaseMessageFontSize: "15px",
        purchaseMessageMargin: "30px 0px 20px",
        headerTextColor: "#000",
        headerTextFontWeight: "bold",
        hideCommunityImpactLink: false,
        hideCommunityImpactBorder: true,
        hidePersonalImpactBorder: true,
        tileCauseFontSize: "0.6rem",
        tileCauseLetterSpacing: "0",
        tileNameFontWeight: "normal",
        tileNameFontSize: "1.3rem",
        tileNameMargin: "12px 0px 0px 0px",
        tileBorderThickness: "0",
        impactFontWeight: "normal",
        hidePoweredBy: false,
        communityCardPadding: "0px",
        personalCardPadding: "0px",
        progressBarBorder: "1px #ff2a00 solid",
        headerPartnerLogoMargin: "0px 4px 0px",
        headerPartnerLogoWidth: "90px",
        headerBeamLogoMargin: "0px 0px 12px 10px", //"0px 0px 30px 2px",
        communityImpactPercentageColor: "#000",
        personalImpactPercentageColor: "#000",
        tilePercentageTextColor: "#000",
        progressBarWidth: "calc(100% - 50px)",
        tilePercentageWidth: "50px",
        tilePercentageTextAlign: "right",
        purchaseMessageTextAlign: "start",
        tilePercentageFontSize: "13px",
        tilePercentageFontWeight: "normal",
        purchaseMessagePadding: "0px",
        percentageFontWeight: "normal",
        linkContainerMargin: "20px 0px -10px 0px",
        personalHeaderMargin: "10px 10px 27px 0px",
        tileCardHeight: "325px",
      },
    });
  }

  createTransaction(containerId, contentType, shopBeamConfig, checkout);
}
