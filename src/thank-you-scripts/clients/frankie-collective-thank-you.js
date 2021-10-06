import * as App from 'widgets';

window.execThankYouScript = function execThankYouScript(cartTotalString, beamUserId,
                                                        orderId, customerId, customerFirstName,
                                                        customerLastName, customerEmail, customerPhone,
                                                        customerZipCode, customerCountryCode) {

const beam_web_sdk_base_url = 'https://frankie.sdk.beamimpact.com';
const beam_widget_id = '6520d822e792453d9d570f8c3e333c96';
const beam_store_id = '17';
const shop_name = 'Frankie Collective';
const shop_domain = 'frankie-collective.myshopify.com';
const key = 'user';

  let found = false;
  const thankYouContainer = document.querySelector("[data-step='thank_you']");
  let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (!mutation.addedNodes) return
      mutation.addedNodes.forEach((node) => {
        if (found) {
          observer.disconnect();
          return;
        }
        if (node.className === "section__content") {
          const beamContentBox = document.createElement("div");
          beamContentBox.className = "content-box";
          beamContentBox.innerHTML = `
                        <div class="content-box__row">
                            <span id="beam-widget-header" style="display: none;">
                            </span>
                            <div id="beam-widget-wrapper"></div>
                            <div style="text-align: right;margin-top: 10px;">
                                <a href="#" id="beam-post-transaction-button" class="button" style="display: none;">Submit</a>
                            </div>
                            <div id="beam-loading-content" style="display: none;"></div>
                        </div>
                    `
          node.prepend(beamContentBox);
          executeBeamWidget();
          found = true;
        }
      });
    })
  });
  observer.observe(thankYouContainer, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });

  function executeBeamWidget() {
    const contentType = "application/json";
    const widgetId = `${beam_widget_id}`;
    const storeId = `${beam_store_id}`;
    const shopName = `${shop_name}`;
    const shopDomain = `${shop_domain}`;
    const beamUser = `${beamUserId}`.trim();
    const containerId = "beam-widget-wrapper";
    const transactionKey = `beam_transaction_key_${widgetId}`;

    const widgetHeader = document.querySelector("#beam-widget-header");
    const widgetWrapper = document.querySelector("#beam-widget-wrapper");
    const cartTotal = parseFloat(stripHtml(cartTotalString).replace("$", ""));

    console.debug("cartTotal(raw):", cartTotalString);
    console.debug("cartTotal(refined):", cartTotal);
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

    function buildImpactOverviewWidget(content = "Getting your impact...") {
      widgetWrapper.innerHTML = "";
      widgetHeader.style.display = "";
      return new beamApps.ImpactOverviewWidget({
        containerId: "beam-widget-wrapper",
        widgetId: widgetId,
        communityImpactUrl: "https://frankiecollective.com/#beam-community",
        loadingScreenContent: content,
        maxContainerWidth: 500,
        themeConfig: {
          fontFamily: 'Lausanne-300, "Helvetica Neue", sans-serif',
          textColor: "#000",
          personalImpactTextColor: "#fff",
          communityImpactTextColor: "#fff",
          gradientColors: ["#fff"],
          headerTextTranform: "uppercase",
          showPurchaseMessage: true,
          tileBorderRadius: "0",
          hideCommunityImpactBorder: true,
          personalImpactBackgroundColor: "#000",
          communityImpactBackgroundColor: "#000",
          progressBarColors: [{ color: "rgb(130, 183, 206)", offset: "100%" }],
          showPersonalImpactPercentage: false,
          underlineLink: true,
          useArrowInLinkText: true,
          linkFontWeight: "normal",
          progressBarBackgroundColor: "rgba(255, 255, 255, 0.15)",
          linkTextAlign: "left",
          linkTextColor: "#000",
          headerTextColor: "#000",
          headerTextFontWeight: "bold",
          headerTextFlexAlign: "start",
          hideCommunityImpactLink: false,
          tileCauseFontSize: "0.6rem",
          tileCauseLetterSpacing: "0",
          tileNameFontWeight: "900",
          tileNameFontSize: "1.3rem",
            personalCardHeight: "auto",
            communityCardHeight: "auto",
        },
      });
    }

    const transactionId = window.localStorage.getItem(transactionKey);

    window
      .fetch(`${beam_web_sdk_base_url}/api/v1/shopify/transaction/post/`, {
        method: "POST",
        headers: {
          "Content-Type": contentType,
          "x-widget-id": widgetId,
          "x-shopify-shop-domain": shopDomain,
        },
        body: JSON.stringify({
          order_id: orderId,
          cart_total: cartTotal,
          transaction_id: transactionId || null,
          customer_beam_user: beamUser,
          customer_id: customerId,
          customer_first_name: customerFirstName,
          customer_last_name: customerLastName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_zip_code: customerZipCode,
          customer_country_code: customerCountryCode,
          default_to_last_nonprofit: false,
          transaction_data: {
            store: storeId,
              cart_total: cartTotal,
          }
        }),
      })
      .then(async (response) => {
        if (response.ok) {
            window.localStorage.removeItem(`beam_transaction_key_${widgetId}`);
            const responseData = await response.json();
            console.debug(responseData);
            console.debug(responseData.nonprofit);
            const { transaction_id } = responseData;
            const loadingContent = document.querySelector("#beam-loading-content");
            const postTransactionButton = document.querySelector("#beam-post-transaction-button");
            let currentNonprofit;
            let currentStore;
          function showLoadingContent(enable = true) {
                    const display = enable ? "none" : "";
                    widgetWrapper.style.display = display;
                    postTransactionButton.style.display = enable ? "" : "none";
                loadingContent.style.display = enable ? "" : "none";
              }

                loadingContent.innerHTML = ` ${
                  currentNonprofit && currentStore ? `
                  You just made an impact for ${ currentNonprofit && currentNonprofit.name}!<br/ >
                  <br/>
                  <br />
                  ${currentStore && currentStore.chain_donation_type.name} of this purchase will be donated there for you.
                  <br />
                  Hang tight to see the impact you just made with ${shopName}...
                ` : ''
                }`

          if (responseData.nonprofit){
              showLoadingContent(false)
              await buildImpactOverviewWidget().render(responseData.user || beamUser);
            } else {
                let currentNonprofit;
                let currentStore;

              function updateTransaction(e) {
                  e.preventDefault()
                  window.fetch(`${beam_web_sdk_base_url}/api/v1/shopify/transaction/update/`, {
                  method: "POST",
                  headers: {
                    "Content-Type": contentType,
                    "x-widget-id": widgetId,
                    "x-shopify-shop-domain": shopDomain
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
                    await buildImpactOverviewWidget(loadingContent.innerHTML).render(responseData.user || beamUser);
                  } else {
                    showLoadingContent(false);
                  }
                }).catch((error) => {
                  console.error(error);
                  showLoadingContent(false);
                });
              }


              const nonprofitWidget = new beamApps.NonprofitWidget({
                widgetId: widgetId,
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
                userDidMatchCallback: (matched, amount) => { },
                isPreCheckout: false,
                forceMobileView: false,
                loadingScreenContent: `${shopName} is donating 1% of your purchase to a nonprofit you choose! Loading nonprofits now...`,
                themeConfig: {
                  id: "minimal-ui-nonprofit",
                  textColor: "#000000",
                  fontFamily: 'Lausanne-300, "Helvetica Neue", sans-serif',
                  gradientColors: ["rgb(130, 183, 206)"],
                  progressBarColors: [
                    { color: "rgb(130, 183, 206)", offset: "100%" }
                  ] ,
                  tileBorderRadius: "0",
                  poweredByPadding: "15px",
                  showLogo: true,
                },
              });



              await nonprofitWidget.render({
                  store: storeId,
                  cartTotal: cartTotal,
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
}