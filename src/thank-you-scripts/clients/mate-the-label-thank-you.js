import * as App from 'widgets';

window.execThankYouScript = function execThankYouScript(cartTotalString, beamUserId,
                                                        orderId, customerId, customerFirstName,
                                                        customerLastName, customerEmail, customerPhone,
                                                        customerZipCode, customerCountryCode) {
  const beam_web_sdk_base_url = 'https://blndco.sdk.beamimpact.com';
  const beam_widget_id = '1832a94575704edfa1168a95309b2f3f';
  const beam_store_id = '39';
  const beam_carbon_widget_id = '4d345970a3f34582b08cace757af45bd';
  const beam_carbon_store_id = '40';
  const shop_name = 'MATE';
  const shop_domain = 'mate-vintage-2.myshopify.com';
  const key = 'user';

  let found = false;
  const BEAM_TEST = false;
  const thankYouContainer = document.querySelector("[data-step='thank_you']");


  let beamCoopObserver = new MutationObserver(function (mutations) {
    const beamCoopContainer = document.querySelector("#coopcommerce");
    if (beamCoopContainer && !document.querySelector("#beam-widget-header")) {
      beamCoopObserver.disconnect();
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
      if (!BEAM_TEST || customerEmail.includes("@beamimpact.com") || customerEmail.includes("@matethelabel.com")) {
        beamCoopContainer.parentNode.insertBefore(beamContentBox, beamCoopContainer)
        //node.prepend(beamContentBox);
        executeBeamWidget();
        found = true;
      }
    }
  });

  beamCoopObserver.observe(document, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
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

    const carbonWidgetId = "{{ beam_carbon_widget_id }}";
    const carbonStoreId = "{{ beam_carbon_store_id }}";
    const carbonContainerId = "beam-carbon-widget-wrapper";

    const nonprofitKey = `beam_nonprofit_key_${widgetId}`;

    const widgetHeader = document.querySelector("#beam-widget-header");
    const widgetWrapper = document.querySelector("#beam-widget-wrapper");
    const carbonWidgetWrapper = document.querySelector("#beam-carbon-widget-wrapper");

    const cartTotal = parseFloat(stripHtml(cartTotalString).replace("$", ""));

    const transactionId = window.localStorage.getItem(transactionKey);
    let postTransactionBody = {
      order_id: orderId,
      cart_total: cartTotal,
      transaction_id: transactionId || null,
      customer_beam_user: beamUser || null,
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
    }
    let transaction_id = transactionId;
    let carbon_transaction_id = null;
    let carbon_beam_user = null;


    let carbonOffsetCartTotal = 0;
    let carbonAvoidanceCartTotal = 0;
    let carbonNonprofit = null;
    let carbonUser = null;

    // {%
    //   for item in checkout.line_items %}
    // beamCarbonproductTags = "{{ item.product.tags | join: ", " }}".split(",")
    // beamCarbonproductTags.forEach(tag => {
    //   if (tag.includes("carbon-")) {
    //     carbonOffsetCartTotal += parseFloat(tag.split("-")[1])
    //   } else if (tag.includes("reduced-")) {
    //     carbonAvoidanceCartTotal += parseFloat(tag.split("-")[1])
    //   }
    // })
    // {%
    //   endfor %
    // }

    carbonOffsetCartTotal = carbonOffsetCartTotal.toFixed(2)
    carbonAvoidanceCartTotal = carbonAvoidanceCartTotal.toFixed(2)

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


      const mobileContainerWidth = document.getElementById(carbonContainerId).clientWidth;

      return new beamApps.ImpactOverviewWidget({
        containerId: "beam-widget-wrapper",
        widgetId: widgetId,
        communityImpactUrl: "https://matethelabel.com/pages/community-impact",
        loadingScreenContent: content,
        maxContainerWidth: 500,
        hidePoweredBy: false,
        isMobile: true,
        themeConfig: {
          textColor: "#000",
          fontFamily: "VisbyCF-Medium",
          personalImpactTextColor: "#000",
          communityImpactTextColor: "#000",
          headerTextTranform: "uppercase",
          showPurchaseMessage: true,
          tileBorderRadius: "0px",
          overlayCornerRadius: "0px",
          linkMargin: "10px 0px",
          mobileMaxWidth: `${mobileContainerWidth || 400}px`,
          purchaseMessageFontSize: "18px",
          hidePurchaseMessageChainName: true,
          purchaseMessageText: "<br/>Check out the impact your MATE purchase made below.",
          communityLinkText: "View the MATE community’s total impact",
          impactFontSize: "12px",//"15px",
          personalImpactBackgroundColor: "#F3EEE5",
          communityImpactBackgroundColor: "#F3EEE5",
          personalCardHeight: "300px",
          communityCardHeight: "300px",
          mobilePersonalHeaderMargin: "5px 0px 10px",
          mobileCommunityHeaderMargin: "5px 0px 10px",
          personalCardMargin: "5px 0px -5px",
          communityCardMargin: "5px 0px -5px",
          communityHeaderText: "The MATE Community's Impact",
          progressBarColors: [
            {color: "#68634B", offset: "100%"},
          ],
          progressBarHeight: "8px",
          goalCompletionTextColor: "#000",
          showPersonalImpactPercentage: false,
          underlineLink: true,
          useArrowInLinkText: true,
          linkFontWeight: "normal",
          progressBarBackgroundColor: "#F3EEE5",
          linkTextAlign: "left",
          linkTextColor: "#000",
          linkContainerMargin: "-3px 0px 0px",
          purchaseMessageTextColor: "#000",
          purchaseMessageFontSize: "14px",
          personalHeaderMargin: "0px 0px -3px 0px",
          communityHeaderMargin: "0px 0px -3px 10px",
          purchaseMessageMargin: "20px 0px 20px",
          headerTextFontColor: "#000",
          headerTextFontWeight: "normal",
          headerTextFlexAlign: "start",
          hideCommunityImpactLink: false,
          centerHeader: true,
          hideCommunityImpactBorder: false,
          tileCauseFontSize: "0.6rem",
          tileCauseLetterSpacing: "0",
          tileNameFontWeight: "normal",//"900",
          tileNameFontSize: "1.3rem",
          tileNameMargin: "17px 0px 0px 0px",
          tileBorderThickness: "0",
          impactFontWeight: "lighter",
          hidePoweredBy: false,
          tilePercentageFontSize: "small",
          communityCardPadding: "0px",
          personalCardPadding: "0px",
          progressBarBorder: "1px #68634B solid",
          progressBarBorderRadius: "7px",
          headerTextPadding: "25px 0 0 0",
          headerPartnerLogoMargin: "0px 4px 0px",
          headerBeamLogoMargin: "0px 0px 0px 2px",
          communityImpactPercentageColor: "#68634B", //"#68634B",
          purchaseMessageTextPadding: "25px 0px 10px",
          purchaseMessageTextAlign: "center",
          tilePercentageFontSize: "normal",
          tilePercentageFontWeight: "normal",
        },
      });
    }


    window
      .fetch(`${beam_web_sdk_base_url}/api/v1/shopify/transaction/post/`, {
        method: "POST",
        headers: {
          "Content-Type": contentType,
          "x-widget-id": widgetId,
          "x-shopify-shop-domain": shopDomain,
        },
        body: JSON.stringify(postTransactionBody),
      })
      .then(async (response) => {
        if (response.ok) {
          window.localStorage.removeItem(`beam_transaction_key_${widgetId}`);
          window.localStorage.removeItem(nonprofitKey);
          const responseData = await response.json();
          transaction_id = responseData.transaction_id;
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
                  await buildImpactOverviewWidget().render(responseData.user || beamUser);
                } else {
                  showLoadingContent(false);
                }
              }).catch((error) => {
                showLoadingContent(false);
              });
            }


            const nonprofitWidget = new beamApps.NonprofitWidget({
              widgetId: widgetId,
              containerId: containerId,
              renderAfterSelection: true,
              selectedNonprofitCallback: (nonprofit, store) => {
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
                fontFamily: "VisbyCF-Medium",
                backgroundColor: "#fff", //"#FC2091",
                tileTextColor: "#000",
                hidePoweredBy: false,
                selectedNonprofitBackgroundColor: "#D89B75", //"#FC2091",
                iconButtonBackgroundColor: "rgba(0,0,0,0)", //"rgba(0,0,0,0)",
                iconButtonBorder: "1px #68634B solid",
                selectedBorder: "1px #D89B75 solid", //"2px #68634B solid",
                progressBarBorder: "1px #68634B solid",
                progressBarBorderRadius: "7px",
                progressBarBackgroundColor: "rgba(0,0,0,0)",
                tileBorderColor: "#68634B",
                tileBorderThickness: "1px",
                progressBarColors: [
                  {color: "#68634B", offset: "100%"},
                ],
                tileBorderRadius: "0",
                tilePercentageTextAlign: "right",
                fundingTextFontWeight: "normal",
                showLogo: true,
                centerHeader: true,
                headerText: `Select a nonprofit and 1% of your purchase will be donated, at no extra cost`,
                headerTextMargin: "20px 0px 20px", //"0px auto",
                headerTextPadding: "15px 0px 0px", //"25px 0px 10px",
                headerTextAlign: "center",
                headerPartnerLogoMargin: "0px 4px 0px",
                headerBeamLogoMargin: "0px 0px 0px 2px",
                poweredByTextColor: "#000",
                tilePercentageFontSize: "small",
                tilePercentageFontWeight: "normal",
                progressBarWidth: "calc(100% - 75px)",
                tilePercentageWidth: "75px",
                //headerPartnerLogoMargin: "0 0 5px",
                //headerBeamLogoMargin: "0 0 5px",
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
          }
        } else {
        }
      })
      .catch((error) => console.error(error));
  }
}