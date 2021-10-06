import * as App from 'widgets';

window.execThankYouScript = function execThankYouScript(cartTotalString, beamUserId,
                                                        orderId, customerId, customerFirstName,
                                                        customerLastName, customerEmail, customerPhone,
                                                        customerZipCode, customerCountryCode) {
  const beam_web_sdk_base_url = 'https://ppc.sdk.beamimpact.com';
  const beam_widget_id = '34cbad063b5f4d729c6474fc565a5cce';
  const beam_store_id = '27';
  const shop_name = 'Pink Panda Candy';
  const shop_domain = 'pinkpandagummies.myshopify.com';
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

    const orderId = "{{ checkout.order_id }}";
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
        communityImpactUrl: "https://pinkpandacandy.com/pages/our-story#community-impact",
        loadingScreenContent: content,
        maxContainerWidth: 500,
        hidePoweredBy: true,
        isMobile: true,
        themeConfig: {
          textColor: "#000",
          fontFamily: "poppins, sans-serif",
          percentageTextColor: "#000",
          impactFontWeight: "normal",
          personalImpactTextColor: "#FEEB34",
          personalCardPadding: "0px",
          personalCardMargin: "0 0 0 0",
          communityImpactTextColor: "#FEEB34",
          communityCardPadding: "0px",
          communityCardMargin: "0px",
          gradientColors: ["#fff"],
          headerTextTranform: "uppercase",
          showPurchaseMessage: true,
          tileBorderRadius: "0",
          purchaseMessageFontSize: "18px",
          purchaseMessageText: "Check out the impact your Pink Panda purchase made below.",
          hidePurchaseMessageChainName: true,
          purchaseMessageTextColor: "#FC2091",
          impactFontSize: "15px",
          personalImpactBackgroundColor: "#FC2091",
          communityImpactBackgroundColor: "#FC2091",
          progressBarColors: [
            {color: "#FEEB34", offset: "100%"},
          ],
          showPersonalImpactPercentage: false,
          personalImpactPercentageColor: "#FEEB34",
          commmunityImpactPercentageColor: "#FEEB34",
          personalCardHeight: "440px",
          communityCardHeight: "440px",
          underlineLink: true,
          useArrowInLinkText: true,
          linkFontWeight: "normal",
          progressBarBackgroundColor: "#FC2091",
          progressBarBorder: "1px #FEEB34 solid",
          linkTextAlign: "left",
          linkTextColor: "#000",
          headerTextColor: "#000",
          headerTextFontWeight: "bold",
          headerTextFlexAlign: "start",
          hideCommunityImpactLink: false,
          hideCommunityImpactBorder: false,
          tileCauseFontSize: "0.6rem",
          tileCauseLetterSpacing: "0",
          tileNameFontWeight: "bold",
          tileNameFontSize: "1.3rem",
          tileBorderThickness: "0",
          hidePoweredBy: true,
          purchaseMessageFontSize: "14px",
          purchaseMessageTextColor: "#000",
          impactFontWeight: "normal",
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
                  You just made an impact for ${currentNonprofit && currentNonprofit.name}!
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
                textColor: "#FEEB34",
                fontFamily: "poppins",
                headerTextFontColor: "#000",
                backgroundColor: "#FC2091",
                tileTextColor: "#FEEB34",
                hidePoweredBy: true,
                iconButtonBackgroundColor: "rgb(252, 32, 145)",
                iconButtonBorder: "2px #FEEB34 solid",
                selectedBorder: "2px #FEEB34 solid",
                progressBarBorder: "1px #FEEB34 solid",
                progressBarBackgroundColor: "#FC2091",
                progressBarColors: [
                  {color: "#FEEB34", offset: "100%"}
                ],
                tileBorderColor: "#FEEB34",
                tileBorderThickness: "2px",
                tilePercentageFontSize: "calc(var(--typeBaseSize) - 7px)",
                tileCauseFontSize: "var(--typeBaseSize)",
                headerTextFontSize: "var(--typeBaseSize)",
                poweredByFontSize: "calc(var(--typeBaseSize) - 4px)",
                poweredByTextColor: "#FEEB34",
                tileDescriptionFontSize: "var(--typeBaseSize)",
                gradientColors: ["#FEEB34", "#FEEB34"],
                tileBorderRadius: "0",
                showLogo: true,
                tilePercentageWidth: "auto",
                tilePercentageTextAlign: "right"
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