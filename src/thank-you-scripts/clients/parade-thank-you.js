import * as App from 'widgets';

const PARADE_BEAM_ID_FOR_ALL_PROMO_CODES = "1";
window.execThankYouScript = function execThankYouScript(cartTotalString, beamUserId,
                                                        orderId, customerId, customerFirstName,
                                                        customerLastName, customerEmail, customerPhone,
                                                        customerZipCode, customerCountryCode,
                                                        beamWebSdkBaseUrl, containerId, shopDomain,
                                                        shopName, widgetId, communityImpactUrl,
                                                        loadBeforeCoopCommerce = true, promoCode
) {
  addStylesheets();
  if (loadBeforeCoopCommerce) {
    insertBeamWidgetBeforeBoopCoop();
  } else {
    insertBeamWidget();
  }


  async function executeBeamWidget() {
    const contentType = "application/json";
    const beamUser = `${beamUserId}`.trim();

    const widgetHeader = document.querySelector("#beam-widget-header");
    const widgetWrapper = document.querySelector("#beam-widget-wrapper");
    const cartTotal = parseFloat(stripHtml(cartTotalString).replace("$", ""));
    let promos = await getShopifyPromotions(contentType, widgetId, shopDomain);
    let isPromoCodeValid = !!promos.find((promo) => promo.shopify_promotion === promoCode);

    console.debug("isPromoCodeValid", isPromoCodeValid);
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
        shopify_promo: isPromoCodeValid ? PARADE_BEAM_ID_FOR_ALL_PROMO_CODES : null
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
        communityImpactUrl: communityImpactUrl,
        loadingScreenContent: content,
        maxContainerWidth: 500,
        hidePoweredBy: true,
        isMobile: true,
        themeConfig: {
          id: "modern-ui-impact-overview",
          promoCode: isPromoCodeValid ? promoCode : null,
          textColor: "#000",
          fontFamily: "Circular XX",
          personalHeaderText: "Your Impact",
          communityHeaderText: "The Parade Community's Impact",
          personalCardWidth: "100%",
          communityCardWidth: "100%",
          desktopContainerMargin: '10px',
          personalImpactTextColor: "#000",
          communityImpactTextColor: "#000",
          headerTextTranform: "capitalize",
          // personalCardMargin: "auto 10px auto auto",
          showPurchaseMessage: true,
          tileBorderRadius: "0px",
          overlayCornerRadius: "0px",
          mobileLinkContainerMargin: "10px 5px 0px 0px",
          hidePurchaseMessageChainName: true,
          purchaseMessageFontFamily: '"Circular XX"',
          promoTextFontFamily: '"Circular XX Bold"',
          promoTextFontWeight: "bold",
          promoTextFontSize: "18px",
          purchaseMessageFontWeight: "14px",
          purchaseMessageMargin: "-20px 0 0 0",
          purchaseMessageText: "<br />Check out the impact your Parade purchase made below.",
          promoText: `You just made an impact for BEAM_NONPROFIT.`,
          separateImpactTitles: true,
          personalHeaderFontFamily: '"Circular XX Bold"',
          communityHeaderFontFamily: '"Circular XX Bold"',
          headerTextFontSize: "14px",
          impactFontSize: "12px",
          communityHeaderMargin: "10px 10px 10px 0px",
          personalImpactBackgroundColor: "#fff",
          communityImpactBackgroundColor: "#fff",
          progressBarColors: [
            {color: "#ea1921", offset: "100%"},
          ],
          goalCompletionTextColor: "#d3d3d3",
          showPersonalImpactPercentage: true,
          showCommunityImpactPercentage: true,
          underlineLink: false,
          useArrowInLinkText: true,
          linkFontWeight: "normal",
          progressBarBackgroundColor: "rgba(0, 0, 0, 0)",
          linkTextAlign: "left",
          linkTextColor: "#497cff",
          purchaseMessageTextColor: "#000",
          promoTextContainerMargin: "10px 0px 20px",
          // promoTextMargin: "30px 0px 20px",
          headerTextColor: "#000",
          headerTextFontWeight: "bold",
          hideCommunityImpactLink: true,
          hideCommunityImpactBorder: true,
          hidePersonalImpactBorder: true,
          tileCauseFontSize: "0.6rem",
          tileCauseLetterSpacing: "0",
          tileNameFontSize: "1.3rem",
          tileNameMargin: "12px 0px 0px 0px",
          tileBorderThickness: "0",
          impactFontWeight: "normal",
          hidePoweredBy: false,
          communityCardPadding: "0px",
          personalCardPadding: "0px",
          progressBarBorder: "1px solid #D0D0D0",
          headerPartnerLogoMargin: "0px 10px 0px 0px",
          headerPartnerLogoWidth: "60px",
          headerBeamLogoWidth: "60px",
          headerBeamLogoMargin: "0px 0px 0px 10px", //"0px 0px 30px 2px",
          progressBarWidth: "100%",
          tilePercentageWidth: "50px",
          tilePercentageTextAlign: "right",
          purchaseMessageTextAlign: "start",
          purchaseMessagePadding: "0px",
          percentageFontWeight: "normal",
          linkContainerMargin: "0px 0px -10px 0px",
          personalHeaderMargin: "10px 10px 10px 0px",
          tileCardHeight: "auto",
          personalCardContentMargin: "0px",
          communityImpactWrapper: "0px",
          personalImpactPercentageColor: "#C0C0C0",
          tilePercentageTextColor: "#C0C0C0",
          tilePercentageFontWeight: "bold",
          tilePercentageFontSize: "12px",
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
                    id: "modern-ui-nonprofit",
                    fontFamily: "Circular XX",
                    headerPartnerLogoMargin: "0px 10px 0px",
                    headerPartnerLogoWidth: "60px",
                    headerBeamLogoWidth: "60px",
                    headerBeamLogoMargin: "0px 0px 0px 10px",
                    headerText: (selectionPromoText ? selectionPromoText : ""),
                    headerTextStyle: {
                      fontSize: '18px',
                      fontWeight: '900',
                      width: '75%',
                      fontFamily: 'Circular XX Bold',
                    },
                    headerTextMobileStyle: {
                      margin: "10px 0px"
                    },

                    showLogo: true,
                    gradientColors: ["#DC2700", "#DC2700"],
                    borderWithGradientStyle: {
                      border: "3px"
                    },
                    showProgress: true,
                    maxContainerWidth: 500,
                    description: {
                      style: {
                        fontFamily: '"Circular XX", sans-serif',
                        fontSize: "12px",
                        fontWeight: "400",
                      },
                      wrapperStyle: {}
                    },
                    cause: {
                      style: {
                        display: 'none'
                      },
                      wrapperStyle: {
                        marginTop: "auto"
                      }
                    },
                    card: {
                      hoverStyle: {backgroundColor: "#efefef", border: "0px"},
                      style: {
                        background: "#ffff",
                      },
                      mobileStyle: {maxWidth: "340px", margin: "auto"},
                      backgroundMobileStyle: {maxWidth: "356px", margin: "5px auto"},
                      textWrapperStyle: {},

                    },
                    image: {
                      style: {
                        height: 'auto'
                      }
                    },
                    displayThankYouMessageForSelectingNonProfit: false,
                    cardTitle: {
                      textStyle: {
                        fontFamily: '"Circular XX", sans-serif',
                        fontSize: "15px",
                        fontWeight: "900",
                        marginTop: "5px"
                      },
                      wrapperStyle: {},
                    },
                    checkbox: {
                      style: {},
                      wrapperStyle: {}
                    },
                    progressBar: {
                      wrapperStyle: {
                        paddingTop: "3px",
                        marginTop: "0px",
                        color: '#ffff',
                        fontFamily: "Circular XX",
                      },
                      style: {
                        backgroundColor: '#ffffff',
                      },
                      textStyle: {},
                    },
                    progressBarColors: [{color: "red", offset: "0%"}],
                    headerLogoContainerWidth: "40%"
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
    const allowedEmailDomains = ['@beamimpact.com', '@yourparade.com'];
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
                font-family: 'Circular XX';
                src: url('https://cdn.shopify.com/s/files/1/0158/6495/4928/files/CircularXX-Book.woff2?v=1619716622') format("woff2");
          }
         @font-face {
                font-family: 'Circular XX Bold';
                src: url('https://cdn.shopify.com/s/files/1/0158/6495/4928/files/CircularXX-Bold.woff2?v=1619716622') format("woff2");
          }

        #beam-logo-header {
            display: flex;
            align-items: center;
        }
        #beam-post-transaction-button {
           background-color: #ff2a00;
           color: #fff;
         }
         #beam-widget-content-box{
         display: flex; 
          flex-direction: row;
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
          border-radius: 5px;
          background-color: #000;
          color: #fff;
          transition: background-color 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
          padding: 1.3rem 1.4rem;
          font-style: normal;
          {#text-transform: uppercase;#}
          letter-spacing: 1px;
          font-weight: bold;
          font-family: "Circular XX", sans-serif;
          position: absolute;
          right: 20px;
          top: 70px;
          height: 0px;
          font-size: 14px;
          width:60px;
        }
        .button:hover {
          color: #fff;
        }
        
        @media (max-width: 750px) {
           #beam-post-transaction-button, .button{
            position: initial;
            display: block;
            width: auto;
            margin: 10px auto auto auto;
          }
        }
    `;
    document.head.appendChild(fontStyle);
  }

  function insertBeamWidgetBeforeBoopCoop() {
    let found = false;

    let beamCoopObserver = new MutationObserver(function (mutations) {
      const beamCoopContainer = document.querySelector("#coopcommerce");
      const beamHeader = document.querySelector("#beam-widget-header");

      if (beamCoopContainer && !beamHeader) {

        beamCoopObserver.disconnect();
        const beamContentBox = document.createElement("div");
        beamContentBox.className = "content-box";
        beamContentBox.innerHTML = `
                <div class="content-box__row">
                    <span id="beam-widget-header" style="display: none;">
                    </span>
                    <div id="beam-widget-wrapper"></div>
                  
                    <a href="#" id="beam-post-transaction-button" class="button" style="display: none;">Submit</a>
                    
                    <div id="beam-loading-content" style="display: none;"></div>
                    <div id="beam-carbon-widget-wrapper"></div>
                </div>
            `
        beamCoopContainer.parentNode.insertBefore(beamContentBox, beamCoopContainer)
        executeBeamWidget();
        found = true;
      }
    });

    beamCoopObserver.observe(document, {
      attributes: false,
      childList: true,
      characterData: false,
      subtree: true
    });
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
          <div class="row">
                <div class="col-sm-8">
                          <div class="content-box__row" id="beam-widget-content-box">
                             <span id="beam-widget-header" style="display: none;">

                              </span>
                              <div style="text-align: right;margin-top: 10px;">
                                <a href="#" id="beam-post-transaction-button" class="button" style="display: none;">Confirm</a>
                              </div>
                              <div id="beam-widget-wrapper"></div>

                              <div id="beam-loading-content" style="display: none;"></div>
                            </div>
                          </div>
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
