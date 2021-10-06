import * as App from 'widgets';

window.execThankYouScript = function execThankYouScript(cartTotalString, beamUserId,
                                                        orderId, customerId, customerFirstName,
                                                        customerLastName, customerEmail, customerPhone,
                                                        customerZipCode, customerCountryCode) {
  const beam_web_sdk_base_url = 'https://ppc.sdk.beamimpact.com';
  const beam_widget_id = '6e9d958fbf734888abdfc129fa4a7e1e';
  const beam_store_id = '48';
  const shop_name = 'Sweet Nothings';
  const shop_domain = 'sweet-nothings-store.myshopify.com';
  const key = 'user';

  let found = false;
  const BEAM_TEST = false;
  const thankYouContainer = document.querySelector("[data-step='thank_you']");

  let beamCoopObserver = new MutationObserver(function (mutations) {
    const beamCoopContainer = document.querySelector("#coopcommerce");
    if (beamCoopContainer) {
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
<div id="beam-carbon-widget-wrapper"></div>
</div>
`
      if (!BEAM_TEST || customerEmail.includes("@beamimpact.com")) {
        beamCoopContainer.parentNode.insertBefore(beamContentBox, beamCoopContainer)
        //node.prepend(beamContentBox);
        executeBeamWidget();
        found = true;
      }
      beamCoopObserver.disconnect();
    }
  });
  beamCoopObserver.observe(document, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
  });

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
                    `;
          if (!BEAM_TEST || customerEmail.includes("@beamimpact.com") || customerEmail.includes("@missgrass.com")) {
            node.prepend(beamContentBox);
            executeBeamWidget();
            found = true;
          }
        }
      });
    })
  });

  /** observer.observe(thankYouContainer, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  }); **/

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
        communityImpactUrl: "https://www.eatsweetnothings.com/pages/about-us",
        loadingScreenContent: content,
        maxContainerWidth: 500,
        hidePoweredBy: true,
        isMobile: true,
        themeConfig: {
          textColor: "#645FAA",
          fontFamily: "Circular Regular",
          personalImpactTextColor: "#645FAA",
          communityImpactTextColor: "#645FAA",
          headerTextTranform: "uppercase",
          showPurchaseMessage: true,
          tileBorderRadius: "0px",
          overlayCornerRadius: "0px",
          hidePurchaseMessageChainName: true,
          purchaseMessageText: "Check out the impact your Sweet Nothings purchase made below.",
          impactFontSize: "14px",
          personalImpactBackgroundColor: "#F3EDE9",
          communityImpactBackgroundColor: "#F3EDE9",
          progressBarColors: [
            {color: "#645FAA", offset: "100%"},
          ],
          showPersonalImpactPercentage: false,
          showCommunityImpactPercentage: true,
          underlineLink: true,
          useArrowInLinkText: true,
          linkFontWeight: "normal",
          progressBarBackgroundColor: "rgba(0, 0, 0, 0)",
          linkTextAlign: "left",
          linkTextColor: "#645FAA",
          purchaseMessageTextColor: "#645FAA",
          purchaseMessageFontSize: "15px",
          purchaseMessageMargin: "10px 0px 15px",
          headerTextColor: "#645FAA",
          headerTextFontWeight: "bold",
          hideCommunityImpactLink: false,
          hideCommunityImpactBorder: false,
          tileCauseFontSize: "0.6rem",
          tileCauseLetterSpacing: "0",
          tileNameFontWeight: "normal",
          tileNameFontSize: "1.3rem",
          tileNameMargin: "12px 0px 0px 0px",
          tileBorderThickness: "0",
          impactFontWeight: "normal",
          hidePoweredBy: false,
          communityCardPadding: "0",
          personalCardPadding: "0",
          progressBarBorder: "1px #000 solid",
          headerPartnerLogoMargin: "0px 4px 0px",
          headerBeamLogoMargin: "0px 0px 0px 2px",
          communityImpactPercentageColor: "#645FAA",
          purchaseMessageTextAlign: "start",
          tilePercentageFontSize: "14px",
          tilePercentageFontWeight: "normal",
          purchaseMessagePadding: "0px",
          percentageFontWeight: "normal",
          linkContainerMargin: "5px 0px -10px 0px",
          communityHeaderMargin: "0px 0px 0px",
          headerPartnerLogoWidth: "70px",
          headerBeamLogoWidth: "70px",
          communityCardHeight: "307px",
          personalCardHeight: "307px",
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
                textColor: "#645FAA",
                fontFamily: "Circular Regular",
                backgroundColor: "#fff", //"rgba(0,0,0,0)",
                tileTextColor: "#645FAA",
                hidePoweredBy: true,
                selectedNonprofitBackgroundColor: "#645FAA", //"#FC2091",
                iconButtonBackgroundColor: "#F5E5E3", //"rgba(0,0,0,0)",
                iconButtonBorder: "1px #645FAA solid",
                selectedBorder: "1px solid #645FAA", //"2px #FC2091 solid",
                progressBarBorder: "1px #645FAA solid",
                progressBarBackgroundColor: "rgba(0,0,0,0)",
                tileBorderColor: "#645FAA",
                tileBorderThickness: "1px",
                tileDescriptionFontSize: "15px",
                tilePercentageTextColor: "#645FAA",
                tilePercentageFontWeight: "normal",
                tilePercentageTextAlign: "end",
                progressBarColors: [
                  {color: "#645FAA", offset: "100%"},
                ],
                tileBorderRadius: "0",
                fundingTextFontWeight: "normal",
                showLogo: true,
                headerTextMargin: "20px 0px 0px 0px",
                headerText: "1% of your purchase is going to a nonprofit you choose",
                headerTextFontWeight: "bold",
                poweredByTextColor: "#645FAA",
                poweredByFontSize: "10px",
                headerTextFontSize: "15px",
                tileCauseFontSize: "14px",
                nonprofitCornerRadius: "0px",
                progressBarWidth: "80%",
                headerPartnerLogoWidth: "70px",
                headerBeamLogoWidth: "70px",
                headerPartnerLogoMargin: "0 3px 0 0",
                headerBeamLogoMargin: "0 0 0 3px",
                tileCauseLetterSpacing: "0px",
                tilePercentageFontSize: "14px",
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