import * as App from 'widgets';

window.execThankYouScript = function execThankYouScript(cartTotalString, beamUserId,
                                                        orderId, customerId, customerFirstName,
                                                        customerLastName, customerEmail, customerPhone,
                                                        customerZipCode, customerCountryCode) {

  const beam_web_sdk_base_url = 'https://ppc.sdk.beamimpact.com';
  const beam_widget_id = 'e0d75bfcec8c4a5490010eef35f0a49f';
  const beam_store_id = '53';
  const shop_name = 'Cleobella';
  const shop_domain = 'cleobella.myshopify.com';
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
                        </div>`
            node.prepend(beamContentBox);
            executeBeamWidget();
            found = true;
          }
        });
      })
    })
  ;
  observer.observe(thankYouContainer, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  })
  ;

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
        communityImpactUrl: "https://cleobella.com/pages/community-impact",
        loadingScreenContent: content,
        maxContainerWidth: 500,
        hidePoweredBy: true,
        isMobile: true,
        themeConfig: {
          id: "modern-ui-impact-overview",
          textColor: "#856d66",
          fontFamily: "Graphik",
          personalImpactTextColor: "#856d66",
          communityImpactTextColor: "#856d66",
          headerTextTranform: "capitalize",
          showPurchaseMessage: true,
          tileBorderRadius: "0px",
          overlayCornerRadius: "0px",
          hidePurchaseMessageChainName: true,
          purchaseMessageText: "<br />Check out the impact your Cleobella purchase made below.",
          promoText: `<span style="font-weight: bold; font-size: 14px;">You just made an impact for BEAM_NONPROFIT.</span><br/>Check out the impact your Cleobella purchase made below.`,
          impactFontSize: "14px",
          personalHeaderMargin: "10px 10px 10px 0px",
          communityHeaderMargin: "10px 0px 10px",
          personalImpactBackgroundColor: "#fff",
          communityImpactBackgroundColor: "#fff",
          progressBarColors: [
            {color: "#856d66", offset: "100%"},
          ],
          goalCompletionTextColor: "#856d66",
          showPersonalImpactPercentage: true,
          showCommunityImpactPercentage: true,
          underlineLink: true,
          useArrowInLinkText: true,
          progressBarBorderRadius: "0px",
          linkFontWeight: "normal",
          progressBarBackgroundColor: "rgba(0, 0, 0, 0)",
          linkTextAlign: "left",
          linkTextColor: "#856d66",
          purchaseMessageTextColor: "#856d66",
          purchaseMessageFontSize: "15px",
          purchaseMessageMargin: "30px 0px 20px",
          headerTextColor: "#856d66",
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
          progressBarBorder: "1px #856d66 solid",
          headerPartnerLogoMargin: "0px 4px 0px",
          headerPartnerLogoWidth: "80px",
          headerBeamLogoMargin: "0px 0px 0px 6px",
          headerBeamLogoWidth: "52px",
          headerBeamLogoHeight: "25px",
          communityImpactPercentageColor: "#856d66",
          personalImpactPercentageColor: "#856d66",
          tilePercentageTextColor: "#856d66",
          progressBarWidth: "calc(100% - 35px)",
          tilePercentageWidth: "35px",
          tilePercentageTextAlign: "right",
          purchaseMessageTextAlign: "start",
          tilePercentageFontSize: "13px",
          tilePercentageFontWeight: "normal",
          purchaseMessagePadding: "0px",
          percentageFontWeight: "normal",
          personalCardContentMargin: "0px 25px 0px 0px",
          communityCardContentMargin: "0px 25px 0px 0px",
          linkContainerMargin: "-10px 0px -10px 0px",
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
                  You just made an impact for ${currentNonprofit && currentNonprofit.name} with your Cleobella purchase!
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
                fontFamily: "Graphik",
                backgroundColor: "#fff", //"rgba(0,0,0,0)",
                tileTextColor: "#856d66",
                hidePoweredBy: true,
                selectedNonprofitBackgroundColor: "#856d66", //"#FC2091",
                iconButtonBackgroundColor: "#fff", //"rgba(0,0,0,0)",
                iconButtonBorder: "1px #856d66 solid",
                selectedBorder: "1px solid #856d66 ", //"2px #FC2091 solid",
                progressBarBackgroundColor: "#fff",
                progressBarBorder: "1px solid #856d66 ",
                progressBarBorderRadius: "0px",
                tileBorderColor: "#856d66",
                tileBorderThickness: "1px",
                tileDescriptionFontSize: "15px",
                tilePercentageTextColor: "#856d66 ",
                tilePercentageFontWeight: "normal",
                tilePercentageTextAlign: "right",
                progressBarColors: [
                  {color: "#856d66", offset: "100%"},
                ],
                tileBorderRadius: "0",
                fundingTextFontWeight: "normal",
                showLogo: true,
                headerTextMargin: "10px 0px 0px 0px",
                headerText: "1% of your purchase is going to a nonprofit you choose",
                headerTextFontWeight: "normal",
                headerTextFontColor: "#856d66",
                poweredByTextColor: "#856d66 ",
                poweredByFontSize: "10px",
                headerTextFontSize: "15px",
                headerBeamLogoMargin: "0px 0px 0px 4px",
                headerPartnerLogoMargin: "0px 4px 0px",
                tileCauseFontSize: "13px",
                progressBarWidth: "80%",
                tilePercentageFontSize: "13px",
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