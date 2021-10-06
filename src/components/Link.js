import Component from "./BaseComponent";

class Link extends Component {
  constructor(options = {}) {
    super();
    this._element = document.createElement("link");
    this._element.rel = options.rel;
    this._element.href = options.href;
  }
}

export default Link;
