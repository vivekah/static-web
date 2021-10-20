import Component from "./BaseComponent";
import {styleUtil} from "../utils";

class Link extends Component {
  constructor(options = {}) {
    super(options);
    this._element = document.createElement("link");
    this._element.rel = options.rel;
    this._element.href = options.href;
    styleUtil.addStyle(this._element, options);
  }
}

export default Link;
