import * as App from 'widgets';
import * as components from "../../components";
import {pathUtil} from "../../utils";

window.execNationalCommunityImpact = async function execNationalCommunityImpact(apiKey, fontFamily, language, containerId) {
  const beamImpactWidgetContainerId = 'beam-community-widget-container';
  const chainId = "61";

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
        flexWrap: 'wrap'
      },
      children: [
        getJoinUsSection(impactData),
        getPartnerSummarySection(),
        getCommunityImpactSection()
      ]
    });
    let container = document.getElementById(containerId);
    if (container) {
      container.append(impactScreenContainer.view);
    } else {
      document.body.append(impactScreenContainer.view);
    }

    renderCommunityImpactWidget();
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
        padding: '0px 20px',
        fontFamily: fontFamily || 'inherit'
      },
      children: [
        new components.BeamFlexWrapper({
          children: [
            new components.BeamImage({
              alt: 'Instacart Purchase Icon',
              src: pathUtil.getAsset('instacart_purchase_icon.png'),
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
                fontWeight: '600'
              }
            }),
            new components.BeamText({
              text: `${impactData?.personal_impact_description || 'Food meals this holiday season by simply placing your order.'}`,
              style: {
                fontSize: '12px',
                lineHeight: '18px',
                fontFamily: fontFamily || 'inherit'
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
          })]}),
            new components.BeamText({
              style: {
                fontSize: '12px',
                lineHeight: '18px',
                marginTop: '11px',
              },
              text: `<a href='results' style='color: green; text-decoration: none;'>${impactData.personal_impact_cta} </a>`
            })
          ]
        }),
      ]
    });
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
          text: `${impactData.aggregate_impact || '0'} meals and counting!`,
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
          text: "Check out the impact we're making in the fight against food insecutiry—together.",
          style: {
            fontSize: '15px',
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
    // let fullUrl = new URL('api/v2/users/impact/instacart/community', beamWebSdkBaseUrl);
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
    let widget = new beamApps.InstacartNationalImpactWidget({
      fontFamily: fontFamily || 'inherit',
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
            // marginBottom: '15px',
            flexDirection: 'column !important',
            flexWrap: 'wrap !important'
          }
        },
        tabsContainer: {
          style: {
            margin: '20px 10px 14px 10px',
            flexDirection: 'row !important',
            flexWrap: 'wrap !important'
          }
        },
        tab: {
          style: {
            color: themeColorConfig.progressBarColor,
            fontSize: '12px'
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
            margin: '10px 0px 0px 0px',
            fontFamily: `${fontFamily} !important`,
            fontSize: "23px",
            lineHeight: "28px",
            textAlign: "center",
            color: "#343538",
            fontWeight: 700
          }
        }
      }
    });
    widget.data = impactData;
    widget.render({chain: chainId});

  }
}
export default window.execNationalCommunityImpact;