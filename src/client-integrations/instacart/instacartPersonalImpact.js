import * as components from "../../components";
import {pathUtil} from "../../utils";

window.execPersonalImpact = async function execPersonalImpact(apiKey,
                                                              userId,
                                                              fontFamily,
                                                              lan = 'en',
                                                              containerId,
                                                              showCta = true,
                                                              reviewResultsCallback = () => {
                                                              }, production = true) {

  const beamWebSdkBaseUrl = production ? process.env.BEAM_BACKEND_BASE_URL : process.env.STAGE_BEAM_BACKEND_BASE_URL;
  const themeColorConfig = {
    progressBarColor: '#16ad0b',
    confirmationButtonColor: '#16ad0b',
    causeTestColor: '#f0a358',
    textColor: '#6a6b6d',
    lightTextColor: '#bbbbbd',
    progressBarBackgroundColor: '#e3e3e3'
  }
  const reviewResultsId = 'review-results-link-personal-impact';
  await renderImpactScreen();

  async function renderImpactScreen() {
    const impactData = await getImpactData(userId);

    let impactScreenContainer = new components.BeamContainer({
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      },
      children: [
        getJoinUsSection(impactData),
      ]
    });
    let container = document.getElementById(containerId);
    if (container) {
      container.append(impactScreenContainer.view);
    } else {
      document.body.append(impactScreenContainer.view);
    }
    addCallbacks();
  }

  function addCallbacks() {
    document.getElementById(reviewResultsId).addEventListener('click', reviewResultsCallback);
  }

  async function getImpactData(userId) {
    let fullUrl = new URL('api/v2/users/personal/instacart', beamWebSdkBaseUrl);
    const params = {
      user: userId,
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
              src: impactData?.personal_impact_image || pathUtil.getAsset('instacart_purchase_icon.png'),
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
            impactData?.personal_impact_description && new components.BeamText({
              text: `${impactData?.personal_impact_description || 'Food meals this holiday season by simply placing your order.'}`,
              style: {
                fontSize: '12px',
                lineHeight: '18px',
                fontFamily: fontFamily || 'inherit'
              }
            }),
            impactData?.percentage && new components.BeamFlexWrapper({
              noWrap: true,
              width: '100%',
              alignItems: 'center',
              alignContent: 'center',
              children: [
                impactData?.percentage && new components.BeamProgressWrapper({
                  percentage: impactData?.percentage,
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
                impactData?.percentage && new components.BeamText({
                  tag: "h6",
                  text: impactData?.percentage + "&#37;",
                  fontSize: '12px',
                  color: '#343538',
                  fontWeight: '200',
                  fontFamily: fontFamily || 'inherit'
                })]
            }),
            showCta && new components.BeamText({
              style: {
                fontSize: '12px',
                lineHeight: '18px',
                marginTop: '11px',
                fontFamily: fontFamily || 'inherit'
              },
              text: `<a href='#' id="${reviewResultsId}" style='color: green; text-decoration: none;'>${impactData?.personal_impact_cta} </a>`
            })
          ]
        }),
      ]
    });
  }

}
export default window.execPersonalImpact;