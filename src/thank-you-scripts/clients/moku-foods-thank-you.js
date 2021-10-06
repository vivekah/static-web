import * as App from 'widgets';

window.execThankYouScript = function execThankYouScript(cartTotalString, beamUserId,
                                                        orderId, customerId, customerFirstName,
                                                        customerLastName, customerEmail, customerPhone,
                                                        customerZipCode, customerCountryCode) {
  const beam_web_sdk_base_url = 'https://ppc.sdk.beamimpact.com';
  const beam_widget_id = '1923996a74994564a880a1e4372cb86b';
  const beam_store_id = '32';
  const shop_name = 'Moku';
  const shop_domain = 'moku-foods.myshopify.com';

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
                              <div style="text-align: right;margin-top: 12px;">
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
        noAjax: true, // NICK CHANGE
        containerId: "beam-widget-wrapper",
        widgetId: widgetId,
        communityImpactUrl: "https://mokufoods.com/pages/about#community-impact",
        loadingScreenContent: content,
        maxContainerWidth: 500,
        hidePoweredBy: false,

        isMobile: true,
        themeConfig: {
          textColor: "#000",
          fontFamily: "brandon-grotesque, sans-serif",
          percentageTextColor: "rgb(28, 117, 97)",
          personalImpactTextColor: "#FFF",
          communityImpactTextColor: "#FFF",
          gradientColors: ["#fff"],
          headerTextTranform: "uppercase",
          showPurchaseMessage: true,
          tileBorderRadius: "10px",
          purchaseMessageFontSize: "18px",
          hidePurchaseMessageChainName: true,
          purchaseMessageText: "Check out the impact your Moku purchase made below.",
          impactFontSize: "15px",
          personalImpactBackgroundColor: "rgb(109, 194, 173)",
          communityImpactBackgroundColor: "rgb(109, 194, 173)",
          progressBarColors: [
            {color: "#1C7561", offset: "100%"},
          ],
          showPersonalImpactPercentage: false,
          communityImpactPercentageColor: "#FFF",
          underlineLink: true,
          useArrowInLinkText: true,
          linkFontWeight: "normal",
          progressBarBackgroundColor: "rgb(142, 209, 192)",
          progressBarBorder: "1px solid rgb(142, 209, 192)",
          linkTextAlign: "left",
          linkTextColor: "rgb(28, 117, 97)",
          purchaseMessageTextColor: "rgb(28, 117, 97)",
          purchaseMessageFontSize: "14px",
          purchaseMessageMargin: "5px 0px 35px",
          headerTextColor: "rgb(28, 117, 97)",
          headerTextFontWeight: "bold",
          headerTextFontSize: "14px",
          headerTextFlexAlign: "start",
          hideCommunityImpactLink: false,
          hideCommunityImpactBorder: false,
          tileCauseFontSize: "14px",
          tileCauseFontWeight: "900",
          tileCauseLetterSpacing: "0",
          tileNameFontWeight: "700",
          tileNameFontSize: "20px",//"1.3rem",
          tileNameMargin: "0",//"60px  0px 0px 0px",
          tileBorderThickness: "0",
          impactFontWeight: "400",
          impactLineHeight: "1",
          hidePoweredBy: false,
          tilePercentageFontSize: "small",
          overlayCornerRadius: "10px 10px 0 0",
          tileBorderRadius: "0px 0px 10px 10px",
          communityCardHeight: "303px",//"343px",//"321px",
          personalCardHeight: "303px",//"343px",
          communityCardPadding: "0px",
          personalCardPadding: "0px",
        },
      });
    }

    const transactionId = window.localStorage.getItem(transactionKey);

    // NICK CHANGE
    // This function modifies the data object of the impact widget, then renders the widget using the modified data.
    async function createImpactWidget(user, nonprofit) {
      const impactWidget = buildImpactOverviewWidget();
      // console.log('impact widget = ', impactWidget);
      impactWidget.data = {};
      const impactRes = await window.fetch(`https://ppc.sdk.beamimpact.com/api/v1/impact/all/?user=${user}&nonprofit=${nonprofit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-widget-id': widgetId
        }
      })
      const impactData = await impactRes.json();

      impactWidget.data.personal = impactData.personal
      impactWidget.data.chain = impactData.chain;
      impactWidget.data.community = impactData.community;
      await impactWidget.render(user)
    }

    // END NICK CHANGE

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
            // NICK CHANGE
            createImpactWidget(responseData.user || beamUser, responseData.nonprofit);
            //  await buildImpactOverviewWidget().render(responseData.user || beamUser);
            // END NICK CHANGE
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
                  // NICK CHANGE
                  createImpactWidget(responseData.user || beamUser, currentNonprofit.id);
                  // await buildImpactOverviewWidget().render(responseData.user || beamUser);
                  // END NICK CHANGE
                } else {
                  showLoadingContent(false);
                }
              }).catch((error) => {
                console.error(error);
                showLoadingContent(false);
              });
            }


            const nonprofitWidget = new beamApps.NonprofitWidget({
              noAjax: true, // NICK CHANGE
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
                textColor: "rgb(28, 117, 97)",
                fontFamily: "brandon-grotesque, sans-serif",
                hidePoweredBy: true,
                gradientColors: ["rgb(109, 201, 177)"],
                progressBarColors: [
                  {color: "rgb(28, 117, 97)", offset: "100%"},
                ],
                progressBarWidth: "88%",
                tileMargin: "0",
                selectedTileImageTopPosition: "0",
                selectedTileBorderRadius: "0px",
                nonprofitCornerRadius: "10px",
                selectedTileDescriptionFontSize: "1px",
                enforceMobileListViewSelection: true,
                tileCauseFontWeight: "700",
                tileTextColor: "#FFFFFF",
                tileCauseFontSize: "14px",
                tileCauseTextTransform: "capitalize",
                tileOverlayBackground: "rgba(0, 0, 0, 0.05)",
                tileNameFontWeight: "700",
                tileNameFontSize: "14px",
                tileBorderColor: "#7BC8B6",
                backgroundColor: "#7BC8B6",
                tileCauseLetterSpacing: "0",
                tileDescriptionFontSize: "14px",
                tilePercentageFontSize: "12px",
                tilePercentageWidth: "18%",
                tilePercentageFontWeight: "400",
                headerText: "Choose a nonprofit and 1% of your purchase will be donated there for you.",
                headerTextFontSize: "14px",
                headTextFontWeight: "700",
                headTextFontStyle: "normal",
                headerTextFontColor: "#227461",
                headerTextFontFamily: "brandon-grotesque, sans-serif",
                progressBarBackgroundColor: "rgba(255, 255, 255, 0)",
                progressBarBorder: "1px solid rgb(28, 117, 97)",
                selectedBorder: "none",
                selectionMessageFontSize: "14px",
                selectionMessageFontWeight: "700",
                selectionMessageFontStyle: "normal",
                iconButtonBorder: "1px solid #7BC8B6",
                showLogo: true,
                showImage: false,
                selectionMessageFontFamily: "brandon-grotesque, sans-serif",
                tileBorderRadius: "10px",
                overlayCornerRadius: "10px 0 0",
                poweredByTextColor: "#FFFFFF",
                iconButtonBackgroundColor: "#7BC8B6",
                selectedNonprofitBackgroundColor: "#227461",
                fundingTextFontWeight: "400",

              },
            });
            // NICK CHANGE
            const nonprofitDataReq = await window.fetch(`https://ppc.sdk.beamimpact.com/api/v1/nonprofits/?store=${storeId}&cartTotal=${cartTotal}&postalCode=${customerZipCode}&countryCode=${customerCountryCode}&show_community_impact=true`, {
              headers: {
                'Content-Type': 'application/json',
                'x-widget-id': widgetId
              }
            })
            const nonprofitData = await nonprofitDataReq.json()
            nonprofitWidget.data = nonprofitData;
            // END NICK CHANGE

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
