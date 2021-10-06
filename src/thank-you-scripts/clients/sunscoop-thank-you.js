import * as App from 'widgets';

window.execThankYouScript = function execThankYouScript(cartTotalString, beamUserId,
                                                        orderId, customerId, customerFirstName,
                                                        customerLastName, customerEmail, customerPhone,
                                                        customerZipCode, customerCountryCode) {

  const beam_web_sdk_base_url = 'https://scoop.sdk.beamimpact.com';
  const beam_widget_id = 'e8feebefd6f843ca9e01b6cad895475d';
  const beam_store_id = '10';
  const shop_name = 'Sunscoop';
  const shop_domain = 'sunscoop.myshopify.com';
  const key = 'user';

  const contentType = "application/json";
  const widgetId = `${beam_widget_id}`;
  const storeId = `${beam_store_id}`;
  const shopName = `${shop_name}`;
  const shopDomain = `${shop_domain}`;
  let beamUser = `${beamUserId}`.trim();
  beamUser = beamUser && beamUser.length > 0 ? beamUser : null;

  const beamSection = document.createElement("div");
  beamSection.className = "step__sections";
  beamSection.style.marginTop = "15px";
  beamSection.innerHTML = `
        <div class="section">
            <div class="section__content">
                <div class="content-box">
                    <div class="content-box__row">
                        <span id="beam-widget-header" style="display: none;">
                             <h3 style="font-family: poppins;">
                                You made an impact for a nonprofit with your ${shopName} purchase
                            </h3>
                            <hr />
                        </span>
                        <div id="beam-widget-wrapper"></div>
                        <div id="beam-loading-content" style="display: none;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.querySelector("[data-step='thank_you']").appendChild(beamSection);

  const widgetHeader = document.querySelector("#beam-widget-header");
  const widgetWrapper = document.querySelector("#beam-widget-wrapper");

  const cartTotal = parseFloat(cartTotalString.replace("$", ""));


  function buildImpactOverviewWidget(content = "Getting your impact...") {
    widgetWrapper.innerHTML = "";
    widgetHeader.style.display = "";
    return new beamApps.ImpactOverviewWidget({
      containerId: "beam-widget-wrapper",
      widgetId: widgetId,
      communityImpactUrl: 'https://sunscoop.com/pages/about',
      loadingScreenContent: content,
      themeConfig: {
        fontFamily: "poppins",
        textColor: "#333",
        gradientColors: ["#f05f65"],
        progressBarColors: [
          {color: "#f05f65", offset: "100%"},
        ],
        personalImpactBackgroundColor: "#FFFCDE",
        communityImpactBackgroundColor: "#FFFCDE"
      }
    });
  }

  const transactionId = window.localStorage.getItem(`beam_transaction_key_${widgetId}`);
  const loadingContent = document.querySelector("#beam-loading-content");

  if (transactionId) {
    widgetWrapper.innerHTML = "Getting your impact...";
    window.fetch(`${beam_web_sdk_base_url}/api/v1/shopify/transaction/post/`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "x-widget-id": widgetId,
        "x-shopify-shop-domain": shopDomain
      },
      body: JSON.stringify({
        order_id: orderId,
        cart_total: cartTotal,
        transaction_id: transactionId,
        customer_beam_user: beamUser,
        customer_id: customerId,
        customer_first_name: customerFirstName,
        customer_last_name: customerLastName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_zip_code: customerZipCode,
        customer_country_code: customerCountryCode,
        transaction_data: {
          store: storeId
        }
      })
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          window.localStorage.removeItem(`beam_transaction_key_${widgetId}`);
          buildImpactOverviewWidget().render(data?.user || customerEmail);
        } else {
          console.error(`
                    status: ${response.status} \n
                    statusText: ${response.statusText} \n
                    error_message: ${await response.json()}
                `);
        }
      })
      .catch((error) => console.error(error));
  } else if (beamUser) {
    widgetWrapper.innerHTML = "Getting your impact...";
    window.fetch(`${beam_web_sdk_base_url}/api/v1/shopify/transaction/update/`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "x-widget-id": widgetId,
        "x-shopify-shop-domain": shopDomain
      },
      body: JSON.stringify({
        order_id: orderId,
        cart_total: cartTotal,
        transaction_id: null,
        customer_beam_user: beamUser,
        customer_id: customerId,
        customer_first_name: customerFirstName,
        customer_last_name: customerLastName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_zip_code: customerZipCode,
        customer_country_code: customerCountryCode,
        transaction_data: {
          store: storeId
        }
      })
    })
      .then(async (response) => {
        if (response.ok) {
          buildImpactOverviewWidget().render(beamUser || customerEmail);
        } else {
          console.error(`
                    status: ${response.status} \n
                    statusText: ${response.statusText} \n
                    error_message: ${await response.json()}
                `);
        }
      })
      .catch((error) => console.error(error));

  } else {
    function showLoadingContent(enable = true) {
      widgetWrapper.style.display = enable ? "none" : "";
      loadingContent.style.display = enable ? "" : "none";
    }

    const nonprofitWidget = new beamApps.NonprofitWidget({
      widgetId: widgetId,
      containerId: "beam-widget-wrapper",
      selectedNonprofitCallback: (nonprofit, store) => {
        showLoadingContent();

        loadingContent.innerHTML = `
                    You just made an impact for ${nonprofit.name}!<br/ >
                    Grow your impact with every purchase at ${store.chain_name}
                    <br/>
                    <br />
                    ${store.chain_donation_type.name} of this purchase, and all future purchases,
                    will be donated there for you, at no extra cost.<br />
                    Hang tight to see the impact you just made...
                `;

        window.fetch(`${beam_web_sdk_base_url}/api/v1/shopify/transaction/post/`, {
          method: "POST",
          headers: {
            "Content-Type": contentType,
            "x-widget-id": widgetId,
            "x-shopify-shop-domain": shopDomain
          },
          body: JSON.stringify({
            order_id: orderId,
            customer_id: customerId,
            customer_first_name: customerFirstName,
            customer_last_name: customerLastName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            customer_zip_code: customerZipCode,
            customer_country_code: customerCountryCode,
            transaction_data: nonprofitWidget.transactionData
          })
        })
          .then(async (response) => {
            if (response.ok) {
              const data = await response.json();
              widgetWrapper.innerHTML = "";
              showLoadingContent(false);
              await buildImpactOverviewWidget(loadingContent.innerHTML).render(data?.user || customerEmail);

            } else {
              showLoadingContent(false);
            }
          })
          .catch((error) => {
            console.error(error);
            showLoadingContent(false);
          });
      },
      userDidMatchCallback: (matched, amount) => {
      },
      isPreCheckout: false,
      forceMobileView: false,
      loadingScreenContent: `${shopName} is donating 1% of your purchase to a nonprofit you choose! Loading nonprofits now...`,
      themeConfig: {
        id: "default-nonprofit",
        textColor: "#000000",
        fontFamily: "poppins",
        gradientColors: ["#f05f65"],
        progressBarColors: [
          {color: "#f05f65", offset: "100%"},
        ]
      },
    });
    nonprofitWidget.render({
      store: storeId,
      cartTotal: cartTotal
    });
  }
}

