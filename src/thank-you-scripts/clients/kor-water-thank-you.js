import * as App from 'widgets';

window.execThankYouScript = function execThankYouScript(cartTotalString, beamUserId,
                                                        orderId, customerId, customerFirstName,
                                                        customerLastName, customerEmail, customerPhone,
                                                        customerZipCode, customerCountryCode) {
  const beam_web_sdk_base_url = 'https://ppc.sdk.beamimpact.com';
  const beam_widget_id = 'b616cda305cc4b3d92ba0aab07f5cb97';
  const beam_store_id = '55';
  const shop_domain = 'korwatershop.myshopify.com';

  const key = 'user';

  let found = false;
  const BEAM_TEST = true;
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
                              <div style="text-align: right;margin-top: 8px;">
                                  <a href="#" id="beam-post-transaction-button" class="button" style="display: none; min-width: 120px;">SUBMIT</a>
                              </div>
                              <div id="beam-loading-content" style="display: none;"></div>
                          </div>
                      `
          if (!BEAM_TEST || customerEmail.includes("@beamimpact.com") || customerEmail.includes("@superetteshop.com")) {
            node.prepend(beamContentBox);
            executeBeamWidget();
            found = true;
          }
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
        communityImpactUrl: "https://www.korwater.com/pages/impact-v1#beam-impact-section",
        loadingScreenContent: content,
        maxContainerWidth: 500,
        hidePoweredBy: true,
        isMobile: true,
        themeConfig: {
          id: "modern-ui-impact-overview",
          textColor: "#30302e",
          fontFamily: "Roboto",
          personalImpactTextColor: "#bcbcbc",
          communityImpactTextColor: "#bcbcbc",
          headerTextTranform: "uppercase",
          showPurchaseMessage: true,
          tileBorderRadius: "0px",
          overlayCornerRadius: "0px",
          hidePurchaseMessageChainName: true,
          purchaseMessageText: "<br />Check out the impact your ${shopName} purchase made below.",
          promoText: `<span style="font-weight: bold; font-size: 14px; color: #30302e;">You just made an impact for BEAM_NONPROFIT.<br/>Check out the impact your ${shopName} purchase made below.</span>`,
          impactFontSize: "14px",
          personalHeaderMargin: "10px 10px 10px 0px",
          communityHeaderMargin: "10px 0px 10px",
          personalImpactBackgroundColor: "#fff",
          communityImpactBackgroundColor: "#fff",
          progressBarColors: [
            {color: "#5ed1ba", offset: "100%"},
          ],
          goalCompletionTextColor: "#bcbcbc",
          showPersonalImpactPercentage: true,
          showCommunityImpactPercentage: true,
          underlineLink: true,
          useArrowInLinkText: true,
          linkFontWeight: "lighter",
          progressBarBackgroundColor: "rgba(0, 0, 0, 0)",
          linkTextAlign: "left",
          linkTextColor: "#bcbcbc",
          purchaseMessageTextColor: "#30302e",
          purchaseMessageFontSize: "15px",
          purchaseMessageMargin: "30px 0px 20px",
          headerTextColor: "#30302e",
          headerTextFontWeight: "bold",
          hideCommunityImpactLink: false,
          hideCommunityImpactBorder: false,
          hidePersonalImpactBorder: false,
          tileCauseFontSize: "0.6rem",
          tileCauseLetterSpacing: "0",
          tileCardHeight: "305px",
          tileNameFontWeight: "normal",
          tileNameFontSize: "1.3rem",
          tileNameMargin: "12px 0px 0px 0px",
          tileBorderThickness: "0",
          impactFontWeight: "normal",
          hidePoweredBy: false,
          communityCardPadding: "0px",
          communityCardContentMargin: "0px",
          personalCardPadding: "0px",
          progressBarBorder: "1px #bcbcbc solid",
          headerPartnerLogoWidth: "80px",
          headerPartnerLogoMargin: "0 10px 0 0",
          headerBeamLogoMargin: "0 0 2px 10px",
          headerBeamLogoWidth: "65px",
          tilePercentageTextColor: "#bcbcbc",
          personalImpactPercentageColor: "#bcbcbc",
          progressBarWidth: "calc(100% - 35px)",
          tilePercentageWidth: "35px",
          tilePercentageTextAlign: "right",
          headerTextFontSize: "12px",
          purchaseMessageTextAlign: "start",
          tilePercentageFontSize: "13px",
          tilePercentageFontWeight: "normal",
          purchaseMessagePadding: "0px",
          percentageFontWeight: "normal",
          linkContainerMargin: "-10px 0px -10px 0px",
          progressBarBorderRadius: "0px",
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
          window.localStorage.removeItem(`beam_transaction_key_${widgetId}`)
          window.localStorage.removeItem(nonprofitKey);
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
                    You just made an impact for ${currentNonprofit && currentNonprofit.name} with your ${shopName} purchase!
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
                id: "minimal-ui-nonprofit",
                textColor: "#30302e",
                fontFamily: "Roboto",
                backgroundColor: "rgba(0,0,0,0)",
                tileTextColor: "#30302e",
                hidePoweredBy: true,
                selectedNonprofitBackgroundColor: "#5ed1ba", //"#FC2091",
                iconButtonBackgroundColor: "#fff", //"rgba(0,0,0,0)",
                iconButtonBorder: "1px #bcbcbc solid",
                selectedBorder: "1px solid #5ed1ba", //"2px #FC2091 solid",
                nonprofitCornerRadius: "0px",
                tileBorderRadius: "0px",
                progressBarBorder: "1px #bcbcbc solid",
                progressBarBackgroundColor: "rgba(0,0,0,0)",
                tileBorderColor: "#bcbcbc",
                tileBorderThickness: "1px",
                tileDescriptionFontSize: "15px",
                tilePercentageTextColor: "#bcbcbc",
                tilePercentageFontWeight: "normal",
                tilePercentageTextAlign: "end",
                progressBarColors: [
                  {color: "#5ed1ba", offset: "100%"},
                ],
                fundingTextFontWeight: "normal",
                showLogo: true,
                headerTextMargin: "20px 0px 0px 0px",
                headerText: "1% of your purchase is going to a nonprofit you choose",
                headerTextFontWeight: "normal",
                poweredByTextColor: "#bcbcbc",
                poweredByFontSize: "11px",
                headerTextFontSize: "15px",
                tileCauseFontSize: "13px",
                progressBarWidth: "80%",
                progressBarBorderRadius: "0px",
                headerPartnerLogoWidth: "80px",
                headerPartnerLogoMargin: "0 10px 0 0",
                headerBeamLogoMargin: "0 0 2px 10px",
                headerBeamLogoWidth: "65px",
                tileCauseLetterSpacing: "0px",
                tilePercentageFontSize: "11px",
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