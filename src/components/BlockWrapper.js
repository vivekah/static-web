import Container from "./Container";
import {styleUtil} from "../utils";

class BlockWrapper extends Container {
  constructor(options = {}) {
    super(options);
    this._element.style.cssText +=
      `display: block !important;width: ${options.width || "100%"} !important;`;
    if (options.style) {
      this._element.style.cssText += styleUtil.styleToString(options.style);
    }
  }
}

export default BlockWrapper;
