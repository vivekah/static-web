import * as App from 'widgets';
import * as components from "../../components";
import {pathUtil} from "../../utils";

window.execNationalCommunityImpact = async function execNationalCommunityImpact(apiKey, fontFamily, language, containerId,
                                                                                selectANonprofitCallback = () => {
                                                                                }, production = true) {
  const beamImpactWidgetContainerId = 'beam-national-impact-container';
  const chainId = "61";
  const beamWebSdkBaseUrl = production ? process.env.BEAM_BACKEND_BASE_URL : process.env.STAGE_BEAM_BACKEND_BASE_URL;
  const beamWebUrl = production ? process.env.WEB_BASE_URL : process.env.STAGE_WEB_BASE_URL;

  //theme
  const themeColorConfig = {
    progressBarColor: '#0AAD0A',
    confirmationButtonColor: '#0AAD0A',
    causeTestColor: '#f0a358',
    textColor: '#343538',
    lightTextColor: '#72767E',
    progressBarBackgroundColor: '#e3e3e3'
  }

  // console.log(" execCardIntegration FOR Instacart")
  const impactData = await getImpactData();
  renderImpactScreen(impactData);

  function renderImpactScreen(impactData) {
    let impactScreenContainer = new components.BeamFlexWrapper({
      style: {
        flexDirection: 'column !important',
        flexWrap: 'wrap',
        padding: '10px 20px'
      },
      children: [
        getJoinUsSection(impactData),
        getPartnerSummarySection(impactData),
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
    addCallbacks();
    renderCommunityImpactWidget();
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

  function addCallbacks() {
    document.getElementById('beam-link-to-select-nonprofit').addEventListener('click', function(e){
      selectANonprofitCallback();
      e.preventDefault();
      return false;
    });
  }

  function getJoinUsSection(impactData) {
    return new components.BeamFlexWrapper({
      alignItems: 'flex-start',
      style: {
        maxWidth: '600px',
        height: '100px',
        justifyContent: 'center',
        margin: 'auto',
        marginTop: '0px',
        flexWrap: 'nowrap !important',
        // padding: '0px 20px',
        fontFamily: fontFamily || 'inherit'
      },
      children: [
        new components.BeamFlexWrapper({
          children: [
            new components.BeamImage({
              alt: 'Instacart Purchase Icon',
              src: impactData.personal_impact_image,
              style: {
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                margin: '0 10px 0 10px'
              }
            })
          ]
        }),
        new components.BeamFlexWrapper({
          flexDirection: 'column',
          alignItems: 'flex-start',
          children: [
            new components.BeamText({
              text: impactData?.personal_impact_header || 'Join us in the fight against food insecurity',
              style: {
                fontFamily: fontFamily || 'inherit',
                fontSize: '18px',
                lineHeight: '26px',
                fontWeight: '600',
                marginTop: '10px'
              }
            }),
            new components.BeamText({
              text: `${impactData?.personal_impact_description || 'Food meals this holiday season by simply placing your order.'}` +
                `<a href='#' id="beam-link-to-select-nonprofit" style='color: ${themeColorConfig.progressBarColor}; text-decoration: none; display: inline;'>${"   " + impactData.personal_impact_cta} </a>`,
              style: {
                fontSize: '12px',
                lineHeight: '18px',
                fontFamily: fontFamily || 'inherit',
                display: 'inline'
              }
            }),
            new components.BeamFlexWrapper({
              noWrap: true,
              width: '100%',
              alignItems: 'center',
              alignContent: 'center',
              children: [
                impactData?.personal_impact && new components.BeamProgressWrapper({
                  percentage: impactData?.personal_impact,
                  height: "4px",
                  backgroundColor: themeColorConfig.progressBarBackgroundColor,
                  border: "none",
                  cornerRadius: undefined,
                  style: {
                    width: '90%',
                    height: '4px',
                    display: 'flex',
                    marginTop: '0px',
                    marginRight: '12px'
                  }
                }),
                // percent text
                impactData.personal_impact && new components.BeamText({
                  tag: "h6",
                  text: impactData?.personal_impact + "&#37;",
                  fontSize: '12px',
                  color: '#343538',
                  fontWeight: '200',
                  fontFamily: fontFamily || 'inherit'
                })]
            }),
          ]
        }),
      ]
    });
  }

  function getPartnerSummarySection(impactData) {

    return new components.BeamFlexWrapper({
      style: {
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 'auto',
        marginTop: '45px',
        // padding: '0px 20px',
        maxWidth: '700px',
      },
      mobileStyle: {
        // maxWidth: '400px',
        textAlign: 'center'
      },
      children: [
        new components.BeamText({
          text: impactData?.global_impact_title || `${impactData.aggregate_impact || '0'} meals and counting!`,
          fontFamily: fontFamily || 'inherit',
          style: {
            fontSize: '44px',
            margin: 'auto',
            fontWeight: '600'
          },
          mobileStyle: {
            fontSize: '31px',
            textAlign: 'center'
          }
        }),
        new components.BeamText({
          text: impactData?.global_impact_description || "Check out the impact we're making in the fight against food insecutiry—together.",
          fontFamily: fontFamily || 'inherit',
          style: {
            fontSize: '15px',
            color: 'grey',
            margin: 'auto',
            padding: '20px 0px',
            paddingTop: '10px',
            textAlign: 'center',
            fontWeight: '200'
          },
          mobileStyle: {
            textAlign: 'center !important'
          }
        })
      ]
    })
  }

  function getCommunityImpactSection() {
    return new components.BeamContainer({
      id: beamImpactWidgetContainerId,
      style: {
        width: '100%'
      }
    });
  }

  function devider() {
    return new components.BeamDivider({
      style: {
        margin: '15px 0px 5px 0px',
        borderTop: `1px solid ${themeColorConfig.progressBarBackgroundColor} `,
        borderBottom: '0',
        maxWidth: '700px'
      }
    });
  }

  async function getImpactData() {
    let fullUrl = new URL('api/v2/users/impact/instacart/community', beamWebSdkBaseUrl);
    const params = {}
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
      if (response.status == 200) return await response?.json();
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  function renderCommunityImpactWidget() {
    let widget = new beamApps.InstacartNationalImpactWidget({
      webBaseUrl: beamWebUrl,
      fontFamily: fontFamily || 'inherit',
      noAjax: true,
      containerId: beamImpactWidgetContainerId,
      chainId: chainId,
      themeConfig: {
        hideLogo: true,
        showNational: true,
        filterByRegion: true,
        noWrap: false,
        maxContainerWidth: 600,
        // impactCardWidth: '256px',
        impactCard: {
          style: {
            borderRadius: '10px',
          },
          mobileStyle: {
            width: '100% !important',
            // maxWidth: '343px',
            margin: '0px 0px 10px 0px',
          }
        },
        title: {
          style: {
            fontSize: '15px',
            fontWeight: '700',
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
            fontSize: '10px !important',
            fontWeight: '400'
          }
        },
        impact: {
          style: {
            fontSize: '12px  !important',
            fontWeight: '400',
            color: themeColorConfig.textColor,
            width: '100%'
          }
        },
        // impactImageHeight: '100%',
        cardImage: {
          style: {
            borderRadius: '10px',
            // height: '152px',
            // width: '236px',
            objectFit: 'cover'
          },
          mobileStyle: {
            width: '100%',
            height: '100%',
          }
        },
        cardOverlay: {
          style: {
            display: 'none'
          }
        },
        innerCard: {
          style: {
            height: 'auto'
          }
        },
        tileHeight: 'inherit',
        cardbody: {
          style: {
            padding: '16px 0px 0px 0px'
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
        hideTabs: false,
        hideBorders: true,
        textColor: themeColorConfig.textColor,
        borderRadius: "15px",
        percentageTextColor: themeColorConfig.textColor,
        showLink: true,
        headerPartnerLogoMargin: '0px',
        headerBeamLogoMargin: '0px',
        headerContainer: {
          style: {
            display: 'flex',
            justifyContent: 'center',
            margin: '0'
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
            display: 'none'
          }
        }, //TODO: rename to nonprofits cause devider
        titleDevider: {
          style: {
            borderTop: `1px solid ${themeColorConfig.progressBarBackgroundColor} !important`,
            margin: 'auto',
            width: '230px'
          }
        },
        tabsSection: {
          style: {
            margin: '0',
            // marginBottom: '15px',
            flexDirection: 'column !important',
            flexWrap: 'wrap !important',
          }
        },
        tabsContainer: {
          style: {
            margin: '20px 10px 14px 10px',
            flexDirection: 'row !important',
            flexWrap: 'wrap !important',
            maxWidth: '343px'

          }
        },
        tab: {
          style: {
            color: themeColorConfig.progressBarColor,
            fontSize: '12px',
            lineHeight: '26px',
            letterSpacing: '0em',
            textAlign: 'center'
          },
          selected: {
            style: {
              color: themeColorConfig.textColor
            }
          },
          underline: {
            style: {
              display: 'none'
            }
          }
        },
        titleNonprofits: {
          style: {
            fontFamily: `${fontFamily} !important`,
            margin: '10px 0px',
            fontSize: '23px',
            fontWeight: "600"
          }
        },
      }
    });
    widget.data = impactData;
    widget.render({chain: chainId});

  }
}
export default window.execNationalCommunityImpact;