import * as App from 'widgets';

window.execThankYouScript = function execThankYouScript(cartTotalString, beamUserId,
                                                        orderId, customerId, customerFirstName,
                                                        customerLastName, customerEmail, customerPhone,
                                                        customerZipCode, customerCountryCode,
                                                        beamWebSdkBaseUrl, containerId,
                                                        shopDomain,
                                                        shopName, widgetId, communityImpactUrl,
                                                        loadBeforeCoopCommerce = true, promoCode, callback = () => {
  }
) {

  console.log(" execThankYouScript FOR ROOTS")
  addStylesheets();
  let beamNonprofitData = null;
  if (loadBeforeCoopCommerce) {
    insertBeamWidgetBeforeBoopCoop();
  } else {
    insertBeamWidget();
  }


  async function executeBeamWidget() {
    const contentType = "application/json";
    const beamUser = `${beamUserId}`.trim();
    const fontFamilyRoots = 'Centra No1 Bold';
    const fontFamilyRootsRegular = 'Centra No1';
    const beamContainerId = 'internal-beam-widget-wrapper';

    const widgetHeader = document.querySelector("#beam-widget-header");
    const widgetWrapper = document.querySelector("#" + beamContainerId);
    const cartTotal = parseFloat(stripHtml(cartTotalString).replace("$", ""));
    // let promos = await getShopifyPromotions(contentType, widgetId, shopDomain);
    let isPromoCodeValid = false;// !!promos.find((promo) => promo.shopify_promotion === promoCode);

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
        default_to_last_nonprofit: false
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

    async function buildImpactOverviewWidget(widgetId, content = "Getting your impact...", isPromoCodeValid, promoCode, user) {
      widgetWrapper.innerHTML = "";
      widgetHeader.style.display = "";
      let impactWidget = new beamApps.ImpactOverviewWidget({
        containerId: beamContainerId,
        widgetId: widgetId,
        communityImpactUrl: communityImpactUrl,
        loadingScreenContent: content,
        maxContainerWidth: 500,
        hidePoweredBy: true,
        isMobile: true,
        noAjax: true,
        themeConfig: {
          id: "modern-ui-impact-overview",
          promoCode: isPromoCodeValid ? promoCode : null,
          textColor: "#000",
          // fontFamily: fontFamilyRoots,
          logoWrapper: {
            style: {
              height: 'auto',
              display: 'block !important',
              flexFlow: 'unset !important'
            }
          },
          personalHeaderText: "YOUR PERSONAL IMPACT",
          communityHeaderText: "THE ROOTS COMMUNITY'S IMPACT",
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
          purchaseMessageFontFamily: fontFamilyRootsRegular,
          promoTextFontFamily: fontFamilyRoots,
          promoTextFontWeight: "bold",
          promoTextFontSize: "18px",
          purchaseMessageFontWeight: "14px",
          purchaseMessageMargin: "-20px 0 0 0",
          purchaseMessageText: "<br />Check out the impact your Roots purchase made below.",
          promoText: `You just made an impact for BEAM_NONPROFIT.`,
          separateImpactTitles: true,
          personalHeaderFontFamily: fontFamilyRoots,
          communityHeaderFontFamily: fontFamilyRoots,
          link: {
            style: {
              fontFamily: fontFamilyRootsRegular
            }
          },
          progressBartext: {
            style: {
              fontFamily: fontFamilyRootsRegular,
              fontWeight: 'normal'
            }
          },
          impact: {
            style: {
              fontFamily: fontFamilyRootsRegular
            }
          },
          headerTextFontSize: "12px",
          impactFontSize: "12px",
          communityHeaderMargin: "10px 10px 10px 0px",
          personalImpactBackgroundColor: "#fff",
          communityImpactBackgroundColor: "#fff",
          progressBarColors: [
            {color: "#2B5134", offset: "0%"},
          ],
          goalCompletionTextColor: "#d3d3d3",
          showPersonalImpactPercentage: true,
          showCommunityImpactPercentage: true,
          underlineLink: false,
          useArrowInLinkText: true,
          linkFontWeight: "normal",
          progressBarBackgroundColor: "rgba(0, 0, 0, 0)",
          linkTextAlign: "left",
          purchaseMessageTextColor: "#000",
          promoTextContainerMargin: "10px 0px 20px",
          // promoTextMargin: "30px 0px 20px",
          headerTextColor: "#000",
          headerTextFontWeight: "normal",
          hideCommunityImpactLink: false,
          linkTextColor: "#178E4E",
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
          personalImpactPercentageColor: "#485751",
          tilePercentageTextColor: "#485751",
          tilePercentageFontWeight: "bold",
          tilePercentageFontSize: "10px",
          linkTextFontSize: '11px',
          progressBarBorderRadius: '0px',
          progressBarHeight: '6px'
        },
      });

      const impactData = await getImpactData(user);
      impactWidget.data = {};
      impactWidget.data.personal = impactData.personal;
      impactWidget.data.chain = impactData.chain;
      impactWidget.data.community = impactData.community;
      return impactWidget;
    }

    async function getImpactData(user) {
      const response = makeApiRequest(`${beamWebSdkBaseUrl}/api/v1/impact/all/?user=${user}&nonprofit=`, {
        'Content-Type': 'application/json', 'x-widget-id': widgetId
      }, null, "GET")
      const impact = response;
      return impact;
    }

    function getStoreIdFromNonProfitsFilteredByZipCode(beamWebSdkBaseUrl, customerZipCode, widgetId, onGetProfitsComplete, transactionHeader, transactionBody) {
      let fetchNonprofitsXHR = new XMLHttpRequest();
      fetchNonprofitsXHR.onreadystatechange = function () {
        if (fetchNonprofitsXHR.readyState !== 4) return;

        if (fetchNonprofitsXHR.status == 200) {
          let res = JSON.parse(fetchNonprofitsXHR.responseText);
          let storeId = res.store.id;
          beamNonprofitData = res;
          onGetProfitsComplete(beamWebSdkBaseUrl, storeId, widgetId, transactionHeader, transactionBody);
        }
      };

      fetchNonprofitsXHR.open("GET", `${beamWebSdkBaseUrl}/api/v1/nonprofits/?user=&postal_code=${customerZipCode}&country_code=&show_community_impact=true`, true);
      fetchNonprofitsXHR.setRequestHeader('x-widget-id', widgetId)
      fetchNonprofitsXHR.send();
    }

    function makeApiRequest(url, transactionHeader, transactionBody, requestType = "POST") {
      let persistTransactionRequest = new XMLHttpRequest();

      return new Promise(function (resolve, reject) {
        persistTransactionRequest.onreadystatechange = async function () {
          if (persistTransactionRequest.readyState !== 4) return;

          if (persistTransactionRequest.status >= 200 && persistTransactionRequest.status < 300) {
            let response = JSON.parse(persistTransactionRequest.responseText);
            resolve(response);
          } else {
            reject({
              status: persistTransactionRequest.status,
              statusText: persistTransactionRequest.statusText
            });
          }
        }
        persistTransactionRequest.onerror = function () {
          reject({
            status: this.status,
            statusText: persistTransactionRequest.statusText
          });
        };

        persistTransactionRequest.open(requestType, url, true);
        Object.keys(transactionHeader).forEach(key => persistTransactionRequest.setRequestHeader(key, transactionHeader[key]))
        let body = transactionBody ? JSON.stringify(transactionBody) : undefined;
        persistTransactionRequest.send(body);
      });
    }

    function renderBeamWidget(beamWebSdkBaseUrl, storeId, widgetId, transactionHeader, transactionBody) {
      let selectionPromoText = null;

      let transactionBodyWithNewStoreId = Object.assign({}, transactionBody);
      transactionBodyWithNewStoreId.transaction_data.store = storeId;
      makeApiRequest(`${beamWebSdkBaseUrl}/api/v1/shopify/transaction/post/`, transactionHeader, transactionBody)
        .then(async (response) => {
          if (response) {
            window.localStorage.removeItem(`beam_transaction_key_${widgetId}`);
            const responseData = response;
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
              selectionPromoText = `Select a nonprofit and 1% of your purchase will be donated there for you`;
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
              let impactWidget = await buildImpactOverviewWidget(widgetId, null, isPromoCodeValid, promoCode, responseData.user || beamUser);
              impactWidget.render(responseData.user || beamUser)
            } else {
              function buildNonProfitWidget(widgetId, beamContainerId, shopName) {
                const postTransactionButton = document.querySelector("#beam-post-transaction-button");
                return new beamApps.NonprofitWidget({
                    widgetId: widgetId,
                    containerId: beamContainerId,
                    renderAfterSelection: true,
                    noAjax: true,
                    selectedNonprofitCallback: (nonprofit, store) => {
                      console.debug(nonprofit);
                      console.debug(store);
                      currentNonprofit = nonprofit;
                      currentStore = store;
                      if (nonprofit) {
                        postTransactionButton.style.display = "";
                        callback({
                          widget: 'nonprofit-widget',
                          id: nonprofit.id,
                          name: nonprofit.name,
                          beamUser: responseData.user || beamUser
                        });
                      } else
                        postTransactionButton.style.display = "none";
                    },
                    userDidMatchCallback: (matched, amount) => {
                    },
                    isPreCheckout: false,
                    forceMobileView: true,
                    loadingScreenContent: `${shopName} is donating 1% of your purchase to a nonprofit you choose! Loading nonprofits now...`,
                    themeConfig: {
                      id: "minimal-ui-nonprofit",
                      fontFamily: fontFamilyRoots,
                      logoWrapper: {
                        style: {
                          display: 'block !important',
                          flexFlow: 'unset !important'
                        }
                      },
                      forceMobileView: true,
                      headerPartnerLogoMargin: "0px 10px 0px",
                      headerPartnerLogoWidth: "60px",
                      headerBeamLogoWidth: "60px",
                      headerBeamLogoMargin: "0px 0px 0px 10px",
                      headerText: (selectionPromoText ? selectionPromoText : ""),
                      showLogo: true,
                      gradientColors: ["#2B5134", "#2B5134"],
                      showProgress: true,
                      maxContainerWidth: 500,
                      displayThankYouMessageForSelectingNonProfit: false,
                      iconButtonBorder: "1px solid #d5d5d5",
                      selectedBorder: "1px solid #d5d5d5",
                      tileBorderColor: "#d5d5d5",
                      progressBarColors: [{color: "2B5134", offset: "0%"}],
                      tileDescriptionFontSize: "14px",
                      progressBarBackgroundColor: "#fff",
                      progressBarBorder: "1px solid #d5d5d5",
                      tilePercentageTextColor: "#d5d5d5",
                      tilePercentageTextAlign: 'right',
                      tilePercentageFontSize: "12px",
                      selectedNonprofitBackgroundColor: "#2B5134",
                      poweredByTextColor: "#000",
                      nonprofitCardMargin: "0 10px 0 0",
                      progressBarBorderRadius: '0px',
                      nonprofitCornerRadius: '0px',
                      tileBorderRadius: "0px",
                      progressBarHeight: '7px',
                      headerTextStyle: {
                        fontSize: '15px',
                        fontWeight: 'normal',
                        margin: "20px 0 20px 0",
                        width: '100%',
                        fontFamily: fontFamilyRoots,
                      },
                      fundingViaTextFontWeight: 'regular',
                      fundingNonprofitNameTextFontWeight: 'regular',
                      fundingTextFontWeight: "regular",
                      progressBartext: {
                        style: {
                          fontFamily: fontFamilyRootsRegular
                        }
                      },
                      impact: {
                        style: {
                          fontFamily: fontFamilyRootsRegular
                        }
                      },
                      cause: {
                        style: {
                          fontFamily: fontFamilyRootsRegular
                        }
                      },
                      poweredBy: {
                        style: {
                          fontFamily: fontFamilyRootsRegular,
                          fontSize: '11px',
                          color: "#d5d5d5"
                        }
                      }
                    },
                  }
                );
              }

              function updateTransaction(e) {
                e.preventDefault()
                makeApiRequest(`${beamWebSdkBaseUrl}/api/v1/shopify/transaction/update/`, transactionHeader, {
                  transaction_id: transaction_id,
                  nonprofit: currentNonprofit.id
                }).then(async (response) => {
                  if (response) {
                    const data = response;
                    widgetWrapper.innerHTML = "";
                    showLoadingContent(false);
                    console.debug(data);

                    let impactWidget = await buildImpactOverviewWidget(widgetId, null, isPromoCodeValid, promoCode, responseData.user || beamUser);
                    impactWidget.render(responseData.user || beamUser)
                  } else {
                    showLoadingContent(false);
                  }
                }).catch((error) => {
                  console.error(error);
                  showLoadingContent(false);
                });
              }

              const nonprofitWidget = buildNonProfitWidget(widgetId, beamContainerId, shopName);
              nonprofitWidget.data = beamNonprofitData;
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
            callback({error: "Transaction could not be persisted"})

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
                font-family: 'Centra No1 Bold';
                src: url('https://beam-sdk.s3.us-west-2.amazonaws.com/fonts/CentraNo1-Bold.otf') format("opentype");
                font-display: block;
          }
         @font-face {
                font-family: 'Centra No1';
                src: url('https://beam-sdk.s3.us-west-2.amazonaws.com/fonts/CentraNo1-Book.otf') format("opentype");
                font-display: block;
          }
          
          #beam-wrapper-content-box {
             background: #fff;
             padding: 10px 20px 10px 20px;
           }
   
        #beam-post-transaction-button {
           color: #fff;
         }
                
          #beam-post-transaction-button  {
            font-size: 13px;
            width: auto;
            padding: 9px 19px;
            float: left;
            margin-top: 0;
            margin-bottom: 0;
            text-transform: uppercase;
            font-family: "Centra No1 Medium";
        }
        .button:hover {
          color: #fff;
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
                    <div id="internal-beam-widget-wrapper">
                     <a href="#" id="beam-post-transaction-button" class="button" style="display: none;">Submit</a>
                    </div>
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
    const thankYouContainer = document.querySelector(containerId ? "#" + containerId : "[data-step='thank_you']");
    console.log(" thankYouContainer: ", thankYouContainer)

    let found = false;
    if (!containerId) {
      let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (!mutation.addedNodes) return
          mutation.addedNodes.forEach((node) => {
            if (found) {
              observer.disconnect();
              return;
            }
            if (node.className === "section__content") {
              const beamContentBox = getBeamWidgetHTML();
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
    } else {
      const beamContentBox = getBeamWidgetHTML();
      thankYouContainer.prepend(beamContentBox);
      executeBeamWidget();
    }

    function getBeamWidgetHTML() {
      const beamContentBox = document.createElement("div");
      beamContentBox.className = "content-box";
      beamContentBox.id = "beam-wrapper-content-box";
      beamContentBox.innerHTML = `
          <div class='row'>
                <div class='col-sm-8'>
                          <div class='content-box__row' id='beam-widget-content-box'>
                             <span id='beam-widget-header' style='display: none;'>
                              </span>
                          
                              <div id="internal-beam-widget-wrapper" ></div>
                              <div style='display: flex; flex-direction: row-reverse; margin-top: 15px;'>
                                                              <a href='#' id='beam-post-transaction-button' class='button' style='display: none;'>SUBMIT</a>
                                </div>
                              <div id="beam-loading-content" style='display: none;'></div>
                            </div>
                          </div>
                      </div>`

      return beamContentBox;
    }
  }

}
export default window.execThankYouScript;