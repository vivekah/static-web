import CardOverlay from "./CardOverlay";
import FlexWrapper from "./FlexWrapper";
import {styleUtil} from "../utils";

class CardOverlayFlex extends CardOverlay {
  constructor(options = {}) {
    super(options);
    this._element.style.cssText += new FlexWrapper().view.style.cssText;
    styleUtil.addStyle(this._element, options);
  }
}

export default CardOverlayFlex;
