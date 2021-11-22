import * as App from 'widgets';
import * as components from "../../components";
import {pathUtil, screenResolutionUtil} from "../../utils";
import css from './instacart.scss';
import Splide from '@splidejs/splide';
import FlexWrapper from "../../components/FlexWrapper";
import {BeamCloseIcon, CloseIcon} from "../../components";

window.execCommunityImpact = async function execCommunityImpact(
  apiKey,
  userId,
  zipCode,
  fontFamily,
  lan = 'en',
  containerId,
  dismissWindowCallback = () => {
  },
  reviewResultsCallback = () => {
  },
  chooseNonprofitCallback = () => {
  },
  seeNationalImpactCallback = () => {
  },
  clickedNonprofitGoalCallback = () => {

  },
  production = true
) {
  const beamImpactWidgetContainerId = 'beam-community-widget-container';
  const beamSliderId = 'beam-slider';
  const chainId = "61";
  const beamWebSdkBaseUrl = production ? process.env.BEAM_BACKEND_BASE_URL : process.env.STAGE_BEAM_BACKEND_BASE_URL;

  let isMobile = screenResolutionUtil.isMobile();

  function loadStyle() {
    document.head.innerHTML += `<style>

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
    document.getElementById('impact-screen-container').style.fontFamily = fontFamily;
  }

  function reportWindowSize() {
    let isMobileNew = screenResolutionUtil.isMobile();

    if (isMobile !== isMobileNew) {
      isMobile = isMobileNew;
      let impactContainer = document.getElementById("impact-screen-container");
      impactContainer.parentNode.removeChild(impactContainer);
      renderImpactScreen();
    }

  }

  window.onresize = reportWindowSize;

  //theme
  const themeColorConfig = {
    progressBarColor: '#0AAD0A',
    confirmationButtonColor: '#0AAD0A',
    causeTestColor: '#f0a358',
    textColor: '#6a6b6d',
    lightTextColor: '#bbbbbd',
    progressBarBackgroundColor: '#e3e3e3'
  }

  // console.log(" execCardIntegration FOR Instacart")
  const impactData = await getImpactData(userId, zipCode);
  renderImpactScreen();

  function renderImpactScreen() {
    let impactScreenContainer = new components.BeamContainer({
      id: "impact-screen-container",
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px 20px'
      },
      children: [
        isMobile && getHeader(),
        getJoinUsSection(impactData),
        devider(),
        getPartnerSummarySection(),
        getTutorialSection(impactData?.tutorial),
        isMobile ? devider() : false,
        isMobile ? getInfoSection(impactData) : false,
        getImpactSummarySection(),
        !isMobile ? getInfoSection(impactData) : false,
        getCommunityImpactSection(),
        getDisclosure(impactData)
      ]
    });
    let container = document.getElementById(containerId);
    if (container) {
      container.append(impactScreenContainer.view);
    } else {
      document.body.append(impactScreenContainer.view);
    }
    loadStyle();
    createCarousel();
    addTooltip(impactData);
    addCallbacks();
    renderCommunityImpactWidget(impactData);
  }

  function getDisclosure(impactData) {
    return new components.BeamText({
      text: impactData.instacart_disclosure,
      id: 'beam-disclosure',
      style: {
        fontSize: '12px',
        fontFamily: fontFamily,
        color: themeColorConfig.textColor,
        maxWidth: '1200px',
        padding: '32px 0px 82px 0px'
      },
      mobileStyle: {
        padding: '32px 0px 82px 0px'
      }
    })
  }

  function getHeader() {
    return new components.BeamFlexWrapper({
      style: {
        width: '100%',
        margin: '0px 0px 12px 0px',
        maxWidth: '500px',
        height: '44px'
      },
      children: [
        new components.BeamCloseIcon({
          clickListener: dismissWindowCallback,
          style: {}
        }),
        new components.BeamFlexWrapper({
          style: {
            flexGrow: '1',
            width: 'calc( 100% - 16px)'
          },
          children: [
            new components.BeamText({
              text: 'Impact Report',
              fontFamily: fontFamily || 'inherit',
              fontSize: '18px',
              fontWeight: '500',
              lineHeight: '26px',
              color: '#343538',
              margin: 'auto'
            })
          ]
        })

      ]
    });
  }

  function addCallbacks() {
    document.getElementById('review-results-link')?.addEventListener('click', reviewResultsCallback);
    document.getElementById('select-nonprofit-impact-overview')?.addEventListener('click', chooseNonprofitCallback);
    document.getElementById('national-impact')?.addEventListener('click', seeNationalImpactCallback);
  }

  function getPartnerSummarySection(impactData) {

    return new components.BeamFlexWrapper({
      flexDirection: 'column',
      style: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '16px',
      },
      mobileStyle: {
        textAlign: 'center'
      },
      children: [
        new components.BeamText({
          text: impactData?.copy?.impactTitleWeb || 'Help us fight food insecurity',
          style: {
            fontSize: '31px',
            marginBottom: '8px',
            fontWeight: '700',
            lineHeight: '40px',
            fontFamily: fontFamily || 'inherit'
          },
          mobileStyle: {
            fontSize: '30px',
            textAlign: 'center'
          }
        }),
        new components.BeamText({
          text: impactData?.copy?.impactDescriptionWeb || "This holiday season, Instacart has partnered with 4 non-profits in support of our mission to create" +
            " a world where everyone has access to the food they love and more time to enjoy it together.",
          style: {
            fontSize: '15px',
            color: '#72767E',
            margin: 'auto',
            textAlign: 'center',
            fontWeight: '400',
            lineHeight: '22px',
            fontFamily: fontFamily || 'inherit',
            maxWidth: '580px'
          },
          mobileStyle: {
            textAlign: 'center !important',
            maxWidth: '100%'
          }
        })
      ]
    })
  }

  function getJoinUsSection(impactData) {
    return new components.BeamFlexWrapper({
      alignItems: 'flex-start',
      style: {
        maxWidth: '600px',
        // height: '100px',
        justifyContent: 'center',
        margin: 'auto',
        marginTop: '0px',
        flexWrap: 'nowrap !important',
        padding: '0px',
        fontFamily: fontFamily || 'inherit'
      },
      children: [
        new components.BeamFlexWrapper({
          style: {
            paddingRight: '16px'
          },
          children: [
            new components.BeamImage({
              alt: 'Instacart Purchase Icon',
              src: impactData.personal_impact_image,
              style: {
                borderRadius: '50%',
                maxWidth: '52px',
                height: '52px',
                display: 'flex',
                margin: '0px'
              }
            })
          ]
        }),
        new components.BeamFlexWrapper({
          flexDirection: 'column',
          alignItems: 'flex-start',
          children: [
            new components.BeamText({
              text: impactData.personal_impact_header || 'Join us in the fight against food insecurity',
              style: {
                fontFamily: fontFamily || 'inherit',
                fontSize: '18px',
                lineHeight: '26px',
                fontWeight: '600'
              }
            }),
            new components.BeamText({
              text: `${impactData.personal_impact_description || 'Food meals this holiday season by simply placing your order.'}` + (!impactData.personal_impact &&
                `<a href='#' id="${impactData.personal_impact_cta?.indexOf('nonprofit') === -1 ? 'review-results-link' : 'select-nonprofit-impact-overview'}" style='color: green; text-decoration: none; font-weight: bold;'> ${impactData.personal_impact_cta} </a>`),
              style: {
                fontSize: '12px',
                lineHeight: '18px',
                fontFamily: fontFamily || 'inherit'
              }
            }),
            impactData.personal_impact && new components.BeamFlexWrapper({
              noWrap: true,
              width: '100%',
              alignItems: 'center',
              alignContent: 'center',
              children: [
                new components.BeamProgressWrapper({
                  percentage: impactData.personal_impact,
                  height: "4px",
                  backgroundColor: themeColorConfig.progressBarBackgroundColor,
                  border: "none",
                  cornerRadius: undefined,
                  style: {
                    width: '90%',
                    height: '4px',
                    display: 'flex',
                    marginTop: '0px',
                    marginRight: '12px',
                    fontFamily: fontFamily || 'inherit'
                  }
                }),
                // percent text
                new components.BeamText({
                  tag: "h6",
                  text: impactData.personal_impact + "&#37;",
                  fontSize: '12px',
                  color: '#343538',
                  fontWeight: '200',
                  fontFamily: fontFamily || 'inherit'
                }),
                new components.BeamText({
                  style: {
                    fontSize: '12px',
                    lineHeight: '18px',
                    fontFamily: fontFamily || 'inherit'
                  },
                  text: `<a href='#' id="${impactData.personal_impact_cta?.indexOf('nonprofit') === -1 ? 'review-results-link' : 'select-nonprofit-impact-overview'}" style='color: green; text-decoration: none;'>${impactData.personal_impact_cta} </a>`
                })]
            }),
            // !impactData.personal_impact && new components.BeamText({
            //   style: {
            //     fontSize: '12px',
            //     lineHeight: '18px',
            //     fontFamily: fontFamily || 'inherit',
            //
            //   },
            //   text: `<a href='#' id="${impactData.personal_impact_cta?.indexOf('nonprofit') === -1 ? 'review-results-link' : 'select-nonprofit-impact-overview'}" style='color: green; text-decoration: none;'>${impactData.personal_impact_cta} </a>`
            // })
          ]
        }),
      ]
    });
  }

  function getTutorialSection(tutorial) {

    let slider = new components.BeamContainer({
      id: beamSliderId,
    });
    slider.view.innerHTML = `
          <style>
          #tutorial-step{
            fontFamily: ${fontFamily};
            display: none;
            
            }
          #tutorial-step-title{
            margin: 0;
           font-size: 28px;
           line-height: 40px;
           font-weight: bold;
          }
          #tutorial-step-descrtiption{
          margin: 8px 0px 0px 0px;
          font-size: 18px;
          line-height: 26px;
          font-weight: 400;
          }
          
          #tutorial-step-text-container{
           width: 70%;
           display: flex;
           justify-content: center;
           height: 100%;
           flex-direction: column;
          }
          
          .slider_img{
          /*width:50%;*/
          border-radius: 10px 0px 0px 10px;
         
          }
          .splide__track {
            border-radius: 10px;
          }
          
       @media only screen and (max-width:800px) {
          #tutorial-step{
            position: relative;
            background: transparent;
            display: flex;
            width: 100%;
            border-radius: 0px 0px 10px 10px;
            align-items: center;
            height: fit-content;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            right: 0px;
            top: 0px;
          }
          #tutorial-step-text-container{
          width: 70%;
          margin: 22px auto 0px auto;
          padding: 0px;
          justify-content: center;
          background-color: #fff;
          }
           .slider_img{
          width:100%;
          border-radius: 10px;
          }
          #tutorial-step {
            background-color: #FFF;
          }

          #tutorial-step-title{
            font-size: 23px;
            line-height:28px;
            font-weight: 700;
          }
          .splide__slide.is-active.is-visible{
            height: fit-content;
            background-color: transparent !important;

          }
          .slider_img{
          margin:10px 0px;
          width: 100%;
          }
          .splide__slide{
          height: fit-content;
          background-color: transparent !important;

          }
          .splide__track{
           height: fit-content;
          }
          
       }
</style>  

          <div class="splide">
            <div class="splide__track">
          <ul class="splide__list">
          ${tutorial && tutorial.map(tutorialStep => {
      return `<li class="splide__slide" style="background-color: #FFF0BD;"><img class="slider_img " src="${isMobile ? tutorialStep.image : tutorialStep.desktopWebImage}" onError="this.onerror=null;this.src='https://staging-beam-widgets.beamimpact.com/assets/img/Artwork%20(1).png';">
                <div id="tutorial-step">
                    <div id="tutorial-step-text-container">
                      <p id="tutorial-step-title">${tutorialStep.title}</p>
                      <p id="tutorial-step-descrtiption">${tutorialStep.description}</p>
                    </div>
                </div>
             </li>`
    })
    }
          </ul>
            </div>
          </div>`
    return new components.BeamFlexWrapper({
      style: {
        flexDirection: 'column !important',
        flexWrap: 'nowrap !important'
        // width: '100%',
        // height: '100%'
      },
      children: [
        // new components.BeamText({
        //   text: 'How it works',
        //   style: {
        //     fontSize: '23px',
        //     lineHeight: '28px',
        //     height: '28px',
        //     fontWeight: '700',
        //     marginTop: '48px',
        //     fontFamily: fontFamily || 'inherit'
        //   }
        // }),
        slider
      ]
    });

  }

  function createCarousel() {
    new Splide('.splide', {
      arrows: false
    }).mount();
  }

  function getImpactSummarySection() {
    return new components.BeamFlexWrapper({
      style: {
        borderRadius: '15px',
        backgroundColor: '#F2F7ED',
        maxWidth: '781px',
        // height: '100px',
        justifyContent: 'center',
        padding: '10px 0px',
        margin: 'auto',
        marginTop: '49px',
        flexDirection: 'row !important',
        flexWrap: 'nowrap !important',
        fontFamily: fontFamily || 'inherit',
        alignItems: 'flex-start'
      },
      mobileStyle: {
        flexDirection: 'column !important',
        backgroundColor: '#fff',
        margin: '15px auto auto',
      },
      children: [
        new components.BeamText({
          id: 'cummulative_impact_title',
          text: impactData.cummulative_impact_title || `Together we funded ${impactData.aggregate_impact || '0'} meals nationwide`,
          style: {
            fontSize: '23px',
            fontWeight: '500',
            margin: '0px',
            marginRight: '10px',
            textAlign: 'left',
            fontFamily: fontFamily || 'inherit',
            width: '50%',
            padding: '24px 33px'
          },
          mobileStyle: {
            textAlign: 'center',
            width: '100%',
            margin: '0px 0px 15px 0px',
          }
        }),
        new components.BeamText({
          text: `${impactData.cummulative_impact_description}</br> <a id="national-impact" href='' style='color: green;'>${impactData.cummulative_impact_cta} </a>`,
          style: {
            fontSize: '15px',
            color: '#72767E',
            fontWeight: '400',
            marginLeft: '10px',
            textAlign: 'left',
            fontFamily: fontFamily || 'inherit',
            width: '50%',
          },
          mobileStyle: {
            textAlign: 'center',
            width: '100%'
          }
        })
      ]
    });
  }

  function getCommunityImpactSection() {
    return new components.BeamContainer({
      id: beamImpactWidgetContainerId,
      style: {
        width: '100%'
      }
    });
  }

  function getInfoSection(impactData) {
    return new components.BeamFlexWrapper({
      style: {
        paddingTop: '4px',
        justifyContent: 'start',
        width: '100%',
        padding: '10px 0px',
        margin: 'auto',
        maxWidth: '781px',
      },
      mobileStyle: {
        justifyContent: 'space-between',
      },
      children: [
        getLearnMore(impactData),
        !isMobile ? new components.BeamText({text: '|', color: "#999"}) : false,
        getPoweredByBeam(impactData)
      ]
    })
  }

  function getLearnMore(impactData) {
    return new components.BeamContainer({
        children: [
          new components.BeamInfoIcon({
            style: {
              display: 'inline',
              width: '12px',
              height: '12px'
            }
          }),
          new components.BeamText({
            text: impactData?.copy.complianceCtaWeb,
            id: 'learn-more',
            style: {
              display: 'inline',
              color: "#999",
              fontFamily: fontFamily,
              fontSize: "12px",
              paddingRight: '5px',
              paddingLeft: '5px',
              fontWeight: '100'
            }
          })
        ]
      }
    )
      ;
  }

  function getPoweredByBeam(impactData) {
    return new components.BeamContainer({
      children: [
        new components.BeamText({
          text: impactData?.copy?.poweredByText || "Powered by Beam Impact",
          color: "#999",
          fontFamily: fontFamily,
          fontWeight: '100',
          fontSize: "12px",
          style: {
            paddingLeft: '5px'
          }
        })
      ]
    });
  }

  function addTooltip(data) {

    let beamTooltip = document.getElementById("beam-tooltip");
    if (!beamTooltip) {
      let learnMoreElem = document.getElementById("learn-more");
      if (learnMoreElem) {
        let learnMoreTooltipText = document.createElement('div');
        learnMoreTooltipText.id = 'beam-tooltip';
        learnMoreTooltipText.textContent = data?.copy?.complianceDescriptionWeb;
        learnMoreElem.classList.add('tooltip');
        learnMoreTooltipText.classList.add('tooltip-text');
        learnMoreElem.appendChild(learnMoreTooltipText)
      }
    }
  }

  function devider() {
    return new components.BeamDivider({
      // margin:'37px 0px 0px 0px !important',
      style: {
        margin: '37px 0px 0px 0px !important',
        borderTop: `1px solid ${themeColorConfig.progressBarBackgroundColor} `,
        borderBottom: '0',
        maxWidth: '700px'
      }
    });
  }

  async function getImpactData(userId, zipCode) {
    let fullUrl = new URL('api/v2/users/impact/instacart', beamWebSdkBaseUrl);
    const params = {
      user: userId,
      zip_code: zipCode,
      lan: lan
    }
    if (params)
      fullUrl.search = new URLSearchParams(params)
        .toString()
        .replace(/null/g, "")
        .replace(/undefined/g, "");
    try {
      let response = await window.fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Api-Key ${apiKey}`
        }
      });
      if (response.status == 200) return await response.json();
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  function renderCommunityImpactWidget(impactData) {
    let widget = new beamApps.InstacartCommunityImpactWidget({
      impactData,
      fontFamily: fontFamily || 'inherit',
      containerId: beamImpactWidgetContainerId,
      chainId: chainId,
      lan: lan,
      themeConfig: {
        id: 'instacart-community-impact',
        showCommunityImpactHeader: true,
        communityImpactTitle: {
          text: impactData.community_impact_title,
          style: {
            fontSize: '15px',
            lineHeight: '22px',
            color: '#000',
            marginBottom: '16px'
          }
        },
        impactCardWidth: '278px',
        maxContainerWidth: 600,
        hideLogo: true,
        noWrap: false,
        impactCard: {
          style: {
            borderRadius: '10px',
            margin: '0px 0px 10px 0px',
          },
          mobileStyle: {
            width: '100%',
            // maxWidth: '343px',
          }
        },
        title: {
          style: {
            fontSize: '15px',
            fontWeight: '600',
            color: themeColorConfig.textColor
          }
        },
        cause: {
          style: {
            fontSize: '12px',
            fontWeight: '600',
            color: themeColorConfig.causeTestColor
          }
        },
        region: {
          style: {
            fontSize: '10px',
            fontWeight: '400',
            fontFamily: fontFamily || 'inherit'
          }
        },
        impact: {
          style: {
            fontSize: '12px',
            fontWeight: '400',
            color: themeColorConfig.textColor,
            width: '100%'
          }
        },
        // impactImageHeight: '100%',
        cardImage: {
          style: {
            borderRadius: '10px',
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }
        },
        cardOverlay: {
          style: {
            display: 'none'
          }
        },
        innerCard: {
          style: {
            height: 'auto',
          }
        },
        tileHeight: 'inherit',
        cardbody: {
          style: {
            padding: '16px 0px',
          }
        },
        outerCard: {
          style: {
            borderRadius: '10px',
            // width: '100%',
            padding: '16px',
            maxWidth: '278px',
            marginBottom: '10px',
            margin: '0px'
          },
          mobileStyle: {
            maxWidth: '100%'
          }
        },
        border: `1px solid ${themeColorConfig.progressBarBackgroundColor}`,
        tileOverlayBackground: 'transparent',
        nonprofitsContainer: {
          style: {
            // flexFlow: "nowrap !important"
            // alignItems: 'flex-start !important',
            justifyContent: 'center !important',
            margin: 'auto',
            maxWidth: '1200px'
          },
          mobileStyle: {
            flexDirection: 'column !important',
            margin: 'auto',
            alignItems: 'center !important',
            justifyContent: 'center !important',
          }
        },
        nonprofitRow: {
          style: {
            justifyContent: 'center !important'
          }
        },
        fontFamily: fontFamily || "inherit",
        gradientColors: [themeColorConfig.progressBarColor],
        progressBarColors: [
          {color: themeColorConfig.progressBarColor, offset: "100%"}
        ],
        hideTabs: true,
        hideBorders: true,
        textColor: themeColorConfig.textColor,
        borderRadius: "15px",
        percentageTextColor: themeColorConfig.textColor,
        showLink: true,
        headerPartnerLogoMargin: '0px 0px -23px',
        headerBeamLogoMargin: '0px 0px 0px 15px',
        nonprofitRow: {
          style: {
            margin: '0px'
          }
        },
        headerContainer: {
          style: {
            display: 'flex',
            justifyContent: 'center',
          }
        },
        progressBar: {
          style: {
            height: '4px',
            border: '0px',
            backgroundColor: themeColorConfig.progressBarBackgroundColor
          },
          textStyle: {
            color: themeColorConfig.textColor,
            fontSize: '12px',
            fontWeight: '300'
          }
        },
        devider: {
          style: {
            margin: '15px 0px 5px 0px',
            borderTop: `1px solid ${themeColorConfig.progressBarBackgroundColor} `,
            borderBottom: '0'
          }
        },
        goalInfo: {
          clickListener: clickedNonprofitGoalCallback,
          style: {
            fontSize: '12px',
            color: themeColorConfig.textColor,
            textDecoration: 'none',
            paddingTop: '12px',
            fontFamily: fontFamily || 'inherit'
          }
        },
        titleNonprofits: {
          style: {
            margin: '10px 0px',
            fontSize: '14px',
            fontWeight: "600",
            fontFamily: fontFamily || 'inherit'
          }
        }
      }
    });
    widget.render({chain: chainId, impactData});
  }
}

export default window.execCommunityImpact;