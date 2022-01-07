import * as App from 'widgets';
import * as components from "../../components";
import {screenResolutionUtil} from "../../utils";

window.execNonprofitSelection = async function execNonprofitSelection(apiKey,
                                                                      userId,
                                                                      postalCode,
                                                                      countryCode,
                                                                      instacartFontFamily,
                                                                      lan = 'en',
                                                                      learnMoreCallback = () => {
                                                                      },
                                                                      chosenNonprofitCallback = () => {
                                                                      },
                                                                      containerId, production = true) {
  // console.log(" execCardIntegration FOR Instacart")

  const EVENTS = {
    nonProfitSelected: 'nonprofit-selected'
  }
  const beamWebSdkBaseUrl = production ? process.env.BEAM_BACKEND_BASE_URL : process.env.STAGE_BEAM_BACKEND_BASE_URL;
  const storeId = "89";
  const chainId = "61";
  const beamContainerId = 'internal-beam-widget-wrapper';
  const confirmButtonId = "beam-chose-nonprofit-button";
  const beamSelectionScreenContainerId = "beam-wrapper-content-box";
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
    progressBarColor: '#0AAD0A',
    confirmationButtonColor: '#0AAD0A',
    causeTestColor: '#E97300',
    textColor: '#343538',
    lightTextColor: '#72767E',
    progressBarBackgroundColor: '#e3e3e3'
  }
  let isMobile = screenResolutionUtil.isMobile();

  function addStylesheets() {

    let nonprofitSelectionScreen = document.getElementById(beamContainerId);
    nonprofitSelectionScreen.innerHTML += `
    <style>
      /* Tooltip container */
      
                              #beam-wrapper-content-box{
                              position: relative;
                              }  
                              #beam-learn-more {
                                position: relative;
                                display: inline-block;
                                border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
                                padding-top: 10px;
                              }

                              /* Tooltip text */
                              #beam-learn-more .beam-impact-tooltip-text {
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
                              #beam-learn-more:hover .beam-impact-tooltip-text {
                                visibility: visible;
                              }
                              #beam-learn-more .beam-impact-tooltip-text::after {
                                content: " ";
                                position: absolute;
                                bottom: 100%;  /* At the top of the tooltip */
                                left: 50%;
                                margin-left: -66px;
                                border-width: 5px;
                                border-style: solid;
                                border-color: transparent transparent #1F5A96 transparent;
                              }

                              #internal-beam-widget-wrapper{
                                  margin-bottom: 6px;
                              }
                              #beam-chose-nonprofit-button{
                                  background: #e3e3e3; 
                                  color: #6a6b6d; 
                                  border-radius:10px; 
                                  width: 100%; 
                                  border: none; 
                                  height: 40px;
                                  font-family: ${fontFamily};
                                  font-size: 18px;
                              }
                              #beam-widget-header{
                              padding: 0 16px;
                              }
                                #beam-selection-title{
                                margin: 4px 5px;
                                text-align: left; 
                                position:static;
                                left:0px;
                                top:0px;
                                font-size: 31px !important;
                                font-weight: 600;
                                color: #343538 !important;
                                font-family: ${fontFamily};
                                line-height:40px !important;
                                letter-spacing: normal !important;
                                }
                                
                                #beam-link-learn-more{
                                margin: 8px 5px; 
                                width: 100%;
                                font-family: ${fontFamily} !important; 
                                font-size:15px !important;
                                line-height:22px !important;
                                color:#72767E;
                                font-weight: 400!important;
                                letter-spacing: normal !important;
                               }
                               #beam-disclosure{
                               font-family: ${fontFamily};
                               font-size: 12px;
                               line-height: normal;
                               }
                               #beam-selection-page-footer{
                                 position: sticky;
                                 width: 100%;
                                 /*margin: 0px -16px;*/
                                
                                 bottom: 0;
                                 right: 0; 
                                 background-color: white;
                               }
                               
                                #beam-confirm-button-wrapper{
                                        width: 100%;
                                        padding: 10px 16px;
                                   }   
                                   #beam-confirm-button-divider{
                                    width: 100%;
                                    display: inline-block !important;
                                    height: 15px;
                                    background: rgb(241,241,241);
                                    background: -moz-linear-gradient(0deg, rgba(241,241,241,1) 3%, rgba(255,255,255,1) 98%);
                                    background: -webkit-linear-gradient(0deg, rgba(241,241,241,1) 3%, rgba(255,255,255,1) 98%);
                                    background: linear-gradient(0deg, rgba(241,241,241,1) 3%, rgba(255,255,255,1) 98%);
                                    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#f1f1f1",endColorstr="#ffffff",GradientType=1);
                                   } 
                              @media only screen and (max-width: 600px) {
                                 #internal-beam-widget-wrapper{
                                  margin-bottom: 8px;
                                 }
                                 #beam-disclosure {
                                  margin: 0px 0px 70px 0px;
                                  font-size: 12px;
                                 font-family: ${fontFamily};

                                 }
                                   #beam-chose-nonprofit-button {
                                       width: 100%;
                                       max-width: 500px;
                                      }
                                  #beam-selection-page-footer{
                                      position: fixed;
                                              bottom: 0;
                                              right: 0; 
                                              width:100%;
                                              background-color: white;
                                              display: flex;
                                              align-items: center;
                                              flex-direction: column;
                                              margin: 0px;
                                        

                                  }    
                                   #beam-confirm-button-wrapper{
                                        width: 100%;
                                        max-width: 500px;
                                        padding: 10px 16px;
                                   }   
                                   #beam-confirm-button-divider{
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
                                                           
                                #beam-selection-title{
                                }
                                #beam-link-learn-more{
                                }
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
          // console.debug("Transaction id:", transaction?.id);
          window.localStorage.setItem(key, transaction?.id);
          window.localStorage.setItem(nonprofitKey, JSON.stringify(widget.lastNonprofit));
          // console.debug("lastNonprofit:  ", widget.lastNonprofit)
          // console.debug("persistTransactionRequest:  ", transaction)
          resolve(transaction?.id);
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
      partner_user_id: userId,
      show_community_impact: true,
      postal_code: postalCode,
      country_code: countryCode,
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
        addTooltip(chainDonationType);
        // console.log("chainDonationType ", chainDonationType)
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
        displayThankYouMessageForSelectingNonProfit: false,
        maxContainerWidth: 600,
        cards: {
          wrap: true
        },

        headerTextStyle: {
          display: 'none'
        },
        gradientColors: ['#72767E', '#72767E'],
        progressBarColors: [
          {color: themeColorConfig.progressBarColor, offset: "100%"},
        ],
        cardTitle: {
          textStyle: {
            color: themeColorConfig.textColor,
            fontSize: '15px',
            fontWeight: 600
          }
        },
        image: {
          style: {
            borderRadius: '12px',
            width: '104px !important',
            height: '104px !important',
            maxWidth: '104px !important',
            maxHeight: '104px !important'
          },
          mobileStyle: {
            width: '76px !important',
            height: '76px !important',
            maxWidth: '76px !important',
            maxHeight: '76px !important'
          }
        },
        card: {
          backgroundStyle: {
            borderRadius: '12px',
            // height: '124px !important',
            width: 'width: 508px',
            padding: '2px !important',
            margin: '5px 0px'
          },
          style: {
            borderRadius: '12px',
            padding: '6px !important',
            // margin: '0px'
          },
          selectedStyle: {
            backgroundColor: '#F6F7F8',
            background: '#F6F7F8'
          },
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
            paddingTop: "0px",
          },
          wrapperMobileStyle: {
            width: '100%',
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
            fontSize: '12px',
            color: themeColorConfig.textColor,
          },
          wrapperMobileStyle: {
            paddingTop: '4px'
          }
        },
        cause: {
          wrapperStyle: {
            paddingTop: '0px',
            marginTop: '0px'
          },
          style: {
            fontSize: '12px',
            fontWeight: '600',
            color: themeColorConfig.causeTestColor,
            paddingTop: '0px'
          }
        },
      }
    });
    document.getElementById(beamContainerId).style.fontFamily = fontFamily;
  }

  async function confirmNonProfit() {
    // console.log(" PERSIST TRANSACTION")
    const selectionId = await persistTransaction();
    if (selectionId) {
      let lastNonprofitInStorage = window.localStorage.getItem(nonprofitKey);
      let lastNonprofit = JSON.parse(lastNonprofitInStorage);
      console.debug("Transaction persisted.");
      chosenNonprofitCallback({nonprofit_id: lastNonprofit?.id})
    } else {
      console.error("Transaction could not be persisted");
    }
  }

  async function executeBeamWidget(data) {
    widget = getBeamWidget(true, data?.chain_donation_type);
    widget.data = data;
    widget.lastNonprofit = data?.nonprofits?.find(nonprofit => nonprofit.id == data.last_nonprofit);
    if (widget.lastNonprofit) {
      userRegistered = true;
      enableConfirmButton();
    }
    return widget.render();
  }

  async function insertBeamWidget(nonprofits) {
    const nonprofitWidgetContainer = containerId ? document.querySelector("#" + containerId) : document.body;

    const beamContentBox = getBeamWidgetHTML(nonprofits?.chain_donation_type);
    nonprofitWidgetContainer.prepend(beamContentBox);
    addStylesheets();
    addInfoSection(nonprofits?.chain_donation_type)
    addTooltip(nonprofits?.chain_donation_type);

    await executeBeamWidget(nonprofits);
    await registerUser(userId);

    function getBeamWidgetHTML(chainDonationType) {
      const beamContentBox = document.createElement("div");
      beamContentBox.className = "content-box";
      beamContentBox.id = beamSelectionScreenContainerId;
      beamContentBox.innerHTML = `
                          <div class='content-box__row' id='beam-widget-content-box'>
                             <div id='beam-widget-header'>
                                <p id="beam-selection-title">
                                ${chainDonationType?.title_web || "Fight food insecurity with instacart"} </p>
                                <p id="beam-link-learn-more"> 
                                ${chainDonationType?.description_web || `Choose a cause to contribute to with your next order, and one meal will be donated there at no extra cost to you. <a style="color:${themeColorConfig.progressBarColor}" href="#">Learn more </a>`}
                                </p>
                              </p>
                             <div id="beam-container"  style="max-width: 500px">
                              <div id="internal-beam-widget-wrapper" style="max-width: 500px"></div>
                                <p id="beam-disclosure">${chainDonationType?.instacart_disclosure}</p>                        
                                </div>
                                
                                </div>
                      
                              <div id="beam-loading-content" style='display: none;'></div>
                            </div>
                          
                      </div>
                                <div id="beam-selection-page-footer">
                                <div id="beam-confirm-button-divider"></div>
                                <div id="beam-confirm-button-wrapper">
                                    <button id="beam-chose-nonprofit-button" disabled>${chainDonationType?.choose_cta || "Choose nonprofit"}
                                 </button>
`
      return beamContentBox;
    }
  }

  function addTooltip(data) {

    let beamTooltip = document.getElementById("beam-selection-tooltip");
    // console.log("beamTooltip: ", beamTooltip)
    if (!beamTooltip) {
      let learnMoreElem = document.getElementById("beam-learn-more");
      if (learnMoreElem) {
        let learnMoreTooltipText = document.createElement('div');
        learnMoreTooltipText.id = 'beam-selection-tooltip';
        learnMoreTooltipText.textContent = data?.compliance_description_web || `
      To support local nonprofits across the country, donations are made to PayPal Giving Fund, a registered 501(c)(3) nonprofit organization. PPGF receives the donation and distributes 100% to the nonprofit of your choice, with Instacart covering all applicable processing fees. In the extremely rare event your nonprofit shuts down or PPGF is otherwise unable to fund it, PPGF will reassign the funds to similar nonprofit in your area.
      `;
        learnMoreTooltipText.classList.add('beam-impact-tooltip-text');
        learnMoreElem.appendChild(learnMoreTooltipText)
      }
    }
  }

  function addInfoSection(chainDonationType) {
    let beamContainer = document.getElementById("beam-container");

    let infoSection = new components.BeamFlexWrapper({
      style: {
        display: 'block',
        justifyContent: 'start',
        width: '100%',
        marginBottom: '-10px'
      },
      mobileStyle: {
        justifyContent: 'space-between',
      },
      children: [
        getLearnMore(chainDonationType?.compliance_cta),
        !isMobile ? new components.BeamText({
          text: '|',
          color: "#72767E",
          height: '8px',
          paddingBottom: '2px',
          marginBottom: "0px", 
          marginTop: "3px",
          fontWeight: '200',
          fontSize: '13.5px'
        }) : false,
        getPoweredByBeam()
      ]
    });

    beamContainer.prepend(infoSection.view)
///


    ////
    function getLearnMore(compliance_cta) {
      return new components.BeamContainer({
          children: [
            new components.BeamInfoIcon({
              style: {
                display: 'inline',
                width: '10px !important',
                height: '10px !important',
                paddingTop: '0px !important',
                marginLeft: '8px',
                color: "#72767E",
              }
            }),
            new components.BeamText({
              text: `Learn more` || compliance_cta,
              id: 'beam-learn-more',
              style: {
                display: 'inline',
                color: "#72767E",
                fontFamily: instacartFontFamily,
                fontSize: "12px",
                paddingLeft: '5px',
                paddingRight: '4px',
                fontWeight: '200',
              }
            })
          ]
        }
      )
        ;
    }

    function getPoweredByBeam(poweredByText) {
      return new components.BeamContainer({
        children: [
          new components.BeamText({
            text: poweredByText || "Powered by Beam Impact",
            color: "#72767E",
            fontFamily: instacartFontFamily,
            fontWeight: '200',
            style: {
              fontSize: '12px',
              marginRight: '8px',
              padding: '1px 0px 0px 4px'
            }
          })
        ]
      });
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
    let linkLearnMore = document.getElementById('beam-link-learn-more');
    linkLearnMore.addEventListener('click', function (e) {
      learnMoreCallback();
      e.preventDefault();
      return false;
    })
  }

  function listenToWindowResize() {
    window.addEventListener('resize', function (event) {
      addTooltip();
    }, true);
  }

  async function getUserTransactionInfo() {
    let beam_url = new URL('api/v2/users/transaction-info', beamWebSdkBaseUrl);
    let params = {
      chain: chainId,
      user: beamUser,
      lan: lan,
      partner_user_id: userId
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

  let nonprofits = await getNonprofits();
  await insertBeamWidget(nonprofits);
  listenToNonprofitSelectedEvent();
  listenToNonprofitConfirmedEvent();
  listenToWindowResize();
  listenToLearnMoreLinkClickEvent();


}

export default window.execNonprofitSelection;
