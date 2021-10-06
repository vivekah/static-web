import Container from "./Container";

class CardOverlay extends Container {
  constructor(options = {}) {
    super(options);
    this._element.style.cssText = `
      position: ${options.position || "absolute"};
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: ${options.padding || "1.25rem"};
      background: ${options.background || "rgba(0, 0, 0, 0.39)"};
    `;
  }
}

export default CardOverlay;
