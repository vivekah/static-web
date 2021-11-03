import * as App from 'widgets';

window.execNonprofitSelection = async function execNonprofitSelection(apiKey,
                                                                      userId,
                                                                      postalCode,
                                                                      instacartFontFamily,
                                                                      lan = 'en',
                                                                      learnMoreCallback = () => {
                                                                      },
                                                                      chosenNonprofitCallback = () => {
                                                                      },
                                                                      containerId) {
  // console.log(" execCardIntegration FOR Instacart")

  const EVENTS = {
    nonProfitSelected: 'nonprofit-selected'
  }
  const beamWebSdkBaseUrl = process.env.BEAM_BACKEND_BASE_URL;
  const storeId = "89";
  const chainId = "61";
  const beamContainerId = 'internal-beam-widget-wrapper';
  const confirmButtonId = "chose-nonprofit-button";

  // shop config
  const fontFamily = instacartFontFamily || "inherit";

  // widget config
  let beamUser = null;
  const key = `beam_transaction_key`;
  const nonprofitKey = `beam_nonprofit_key`;
  let widget = null;
  let userRegistered = false;

  //theme
  const themeColorConfig = {
    progressBarColor: '#16ad0b',
    confirmationButtonColor: '#16ad0b',
    causeTestColor: '#E97300',
    textColor: '#343538',
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
    if (!instacartFontFamily) {
      let link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Poppins:wght@400&display=swap');

      document.head.appendChild(link);
    }
    document.head.innerHTML += `
    <style>
      /* Tooltip container */
                              .tooltip {
                                position: relative;
                                display: inline-block;
                                border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
                                padding-top: 10px;
                              }

                              /* Tooltip text */
                              .tooltip .tooltip-text {
                                visibility: hidden;
                                width: 180px;
                                background-color: #1F5A96;
                                color: #fff;
                                text-align: center;
                                padding: 8px 0;
                                line-height: 1.5;
                                text-align: left;
                                border-radius: 6px;
                                font-family: ${fontFamily};
                                font-size: 10px;
                                padding: 8px;
                                margin-top: 5px;
                               
                                /* Position the tooltip text - see examples below! */
                                position: absolute;
                                z-index: 1;
                              }
                              
                              /* Show the tooltip text when you mouse over the tooltip container */
                              .tooltip:hover .tooltip-text {
                                visibility: visible;
                              }
                              .tooltip .tooltip-text::after {
                                content: " ";
                                position: absolute;
                                bottom: 100%;  /* At the top of the tooltip */
                                left: 50%;
                                margin-left: -66px;
                                border-width: 5px;
                                border-style: solid;
                                border-color: transparent transparent #1F5A96 transparent;
                              }
                              
    </style>`
  }

  function persistTransaction() {
    let persistTransactionRequest = new XMLHttpRequest();

    return new Promise(function (resolve, reject) {
      persistTransactionRequest.onreadystatechange = async function () {
        if (persistTransactionRequest.readyState !== 4) return;

        if (persistTransactionRequest.status >= 200 && persistTransactionRequest.status < 300) {
          let transaction = JSON.parse(persistTransactionRequest.responseText);
          console.debug("Transaction id:", transaction?.id);
          window.localStorage.setItem(key, transaction?.id);
          window.localStorage.setItem(nonprofitKey, JSON.stringify(widget.lastNonprofit));
          console.debug("lastNonprofit:  ", widget.lastNonprofit)
          console.debug("persistTransactionRequest:  ", transaction)
          resolve(transaction.id);
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

      persistTransactionRequest.open("POST", `${beamWebSdkBaseUrl}/api/v2/users/favorite-nonprofit`, true);
      persistTransactionRequest.setRequestHeader('Content-type', 'application/json')
      persistTransactionRequest.setRequestHeader('Authorization', `Api-Key ${apiKey}`)
      let body = JSON.stringify({
        nonprofit: widget.transactionData.nonprofit,
        partner_user_id: userId
      });
      persistTransactionRequest.send(body);
    });
  }

  async function registerUser(userId) {
    // console.log("Registering user: ", userId)
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


  async function getNonprofits() {
    // console.log("getNonprofits ", userId)
    let beam_url = new URL('api/v2/chains/nonprofits', beamWebSdkBaseUrl);
    let params = {
      chain: chainId,
      user: beamUser,
      store: storeId,
      show_community_impact: true,
      postal_code: postalCode,
      lan: lan
    };
    if (params)
      beam_url.search = new URLSearchParams(params)
        .toString()
        .replace(/null/g, "")
        .replace(/undefined/g, "");

    let response = await window.fetch(beam_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Api-Key ${apiKey}`
      },
    });
    if (response.status === 200) {
      return await response.json();
    } else
      return null;
  }

  function getBeamWidget(noAjax, chainDonationType) {
    // initialize nonprofit widget
    return new beamApps.NonprofitWidget({
      containerId: beamContainerId,
      lan: lan,
      noAjax: noAjax,
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
      forceMobileView: false,
      fontFamily: fontFamily,
      themeConfig: {
        id: "modern-ui-nonprofit",
        headerText: "",
        maxContainerWidth: 400,
        cards: {
          wrap: true
        },
        headerTextStyle: {
          display: 'none'
        },
        gradientColors: [themeColorConfig.textColor, themeColorConfig.textColor],
        progressBarColors: [
          {color: themeColorConfig.progressBarColor, offset: "100%"},
        ],
        cardTitle: {
          textStyle: {
            color: themeColorConfig.textColor,
            fontSize: '15px'
          }
        },
        image: {
          style: {
            borderRadius: '12px',
            maxWidth: '104px',
            maxHeight: '104px'
          },
          mobileStyle: {
            maxWidth: '100%',
            maxHeight: '100%'
          }
        },
        card: {
          backgroundStyle: {
            borderRadius: '12px',
            height: '124px !important',
            width: 'width: 508px',
            padding: '2px !important'
          },
          style: {
            borderRadius: '12px',
            padding: '8px !important'

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
            backgroundColor: themeColorConfig.progressBarBackgroundColor,
          },
          wrapperStyle: {
            paddingTop: "0px"
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
        },
        learnMore: {
          text: chainDonationType?.compliance_cta || "Learn more",
          style: {
            fontSize: '12px',
          },
          icon: {
            style: {
              width: '10px !important',
              height: '10px !important',
              paddingTop: '0px !important',
              marginLeft: '8px',
            }
          }
        },
        poweredBy: {
          style: {
            fontSize: '12px',
            marginRight: '8px',
          }
        }
      }
    });
  }

  async function confirmNonProfit() {
    // console.log(" PERSIST TRANSACTION")
    const selectionId = await persistTransaction();
    if (selectionId) {
      let lastNonprofitInStorage = window.localStorage.getItem(nonprofitKey);
      let lastNonprofit = JSON.parse(lastNonprofitInStorage);
      console.debug("Transaction persisted.");
      chosenNonprofitCallback({nonprofit_id: lastNonprofit.id})
    } else {
      console.error("Transaction could not be persisted");
    }
  }

  async function executeBeamWidget(data) {

    widget = getBeamWidget(true, data?.chain_donation_type);
    widget.data = data;
    let lastNonprofitInStorage = window.localStorage.getItem(nonprofitKey);
    if (lastNonprofitInStorage) {
      userRegistered = true;
      enableConfirmButton();
      widget.lastNonprofit = JSON.parse(lastNonprofitInStorage);
    }
    return widget.render();
  }

  async function insertBeamWidget(nonprofits) {
    const nonprofitWidgetContainer = containerId ? document.querySelector("#" + containerId) : document.body;

    const beamContentBox = getBeamWidgetHTML(nonprofits?.chain_donation_type);
    nonprofitWidgetContainer.prepend(beamContentBox);
    await executeBeamWidget(nonprofits);
    await registerUser(userId);
    addTooltip(nonprofits?.chain_donation_type);

    function getBeamWidgetHTML(chainDonationType) {
      const beamContentBox = document.createElement("div");
      beamContentBox.className = "content-box";
      beamContentBox.id = "beam-wrapper-content-box";
      beamContentBox.innerHTML = `
 <style>
                              #internal-beam-widget-wrapper{
                              }
                              #chose-nonprofit-button{
                                  background: #e3e3e3; 
                                  color: #6a6b6d; 
                                  border-radius:10px; 
                                  width: 100%; 
                                  border: none; 
                                  height: 40px;
                                 font-family: ${fontFamily};
                              }
                              #beam-widget-header{
                              padding: 0 15px;
                              }
                                #selection-title{
                                margin: 4px 5px;
                                text-align: left; 
                                position:static;
                                left:0px;
                                top:0px;
                                font-size: 31px !important;
                                font-weight: 900;
                                color: #343538 !important;
                                font-family: ${fontFamily};
                                line-height:40px !important;
                                letter-spacing: normal !important;
                                }
                                
                                #link-learn-more{
                                margin: 8px 5px; 
                                width: 100%;
                                font-family: ${fontFamily} !important; 
                                font-size:15px !important;
                                line-height:22px !important;
                                color:#72767E;
                                font-weight: 400!important;
                                letter-spacing: normal !important;
                               }
                              @media only screen and (max-width: 600px) {
                                 #internal-beam-widget-wrapper{
                                  margin-bottom: 70px;
                                 }
                                   #chose-nonprofit-button {
                                       width: 100%;
                                       max-width: 500px;
                                      }
                                  #selection-page-footer{
                                      position: fixed;
                                              bottom: 0;
                                              right: 0; 
                                              width:100%;
                                              background-color: white;
                                              display: flex;
                                              align-items: center;
                                              flex-direction: column;
                                        

                                  }    
                                   #button-wrapper{
                                        width: 100%;
                                        max-width: 500px;
                                        padding: 10px;
                                   }   
                                   #button-divider{
                                    width: 100%;
                                    display: inline-block !important;
                                    height: 15px;
                                    background: rgb(241,241,241);
                                    background: -moz-linear-gradient(0deg, rgba(241,241,241,1) 3%, rgba(255,255,255,1) 98%);
                                    background: -webkit-linear-gradient(0deg, rgba(241,241,241,1) 3%, rgba(255,255,255,1) 98%);
                                    background: linear-gradient(0deg, rgba(241,241,241,1) 3%, rgba(255,255,255,1) 98%);
                                    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#f1f1f1",endColorstr="#ffffff",GradientType=1);
                                   }  
                                  }
                                                                 
                              @media only screen and (max-width: 400px) {
                                                           
                                #selection-title{
                                }
                                #link-learn-more{
                                }
                           }
                                </style>

          <div class='row'>
                <div class='col-sm-8'>
                          <div class='content-box__row' id='beam-widget-content-box'>
                             <div id='beam-widget-header'>
                                <p id="selection-title">
                                ${chainDonationType?.title_web || "Fight food insecurity with instacart"} </p>
                                <p id="link-learn-more"> 
                                ${chainDonationType?.description_web || `Choose a cause to contribute to with your next order, and one meal will be donated there at no extra cost to you. <a style="color:${themeColorConfig.progressBarColor}" href="#">Learn more </a>`}
                                </p>
                              </p>
                             <div id="beam-container"  style="max-width: 500px">
                              <div id="internal-beam-widget-wrapper" style="max-width: 500px"></div>
                            
                                <div id="selection-page-footer">
                                <div id="button-divider"></div>
                                <div id="button-wrapper">
                                    <button id="chose-nonprofit-button" disabled>${chainDonationType?.choose_cta || "Choose nonprofit"}
                                 </button>
                                </div>
                                
                                </div>
                      
                              <div id="beam-loading-content" style='display: none;'></div>
                            </div>
                            </div>
                          </div>
                      </div>`

      return beamContentBox;
    }
  }

  function addTooltip(data) {

    let beamTooltip = document.getElementById("beam-tooltip");
    if (!beamTooltip) {
      let learnMoreElem = document.getElementById("learn-more");
      if (learnMoreElem) {
        let learnMoreTooltipText = document.createElement('div');
        learnMoreTooltipText.id = 'beam-tooltip';
        learnMoreTooltipText.textContent = data?.compliance_description_web || `
      To support local nonprofits across the country, donations are made to PayPal Giving Fund, a registered 501(c)(3) nonprofit organization. PPGF receives the donation and distributes 100% to the nonprofit of your choice, with Instacart covering all applicable processing fees. In the extremely rare event your nonprofit shuts down or PPGF is otherwise unable to fund it, PPGF will reassign the funds to similar nonprofit in your area.
      `;
        learnMoreElem.classList.add('tooltip');
        learnMoreTooltipText.classList.add('tooltip-text');
        learnMoreElem.appendChild(learnMoreTooltipText)
      }
    }
  }

  function listenToNonprofitSelectedEvent() {
    window.addEventListener(EVENTS.nonProfitSelected, function () {
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
      if (userRegistered) {
        // console.log("User is registered, confirmation of nonprofit can be done");
        confirmNonProfit();
      } else {
        console.error(" User is not registered!")
      }
    });
  }

  function listenToLearnMoreLinkClickEvent() {
    let linkLearnMore = document.getElementById('link-learn-more');
    linkLearnMore.addEventListener('click', function () {
      learnMoreCallback();
    })
  }

  function listenToWindowResize() {
    window.addEventListener('resize', function (event) {
      addTooltip();
    }, true);
  }

  let nonprofits = await getNonprofits();
  addStylesheets();
  await insertBeamWidget(nonprofits);
  listenToNonprofitSelectedEvent();
  listenToNonprofitConfirmedEvent();
  listenToWindowResize();
  listenToLearnMoreLinkClickEvent();


}

export default window.execNonprofitSelection;