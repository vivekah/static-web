import * as App from 'widgets';

window.execCardIntegration = async function execCardIntegration(userId,
                                                                countryCode,
                                                                containerId,
                                                                instacartFontFamily,
                                                                callback = () => {
                                                                }) {
  console.log(" execCardIntegration FOR Instacart")

  const EVENTS = {
    nonProfitConfirmed: 'nonprofit-confirmed',
    nonProfitSelected: 'nonprofit-selected'
  }
  const beamWebSdkBaseUrl = process.env.BEAM_BACKEND_BASE_URL;
  const widgetId = 'e9738b7ffed2476bbec748b1ccc1a046';
  const storeId = "89";
  const chainId = "61";
  const beamContainerId = 'internal-beam-widget-wrapper';
  const confirmButtonId = "chose-nonprofit-button";
  const apiKey = 'MCT5KmLZUJCf.aecf3e1a-c091-481a-89bc-ae9384b3639c';

  addStylesheets();
  // shop config
  const fontFamily = instacartFontFamily || 'Centra No1 Bold';

  // widget config
  let beamUser = null;
  const key = `beam_transaction_key_${widgetId}`;
  const nonprofitKey = `beam_nonprofit_key_${widgetId}`;
  let widget = null;
  let userRegistered = false;

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
          let transaction = JSON.parse(persistTransactionRequest.responseText);
          console.debug("Transaction id:", transaction.selection_id);
          window.localStorage.setItem(key, transaction?.selection_id);
          window.localStorage.setItem(nonprofitKey, JSON.stringify(widget.lastNonprofit));
          console.debug("lastNonprofit:  ", widget.lastNonprofit)
          console.debug("persistTransactionRequest:  ", transaction)
          resolve(transaction.selection_id);
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
      persistTransactionRequest.setRequestHeader('Authorization', `Api-Key ${apiKey}`)
      let body = JSON.stringify({
        ...widget.transactionData,
        selection_id: transactionId
      });
      console.log(" BODY: ", body)
      persistTransactionRequest.send(body);
    });
  }

  async function registerUser(userId) {
    console.log("Registering user: ", userId)
    let beam_url = new URL('api/v2/users/register', beamWebSdkBaseUrl).toString();
    let response = await window.fetch(beam_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Api-Key ${apiKey}`
      },
      body: JSON.stringify({id: userId})
    });
    if (response.status === 201) {
      userRegistered = true;
      return await response.json();
    } else if (response.status === 200) {
      userRegistered = true;
      return response.statusText;
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
          fontFamily: fontFamily,
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
    const selectionId = await persistTransaction();
    if (selectionId) {
      console.debug("Transaction persisted.");
      callback({id: selectionId})
    } else {
      console.error("Transaction could not be persisted");
      callback({error: "Transaction could not be persisted"});
    }
  }

  async function executeBeamWidget() {

    widget = getBeamWidget();
    let lastNonprofitInStorage = window.localStorage.getItem(nonprofitKey);
    if (lastNonprofitInStorage) {
      userRegistered = true;
      enableConfirmButton();
      widget.lastNonprofit = JSON.parse(lastNonprofitInStorage);
    }
    return widget.render({
      chain: chainId,
      user: beamUser,
      store: storeId,
      showCommunityImpact: true,
      postalCode: countryCode
    });
  }

  async function insertBeamWidget() {
    const nonprofitWidgetContainer = containerId ? document.querySelector("#" + containerId) : document.body;
    console.log(" nonprofitWidgetContainer: ", nonprofitWidgetContainer)

    const beamContentBox = getBeamWidgetHTML();
    nonprofitWidgetContainer.prepend(beamContentBox);
    await executeBeamWidget();
    await registerUser(userId);
    addTooltip();

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
                          
                          <div id="beam-container"  style="max-width: 500px">
                              <div id="internal-beam-widget-wrapper"></div>
                              <style scoped>
                              
                              /* Tooltip container */
                              .tooltip {
                                position: relative;
                                display: inline-block;
                                border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
                              }
                              
                              /* Tooltip text */
                              .tooltip .tooltip-text {
                                visibility: hidden;
                                width: 120px;
                                background-color: black;
                                color: #fff;
                                text-align: center;
                                padding: 5px 0;
                                border-radius: 6px;
                               
                                /* Position the tooltip text - see examples below! */
                                position: absolute;
                                z-index: 1;
                              }
                              
                              /* Show the tooltip text when you mouse over the tooltip container */
                              .tooltip:hover .tooltip-text {
                                visibility: visible;
                              }
                              
                              @media only screen and (max-width: 600px) {
                                 #internal-beam-widget-wrapper{
                                  margin-bottom: 70px;
                                 }
                                   #chose-nonprofit-button{
                                         margin-bottom: 10px;
                                         width: 90%;
                                        }
                                   #button-wrapper{
                                    position: fixed;
                                              bottom: 0;
                                              right: 0; 
                                              width:100%;
                                              background-color: white;
                                              display: flex;
                                              align-items: center;
                                              flex-direction: column;
                                   }   
                                   #button-divider{
                                    width: 100%;
                                    height: 15px;
                                    margin: 10px 0px;
                                    background: rgb(241,241,241);
                                    background: -moz-linear-gradient(0deg, rgba(241,241,241,1) 3%, rgba(255,255,255,1) 98%);
                                    background: -webkit-linear-gradient(0deg, rgba(241,241,241,1) 3%, rgba(255,255,255,1) 98%);
                                    background: linear-gradient(0deg, rgba(241,241,241,1) 3%, rgba(255,255,255,1) 98%);
                                    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#f1f1f1",endColorstr="#ffffff",GradientType=1);
                                   }  
                                  }
                              
                                </style>
                                <div id="button-wrapper">
                                    <div id="button-divider"></div>
                                    <button id="chose-nonprofit-button" disabled style="background: #e3e3e3; color: #6a6b6d; border-radius:
                                 10px; width: 100%; border: none; height: 40px;">Choose
                                nonprofit
                                 </button>
                                </div>
                      
                              <div id="beam-loading-content" style='display: none;'></div>
                            </div>
                            </div>
                          </div>
                      </div>`

      return beamContentBox;
    }
  }

  function listenToNonprofitSelectedEvent() {

    window.addEventListener(EVENTS.nonProfitSelected, function () {
      console.log("Event: Nonprofit selected");
      enableConfirmButton();
    });
  }

  function enableConfirmButton() {
    let button = document.getElementById(confirmButtonId);
    button.style.backgroundColor = themeColorConfig.confirmationButtonColor;
    button.style.color = '#fff';
    button.disabled = false;
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
      console.log("Event: Nonprofit confirmed");
      if (userRegistered) {
        console.log("User is registered, confirmation of nonprofit can be done");
        confirmNonProfit();
      } else {
        console.error(" User is not registered!")
      }
    });
  }

  await insertBeamWidget();
  listenToNonprofitSelectedEvent();
  listenToNonprofitConfirmedEvent();

  function addTooltip() {
    let learnMoreElem = document.getElementById("learn-more");
    if (learnMoreElem) {
      let learnMoreTooltipText = document.createElement('div');
      learnMoreTooltipText.textContent = `
      To support local nonprofits across the country, donations are nmade to ParPal Giving Fund, a registered 501(c)(3) nonprofit organization. 
      `;
      learnMoreElem.classList.add('tooltip');
      learnMoreTooltipText.classList.add('tooltip-text');
      learnMoreElem.appendChild(learnMoreTooltipText)
    }
  }

}

export default window.execCardIntegration;