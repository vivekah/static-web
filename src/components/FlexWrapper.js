import Container from "./Container";
import {styleUtil} from "../utils";

class FlexWrapper extends Container {
  constructor(options = {}) {
    super(options);
    this._element.style.cssText += `
      diplay: -ms-flexbox !important;
      display: flex !important;
      -ms-flex-direction: ${options.flexDirection || 'row'} !important;
      flex-direction: ${options.flexDirection || 'row'} !important;
      -ms-flex-align: ${options.alignItems || "center"} !important;
      align-items: ${options.alignItems || "center"} !important;
      ${!options.noWrap &&
    "flex-wrap: wrap !important;"
    }
      ${
      options.centerItems &&
      "-ms-flex-pack: center !important;justify-content: center !important;"
    }
      ${
      options.wrap &&
      "-ms-flex-wrap: wrap !important; flex-wrap: wrap !important;"
    }
      ${
      options.noWrap &&
      "-ms-flex-wrap: nowrap !important; flex-wrap: nowrap !important;"
    }
      ${
      options.justifyContent &&
      `justify-content: ${options.justifyContent} !important;`
    }
      ${
      options.width &&
      `width: ${options.width}`
    }
    `;
    if (options.style) {
      this._element.style.cssText += styleUtil.styleToString(options.style);
    }
  }
}

export default FlexWrapper;
