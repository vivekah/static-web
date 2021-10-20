import Component from "./BaseComponent";
import {styleUtil} from "../utils";

class Button extends Component {
  constructor(options = {}) {
    super(options);
    this._element = document.createElement("button");
    this._element.id = options.id;
    this._element.innerHTML = options.text;
    this._element.style.cssText = `
      display: inline-block;
      font-family: ${options.fontFamily || "poppins"};
      font-weight: ${options.fontWeight || "400"};
      color: ${options.color || "#212529"};
      text-align: center;
      vertical-align: middle;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      outline: none;
      margin: ${options.margin || "0"};
      background-color: ${options.backgroundColor || "transparent"};
      border: ${options.borderWidth || "1px"} solid ${
      options.borderColor || "transparent"
    };
      padding: ${options.padding || "0.375rem 0.75rem"};
      font-size: ${options.fontSize || "1rem"};
      ${options.textTransform ? `text-transform: ${options.textTransform};` : ""}
      line-height: 1.5;
      border-radius: ${options.cornerRadius || "0.25rem"};
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    `;
    options.clickListener &&
    this._element.addEventListener("click", options.clickListener);
    styleUtil.addStyle(this._element, options);
  }
}

export default Button;
