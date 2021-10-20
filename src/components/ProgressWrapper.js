import Container from "./Container";
import {styleUtil} from "../utils";

class ProgressWrapper extends Container {
  constructor(options = {}) {
    super(options);
    this._element.className = "beam-progress"; // for identification and recalibration
    this._element.dataset.percentage = options.percentage || 0;
    this._element.style.cssText += `
      display: -ms-flexbox;
      display: flex;
      overflow: hidden;
      font-size: ${options.fontSize || "0.7rem"};
      background-color: ${options.backgroundColor || "#e9ecef"};
      border-radius: ${options.cornerRadius || "7px"};
    `;

    styleUtil.addStyle(this._element, options);
  }
}

export default ProgressWrapper;
