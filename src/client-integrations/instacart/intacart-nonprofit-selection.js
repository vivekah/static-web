import * as App from 'widgets';

window.execCardIntegration = async function execCardIntegration(userId,
                                                                countryCode,
                                                                containerId,
                                                                callback = () => {
                                                                }) {
  console.log(" execCardIntegration FOR Instacart")

  const EVENTS = {
    nonProfitConfirmed: 'nonprofit-confirmed',
    nonProfitSelected: 'nonprofit-selected'
  }
  const beamWebSdkBaseUrl = process.env.BEAM_BACKEND_BASE_URL;
  const widgetId = 'e9738b7ffed2476bbec748b1ccc1a046';
  const storeId = "13";
  const chainId = "7";
  const beamContainerId = 'internal-beam-widget-wrapper';
  const confirmButtonId = "chose-nonprofit-button";
  addStylesheets();
  // shop config
  const fontFamily = 'Centra No1 Bold';
  const fontFamilyRootsRegular = 'Centra No1';

  // widget config
  let beamUser = null;
  const key = `beam_transaction_key_${widgetId}`;
  const nonprofitKey = `beam_nonprofit_key_${widgetId}`;
  let storedNonprofitId = window.localStorage.getItem(nonprofitKey) || null;
  let widget = null;
  let beamNonprofitData = null;

  //theme
  const themeColorConfig = {
    progressBarColor: '#16ad0b',
    confirmationButtonColor: '#16ad0b',
    causeTestColor: '#f0a358',
    textColor: '#6a6b6d',
    lightTextColor: '#bbbbbd',
    progressBarBackgroundColor: '#e3e3e3'
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
                font-display: block;
                src: url('https://beam-sdk.s3.us-west-2.amazonaws.com/fonts/CentraNo1-Bold.otf') format("opentype");
          }
         @font-face {
                font-family: 'Centra No1';
                font-display: block;
                src: url('https://beam-sdk.s3.us-west-2.amazonaws.com/fonts/CentraNo1-Book.otf') format("opentype");
          }
    `;
    document.head.appendChild(fontStyle);
  }

  function persistTransaction() {
    let transactionId = window.localStorage.getItem(key);
    let persistTransactionRequest = new XMLHttpRequest();

    return new Promise(function (resolve, reject) {
      persistTransactionRequest.onreadystatechange = async function () {
        if (persistTransactionRequest.readyState !== 4) return;

        if (persistTransactionRequest.status >= 200 && persistTransactionRequest.status < 300) {
          let transactionId = JSON.parse(persistTransactionRequest.responseText);
          console.debug("Transaction id:", transactionId);
          window.localStorage.setItem(key, transactionId);
          console.debug("widget.transactionData.nonprofit:", widget.transactionData.nonprofit);
          window.localStorage.setItem(nonprofitKey, widget.transactionData.nonprofit);
          storedNonprofitId = widget.transactionData.nonprofit
          widget.lastNonprofit = beamNonprofitData.nonprofits.filter(x => x.id == storedNonprofitId)[0] || null;
          resolve(persistTransactionRequest);
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

      persistTransactionRequest.open("POST", `${beamWebSdkBaseUrl}/api/v2/users/selection`, true);
      persistTransactionRequest.setRequestHeader('Content-type', 'application/json')
      let body = JSON.stringify({
        ...widget.transactionData,
        selection_id: transactionId
      });
      console.log(" BODY: ", body)
      persistTransactionRequest.send(body);
    });
  }

  async function registerUser(userId) {
    let beam_url = new URL('api/v2/users/register', beamWebSdkBaseUrl).toString();
    try {
      let response = await window.fetch(beam_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userId: userId})
      });
      if (response.status == 200) return await response.json();
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  function getBeamWidget() {
    // initialize nonprofit widget
    return new beamApps.NonprofitWidget({
      widgetId: widgetId,
      containerId: beamContainerId,
      userDidMatchCallback: async (matched, amount) => {
        // process action
        console.log("Not implemented");
      },
      renderAfterSelection: true,
      selectedNonprofitCallback: async (nonprofit, store) => {
        console.debug(nonprofit);
        // create new event
        let event = new Event(EVENTS.nonProfitSelected);
        // Dispatch the event.
        window.dispatchEvent(event);
      },
      isPreCheckout: false,
      forceMobileView: true,
      fontFamily: fontFamily,
      themeConfig: {
        id: "modern-ui-nonprofit",
        headerText: `Choose a cause to contribute to with your next order, and one meal will be donated there at no extra cost to you. <span style="color:${themeColorConfig.progressBarColor}">Learn more </span>`,
        headerTextStyle: {
          fontSize: '15px',
          fontWeight: '600',
          margin: "20px 0 20px 0",
          width: '100%',
          fontFamily: fontFamilyRootsRegular,
          color: themeColorConfig.lightTextColor
        },
        gradientColors: [themeColorConfig.textColor, themeColorConfig.textColor],
        progressBarColors: [
          {color: themeColorConfig.progressBarColor, offset: "100%"},
        ],
        cardTitle: {
          textStyle: {
            color: themeColorConfig.textColor,
            fontSize: '14px'
          }
        },
        image: {
          style: {
            borderRadius: '15px',
          }
        },
        card: {
          backgroundStyle: {
            borderRadius: '15px',
          },
          style: {
            borderRadius: '15px',
          }
        },
        checkbox: {
          style: {
            display: 'none'
          }
        },
        progressBar: {
          style: {
            height: '6px',
            border: '0px',
            backgroundColor: themeColorConfig.progressBarBackgroundColor
          },
          textStyle: {
            color: themeColorConfig.textColor,
            fontSize: '12px',
            fontWeight: '500'
          }
        },
        region: {
          style: {
            display: 'block',
            marginBottom: '5px'
          },
          textStyle: {
            color: themeColorConfig.textColor,
            fontSize: '10px',
            fontWeight: '300'
          }
        },
        description: {
          style: {
            fontSize: '12px'
          }
        },
        cause: {
          wrapperStyle: {
            paddingTop: '0px',
            marginTop: '0px'
          },
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            color: themeColorConfig.causeTestColor,
            paddingTop: '0px'
          }
        },
        infoArea: {
          style: {
            display: 'block',
            justifyContent: 'space-between',
            width: '100%'
          }
        }
      }
    });
  }

  async function confirmNonProfit() {
    console.log(" PERSIST TRANSACTION")
    const success = await persistTransaction();
    if (success) {
      console.debug("Transaction persisted.");
      callback({id: nonprofit.id, name: nonprofit.name})
    } else {
      console.error("Transaction could not be persisted");
      callback({error: "Transaction could not be persisted"});
    }
  }

  function executeBeamWidget() {

    widget = getBeamWidget();
    widget.render({
      chain: chainId,
      user: beamUser,
      store: storeId,
      // cartTotal: cartTotal,
      showCommunityImpact: true,
    });
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
                             <span id='beam-widget-header' style=''>
                                <p style="text-align: left; margin-bottom: -11px; font-size: 20px; font-weight: bold; font-family: inherit;">
                                Fight food insecurity with instacart</p>
                              </span>
                          
                              <div id="internal-beam-widget-wrapper" ></div>
                              <style scoped>
                              @media only screen and (max-width: 600px) {
                                   #chose-nonprofit-button{
                                             position: fixed;
                                              bottom: 0;
                                              right: 0; 
                                        }
                                  }
                              
                                </style>
                              <button id="chose-nonprofit-button" style="background: #e3e3e3; color: #6a6b6d; border-radius:
                            10px;width: 100%; border: none; height: 40px;">Choose
                                nonprofit
                            </button>
                                </div>
                              <div id="beam-loading-content" style='display: none;'></div>
                            </div>
                          </div>
                      </div>`

      return beamContentBox;
    }
  }

  function listenToNonprofitSelectedEvent() {

    window.addEventListener(EVENTS.nonProfitSelected, function () {
      console.log("Nonprofit chosennn");
      let button = document.getElementById(confirmButtonId);
      button.style.backgroundColor = themeColorConfig.confirmationButtonColor;
      button.style.color = '#fff';
    });
  }

  function listenToNonprofitConfirmedEvent() {
    let button = document.getElementById(confirmButtonId);

    button.addEventListener("click", function () {
      // create new event
      let event = new Event(EVENTS.nonProfitConfirmed);

      // Dispatch the event.
      window.dispatchEvent(event);
    });

    window.addEventListener(EVENTS.nonProfitConfirmed, function () {
      confirmNonProfit();
    });
  }

  insertBeamWidget();
  listenToNonprofitSelectedEvent();
  listenToNonprofitConfirmedEvent();


}

export default window.execCardIntegration;