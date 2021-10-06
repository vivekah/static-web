import {styleUtil} from "./index";

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

export default {
  styleToString,
  addStyleOnHover
}
