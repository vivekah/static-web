import Container from "./Container";
import {styleUtil} from "../utils";


class BlockWrapper extends Container {
  constructor(options = {}) {
    super(options);
    this._element.style.cssText +=
      `display: block !important;width: ${options.width || "100%"} !important;`;
    styleUtil.addStyle(this._element, options);
  }
}

export default BlockWrapper;
