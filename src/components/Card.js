import Container from "./Container";
import {styleUtil} from "../utils";

class Card extends Container {
  constructor(options = {}) {
    super(options);
    this._element.style.cssText += `
      position: relative;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: ${options.flexDirection || "column"};
      flex-direction: ${options.flexDirection || "column"};
      min-width: 0;
      word-wrap: break-word;
      cursor: ${options.cursor || "arrow"};
      background-image: ${options.backgroundImage || "none"};
      max-width: ${options.maxWidth};
      margin: ${options.margin};
      ${
      options.backgroundImage &&
      `
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% auto;
      `
    }
      background-color: ${options.backgroundColor || "transparent"};
      background-clip: border-box;
      border: ${options.border || "1px solid rgba(0, 0, 0, 0.125)"};
      border-radius: ${options.cornerRadius || "0.25rem"};
      ${options.overflow && `overflow: ${options.overflow};`}
     `;
    options.clickListener &&
    this._element.addEventListener("click", options.clickListener);
    styleUtil.addStyle(this._element, options);
  }
}

export default Card;
