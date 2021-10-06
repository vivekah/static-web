import * as App from 'widgets';

window.execThankYouScript = function execThankYouScript(cartTotalString, beamUserId,
                                                        orderId, customerId, customerFirstName,
                                                        customerLastName, customerEmail, customerPhone,
                                                        customerZipCode, customerCountryCode) {
  const beam_web_sdk_base_url = 'https://ppc.sdk.beamimpact.com';
  const beam_widget_id = '3ed75488cd0f4e2ea1d4b6c7b1cd6d40';
  const beam_store_id = '29';
  const shop_name = 'Koa';
  const shop_domain = 'living-koa.myshopify.com';
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
                                <a href="#" id="beam-post-transaction-button" class="button" style="display: none; min-width: 155px;">Submit</a>
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
        communityImpactUrl: "https://livingkoa.com/pages/about#community-impact",
        loadingScreenContent: content,
        maxContainerWidth: 500,
        hidePoweredBy: false,

        isMobile: true,
        themeConfig: {
          textColor: "#3C4600",
          fontFamily: "Avenir Next",
          percentageTextColor: "#DEF2C1",
          personalImpactTextColor: "#DEF2C1",
          personalCardPadding: "0px",
          personalCardMargin: "0px 0px 0px 0px",
          communityImpactTextColor: "#DEF2C1",
          communityCardPadding: "0px",
          communityCardMargin: "0px 0px 0px 0px",
          gradientColors: ["#fff"],
          headerTextTranform: "uppercase",
          showPurchaseMessage: true,
          tileBorderRadius: "0",
          purchaseMessageFontSize: "18px",
          hidePurchaseMessageChainName: true,
          purchaseMessageText: "Check out the impact your Koa purchase made below.",
          impactFontSize: "15px",
          personalImpactBackgroundColor: "#3C4600",
          communityImpactBackgroundColor: "#3C4600",
          progressBarColors: [
            {color: "#DEF2C1", offset: "100%"},
          ],
          showPersonalImpactPercentage: false,
          personalImpactPercentageColor: "#DEF2C1",
          commmunityImpactPercentageColor: "#DEF2C1",
          personalCardHeight: "auto",
          communityCardHeight: "auto",
          underlineLink: true,
          useArrowInLinkText: true,
          linkFontWeight: "normal",
          progressBarBackgroundColor: "rgb(60, 70, 0)",
          progressBarBorder: "1px #DEF2C1 solid",
          linkTextAlign: "left",
          linkTextColor: "#3C4600",
          headerTextColor: "#3C4600",
          headerTextFontWeight: "540",
          headerTextFlexAlign: "start",
          hideCommunityImpactLink: false,
          hideCommunityImpactBorder: false,
          tileCauseFontSize: "0.6rem",
          tileNameFontWeight: "lighter",
          tileNameFontSize: "1.3rem",
          tileBorderThickness: "0",
          hidePoweredBy: true,
          purchaseMessageFontSize: "14px",
          headerLogoAlign: "baseline",
          impactFontWeight: "lighter",
          tileNameMargin: "15px 0px -5px 0px",
          communityHeaderMargin: "0",
          headerPartnerLogoMargin: "0px",
          headerPartnerLogoMargin: "0px",
          headerBeamLogoMargin: "0px 20px 0px 0px",
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
              loadingScreenContent: `Koa is donating 1% of your purchase to a nonprofit you choose! Loading nonprofits now...`,
              themeConfig: {

                id: "minimal-ui-nonprofit",
                textColor: "#3C4600",
                tileTextColor: "#3C4600",
                fontFamily: "Avenir Next",
                tileBorderRadius: "0",
                tileHeight: "30px",
                backgroundColor: "rgba(255, 255, 255, 0)",
                selectedNonprofitBackgroundColor: "#DEF2C1",
//                     tileBorderColor: "#d9d9d9",//"rgb(92,154,130)",
                selectedBorder: "1px solid #3C4600", //rgb(92, 154, 130)",
                showNonprofitBanner: false,
                showLogo: true,
                progressBarColors: [
                  {color: "#DEF2C1", offset: "100%"}
                ],
                tileBorderColor: "#3C4600",
                progressBarBorder: "1px solid #3C4600",
                progressBarBackgroundColor: "rgba(0,0,0,0)",
                progressBarWidth: "88%",
                tilePercentageFontSize: "10px",
                tilePercentageTextAlign: "right",
                tilePercentageWidth: "auto",
                isInKind: false,
                headerText: "1% of your purchase is going to a nonprofit of your choice",
                fundingTextFontWeight: "bold",
                iconButtonBorder: "#3C4600 1px solid",
          //      <!--   poweredByTextColor: "#3C4600", -->
                poweredByTextColor: "lightgray",
                headerPartnerLogoMargin: "0px",
                headerBeamLogoMargin: "0px 20px 0px -9px",
                poweredByTextColor: "#7F7F7F",
                poweredByFontSize: "10px",
                tileImageHeight: "80%",
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