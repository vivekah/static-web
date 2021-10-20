import Component from "./BaseComponent";
import {styleUtil} from "../utils";

class Divider extends Component {
  constructor(options = {}) {
    super();
    this._element = document.createElement(options.vertical ? "div" : "hr");

    let borderStyle = `${options.borderWidth || "1px"} solid ${
      options.borderColor || "#000"
    }`;

    this._element.style.margin = options.margin || "0";

    if (options.vertical) {
      this._element.style.cssText += `
      display: inline-block;
      width: ${options.borderWidth || "1px"};
      height: ${options.height || "100%"};
      border-left: ${borderStyle};
    `;
    } else {
      this._element.style.cssText += `
      width: ${options.width || "100%"};
      border: ${borderStyle};
    `;
    }
    if (options.style) {
      this._element.style.cssText += styleUtil.styleToString(options.style);
    }
  }
}

export default Divider;
