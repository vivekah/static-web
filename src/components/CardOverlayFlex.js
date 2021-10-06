import CardOverlay from "./CardOverlay";
import FlexWrapper from "./FlexWrapper";

class CardOverlayFlex extends CardOverlay {
  constructor(options = {}) {
    super(options);
    this._element.style.cssText += new FlexWrapper().view.style.cssText;
  }
}

export default CardOverlayFlex;
