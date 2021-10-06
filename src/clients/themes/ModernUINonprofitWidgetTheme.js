import BaseTheme from "./BaseTheme";
import * as components from "../../components";


const CARD_DEFAULT_BG_COLOR_ON_HOVER = "#F5F5F5";

class ModernUINonprofitWidgetTheme extends BaseTheme {
  constructor(options = {}) {
    super(options);
    this.isMobile = false;
  }


  static get id() {
    return "modern-ui-nonprofit";
  }

  headerText(text) {
    return new components.BeamText({
      text: text,
      style: {
        padding: "10px",
        margin: '10px 0 10px 0 ',
        color: 'black',
        fontFamily: this.options?.headerTextStyle.fontFamily,
        fontSize: "medium",
        fontWeight: "normal",
        ...this.options.headerTextStyle,
        ...this.isMobile ? this.options.headerTextMobileStyle : {},
      }
    });
  }

  card(nonprofit, margin = "0", selectedNonprofit) {
    const borderWithGradientStyle = {
      backgroundImage: selectedNonprofit?.id === nonprofit.id ? `linear-gradient(to right, ${this.gradientColors})` : '#D0D0D0',
      backgroundClip: "padding-box, border-box",
      borderRadius: "5px",
      display: 'flex',
      margin: '5px',
      flex: 1,
      alignSelf: 'stretch',
      padding: '2px'// card border size
    };

    const cardDefaultStyle = {
      borderRadius: "5px",
      overflow: "hidden",
      padding: "8px",
      cursor: "pointer",
      flexDirection: 'row',
      backgroundColor: '#fff',
      flexWrap: 'nowrap',
      flex: 1,
      alignSelf: 'stretch',
      background: "#fff",
      display: 'flex'
    };

    const cardContent = new components.BeamContainer({
      hoverStyle: {
        backgroundColor: CARD_DEFAULT_BG_COLOR_ON_HOVER,
        ...(this.options?.card?.hoverStyle && {backgroundColor: this.options.card?.hoverStyle?.backgroundColor})
      },
      style: {
        ...cardDefaultStyle,
        ...this.options?.card?.style,
        ...this.isMobile ? this.options?.card?.mobileStyle : {},
        ...{border: 'none!important'} //do not change, this contanier
                                      // should not have any border as the border is added with background image for gradients
      },
      children: [
        // card image
        new components.BeamCardImage({
          src: nonprofit.image,
          style: {
            minWidth: '0',
            objectFit: "cover",
            borderRadius: '3px',
            aspectRatio: '1 / 1',
            flex: '1',
            ...this.options?.image?.style,
            ...this.isMobile ? this.options?.image?.mobileStyle : {},
          }
        }),
        // card text wrapper
        new components.BeamContainer({
          style: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            margin: '0 0 0 0.8rem',
            flex: "2",
            ...this.options?.card?.textWrapperStyle,
            ...this.isMobile ? this.options?.card?.textWrapperMobileStyle : {},
          },
          children: [
            //title
            new components.BeamFlexWrapper({
              children: [
                new components.BeamFlexWrapper({
                  style: {
                    flexGrow: 2,
                    ...this.options?.cardTitle?.wrapperStyle,
                    ...this.isMobile ? this.options?.cardTitle?.wrapperMobileStyle : {},
                  },
                  children: [
                    // card  title
                    new components.BeamText({
                      tag: "h4",
                      text: nonprofit.cause,
                      style: {
                        fontFamily: "inherit",
                        fontWeight: "bold",
                        fontSize: "12px",
                        color: "black",
                        margin: "0 18px 0 0",
                        ...this.options?.cardTitle?.textStyle,
                        ...this.isMobile ? this.options?.cardTitle?.textMobileStyle : {},
                      }
                    })]
                }), new components.BeamFlexWrapper({
                  style: {
                    flexShrink: 1,
                    ...this.options?.checkbox?.wrapperStyle,
                    ...this.isMobile ? this.options?.checkbox?.wrapperMobileStyle : {},
                  },
                  children: [
                    new components.BeamRoundCheckbox({
                      noSelections: !selectedNonprofit,
                      isSelected: selectedNonprofit && nonprofit.id === selectedNonprofit.id,
                      style: {
                        color: '#262626FF',
                        position: 'absolute',
                        right: '10px',
                        top: '10px',
                        ...this.options?.checkbox?.style,
                        ...this.isMobile ? this.options?.checkbox?.mobileStyle : {},
                      }
                    }),
                  ]
                }),
              ]
            }),
            // description wrapper
            new components.BeamContainer({
              children: [
                // text wrapper
                new components.BeamContainer({
                  style: {
                    flexGrow: 3,
                    width: "100%",
                    ...this.options?.description?.wrapperStyle
                  },
                  children: [
                    // description
                    new components.BeamText({
                      text: (this.options.lan ? nonprofit.impact_description + " via " + nonprofit.name : "Fund " + nonprofit.impact_description) + " via " + nonprofit.name,
                      style: {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        margin: '3px 0 0 0',
                        fontFamily: 'inherit',
                        fontSize: "10px",
                        lineHeight: "1.4em",
                        color: "black",
                        ...this.options?.description?.style,
                        ...this.isMobile ? this.options?.description?.mobileStyle : {},
                      }
                    }),
                  ],
                }),
              ],
            }),
            //cause
            new components.BeamContainer({
              style: {
                flexWrap: 'nowrap !important',
                paddingTop: '15px',
                justifyContent: "space-between",
                marginTop: "auto",
                alignItems: 'flex-end',
                ...this.options?.cause?.wrapperStyle,
                ...this.isMobile ? this.options?.cause?.wrapperMobileStyle : {},
              },
              children: [
                new components.BeamText({
                  text: nonprofit.cause,
                  style: {
                    overflow: "hidden",
                    margin: '3px 0 0 0',
                    fontFamily: 'inherit',
                    fontSize: "12px",
                    lineHeight: "1.4em",
                    color: "black",
                    ...this.options?.cause?.style,
                    ...this.isMobile ? this.options?.cause?.mobileStyle : {},
                  }
                }),
              ]
            }),
            // progress wrapper
            new components.BeamFlexWrapper({
              style: {
                flexWrap: 'nowrap !important',
                paddingTop: '15px',
                justifyContent: "space-between",
                marginTop: "auto",
                alignItems: 'flex-end',
                ...this.options?.progressBar?.wrapperStyle,
                ...this.isMobile ? this.options?.progressBar?.wrapperMobileStyle : {},
              },
              children: [
                // progress
                new components.BeamProgressWrapper({
                  percentage: nonprofit?.impact?.percentage,
                  style: {
                    height: '7px',
                    backgroundColor: '#fff',
                    border: '1px solid #D0D0D0',
                    fontSize: '10px',
                    flex: '1 0 auto',
                    ...this.options?.progressBar?.style,
                    ...this.isMobile ? this.options?.progressBar?.mobileStyle : {},

                  }
                }),
                // percentage text
                new components.BeamText({
                  text: `${nonprofit?.impact?.percentage}%`,
                  style: {
                    textAlign: "left",
                    fontFamily: "inherit",
                    color: "#C0C0C0",
                    fontWeight: "bold",
                    fontSize: "10px",
                    margin: "auto 0 0 5px",
                    whiteSpace: 'nowrap',
                    ...this.options?.progressBar?.textStyle,
                    ...this.isMobile ? this.options?.progressBar?.textMobileStyle : {},

                  },
                }),
              ],
            }),
          ],
        }),
      ]
    });

    return new components.BeamCard({
      hoverStyle: {
        backgroundColor: CARD_DEFAULT_BG_COLOR_ON_HOVER,
        ...(this.options?.card?.hoverStyle && this.options?.card?.hoverStyle)
      },
      clickListener: nonprofit.onClick,
      style: {
        ...borderWithGradientStyle,
        ...this.options?.card?.backgroundStyle,
        ...this.isMobile ? this.options.card?.backgroundMobileStyle : {},
      },
      children: [cardContent],
    });
  }

  column(nonprofit, lastNonprofit) {
    return new components.BeamCard({
      width: "100%",
      cornerRadius: "5px",
      padding: "2px",
      backgroundImage: lastNonprofit?.id === nonprofit.id &&
        `linear-gradient(to right, ${this.gradientColors})`,
      children: [this.card(nonprofit, null, lastNonprofit)],
    });
  }

  emptyCard() {
    const cardDefaultStyle = {
      borderRadius: "5px",
      overflow: "hidden",
      padding: "8px",
      cursor: "auto",
      flexDirection: 'row',
      backgroundColor: 'transparent !important',
      border: 'none !important',
      flexWrap: 'nowrap',
      flex: 1,
      alignSelf: 'stretch',
      display: 'flex'
    };
    return new components.BeamCard({
      style: cardDefaultStyle
    });
  }

  headerComponent({headerLogo, text}) {
    return new components.BeamContainer({
      width: "100%",
      children: [headerLogo],
    });
  }

  mobileComponent(nonprofits, lastNonprofit) {
    console.log(" mobile view")
    return this.desktopListComponent(nonprofits, lastNonprofit, true);
  }

  desktopListComponent(nonprofits, selectedNonprofit, wrap = false) {
    this.isMobile = wrap;
    this.showProgress = this.options.showCommunityImpact || nonprofits.some(
      (nonprofit) => parseInt(nonprofit.impact.percentage) > 0
    );

    const column = (nonprofit, selectedNonprofit, margin) => {
      return nonprofit ? this.card(nonprofit, null, selectedNonprofit) : this.emptyCard();
    };

    const twoColumnList = (nonprofits, selectedNonprofit) => {
      return nonprofits.map((nonprofit, index) => {
        if ((index + 1) % 2 !== 0) {
          let nonprofit2 = nonprofits[index + 1];

          return new components.BeamFlexWrapper({
            centerItems: false,
            noWrap: !wrap,
            justifyContent: 'stretch',
            children: [
              // column 1
              column(nonprofit, selectedNonprofit),
              // column 2
              column(nonprofit2, selectedNonprofit),
            ],
          });
        }
      });
    };
    const oneColumnList = (nonprofits, selectedNonprofit) => {
      return [
        new components.BeamFlexWrapper({
          margin: "15px auto auto auto",
          textAlign: 'center',
          alignItems: "center",
          justifyContent: 'center',
          flexDirection: 'column',
          children: nonprofits.map((nonprofit, index) =>
            column(
              nonprofit,
              selectedNonprofit
            )
          ),
        }),
      ]
    };
    const headerComponent = this.headerText(this.options.headerText || `Select a cause and <b>we'll donate 1%</b> of your purchase there for you.`);
    const listNonprofits = wrap ? oneColumnList(nonprofits, selectedNonprofit) : twoColumnList(nonprofits, selectedNonprofit);
    return new components.BeamContainer({
      children: [headerComponent, ...listNonprofits]
    });
  }
}

export default ModernUINonprofitWidgetTheme;