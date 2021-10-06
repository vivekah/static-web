import Text from "./Text";
import {styleUtil} from "../utils";

class Anchor extends Text {
  constructor(options = {}) {
    options.tag = "a";
    super(options);
    this._element.style.display = "inline-block";
    this._element.href = options.href || "#";
    this._element.target = options.target || "_blank";
    if (!options.asLink) {
      this._element.style.textDecoration = "none !important";
    }

    this._element.innerHTML = options.text;

    options.children &&
    options.children.forEach((child) => {
      child && this._element.appendChild(child.view);
    });


    if (options.style) {
      this._element.style.cssText += styleUtil.styleToString(options.style);
    }
  }
}

export default Anchor;
