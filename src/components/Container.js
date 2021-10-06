import Component from "./BaseComponent";
import {styleUtil} from "../utils";

class Container extends Component {
  constructor(options = {}) {
    super();
    this._element = document.createElement("div");
    if (options.className) this._element.className = options.className;
    if (options.id) this._element.id = options.id;
    if (options.height) this._element.style.height = options.height;
    if (options.width) this._element.style.width = options.width;
    if (options.maxHeight) this._element.style.maxHeight = options.maxHeight;
    if (options.minHeight) this._element.style.minHeight = options.minHeight;
    if (options.maxWidth) this._element.style.maxWidth = options.maxWidth;
    if (options.minWidth) this._element.style.minWidth = options.minWidth;
    if (options.margin) this._element.style.margin = options.margin;
    if (options.padding) this._element.style.padding = options.padding;
    if (options.textAlign) this._element.style.textAlign = options.textAlign;
    if (options.backgroundColor) this._element.style.backgroundColor = options.backgroundColor;
    if (options.backgroundSize) this._element.style.backgroundSize = options.backgroundSize;
    if (options.backgroundPosition) this._element.style.backgroundPosition = options.backgroundPosition;
    if (options.backgroundImage) this._element.style.backgroundImage = options.backgroundImage;
    if (options.border) this._element.style.border = options.border;
    if (options.borderWidth) this._element.style.Width = options.borderWidth;
    if (options.borderBottom) this._element.style.borderBottom = options.borderBottom;
    if (options.cornerRadius) this._element.style.borderRadius = options.cornerRadius;
    if (options.transition) this._element.style.transition = options.transition;
    if (options.overflow) this._element.style.overflow = options.overflow;
    if (options.border) this._element.style.border = options.border;
    if (options.pos) {
      this._element.style.position = options.pos.position;
      if (options.pos.top) this._element.style.top = options.pos.top;
      if (options.pos.right) this._element.style.right = options.pos.right;
      if (options.pos.bottom) this._element.style.bottom = options.pos.bottom;
      if (options.pos.left) this._element.style.left = options.pos.left;
      if (options.pos.zIndex) this._element.style.zIndex = options.pos.zIndex;
      if (options.pos.flexBasis) this._element.style.flexBasis = options.pos.flexBasis;
    }
    if (options.alignSelf) this._element.style.alignSelf = options.alignSelf;

    options.clickListener &&
    this._element.addEventListener("click", options.clickListener);

    options.children &&
    options.children.forEach((child) => {
      child && this._element.appendChild(child.view);
    });

    if (options.style) {
      this._element.style.cssText += styleUtil.styleToString(options.style);
    }
    if (options.hoverStyle) {
      styleUtil.addStyleOnHover(this._element, options.hoverStyle);
    }
  }
}

export default Container;
