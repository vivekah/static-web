import * as App from 'widgets';

window.execThankYouScript = function execThankYouScript(cartTotalString, beamUserId,
                                                        orderId, customerId, customerFirstName,
                                                        customerLastName, customerEmail, customerPhone,
                                                        customerZipCode, customerCountryCode) {
  const beam_web_sdk_base_url = 'https://sundae.sdk.beamimpact.com';
  const beam_widget_id = 'c7e7e9981e65485e881f89387447673e';
  const beam_store_id = '11';
  const beam_variant_store_id = '31';
  const shop_name = 'Sundae School';
  const shop_domain = 'sundaeschool.myshopify.com';
  const beam_meta = checkout.customer.metafields.beam_meta;
  const key = 'user';

  async function getCart() {
    let response = await fetch(`https://{{ shop.domain }}/cart.js`);
    return await response.json();
  }

  const fontStyle = document.createElement("style");
  fontStyle.innerHTML = `
#beam-widget-wrapper > div > div > img:first-child {
    margin: 0px 9px 0px 0px;
}
      #beam-post-transaction-button {
           min-width: 100px;
          text-transform: none !important;
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
        border-radius: 0;
        background-color: #000;
        color: #fff;
        transition: background-color 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
        padding: 1.6rem 1.4rem;
        min-width: 100px;
        font-style: normal;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: bold;
        font-size: normal;
        font-family: Lausanne-300, "Helvetica Neue", sans-serif;
      }
      .button:hover {
        color: #fff;
      }
    `;
  document.head.appendChild(fontStyle);

  const contentType = "application/json";
  const widgetId = `${beam_widget_id}`;
  const storeId = `${beam_store_id}`;
  const shopName = `${shop_name}`;
  const shopDomain = `${shop_domain}`;
  const beamUser = `${beamUserId}`.trim();

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
                                <a href="#" id="beam-post-transaction-button" class="button" style="display: none;">Submit</a>
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

    const widgetHeader = document.querySelector("#beam-widget-header");
    const widgetWrapper = document.querySelector("#beam-widget-wrapper");

    const containerId = "beam-widget-wrapper";

    const ALT_STORE_PRODUCT_VARIANTS = {
      33333589180493: 43, //[AAPI] TAEKWONDO Hoodie (s)
      33333589213261: 43, //[AAPI] TAEKWONDO Hoodie (m)
      33333589246029: 43, //[AAPI] TAEKWONDO Hoodie (l)
      33333589278797: 43, //[AAPI] TAEKWONDO Hoodie (xl)
      39279588278349: 43, //[AAPI] Filial Piety White Hoodie (s)
      39279588311117: 43, //[AAPI] Filial Piety White Hoodie (m)
      39279588343885: 43, //[AAPI] Filial Piety White Hoodie (l)
      39279588376653: 43, //[AAPI] Filial Piety White Hoodie (xl)
      33333583937613: 11, //TAEKWONDO shirt (s)
      33333583970381: 11, //TAEKWONDO shirt (m)
      33333584003149: 11, //TAEKWONDO shirt (l)
      33333584035917: 11, //TAEKWONDO shirt (xl)
      39267805528141: 11, //[AAPI] Blue PHYS. ED. DEPT. T-Shirt (s)
      39267805560909: 11, //[AAPI] Blue PHYS. ED. DEPT. T-Shirt (m)
      39267805593677: 11, //[AAPI] Blue PHYS. ED. DEPT. T-Shirt (l)
      39267805626445: 11, //[AAPI] Blue PHYS. ED. DEPT. T-Shirt (xl)
      33125363384397: 11, //[AAPI] Pink PHYS. ED. DEPT. T-Shirt (s)
      33125363417165: 11, //[AAPI] Pink PHYS. ED. DEPT. T-Shirt (m)
      33125363449933: 11, //[AAPI] Pink PHYS. ED. DEPT. T-Shirt (l)
      33125363482701: 11, //[AAPI] Pink PHYS. ED. DEPT. T-Shirt (xl)
      39279589457997: 11, //[AAPI] Stop Asian Hate Calculator T-Shirt (s)
      39279589490765: 11, //[AAPI] Stop Asian Hate Calculator T-Shirt (m)
      39279589523533: 11, //[AAPI] Stop Asian Hate Calculator T-Shirt (l)
      39279589556301: 11, //[AAPI] Stop Asian Hate Calculator T-Shirt (xl)
      39279586803789: 11, //[AAPI] Filial Piety Black T-Shirt (s)
      39279586836557: 11, //[AAPI] Filial Piety Black T-Shirt (m)
      39279586869325: 11, //[AAPI] Filial Piety Black T-Shirt (l)
      39279586902093: 11, //[AAPI] Filial Piety Black T-Shirt (xl)
      39279564652621: 11, //[AAPI] F U White T-Shirt (s)
      39279564685389: 11, //[AAPI] F U White T-Shirt (m)
      39279564718157: 11, //[AAPI] F U White T-Shirt (l)
      39279564750925: 11, //[AAPI] F U White T-Shirt (xl)
      39279583789133: 11, //[AAPI] F U Black Long Sleeve (s)
      39279583821901: 11, //[AAPI] F U Black Long Sleeve (m)
      39279583854669: 11, //[AAPI] F U Black Long Sleeve (l)
      39279583887437: 11, //[AAPI] F U Black Long Sleeve (xl)
      33333583937613: 11, //[AAPI] TAEKWONDO T-Shirt (s)
      33333583970381: 11, //[AAPI] TAEKWONDO T-Shirt (s)
      33333584003149: 11, //[AAPI] TAEKWONDO T-Shirt (s)
      33333584035917: 11, //[AAPI] TAEKWONDO T-Shirt (s)
      //33331723501645 : 12, // Blunts dont break hearts (s)
      //39438830534851: 33 //TEST
    };
    let cartTotal = parseFloat(cartTotalString.replace("$", ""));

    function buildImpactOverviewWidget(content = "Getting your impact...") {
      widgetWrapper.innerHTML = "";
      widgetHeader.style.display = "";
      return new beamApps.ImpactOverviewWidget({
        containerId: "beam-widget-wrapper",
        widgetId: widgetId,
        communityImpactUrl: 'https://sundae.school/pages/about',
        loadingScreenContent: content,
        themeConfig: {
          id: "minimal-ui-impact-overview",
          fontFamily: "poppins",
          textColor: "#333",
          hidePurchaseMessageChainName: true,
          purchaseMessageText: "Check out the impact your Sundae purchase made below.",
          impactfundingTextFontWeight: "500",
          headerTextPadding: "35px 10px 10px",
          headerPartnerLogoWidth: "130px",
          headerPartnerLogoHeight: "70px",
          headerPartnerLogoMargin: "0px 0px -15px",
          gradientColors: ["#F7CE68", "#FF944B"],
          tileBorderRadius: "0",
          hideCommunityImpactLink: true
        }
      });
    }

    const transactionId = window.localStorage.getItem(`beam_transaction_key_${widgetId}`);
    //
    // let variantStore = false;
    // {% for item in order.line_items %}
    // if (Object.keys(ALT_STORE_PRODUCT_VARIANTS).includes("{{ item.variant_id }}" || "{{ item.id }}")) {
    //     variantStore = true
    // }
    // {% endfor %}
    //
    // if (variantStore) {
    //     storeId = "{{ beam_variant_store_id }}";
    //     cartTotal = 0;
    //
    //     {% for item in order.line_items %}
    //     if (Object.keys(ALT_STORE_PRODUCT_VARIANTS).includes("{{ item.variant_id }}")) {
    //         variantStore = true
    //
    //         cartTotal += ALT_STORE_PRODUCT_VARIANTS["{{ item.variant_id }}"] * parseInt("{{ item.quantity }}");
    //     }
    //     {% endfor %}
    //     cartTotal = cartTotal * 100;
  }

  // widgetWrapper.innerHTML = "Getting your impact...";
  window
    .fetch("{{ beam_web_sdk_base_url }}/api/v1/shopify/transaction/post/", {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "x-widget-id": widgetId,
        "x-shopify-shop-domain": shopDomain,
      },
      body: JSON.stringify({
        order_id: orderId,
        cart_total: cartTotal,
        transaction_id: transactionId ? transactionId : null,
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

        loadingContent.innerHTML = ` ${currentNonprofit && currentStore && `
                  You just made an impact with your Sundae School purchase!
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
            window.fetch("{{ beam_web_sdk_base_url }}/api/v1/shopify/transaction/update/", {
              method: "POST",
              headers: {
                "Content-Type": contentType,
                "x-widget-id": widgetId,
                "x-shopify-shop-domain": shopDomain
              },
              body: JSON.stringify({
                order_id: orderId,
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
            showLogo: true,
            themeConfig: {
              id: "minimal-ui-nonprofit",
              textColor: "#000000",
              fontFamily: "poppins",
              showLogo: true,
              hidePoweredBy: true,
              headerPartnerLogoWidth: "130px",
              headerPartnerLogoHeight: "70px",
              headerPartnerLogoMargin: "0px 0px -15px",
              gradientColors: ["#F7CE68", "#FF944B"],
              headerText: "1% of your purchase is going to a nonprofit you choose.",
              tileBorderRadius: "0",
              // poweredByPadding: "0",
              headerTextPadding: "10px !important",
              //  headerTextBorder: "solid 1px #000 !important",
              headerTextMargin: "0px 0px 10px 0px !important"
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
        console.error(`status: ${response.status}`);
      }
    })
    .catch((error) => console.error(error));
}
