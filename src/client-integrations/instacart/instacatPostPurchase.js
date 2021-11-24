import * as App from 'widgets';
import * as components from "../../components";
import {pathUtil} from "../../utils";

window.execPostPurchaseView = async function execPostPurchaseView(apiKey,
                                                                  userId,
                                                                  instacartFontFamily,
                                                                  lan = "en",
                                                                  containerId, production = true) {
  // console.log(" execPostPurchaseView FOR Instacart")
  const storeId = "89";
  const chainId = "61";
  const beamWebSdkBaseUrl = production ? process.env.BEAM_BACKEND_BASE_URL : process.env.STAGE_BEAM_BACKEND_BASE_URL;
  // shop config
  const fontFamily = instacartFontFamily;
  //theme
  const themeColorConfig = {
    progressBarColor: '#0AAD0A',
    confirmationButtonColor: '#0AAD0A',
    causeTestColor: '#f0a358',
    textColor: '#4b4b4e',
    lightTextColor: '#bbbbbd',
    progressBarBackgroundColor: '#e3e3e3',
    counterColor: 'rgb(253 109 65)'
  }
  addStylesheets();
  await renderView();

  function addStylesheets() {
    //add styles here
  }

  async function renderView() {
    let data = await getTransactionInfo();
    const container = new components.BeamContainer({
      id: "beam-post-purchase-container",
      style: {
        // width: '100%',
      },
      children: [
        footer(data)
      ]
    });
    const outerContainer = document.getElementById(containerId);
    if (outerContainer) {
      outerContainer.append(container.view);
    } else {
      document.body.append(container.view);
    }

    function footer(data) {
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
            text: data?.confirmation_message || 'Your order has funded a meal </br> for someone in need.',
            textAlign: 'center',
            fontFamily: fontFamily,
            fontWeight: '600'
          }),
          data && new components.BeamText({
            text: data.favorite_nonprofit,
            textAlign: 'center',
            color: themeColorConfig.lightTextColor,
            fontSize: '12px',
            fontFamily: fontFamily,
          })

        ]
      });
    }
  }

  async function getTransactionInfo() {
    let fullUrl = new URL('api/v2/users/transaction-info', beamWebSdkBaseUrl);
    const params = {
      partner_user_id: userId,
      lan: lan,
      chain: chainId
    }
    if (params)
      fullUrl.search = new URLSearchParams(params)
        .toString()
        .replace(/null/g, "")
        .replace(/undefined/g, "");
    let response = await window.fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Api-Key ${apiKey}`
      }
    });
    if (response.status == 200)
      try {
        return await response.json();

      } catch (e) {
        return await response.statusText;
      }
    else
      return null;
  }

}

export default window.execPostPurchaseView;