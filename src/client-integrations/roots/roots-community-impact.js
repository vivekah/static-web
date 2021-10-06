import * as App from 'widgets';

window.exectCommunityImpactIntegration = function exectCommunityImpactIntegration(widgetId, containerId) {
  addStylesheets();

  console.log(" exectCommunityImpactIntegration FOR ROOTS")
  const fontFamilyRootsBold = 'Centra No1 Bold';
  const fontFamilyRootsRegular = 'Centra No1';

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
                src: url('https://beam-sdk.s3.us-west-2.amazonaws.com/fonts/CentraNo1-Bold.otf') format("opentype");
                font-display: block;
          }
         @font-face {
                font-family: 'Centra No1';
                src: url('https://beam-sdk.s3.us-west-2.amazonaws.com/fonts/CentraNo1-Book.otf') format("opentype");
                font-display: block;
          }
    `;
    document.head.appendChild(fontStyle);
  }

  let widget = new beamApps.CommunityImpactWidget({
    containerId: containerId,
    widgetId: widgetId,
    themeConfig: {
      fontFamily: fontFamilyRootsBold,
      cause: {
        style: {
          fontFamily: fontFamilyRootsRegular
        }
      },
      textColor: "#333",
      gradientColors: ["#2b5135", "#2b5135"],
      progressBarColors: [
        {color: "#2b5135", offset: "100%"}
      ],
      borderRadius: '0px',
      hideBorders: true,
      hideTabs: false,
      tab: {
        style: {
          textTransform: 'uppercase',
          textDecoration: 'none'
        }
      },
      filterByRegion: true,
      showLink: true,
      impactDetailsFontSize: '14px',
      linkTextFontSize: '12px',
      showGoalCompletionCount: true,
      goalCompletionTextFontSize: '12px',
      goalCompletionNumberTextColor: "#777777",
      goalCompletionTextColor: "#777777",
      goalCompletitionTextFontStyle: "normal",
      goalCompletionTextStyle: {
        margin: '0px',
        fontFamily: fontFamilyRootsRegular
      },
      causeTypeTransform: "uppercase",
      learnMoreAsLink: false,
      linkText: "Learn More  >",
      headerPartnerLogoMargin: "-25px 10px 0px 10px",
      headerPartnerLogoWidth: "60px",
      headerBeamLogoWidth: "60px",
      headerBeamLogoMargin: "0px 0px 0px 10px", //"0px 0px 30px 2px",
      tileOverlayPadding: '10px 15px',
      nonprofitTextFontWeight: "normal",
      learnMoreFontWeight: "normal",
      learnMoreTextColor: "#4d9767",
      percentageFontWeight: 'normal',
      percentageFontSize: '11px',
      progressBarBorder: "1px solid #d5d5d5",
      progressBar: {
        style: {
          margin: '10px 0px'
        }
      },
      percentageTextColor: "#000",
      progressBarBackgroundColor: "#fff",
      causeTitleFontSize: '20px',
      causeTypeFontSize: '12px',
      causeUpperCase: true,
      nonprofitTextLineHeight: 'none',
      impactImageHeight: '180px',
      progressBarBorderRadius: '0px',
      progressBarHeight: '8px',
      impactCardColumn1Margin: "0 10px 0 auto",
      impactCardColumn2Margin: "0 auto 0 0",
      nonprofitRow: {
        style: {
          margin: 'auto',
        }
      },
      widgetContainer: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: "center",
        }
      },
      impact: {
        style: {
          fontFamily: fontFamilyRootsRegular
        }
      },
      link: {
        style: {
          fontFamily: fontFamilyRootsRegular
        }
      },
      progressBartext: {
        style: {
          fontFamily: fontFamilyRootsRegular
        }
      },
      nonprofitsContainer: {
        style: {
          flexDirection: "column !important",
        }
      },
      logoAndNonprofitsContainer: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }
      }
    }
  });
  widget.render();
}
export default window.exectCommunityImpactIntegration;