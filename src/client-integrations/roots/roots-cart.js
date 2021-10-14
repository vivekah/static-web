import * as App from 'widgets';

window.execCardIntegration = async function execCardIntegration(cartTotal,
                                                                beamWebSdkBaseUrl, containerId, shopDomain,
                                                                widgetId, storeId, callback = () => {
  },chainId) {
  console.log(" execCardIntegration FOR ROOTS")

  addStylesheets();
  // shop config
  const fontFamily = 'Centra No1 Bold';
  const fontFamilyRootsRegular = 'Centra No1';
  // widget config
  let beamUser = null;
  const key = `beam_transaction_key_${widgetId}`;
  const nonprofitKey = `beam_nonprofit_key_${widgetId}`;
  let storedNonprofitId = window.localStorage.getItem(nonprofitKey) || null;
  let widget = null;
  let beamNonprofitData = null;


  function addStylesheets() {
    const viewPortMetaTag = document.querySelector("meta[name='viewport']");
    if (!viewPortMetaTag) {
      let meta = document.createElement('meta');
      meta.name = "viewport";
      meta.content = "width=device-width,initial-scale=1.0";
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
    const fontStyle = document.createElement("style");
    fontStyle.innerHTML = `
         @font-face {
                font-family: 'Centra No1 Bold';
                font-display: block;
                src: url('https://beam-sdk.s3.us-west-2.amazonaws.com/fonts/CentraNo1-Bold.otf') format("opentype");
          }
         @font-face {
                font-family: 'Centra No1';
                font-display: block;
                src: url('https://beam-sdk.s3.us-west-2.amazonaws.com/fonts/CentraNo1-Book.otf') format("opentype");
          }
    `;
    document.head.appendChild(fontStyle);
  }

  function persistTransaction() {
    let transactionId = window.localStorage.getItem(key);
    let persistTransactionRequest = new XMLHttpRequest();

    return new Promise(function (resolve, reject) {
      persistTransactionRequest.onreadystatechange = async function () {
        if (persistTransactionRequest.readyState !== 4) return;

        if (persistTransactionRequest.status >= 200 && persistTransactionRequest.status < 300) {
          let transactionId = JSON.parse(persistTransactionRequest.responseText);
          console.debug("Transaction id:", transactionId);
          window.localStorage.setItem(key, transactionId);
          window.localStorage.setItem(nonprofitKey, widget.transactionData.nonprofit);
          storedNonprofitId = widget.transactionData.nonprofit
          widget.lastNonprofit = beamNonprofitData.nonprofits.filter(x => x.id == storedNonprofitId)[0] || null;
          resolve(persistTransactionRequest);
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

      persistTransactionRequest.open("POST", `${beamWebSdkBaseUrl}/api/v2/users/selection`, true);
      persistTransactionRequest.setRequestHeader('Content-type', 'application/json')
      let body = JSON.stringify({
        ...widget.transactionData,
        selection_id: transactionId
      });
      persistTransactionRequest.send(body);
    });
  }

  function getBeamWidget() {
    // initialize nonprofit widget
    return new beamApps.NonprofitWidget({
      widgetId: widgetId,
      containerId: containerId,
      userDidMatchCallback: async (matched, amount) => {
        // process action
        console.log("Not implemented");
      },
      renderAfterSelection: true,
      selectedNonprofitCallback: async (nonprofit, store) => {
        console.debug(nonprofit);

        const success = await persistTransaction();
        if (success) {
          console.debug("Transaction persisted.");
          callback({id: nonprofit.id, name: nonprofit.name})
        } else {
          console.error("Transaction could not be persisted");
          callback({error: "Transaction could not be persisted"});
        }
      },
      isPreCheckout: false,
      forceMobileView: true,
      fontFamily: fontFamily,
      // noAjax: true,
      themeConfig: {
        id: "minimal-ui-nonprofit",
        textColor: "#222633",
        fontFamily: fontFamily,
        headerTextFontFamily: fontFamily,
        backgroundColor: "rgba(0,0,0,0)", //"rgba(0,0,0,0)",
        tileTextColor: "#222633",
        hidePoweredBy: false,
        selectedNonprofitBackgroundColor: "#2B5134", //"#FC2091",
        iconButtonBackgroundColor: "#fff", //"rgba(0,0,0,0)",
        selectedBorder: "1px solid #105e65", //"2px #FC2091 solid",
        progressBarBackgroundColor: "#fff",
        tileBorderColor: "#999999",
        tileBorderThickness: "1px",
        tileDescriptionFontSize: "15px",
        tilePercentageFontWeight: "normal",
        tilePercentageTextAlign: "right",
        progressBarColors: [
          {color: "#2B5134", offset: "100%"},
        ],
        tileBorderRadius: "3px",
        showLogo: false,
        headerTextMargin: "10px 0px 0px 0px",
        headerText: `Select a nonprofit and 1% of your purchase will be donated there for you`,
        headerTextFontWeight: "normal",
        poweredByTextColor: "#222633",
        poweredByFontSize: "13px",
        headerTextFontSize: "15px",
        tileCauseFontSize: "13px",
        nonprofitCornerRadius: "3px",
        progressBarBorderRadius: "0px",
        progressBarWidth: "70%",
        tilePercentageWidth: '30%',
        tilePercentageFontSize: "13px",
        tileCauseLetterSpacing: "0px",
        headerPartnerLogoWidth: "60px",
        headerPartnerLogoMargin: "0px 10px 10px 0px",
        headerBeamLogoMargin: "0 0 0 3px",
        headerTextFontColor: "#222633",
        fundingTextFontWeight: "normal",
        fundingNonprofitNameTextFontWeight: "normal",
        fundingViaTextFontWeight: "normal",
        tilePercentageTextColor: "#827B7BE4",
        iconButtonBorder: "1px solid #827B7BE4",
        progressBarBorder: "1px #827B7BE4 solid",
        progressBartext: {
          style: {
            fontFamily: fontFamilyRootsRegular
          }
        },
        impact: {
          style: {
            fontFamily: fontFamilyRootsRegular
          }
        },
        cause: {
          style: {
            fontFamily: fontFamilyRootsRegular
          }
        },
        poweredBy: {
          style: {
            fontFamily: fontFamilyRootsRegular,
            fontSize: '11px',
            color: "#827B7BE4"
          }
        }
      }
    });
  }

  function getNonProfits() {

    widget = getBeamWidget();
    // widget.data = res;
    // widget.lastNonprofit = beamNonprofitData.nonprofits.filter(x => x.id == storedNonprofitId)[0] || null

    widget.render({
      chain: chainId,
      user: beamUser,
      store: storeId,
      cartTotal: cartTotal,
      showCommunityImpact: true,
    });
    // let fetchNonprofitsXHR = new XMLHttpRequest();
    // fetchNonprofitsXHR.onreadystatechange = async function () {
    //   if (fetchNonprofitsXHR.readyState !== 4) return;
    //   if (fetchNonprofitsXHR.status >= 200 && fetchNonprofitsXHR.status < 300) {
    //     let res = JSON.parse(fetchNonprofitsXHR.responseText);
    //     beamNonprofitData = res;
    //
    //
    //     if (widget.lastNonprofit) {
    //       let successfulTransaction = await persistTransaction();
    //       if (successfulTransaction) {
    //         console.debug("Transaction persisted.");
    //         callback({id: widget.lastNonprofit.id, name: widget.lastNonprofit.name})
    //       } else {
    //         console.error("Transaction could not be persisted");
    //         callback({error: "Transaction could not be persisted"})
    //
    //       }
    //     }
    //   }
    // }
    // fetchNonprofitsXHR.open("GET", `${beamWebSdkBaseUrl}/api/v2/chains/nonprofits?chain=${chainId}&store=${storeId}`, true);
    // fetchNonprofitsXHR.send();
  }

  getNonProfits();
}

export default window.execCardIntegration;