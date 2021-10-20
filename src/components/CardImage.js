import Image from "./Image";
import {styleUtil} from "../utils";

class CardImage extends Image {
  constructor(options = {}) {
    super(options);
    this._element.style.cssText = `
      width: ${options.width || "100%"};
      ${options.height && `height: ${options.height};`}
      ${options.objectFit && `object-fit: ${options.objectFit};`}
    `;
    styleUtil.addStyle(this._element, options);
    if (options.pos) {
      this._element.style.position = options.pos.position;
      this._element.style.top = options.pos.top;
      this._element.style.right = options.pos.right;
      this._element.style.bottom = options.pos.bottom;
      this._element.style.left = options.pos.left;
    }
    if (options.margin) this._element.style.margin = options.margin;
  }
}

export default CardImage;
