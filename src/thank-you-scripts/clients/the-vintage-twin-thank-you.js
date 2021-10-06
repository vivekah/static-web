import * as App from 'widgets';

window.execThankYouScript = function execThankYouScript(cartTotalString, beamUserId,
                                                        orderId, customerId, customerFirstName,
                                                        customerLastName, customerEmail, customerPhone,
                                                        customerZipCode, customerCountryCode) {
  // const beam_web_sdk_base_url = 'https://tvt.sdk.beamimpact.com'
  // const beam_widget_id = '5b73d5fc362a4ed1a6129e2af01ec366'
  // const beam_store_id = '12'
  // const shop_name = 'The Vintage Twin'
  // const shop_domain = 'tvt1.myshopify.com'
  // const key = 'user'

  const beam_web_sdk_base_url = 'https://ppc.sdk.beamimpact.com'
  const beam_widget_id = 'a33e606929cd41449c49fe29636a85d2';
  const beam_store_id = '37';
  const shop_name = 'BB-Impact';
  const shop_domain = 'bb-impact-sample.myshopify.com';
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
          beamContentBox.style.padding = "15px";
          beamContentBox.innerHTML = `
                        <span id="beam-widget-header" style="display: none;">
                             <h3 style="font-family: inherit;">
                                You made an impact for a nonprofit with your ${shop_name} purchase
                            </h3>
                            <hr />
                        </span>
                        <div id="beam-widget-wrapper"></div>
                        <div style="text-align: right;margin-top: 10px;">
                            <a href="#" id="beam-post-transaction-button" class="button button-primary w-52" style="display: none;">Submit</a>
                        </div>
                        <div id="beam-loading-content" style="display: none;"></div>
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
    const beamUser = `${beamUserId}`.trim(); // CHANGE_BEAM
    const containerId = "beam-widget-wrapper";
    const transactionKey = `beam_transaction_key_${widgetId}`;

    const fontFamily = '"Helvetica Neue", -apple-system, sans-serif';
    const headerFontFamily = "Helvetica,Arial,sans-serif";
    const alternateFontFamily = "Helvetica,Arial,sans-serif";

    const widgetHeader = document.querySelector("#beam-widget-header");
    const widgetWrapper = document.querySelector("#beam-widget-wrapper");
    const cartTotal = parseFloat(cartTotalString.replace("$", ""));

    function buildImpactOverviewWidget(content = "Getting your impact...") {
      widgetWrapper.innerHTML = "";
      widgetHeader.style.display = "";
      return new beamApps.ImpactOverviewWidget({
        containerId: "beam-widget-wrapper",
        widgetId: widgetId,
        communityImpactUrl: '#',
        loadingScreenContent: content,
        themeConfig: {
          fontFamily: "inherit",
          textColor: "#333",
          gradientColors: ["#000000", "#000000"],
          headerTextFontSize: "medium",
          hideCommunityImpactLink: true
        }
      });
    }

    const transactionId = window.localStorage.getItem(`beam_transaction_key_${widgetId}`);

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
          transaction_id: transactionId ? transactionId : null,
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
          const {transaction_id} = responseData;
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

          loadingContent.innerHTML = ` ${currentNonprofit && currentStore ? `
                  You just made an impact for ${currentNonprofit && currentNonprofit.name}!<br/ >
                  <br/>
                  <br />
                  ${currentStore && currentStore.chain_donation_type.name} of this purchase will be donated there for you.
                  <br />
                  Hang tight to see the impact you just made with ${shopName}...
                ` : ''
          }`

          if (responseData.nonprofit) {
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
              userDidMatchCallback: (matched, amount) => {
              },
              isPreCheckout: false,
              forceMobileView: false,
              loadingScreenContent: `${shopName} is donating 1% of your purchase to a nonprofit you choose! Loading nonprofits now...`,
              themeConfig: {
                id: "minimal-ui-nonprofit",
                textColor: "#000000",
                fontFamily: 'Lausanne-300, "Helvetica Neue", sans-serif',
                gradientColors: ["rgb(130, 183, 206)"],
                progressBarColors: [
                  {color: "rgb(130, 183, 206)", offset: "100%"}
                ],
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
