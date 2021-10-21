import * as App from 'widgets';
import * as components from "../../components";
import {screenResolutionUtil} from "../../utils";
import Glide from "@glidejs/glide";
// Required Core Stylesheet
import css from './instacart.scss';

window.execCommunityImpact = async function execCommunityImpact(userId,
                                                                countryCode
) {
  const beamImpactWidgetContainerId = 'beam-community-widget-container';
  const beamSliderClass = 'splide';
  const chainId = '7';
  let isMobile = screenResolutionUtil.isMobile();
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
        devider(),
        getPartnerSummarySection(),
        getTutorialSection(),
        getImpactSummarySection(),
        getCommunityImpactSection()
      ]
    });
    console.log(" impact container: ", impactScreenContainer);
    document.body.append(impactScreenContainer.view);
    createCarousel();
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
          text: 'Help us fight food insecurity',
          style: {
            fontSize: '40px',
            margin: 'auto',
            fontWeight: '600'
          },
          mobileStyle: {
            fontSize: '30px',
            textAlign: 'center'
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

  function getJoinUsSection() {
    return new components.BeamFlexWrapper({
      style: {
        maxWidth: '600px',
        height: '100px',
        justifyContent: 'center',
        margin: 'auto',
        marginTop: '0px',
        flexDirection: 'row',
        flexWrap: 'nowrap !important',
        padding: '0px 20px'
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
    let slider = new components.BeamContainer({id: beamSliderClass});
    slider.view.innerHTML = `
<div class="glide">
  <div class="glide__track" data-glide-el="track">
    <ul class="glide__slides">
      <li class="glide__slide">0</li>
      <li class="glide__slide">1</li>
      <li class="glide__slide">2</li>
    </ul>
  </div>
   <div class="glide__arrows" data-glide-el="controls">
    <button class="glide__arrow glide__arrow--left" data-glide-dir="<">prev</button>
    <button class="glide__arrow glide__arrow--right" data-glide-dir=">">next</button>
  </div>
    <div class="glide__bullets" data-glide-el="controls[nav]">
    <button class="glide__bullet" data-glide-dir="=0"></button>
    <button class="glide__bullet" data-glide-dir="=1"></button>
    <button class="glide__bullet" data-glide-dir="=2"></button>
  </div>
</div>`
    return new components.BeamFlexWrapper({
      style: {
        flexDirection: 'column !important'
      },
      children: [
        new components.BeamText({
          text: 'How it works',
          style: {
            fontSize: '20px',
            margin: 'auto',
            fontWeight: '600'
          }
        }),
        slider
      ]
    });
  }

  function createCarousel() {
    new Glide('.glide').mount()
  }

  function getImpactSummarySection() {
    return new components.BeamFlexWrapper({
      style: {
        borderRadius: '15px',
        backgroundColor: '#efefef',
        maxWidth: '700px',
        height: '100px',
        justifyContent: 'center',
        padding: '20px',
        margin: 'auto',
        marginTop: '0px',
        flexDirection: 'row',
        flexWrap: 'nowrap !important'
      },
      mobileStyle: {
        flexDirection: 'column !important',
        backgroundColor: '#fff',
      },
      children: [
        new components.BeamText({
          text: 'Together we funded 27,571 meals nationwide',
          style: {
            fontSize: '22px',
            fontWeight: '600',
            marginRight: '10px',
            textAlign: 'left'
          },
          mobileStyle: {
            textAlign: 'center'
          }
        }),
        new components.BeamText({
          text: "FPO we've partnered with hunderds of local and national charitys. <a href='' style='color: green;'>Review national impact </a>",
          style: {
            fontSize: '14px',
            color: 'gray',
            fontWeight: '200',
            marginLeft: '10px',
            textAlign: isMobile ? 'center' : 'left'
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
          "Authorization": 'Api-Key RFvjWgza1Zic.389a8df3-cd51-4808-b472-c1dc413d1162'
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
        hideLogo: true,
        noWrap: false,
        impactCard: {
          style: {
            width: '280px'
          },
          mobileStyle: {
            width: '340px'
          }
        },
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
            borderRadius: '25px',
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
            maxWidth: '1200px'
          },
          mobileStyle: {
            flexDirection: 'column !important',
            margin: 'auto',
            alignItems: 'center !important',
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
          completedText: '✅ Instacart has reached 100% goal!',
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