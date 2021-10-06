import * as App from 'widgets';

window.execThankYouScript = function execThankYouScript(cartTotalString, beamUserId,
                                                        orderId, customerId, customerFirstName,
                                                        customerLastName, customerEmail, customerPhone,
                                                        customerZipCode, customerCountryCode) {
  const beam_web_sdk_base_url = 'https://ppc.sdk.beamimpact.com';
  const beam_widget_id = 'e2fc13db54224f77b81c4ffabf06233c';
  const beam_store_id = '42';
  const shop_name = 'American Provenance';
  const shop_domain = 'american-provenance.myshopify.com';
  const key = 'user';

  let found = false;
  const BEAM_TEST = false;
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


    let userMatch = false;
    let userMatchAmount = 0.00;
    // {%
    //   for item in checkout.line_items %}
    // if ("{{ item.product.tags }}".includes("beam-match")) {
    //   userMatch = true
    //   userMatchAmount = parseFloat("{{ item.final_price }}")
    //   cartTotal -= userMatchAmount
    // }
    // {%
    //   endfor %
    // }

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
        noAjax: true,
        containerId: "beam-widget-wrapper",
        widgetId: widgetId,
        communityImpactUrl: "https://americanprovenance.com/pages/commitmenttocommunity",
        loadingScreenContent: content,
        maxContainerWidth: 500,
        hidePoweredBy: true,
        isMobile: true,
        themeConfig: {
          textColor: "#000",
          fontFamily: "Montserrat",
          personalImpactTextColor: "#fff",
          communityImpactTextColor: "#fff",
          headerTextTranform: "uppercase",
          showPurchaseMessage: true,
          tileBorderRadius: "0px",
          overlayCornerRadius: "0px",
          // purchaseMessageFontSize: "18px",
          hidePurchaseMessageChainName: true,
          purchaseMessageText: "<br/>Check out the impact your American Provenance purchase made below.",
          impactFontSize: "14px",
          personalImpactBackgroundColor: "#15294A",
          communityImpactBackgroundColor: "#15294A",
          personalHeaderMargin: "0px 0px 7px",
          communityHeaderMargin: "0px 0px 7px",
          progressBarColors: [
            {color: "#fff", offset: "100%"},
          ],
          showPersonalImpactPercentage: false,
          underlineLink: true,
          useArrowInLinkText: true,
          linkFontWeight: "normal",
          progressBarBackgroundColor: "rgba(255, 255, 255, 0.3)",
          linkTextAlign: "left",
          linkTextColor: "#15294A",
          purchaseMessageTextColor: "#15294A",
          purchaseMessageFontSize: "14px",
          purchaseMessageMargin: "20px 0px 20px",
          headerTextColor: "#15294A",
          headerTextFontWeight: "normal",
          hideCommunityImpactLink: false,
          hideCommunityImpactBorder: false,
          tileCauseFontSize: "0.9rem",
          tileCauseLetterSpacing: "0",
          tileNameFontWeight: "normal",//"900",
          tileNameFontSize: "14px",
          tileNameMargin: "12px 0px 0px 0px",
          tileBorderThickness: "0",
          impactFontWeight: "lighter",
          hidePoweredBy: false,
          communityCardPadding: "0px",
          personalCardPadding: "0px",
          progressBarBorder: "1px #15294A solid",
          headerPartnerLogoMargin: "0px 4px 0px",
          headerBeamLogoMargin: "0px 0px 0px 4px",
          communityImpactPercentageColor: "#fff", //"#68634B",
          purchaseMessageTextAlign: "start",
          tilePercentageFontSize: "14px",
          tilePercentageFontWeight: "normal",
          tileNameFontWeight: "bold",
          tileNameFontSize: "20px",
          purchaseMessagePadding: "0px",
          percentageFontWeight: "lighter",
          linkContainerMargin: "-10px 0px -10px 0px",
          headerTextFlexAlign: "top",
          communityHeaderMargin: "0px 0px -2px 10px", //"0px 0px -10px 0px",
        },
      });
    }

    const transactionId = window.localStorage.getItem(transactionKey);

    // NICK CHANGE
    // This function modifies the data object of the impact widget that is created on page load, then renders the widget using the modified data.
    async function createImpactWidget(user, nonprofit) {
      const impactWidget = buildImpactOverviewWidget();
      // console.log('impact widget = ', impactWidget);
      impactWidget.data = {};
      const impactRes = await window.fetch(`https://ppc.sdk.beamimpact.com/api/v1/impact/all/?user=${user}&nonprofit=${nonprofit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-widget-id': 'e2fc13db54224f77b81c4ffabf06233c'
        }
      })
      const impactData = await impactRes.json();
      // console.log('personal impact = ', impactData);
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
            user_did_match: userMatch,
            user_match_amount: userMatchAmount
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
                      You just made an impact for ${currentNonprofit && currentNonprofit.name} with your American Provenance purchase!
                    `
          }`
          // NICK CHANGE
          //  responseData.nonprofit = false; // set this to false to force the nonprofit widget to render
          // END NICK CHANGE
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
              e.preventDefault();
              // NICK CHANGE
              //  return createImpactWidget();
              // END NICK CHANGE
              window.fetch(`${beam_web_sdk_base_url}/api/v1/shopify/transaction/update/`, {
                method: "POST",
                headers: {
                  "Content-Type": contentType,
                  "x-widget-id": widgetId,
                  "x-shopify-shop-domain": shopDomain
                },
                body: JSON.stringify({
                  transaction_id: transaction_id || transactionId,
                  nonprofit: currentNonprofit.id
                })
              }).then(async (response) => {
                if (response.ok) {
                  const data = await response.json();
                  widgetWrapper.innerHTML = "";
                  showLoadingContent(false);
                  console.debug(data);
                  // NICK CHANGE
                  // console.log('current nonprofit = ', currentNonprofit)
                  createImpactWidget(responseData.user || beamUser, currentNonprofit.id);
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
              noAjax: true,
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
                textColor: "#15294A",
                fontFamily: "Montserrat",
                backgroundColor: "rgba(0,0,0,0)", //"#FC2091",
                tileTextColor: "#15294A",
                hidePoweredBy: false,
                selectedNonprofitBackgroundColor: "#15294A", //"#FC2091",
                iconButtonBackgroundColor: "#F4F4F4", //"rgba(0,0,0,0)",
                iconButtonBorder: "1.5px #F4F4F4 solid",
                selectedBorder: "1.5px solid #000", //"2px #FC2091 solid",
                progressBarBorder: "1px #15294A solid",
                progressBarBackgroundColor: "rgba(0,0,0,0)",
                tileBorderColor: "#000",
                tileBorderThickness: "1.5px",
                tilePercentageFontSize: "normal",
                tilePercentageTextColor: "#505158",
                tilePercentageFontWeight: "normal",
                tilePercentageTextAlign: "end",
                progressBarColors: [
                  {color: "#15294A", offset: "100%"},
                ],
                tileBorderRadius: "0",
                fundingTextFontWeight: "normal",
                showLogo: true,
                headerTextMargin: "20px 0px 0px 0px",
                headerText: "1% of your purchase is going to a nonprofit of your choice"
              },
            });
            // NICK CHANGE
            const nonprofitDataReq = await window.fetch(`https://ppc.sdk.beamimpact.com/api/v1/nonprofits/?store=${storeId}&cartTotal=${cartTotal}&postalCode=${customerZipCode}&countryCode=${customerCountryCode}&showCommunityImpact=${true}`, {
              headers: {
                'Content-Type': 'application/json',
                'x-widget-id': 'e2fc13db54224f77b81c4ffabf06233c'
              }
            })
            const nonprofitData = await nonprofitDataReq.json()
            // console.log('nonprofit data = ', nonprofitData);
            nonprofitWidget.data = nonprofitData;
            // console.log('nonprofit widget = ', nonprofitWidget);
            // END NICK CHANGE

            await nonprofitWidget.render({
              store: storeId,
              cartTotal: cartTotal,
              postalCode: customerZipCode,
              countryCode: customerCountryCode,
              showCommunityImpact: true
            });
            // NICK CHANGE

            // END CHANGE
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