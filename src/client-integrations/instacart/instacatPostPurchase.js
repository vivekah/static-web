import * as App from 'widgets';
import * as components from "../../components";
import {pathUtil} from "../../utils";

window.execPostPurchaseView = async function execPostPurchaseView(containerId,
                                                                  instacartFontFamily,
                                                                  callback = () => {
                                                                  }) {
  console.log(" execPostPurchaseView FOR Instacart")

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
  const apiKey = 'RFvjWgza1Zic.389a8df3-cd51-4808-b472-c1dc413d1162';

  // shop config
  const fontFamily = 'Poppins';
  //theme
  const themeColorConfig = {
    progressBarColor: '#16ad0b',
    confirmationButtonColor: '#16ad0b',
    causeTestColor: '#f0a358',
    textColor: '#4b4b4e',
    lightTextColor: '#bbbbbd',
    progressBarBackgroundColor: '#e3e3e3',
    counterColor: 'rgb(253 109 65)'
  }
  addStylesheets();
  renderView();

  function addStylesheets() {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css?family=Poppins';
    fontLink.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(fontLink);


    const viewPortMetaTag = document.querySelector("meta[name='viewport']");
    if (!viewPortMetaTag) {
      let meta = document.createElement('meta');
      meta.name = "viewport";
      meta.content = "width=device-width,initial-scale=1.0";
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
    const fontStyle = document.createElement("style");
    fontStyle.innerHTML = `
         body {
              font-family: 'Poppins';
            }
    `;
    document.head.appendChild(fontStyle);
  }

  function getFavouriteNonprofit() {

  }

  function renderView() {
    const container = new components.BeamContainer({
      id: "beam-post-purchase-view-container",
      style: {
        width: '100%',
        height: '100%',
      },
      children: [
        // successfulPurchaseInfo(),
        // fundedMealsCounterSection(),
        footer()
      ]
    });
    const outerContainer = document.getElementById(containerId);
    if (outerContainer) {
      outerContainer.append(container.view);
    } else {
      document.body.append(container.view);
    }

    function footer() {
      return new components.BeamFlexWrapper({
        style: {
          flexDirection: 'column !important'
        },
        children: [
          new components.BeamImage({
            src: pathUtil.getAsset('instacart_purchase_icon.png'),
            style: {
              borderRadius: '50%',
              width: '55px',
              height: '55px'
            }
          }),
          new components.BeamText({
            text: 'Your order has funded a meal </br> for someone in need.',
            textAlign: 'center',

            fontWeight: '600'
          }),
          new components.BeamText({
            text: 'LA Regional Food Bank',
            textAlign: 'center',
            color: themeColorConfig.lightTextColor,
            fontSize: '12px'
          })

        ]
      });
    }

    function fundedMealsCounterSection() {
      return new components.BeamFlexWrapper({
        id: 'beam-funded-meals-counter',
        style: {
          flexDirection: 'column !important',
          margin: "90px auto"
        },
        children: [
          new components.BeamText({
            text: "⏰ With Instacart, you have saved",
            style: {
              fontSize: '18px',
              color: themeColorConfig.textColor,
              fontWeight: '700'
            }
          }),
          new components.BeamFlexWrapper({
            children: [
              fundedMealsCounter(1),
              fundedMealsCounter()
            ]
          }),
          new components.BeamText({
            text: `19 hours of shopping with 12 orders`,
            style: {
              fontSize: '14px',

              color: themeColorConfig.textColor
            }
          })

        ]
      });

    }

    function fundedMealsCounter(count = '9') {
      return new components.BeamContainer({
        style: {
          width: '70px',
          height: '70px',
          margin: '10px 3px 10px 3px',
          backgroundColor: themeColorConfig.counterColor,
          borderRadius: '5px'
        },
        children: [
          new components.BeamText({
            text: count,
            style: {
              fontSize: '52px',
              textAlign: 'center',
              fontWeight: '600',
              color: '#fff',
              width: '100%',
              height: '100%'
            }
          })
        ]
      })
    }

    function successfulPurchaseInfo() {
      return new components.BeamFlexWrapper({
        id: 'beam-all-set',
        style: {
          flexDirection: 'column !important',
        },
        children: [
          new components.BeamRoundCheckbox({
            isSelected: themeColorConfig.progressBarColor,
            style: {
              backgroundColor: '#fff',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              margin: '20px',
              marginTop: '120px',
              fill: themeColorConfig.progressBarColor
            }
          }),
          new components.BeamText({
            text: "You're all set!",
            style: {
              fontSize: '26px',
              color: themeColorConfig.textColor,
              fontWeight: 'bold'
            }
          })
        ]
      });

    }
  }

}

export default window.execPostPurchaseView;