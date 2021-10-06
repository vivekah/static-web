import * as App from 'widgets';

window.execThankYouScript = function execThankYouScript(cartTotalString, beamUserId,
                                                        orderId, customerId, customerFirstName,
                                                        customerLastName, customerEmail, customerPhone,
                                                        customerZipCode, customerCountryCode,
                                                        beamWebSdkBaseUrl, containerId, shopDomain,
                                                        shopName, widgetId, communityImpactUrl,
                                                        testMode = false,
                                                        promoCode = undefined) {
  addStylesheets();
  if (!testMode || havePermissionToSeeWidgets(customerEmail)) {
    insertBeamWidget();
  } else {
    console.error("You don't have permission to view this widget in test mode.")
  }


  async function executeBeamWidget() {
    const contentType = "application/json";
    const beamUser = `${beamUserId}`.trim();

    const widgetHeader = document.querySelector("#beam-widget-header");
    const widgetWrapper = document.querySelector("#beam-widget-wrapper");
    const cartTotal = parseFloat(stripHtml(cartTotalString).replace("$", ""));
    let promos = undefined;//await getShopifyPromotions(contentType, widgetId, shopDomain);
    let isPromoCodeValid = false;//!!promos.find((promo) => promo.shopify_promotion === promoCode);

    console.debug("cartTotal(raw):", cartTotalString);
    console.debug("cartTotal(refined):", cartTotal);

    const transactionKey = `beam_transaction_key_${widgetId}`;
    const transactionId = window.localStorage.getItem(transactionKey);
    const transactionBody = {
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
        cart_total: cartTotal,
        default_to_last_nonprofit: false,
      }
    };
    const transactionHeaders = {
      "Content-Type": contentType,
      "x-widget-id": widgetId,
      "x-shopify-shop-domain": shopDomain,
    };


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

    function buildImpactOverviewWidget(widgetId, content = "Getting your impact...", isPromoCodeValid, promoCode) {
      widgetWrapper.innerHTML = "";
      widgetHeader.style.display = "";
      return new beamApps.ImpactOverviewWidget({
        containerId: "beam-widget-wrapper",
        widgetId: widgetId,
        communityImpactUrl: "https://www.foriawellness.com/pages/about-foria",
        loadingScreenContent: content,
        maxContainerWidth: 500,
        hidePoweredBy: true,
        isMobile: true,
        themeConfig: {
          id: 'modern-ui-impact-overview',
          textColor: "#222633",
          progressBarColors: [
            {color: "#105e65", offset: "100%"},
          ],
          promoText: `Check out the impact your ${shopName} purchase made below.`,
          fontFamily: "Montserrat",
          headerTextTranform: "capitalize",
          showPurchaseMessage: true,
          tileBorderRadius: "0px",
          overlayCornerRadius: "0px",
          hidePurchaseMessageChainName: true,
          purchaseMessageText: "<br />Check out the impact your ${shopName} purchase made below.",
          impactFontSize: "14px",
          personalImpactBackgroundColor: "#fff",
          communityImpactBackgroundColor: "#fff",
          showPersonalImpactPercentage: true,
          showCommunityImpactPercentage: true,
          underlineLink: false,
          useArrowInLinkText: true,
          linkFontWeight: "normal",
          progressBarBackgroundColor: "#fff",
          linkTextAlign: "left",
          linkTextColor: "#105e65", //#dfdfdf
          purchaseMessageTextColor: "#222633",
          purchaseMessageFontSize: "15px",
          purchaseMessageMargin: "30px 0px 20px",
          headerTextColor: "#222633",
          headerTextFontWeight: "normal",
          hideCommunityImpactLink: false,
          hideCommunityImpactBorder: false,
          hidePersonalImpactBorder: false,
          tileCauseFontSize: "0.6rem",
          tileCauseLetterSpacing: "0",
          tileNameFontWeight: "normal",
          tileNameFontSize: "1.3rem",
          tileNameMargin: "12px 0px 0px 0px",
          tileBorderThickness: "1px",
          impactFontWeight: "normal",
          hidePoweredBy: false,
          communityCardPadding: "0px",
          personalCardPadding: "0px",
          headerPartnerLogoWidth: "120px",
          headerBeamLogoWidth: "70px",
          headerPartnerLogoMargin: "10px 10px 0px 0px",
          headerBeamLogoMargin: "0px 0px 0px 10px",
          communityImpactPercentageColor: "#999999",
          personalImpactPercentageColor: "#999999",
          tilePercentageTextColor: "#999999",
          progressBarWidth: "calc(100% - 35px)",
          tilePercentageWidth: "35px",
          tilePercentageTextAlign: "right",
          purchaseMessageTextAlign: "start",
          tilePercentageFontSize: "13px",
          tilePercentageFontWeight: "normal",
          purchaseMessagePadding: "0px",
          percentageFontWeight: "normal",
          linkContainerMargin: "5px 0px -10px 0px",
          impactDetailsBorder: "0px solid #999999",
          communityCardHeight: "300px",
          personalCardHeight: "300px",
          progressBarHeight: "6px",
          personalHeaderMargin: "10px 10px 10px 0px",
          communityHeaderMargin: "10px 0px 10px",
          promoText: `<span style="font-weight: normal; font-size: 14px; color: #222633;">You just made an impact for BEAM_NONPROFIT.</span><br/><span style="font-weight: normal; font-size: 14px; color: #999999;">Check out the impact your ${shopName} purchase made below.</span>`,
          personalCardContentMargin: "0 0 0 0",
          communityCardContentMargin: "0 0 0 0",
          personalImpactTextColor: "#999999",
          communityImpactTextColor: "#999999",
          progressBarBorderRadius: "5px",
          progressBarBorder: "1px #999999 solid",
        },
      });
    }

    function getStoreIdFromNonProfitsFilteredByZipCode(beamWebSdkBaseUrl, customerZipCode, widgetId, onGetProfitsComplete, transactionHeader, transactionBody) {
      let fetchNonprofitsXHR = new XMLHttpRequest();
      fetchNonprofitsXHR.onreadystatechange = function () {
        if (fetchNonprofitsXHR.readyState == 4 && fetchNonprofitsXHR.status == 200) {
          let res = JSON.parse(fetchNonprofitsXHR.responseText);
          let storeId = res.store.id;
          onGetProfitsComplete(beamWebSdkBaseUrl, storeId, widgetId, transactionHeader, transactionBody);
        }
      };

      fetchNonprofitsXHR.open("GET", `${beamWebSdkBaseUrl}/api/v1/nonprofits/?user=&postal_code=${customerZipCode}&country_code=&show_community_impact=true`, true);
      fetchNonprofitsXHR.setRequestHeader('x-widget-id', widgetId)
      fetchNonprofitsXHR.send();
    }

    function renderBeamWidget(beamWebSdkBaseUrl, storeId, widgetId, transactionHeader, transactionBody) {
      let selectionPromoText = null;

      let transactionBodyWithNewStoreId = Object.assign({}, transactionBody);
      transactionBodyWithNewStoreId.transaction_data.store = storeId;

      window
        .fetch(`${beamWebSdkBaseUrl}/api/v1/shopify/transaction/post/`, {
          method: "POST",
          headers: transactionHeader,
          body: JSON.stringify(transactionBodyWithNewStoreId),
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
            if (isPromoCodeValid) {
              selectionPromoText = `Select a nonprofit and 1% of your purchase will be donated there for you, at no extra cost  </br> + your donation will be boosted by 2x with code ${promoCode}!`;
            } else {
              selectionPromoText = `Select a nonprofit and 1% will be donated there for you, at no extra cost.`;
            }

            function showLoadingContent(enable = true) {
              const display = enable ? "none" : "";
              widgetWrapper.style.display = display;
              postTransactionButton.style.display = enable ? "" : "none";
              loadingContent.style.display = enable ? "" : "none";
            }

            loadingContent.innerHTML = ` ${
              currentNonprofit && currentStore && `
                    You just made an impact for ${currentNonprofit && currentNonprofit.name} with your Parade purchase!
                  `
            }`

            if (responseData.nonprofit) {
              showLoadingContent(false)
              await buildImpactOverviewWidget(widgetId, null, isPromoCodeValid, promoCode).render(responseData.user || beamUser);
            } else {

              function buildNonProfitWidget(widgetId, containerId, shopName) {
                const postTransactionButton = document.querySelector("#beam-post-transaction-button");
                return new beamApps.NonprofitWidget({
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
                    textColor: "#222633",
                    progressBarColors: [
                      {color: "#105e65", offset: "100%"},
                    ],
                    fontFamily: "Montserrat",
                    backgroundColor: "#fff", //"rgba(0,0,0,0)",
                    tileTextColor: "#222633",
                    hidePoweredBy: true,
                    nonprofitCornerRadius: "0px",
                    selectedNonprofitBackgroundColor: "#105e65", //
                    iconButtonBackgroundColor: "#fff", //"rgba(0,0,0,0)",
                    iconButtonBorder: "1.5px #105e65 solid",
                    selectedBorder: "1.5px solid #105e65 ", //
                    progressBarBackgroundColor: "#fff",
                    tileBorderColor: "#999999",
                    tileBorderThickness: "1px",
                    tilePercentageFontSize: "14px",
                    tileDescriptionFontSize: "normal",
                    tilePercentageTextColor: "#999999",
                    tilePercentageFontWeight: "normal",
                    tilePercentageTextAlign: "end",
                    fundingTextFontWeight: "normal",
                    showLogo: true,
                    headerTextMargin: "20px 0px 8px 0px",
                    headerText: `Select a nonprofit and 1% of your purchase will be donated, at <span style="text-decoration: underline; font-size: 14px; color: #222633;">no extra cost</span>`,
                    poweredByTextColor: "#999999",
                    poweredByFontSize: "11px",
                    tileCauseFontSize: "14px",
                    progressBarWidth: "80%",
                    tileCauseLetterSpacing: "0px",
                    headerPartnerLogoWidth: "120px",
                    headerBeamLogoWidth: "70px",
                    headerPartnerLogoMargin: "10px 10px 0px 5px",
                    headerBeamLogoMargin: "0px 0px 0px 10px",
                    tileBorderRadius: "0px",
                    progressBarHeight: "6px",
                    headerTextFontColor: "#222633",
                    headerTextFontSize: "normal",
                    progressBarBorderRadius: "5px",
                    headerTextFontWeight: "normal",
                    tileCauseFontWeight: "normal",
                    fundingNonprofitNameTextFontWeight: "normal",
                    fundingViaTextFontWeight: "normal",
                    progressBarBorder: "1px #999999 solid",
                  },
                });
              }

              function updateTransaction(e) {
                e.preventDefault()
                window.fetch(`${beamWebSdkBaseUrl}/api/v1/shopify/transaction/update/`, {
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

                    await buildImpactOverviewWidget(widgetId, null, isPromoCodeValid, promoCode).render(responseData.user || beamUser);
                  } else {
                    showLoadingContent(false);
                  }
                }).catch((error) => {
                  console.error(error);
                  showLoadingContent(false);
                });
              }

              const nonprofitWidget = buildNonProfitWidget(widgetId, containerId, shopName);

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
            console.error(response)
          }
        })
        .catch((error) => console.error(error));
    }

    getStoreIdFromNonProfitsFilteredByZipCode(beamWebSdkBaseUrl, customerZipCode, widgetId, renderBeamWidget, transactionHeaders, transactionBody);

  }

  function havePermissionToSeeWidgets(customerEmail) {
    const allowedEmailDomains = ['@beamimpact.com'];
    return allowedEmailDomains.find(allowedEmailDomain => customerEmail.indexOf(allowedEmailDomain) != -1)
  }

  function addStylesheets() {
    const viewPortMetaTag = document.querySelector("meta[name='viewport']");
    if (!viewPortMetaTag) {
      let meta = document.createElement('meta');
      meta.name = "viewport";
      meta.content = "width=device-width,initial-scale=1.0";
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
    const fontStyle = document.createElement("style");
    fontStyle.innerHTML = `
      @font-face {
          font-family: 'Helvetica Neue LT Std';
          src: url('https://d1jhb45gnbgj0c.cloudfront.net/fonts/HelveticaNeueLTStd-Roman.otf');
      }
      @font-face {
          font-family: 'Montserrat';
          src: url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
      }
      #beam-post-transaction-button {
         background-color: #105e65;
         color: #fff;
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
        border-radius: 0px;
        background-color: #000;
        color: #fff;
        transition: background-color 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
        padding: 1.6rem 1.4rem;
        min-width: 100px;
        font-style: normal;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: normal;
        font-size: normal;
        font-family: "Helvetica Neue", sans-serif;
      }
      .button:hover {
        color: #fff;
      }
    `;
    document.head.appendChild(fontStyle);
  }

  function getShopifyPromotions(contentType, widgetId, shopDomain) {
    return window.fetch(`${beamWebSdkBaseUrl}/api/v1/shopify/promo`, {
      method: "GET",
      headers: {
        "Content-Type": contentType,
        "x-widget-id": widgetId,
        "x-shopify-shop-domain": shopDomain
      }
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        console.debug("PROMO CODE: ", data);
        return data?.promos;
      }
    })
  }

  function insertBeamWidget() {
    const thankYouContainer = document.querySelector("[data-step='thank_you']");
    let found = false;
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
                                  <a href="#" id="beam-post-transaction-button" class="button" style="display: none; min-width: 155px;">SUBMIT</a>
                              </div>
                              <div id="beam-loading-content" style="display: none;"></div>
                          </div>`

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
  }
}
