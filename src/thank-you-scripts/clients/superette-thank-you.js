import * as App from 'widgets';

window.execThankYouScript = function execThankYouScript(cartTotalString, beamUserId,
                                                        orderId, customerId, customerFirstName,
                                                        customerLastName, customerEmail, customerPhone,
                                                        customerZipCode, customerCountryCode) {
  const beam_web_sdk_base_url = 'https://ppc.sdk.beamimpact.com';
  const beam_widget_id = 'afd026de7827482db4adc69080e4a587';
  const beam_store_id = '51';
  const shop_name = 'Superette';
  const shop_domain = 'superette-shop.myshopify.com';
  const key = 'user';

  let found = false;
  const thankYouContainer = document.querySelector("[data-step='thank_you']");
  console.log(" thank you container: ", thankYouContainer);
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
                                  <a href="#" id="beam-post-transaction-button" class="button" style="display: none; min-width: 155px;">Checkout</a>
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
          personalHeaderMargin: "10px 10px 10px 0px",
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
                  await buildImpactOverviewWidget().render(responseData.user || beamUser);
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
                tilePercentageFontWeight: "normal",
                tilePercentageTextAlign: "end",
                progressBarColors: [
                  {color: "#ff2a00", offset: "100%"},
                ],
                tileBorderRadius: "5px",
                fundingTextFontWeight: "normal",
                showLogo: true,
                headerTextMargin: "-15px 0px 0px",
                headerText: "1% of your purchase is going to a nonprofit you choose",
                headerTextFontWeight: "normal",
                poweredByTextColor: "#645FAA",
                poweredByFontSize: "11px",
                headerTextFontSize: "normal",
                tileCauseFontSize: "14px",
                nonprofitCornerRadius: "5px",
                progressBarWidth: "80%",
                tileCauseLetterSpacing: "0px",
                // headerPartnerLogoWidth : "60px",
                // headerPartnerLogoMargin: "0 3px 0 0",
                // headerBeamLogoMargin: "0 0 0 3px",

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
              store: storeId,
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
}
