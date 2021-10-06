import * as App from 'widgets';

window.execThankYouScript = function execThankYouScript(cartTotalString, beamUserId,
                                                        orderId, customerId, customerFirstName,
                                                        customerLastName, customerEmail, customerPhone,
                                                        customerZipCode, customerCountryCode) {
  const beam_web_sdk_base_url = 'https://east.sdk.beamimpact.com';
  const beam_widget_id = 'd048790d898e4195bd428aa8c2608742';
  const beam_store_id = '13';
  const shop_name = '18 East';
  const shop_domain = '18-east.myshopify.com';

  const fontStyle = document.createElement("style");
  fontStyle.innerHTML = `
    #beam-post-transaction-button {
         border-radius: 5px;
         font-size: 14px;
         min-width: 95px;
        background: #3d4246;
     }
    .button  {
      text-overflow: ellipsis;
      overflow: visible;
      display: inline-block;
      margin: 0;
      line-height: 0;
      text-decoration: none;
      text-align: center;
      vertical-align: middle;
      white-space: nowrap;
      border: none;
      cursor: pointer;
      user-select: none;
      border-radius: 0;
      background-color: #000;
      color: #fff;
      transition: background-color 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
      padding: 1.6rem 1.4rem;
      min-width: 105px;
      font-style: normal;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: bold;
      font-size: normal;
      font-family: Lausanne-300, "Helvetica Neue", sans-serif;
    }
    .button:hover {
      color: #fff;
    }
  `;
  // font-family: Lausanne-300, "Helvetica Neue", sans-serif;
  document.head.appendChild(fontStyle);

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
    const cartTotal = parseFloat(cartTotalString.replace("$", ""));

    console.debug("cartTotal(raw):", cartTotalString);
    console.debug("cartTotal(refined):", cartTotal);

    function buildImpactOverviewWidget(content = "Getting your impact...") {
      widgetWrapper.innerHTML = "";
      widgetHeader.style.display = "";
      return new beamApps.ImpactOverviewWidget({
        containerId: "beam-widget-wrapper",
        widgetId: widgetId,
        communityImpactUrl: 'https://18east.co/pages/about/',
        loadingScreenContent: content,
        themeConfig: {
          id: "minimal-ui-impact-overview",
          fontFamily: "Helvetica, Helvetica Neue, Arial, Lucida Grande, sans-serif",
          textColor: "#333",
          gradientColors: ["#F5D563", "#F5D563"],
          progressBarColors: [
            {color: "#F5D563", offset: "100%"},
          ],
          headerTextFontSize: "medium",
          tileBorderRadius: "0",
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
          transaction_data: {
            store: storeId
          }
        }),
      })
      .then(async (response) => {
        if (response.ok) {
          window.localStorage.removeItem(`beam_transaction_key_${widgetId}`);
          const responseData = await response.json();
          console.debug(responseData);
          // buildImpactOverviewWidget().render(responseData?.user || beamUser || customerEmail); const loadingContent = document.querySelector("#beam-loading-content");
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

          loadingContent.innerHTML = ` ${currentNonprofit && currentStore && `
                      You just made an impact for ${currentNonprofit && currentNonprofit.name} with your Rainbo purchase!
                    `
          }`

          if (responseData.nonprofit) {
            showLoadingContent(false)
            await buildImpactOverviewWidget().render(responseData.user || beamUser);
          } else {
            let currentNonprofit;
            let currentStore;

            function updateTransaction(e) {
              e.preventDefault()
              window.fetch(`${beam_web_sdk_base_url}/api/v1/shopify/transaction/post/`, {
                method: "POST",
                headers: {
                  "Content-Type": contentType,
                  "x-widget-id": widgetId,
                  "x-shopify-shop-domain": shopDomain
                },
                body: JSON.stringify({
                  order_id: orderId,
                  cart_total: cartTotal,
                  transaction_id: transactionId ? transactionId : null,
                  customer_beam_user: beamUser || responseData.user,
                  customer_id: customerId,
                  customer_first_name: customerFirstName,
                  customer_last_name: customerLastName,
                  customer_email: customerEmail,
                  customer_phone: customerPhone,
                  customer_zip_code: customerZipCode,
                  customer_country_code: customerCountryCode,
                  transaction_id: transaction_id,
                  nonprofit: currentNonprofit.id,
                  transaction_data: {
                    store: storeId
                  }
                })
              }).then(async (response) => {
                if (response.ok) {
                  const data = await response.json();
                  widgetWrapper.innerHTML = "";
                  showLoadingContent(false);
                  console.debug(data);
                  await buildImpactOverviewWidget().render(responseData.user || beamUser, currentNonprofit.id);
                } else {
                  showLoadingContent(false);
                }
              }).catch((error) => {
                console.error(error);
                showLoadingContent(false);
              });
            }

            nonprofitWidget = new beamApps.NonprofitWidget({
              widgetId: widgetId,
              containerId: "beam-widget-wrapper",
              userDidMatchCallback: async (matched, amount) => {
              },
              renderAfterSelection: true,
              selectedNonprofitCallback: (nonprofit, store) => {
                console.debug(store);
                currentNonprofit = nonprofit;
                currentStore = store;
                if (nonprofit)
                  postTransactionButton.style.display = "";
                else
                  postTransactionButton.style.display = "none";
              },
              isPreCheckout: false,
              forceMobileView: true,
              //loadingScreenContent: `${shopName} is donating 1% of your purchase to a nonprofit you choose! Loading nonprofits now...`,
              loadingScreenContent: `1% of your purchase is going to a nonprofit of your choice`,
              themeConfig: {
                id: "minimal-ui-nonprofit",
                textColor: "#000000",
                showLogo: true,
                fontFamily: "Helvetica, Helvetica Neue, Arial, Lucida Grande, sans-serif",
                gradientColors: ["#F5D563", "#F5D563"],
                tileBorderRadius: "0",
                progressBarColors: [
                  {color: "#F5D563", offset: "100%"},
                ]
              },
            });

            nonprofitWidget.render({
              store: storeId,
              postalCode: customerZipCode,
              countryCode: customerCountryCode,
              cartTotal: cartTotal,
              showCommunityImpact: true
            });
            postTransactionButton.addEventListener('click', updateTransaction)
            console.debug(nonprofitWidget.transactionData);
          }
        } else {
          console.error(`status: ${response.status}`);
        }
      })
      .catch((error) => console.error(error));
  }
}