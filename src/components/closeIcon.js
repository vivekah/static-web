import Component from "./BaseComponent";
import {styleUtil} from "../utils";

class CloseIcon extends Component {
  constructor(options = {}) {
    super(options);
    this._element = this.getIcon();
    options.clickListener &&
    this._element.addEventListener("click", options.clickListener);
    styleUtil.addStyle(this._element, options);
  }


  getIcon() {
    const iconSvg = this.getIconSvg("bi bi-x-lg");
    const iconPath = this.getIconPath("M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z");
    iconSvg.appendChild(iconPath);
    const iconPath2 = this.getIconPath("M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z");
    iconSvg.appendChild(iconPath2);
    return iconSvg;
  }

  getIconPath(attributeD) {
    const iconPath = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );

    iconPath.setAttribute('d', attributeD);
    return iconPath;
  }

  getIconSvg(className) {
    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSvg.setAttribute('fill', "currentColor");
    iconSvg.setAttribute('width', "16");
    iconSvg.setAttribute('height', "16");
    iconSvg.setAttribute('class', className);
    iconSvg.setAttribute('viewBox', "0 0 16 16");
    return iconSvg;
  }

}

export default CloseIcon;
