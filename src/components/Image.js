import Component from "./BaseComponent";

class Image extends Component {
  constructor(options = {}) {
    super();
    this._element = document.createElement("img");
    if (options.width) this._element.style.width = options.width;
    if (options.height) this._element.style.height = options.height;
    if (options.margin) this._element.style.margin = options.margin;
    if (options.className) this._element.className = options.className;
    if (options.zIndex) this._element.style.zIndex = options.zIndex;
    if (options.transition) this._element.style.transition = options.transition;
    if (options.alignSelf) this._element.style.alignSelf = options.alignSelf;
    this._element.src = options.src || "";
    this._element.alt = options.alt || "";
  }
}

export default Image;
