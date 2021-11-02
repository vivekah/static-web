import * as App from 'widgets';
import * as components from "../../components";

window.execNationalCommunityImpact = async function execNationalCommunityImpact(apiKey) {
  const beamImpactWidgetContainerId = 'beam-community-widget-container';
  const chainId = "61";

  //theme
  const themeColorConfig = {
    progressBarColor: '#16ad0b',
    confirmationButtonColor: '#16ad0b',
    causeTestColor: '#f0a358',
    textColor: '#6a6b6d',
    lightTextColor: '#bbbbbd',
    progressBarBackgroundColor: '#e3e3e3'
  }

  console.log(" execCardIntegration FOR Instacart")
  const impactData = await getImpactData();
  console.log(" IMPACT DATA: ", impactData)
  renderImpactScreen();

  function renderImpactScreen() {
    let impactScreenContainer = new components.BeamFlexWrapper({
      style: {
        flexDirection: 'column !important',
        flexWrap: 'wrap'
      },
      children: [
        getPartnerSummarySection(),
        getCommunityImpactSection()
      ]
    });
    console.log(" impact container: ", impactScreenContainer);
    document.body.append(impactScreenContainer.view);
    renderCommunityImpactWidget();
  }

  function getPartnerSummarySection() {

    return new components.BeamFlexWrapper({
      style: {
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 'auto',
        marginTop: '45px',
        padding: '0px 20px',
        maxWidth: '700px',

      },
      mobileStyle: {
        maxWidth: '400px',
        textAlign: 'center'
      },
      children: [
        new components.BeamText({
          text: `${'12,345'} meals and counting!`,
          style: {
            fontSize: '30px',
            margin: 'auto',
            fontWeight: '600'
          },
          mobileStyle: {
            fontSize: '30px',
            textAlign: 'center'
          }
        }),
        new components.BeamText({
          text: "Check out the impact we're making in the fight against food insecutiry—together.",
          style: {
            fontSize: '14px',
            color: 'grey',
            margin: 'auto',
            padding: '20px',
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
        margin: '15px 20px 5px 20px',
        borderTop: `1px solid ${themeColorConfig.progressBarBackgroundColor} `,
        borderBottom: '0',
        maxWidth: '700px'
      }
    });
  }

  async function getImpactData() {
    const beamWebSdkBaseUrl = process.env.BEAM_BACKEND_BASE_URL;
    let fullUrl = new URL('api/v2/chains/impact/all', beamWebSdkBaseUrl);
    const params = {
      chain: chainId
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

  function renderCommunityImpactWidget() {
    let widget = new beamApps.InstacartCommunityImpactWidget({
      fontFamily: "poppins",
      // widgetId: widgetId,
      noAjax: true,
      containerId: beamImpactWidgetContainerId,
      chainId: chainId,
      themeConfig: {
        hideLogo: true,
        showNational: true,
        filterByRegion: true,
        noWrap: false,
        impactCard: {
          style: {
            width: '280px'
          },
          mobileStyle: {
            width: '340px'
          }
        },
        title: {
          style: {
            fontSize: '14px',
            fontWeight: '500',
            color: themeColorConfig.textColor
          }
        },
        cause: {
          style: {
            fontSize: '11px',
            fontWeight: '500',
            color: themeColorConfig.causeTestColor
          }
        },
        region: {
          style: {
            fontSize: '10px',
            fontWeight: '300'
          }
        },
        impact: {
          style: {
            fontSize: '11px',
            fontWeight: '300',
            color: themeColorConfig.textColor
          }
        },
        impactImageHeight: '100%',
        cardImage: {
          style: {
            borderRadius: '10px',
            height: '130px',
            width: 'auto',
            // objectFit: 'contain',
            margin: '10px 10px',
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
            padding: '0px 10px 10px 10px'
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
        fontFamily: "inherit",
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
        headerPartnerLogoMargin: '0px 0px -23px',
        headerBeamLogoMargin: '0px 0px 0px 15px',
        headerContainer: {
          style: {
            display: 'flex',
            justifyContent: 'center',
            margin: '0'
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
            marginBottom: '15px',
            flexDirection: 'column !important',
            flexWrap: 'wrap !important'
          }
        },
        tabsContainer: {
          style: {
            margin: '10px',
            flexDirection: 'row !important',
            flexWrap: 'wrap !important'
          }
        },
        tab: {
          style: {
            color: themeColorConfig.progressBarColor
          },
          underline: {
            style: {
              display: 'none'
            }
          }
        },
        titleNonprofits: {
          style: {
            margin: '10px 0px',
            fontSize: '14px',
            fontWeight: "600"
          }
        }
      }
    });
    widget.data = impactData;
    widget.render({chain: chainId});

  }
}
export default window.execNationalCommunityImpact;