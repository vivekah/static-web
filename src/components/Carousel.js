import Component from "./BaseComponent";
import {styleUtil} from "../utils";

class Carousel extends Component {
  constructor(options = {}) {
    super(options);
    styleUtil.addStyle(this._element, options);

  }
}