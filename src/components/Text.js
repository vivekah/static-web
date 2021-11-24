import Component from "./BaseComponent";
import {styleUtil} from "../utils";

class Text extends Component {
  constructor(options = {}) {
    super(options);
    this._element = document.createElement(options.tag || "p");
    if (options.href) this._element.href = options.href
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
      if (options.clickListenerParams) {
        this._element.addEventListener("click", (e) => {
          options.clickListener(options.clickListenerParams)
          e.preventDefault(); // Cancel the native event
          return false;
        });
      } else {
        this._element.addEventListener("click", function (e) {
          options.clickListener();
          e.preventDefault(); // Cancel the native event
          return false;
        })
      }
    }
    if (options.addAttribute) {
      this._element.setAttribute("data-start", options.dataStart);
      this._element.setAttribute("data-end", options.dataEnd);
    }
    if (options.className) {
      this._element.className = options.className;
    }
    if (options.id) {
      this._element.id = options.id;
    }

    styleUtil.addStyle(this._element, options);
  }
}

export default Text;
