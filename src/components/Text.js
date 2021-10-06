import Component from "./BaseComponent";
import {styleUtil} from "../utils";

class Text extends Component {
  constructor(options = {}) {
    super();
    this._element = document.createElement(options.tag || "p");
    this._element.style.cssText = `
      font-family: ${options.fontFamily || "poppins"};
      font-size: ${options.fontSize || "medium"};
      font-weight: ${options.fontWeight || "normal"};
      color: ${options.color || "#000"};
      text-transform: ${options.textTransform || "none"};
      letter-spacing: ${options.letterSpacing || "normal"};
      line-height: ${options.lineHeight || "normal"};
      margin: ${options.margin || "0"};
      padding: ${options.padding || "0"};
      text-decoration: ${options.asLink ? "underline" : "none"};
      text-align: ${options.textAlign || "left"};
      cursor: ${options.cursor || "arrow"};
      border: ${options.border || "none"};
      ${options.width ? `width: ${options.width};` : ""}
      ${options.maxWidth ? `max-width: ${options.maxWidth};` : ""}
      ${options.whiteSpace ? `white-space: ${options.whiteSpace};` : ""}
      ${options.minWidth ? `min-width: ${options.minWidth};` : ""}
    `;
    this._element.innerHTML = options.text;
    if (options.clickListener) {
      this._element.addEventListener("click", options.clickListener);
    }
    if (options.addAttribute) {
      this._element.setAttribute("data-start", options.dataStart);
      this._element.setAttribute("data-end", options.dataEnd);
    }
    if (options.className) {
      this._element.className = options.className;
    }

    if (options.style) {
      this._element.style.cssText += styleUtil.styleToString(options.style);
    }
  }
}

export default Text;
