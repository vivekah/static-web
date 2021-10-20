import {screenResolutionUtil, styleUtil} from "./index";

const styleToString = (style) => {
  return Object.keys(style).reduce((acc, key) => (
    acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + style[key] + ';'
  ), '');
};

const addStyleOnHover = (element, style) => {
  const oldStyle = element.style.cssText;
  element.onmouseover = function () {
    this.style.cssText += styleUtil.styleToString(style);
  }
  element.onmouseleave = function () {
    this.style.cssText = oldStyle;
  }
}

const addStyle = (element, options) => {
  if (options.style) {
    element.style.cssText += styleUtil.styleToString(options.style);
  }
  if (options.hoverStyle) {
    styleUtil.addStyleOnHover(element, options.hoverStyle);
  }

  function addMobileStyle(element, options) {
    if (screenResolutionUtil.isMobile() && options.mobileStyle) {
      element.style.cssText += styleUtil.styleToString(options.mobileStyle);
    }
  }

  function addDesktopStyle(element, options) {

    if (!screenResolutionUtil.isMobile() && options.style) {
      element.style.cssText += styleUtil.styleToString(options.style);
    }
  }

  let mobileScreen = window.matchMedia("(max-width: 750px)")
  addMobileStyle(element, options) // Call listener function at run time
  mobileScreen.addListener(() => {
    addMobileStyle(element, options)
  }) // Attach listener function on state changes

  let desktopScreen = window.matchMedia("(min-width: 751px)")
  addDesktopStyle(element, options) // Call listener function at run time
  desktopScreen.addListener(() => {
    addDesktopStyle(element, options)
  })

}

export default {
  styleToString,
  addStyleOnHover,
  addStyle
}
