import * as App from 'widgets';
import * as components from "../../components";
import {CommunityImpactIntegration} from "./index";
import {InstacartCommunityImpactWidget} from "../../clients";

window.execCommunityImpact = async function execCommunityImpact(userId,
                                                                countryCode
) {
  const beamImpactWidgetContainerId = 'beam-community-widget-container';
  const chainId = '7';
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
  const impactData = await getImpactData(userId, countryCode);
  console.log(" IMPACT DATA: ", impactData)
  renderImpactScreen();

  function renderImpactScreen() {
    let impactScreenContainer = new components.BeamFlexWrapper({
      style: {
        flexDirection: 'column !important',
        flexWrap: 'wrap'
      },
      children: [
        getJoinUsSection(),
        getPartnerSummarySection(),
        getTutorialSection(),
        getImpactSummarySection(),
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
        width: '600px',
        marginTop: '45px'
      },
      children: [
        new components.BeamText({
          text: 'Help us fight food insecurity',
          style: {
            fontSize: '40px',
            margin: 'auto',
            fontWeight: '600'
          }
        }),
        new components.BeamText({
          text: "This holiday season, Instacart has partnered with 4 non-profits in support of our mission to create" +
            " a world where everyone has access to the food they love and more time to enjoy it together.",
          style: {
            fontSize: '14px',
            color: 'grey',
            margin: 'auto',
            padding: '20px',
            textAlign: 'center'
          }
        })
      ]
    })
  }

  function getJoinUsSection() {
    return new components.BeamFlexWrapper({
      style: {
        borderBottom: '1px solid grey',
        width: '600px',
        height: '100px',
        justifyContent: 'center',
        margin: 'auto',
        marginTop: '0px',
        flexDirection: 'row',
        flexWrap: 'nowrap !important'
      },
      children: [
        new components.BeamFlexWrapper({
          children: [
            new components.BeamImage({
              alt: 'Beam Logo',
              src: 'https://d1jhb45gnbgj0c.cloudfront.net/beam_images/Beam+Logo_Vector.png',
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
          style: {
            flexDirection: 'column',
          },
          children: [
            new components.BeamText({
              text: 'Join us in the fight against food insecurity'
            }),
            new components.BeamText({
              text: "Food meals this holiday season by simply placing your order. <a href='' style='color: green;'>Select a nonprofit </a>",
              style: {
                fontSize: '12px'
              }
            })
          ]
        })
      ]
    });
  }

  function getTutorialSection() {
    return new components.BeamFlexWrapper({
      style: {},
      children: [
        new components.BeamText({
          text: 'How it works',
          style: {
            fontSize: '20px',
            margin: 'auto',
            fontWeight: '600'
          }
        }),
        //https://splidejs.com/guides/getting-started/
      ]
    });
  }

  function getImpactSummarySection() {
    return new components.BeamFlexWrapper({
      style: {
        borderRadius: '15px',
        backgroundColor: '#efefef',
        width: '700px',
        height: '100px',
        justifyContent: 'center',
        padding: '20px',
        margin: 'auto',
        marginTop: '0px',
        flexDirection: 'row',
        flexWrap: 'nowrap !important'
      },
      children: [
        new components.BeamText({
          text: 'Together we funded 27,571 meals nationwide',
          style: {
            fontSize: '20px',
            fontWeight: '600',
            marginRight: '10px'
          }
        }),
        new components.BeamText({
          text: "FPO we've partnered with hunderds of local and national charitys. <a href='' style='color: green;'>Review national impact </a>",
          style: {
            fontSize: '14px',
            color: 'gray',
            fontWeight: '200',
            marginLeft: '10px'
          }
        })
      ]
    });
  }

  function getCommunityImpactSection() {
    return new components.BeamContainer({
      id: beamImpactWidgetContainerId
    });
  }

  async function getImpactData(userId, countryCode) {
    const beamWebSdkBaseUrl = process.env.BEAM_BACKEND_BASE_URL;
    let fullUrl = new URL('api/v2/users/impact/instacart', beamWebSdkBaseUrl);
    const params = {
      user: userId,
      zip_code: countryCode
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
          "Authorization": 'Api-Key WiU4Vpap'
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
      widgetId: widgetId,
      containerId: beamImpactWidgetContainerId,
      themeConfig: {
        noWrap: false,
        impactCardWidth: '280px',
        tileHeight: '100%',
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
        cardImage: {
          style: {
            padding: '10px',
            borderRadius: '25px'
          }
        },
        cardbody: {
          style: {
            padding: '10px'
          }
        },
        border: `1px solid ${themeColorConfig.progressBarBackgroundColor}`,
        tileOverlayBackground: 'transparent',
        nonprofitsContainer: {
          style: {
            // flexFlow: "nowrap !important"
            alignItems: 'flex-start !important',
            margin: 'auto',
            width: '1200px'
          }
        },
        fontFamily: "inherit",
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
        headerContainer: {
          style: {
            display: 'flex',
            justifyContent: 'center',
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
            margin: '15px 0px 5px 0px',
            borderTop: `1px solid ${themeColorConfig.progressBarBackgroundColor} `,
            borderBottom: '0'
          }
        },
        goalInfo: {
          text: 'Help Instacart reach this goal!',
          completedText: 'Instacart has reached 100% goal!',
          contributeText: `<a style="color: ${themeColorConfig.progressBarColor}"> Contribute to this effort with your next order > </a>`,
          style: {
            fontSize: '11px',
            color: themeColorConfig.textColor
          }
        }
      }

    });
    widget.render({chain: chainId});
  }
}
export default window.execCommunityImpact;