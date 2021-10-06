import Container from "./Container";
import {styleUtil} from "../utils";

class CardBody extends Container {
  constructor(options = {}) {
    super(options);
    this._element.style.cssText += `
      -ms-flex: 1 1 auto;
      flex: 1 1 auto;
      background-color: ${options.backgroundColor || "transparent"};
      border-radius: ${options.cornerRadius || "0"};
      border: ${options.border || "none"};
    `;

    if (options.style) {
      this._element.style.cssText += styleUtil.styleToString(options.style);
    }
  }
}

export default CardBody;
