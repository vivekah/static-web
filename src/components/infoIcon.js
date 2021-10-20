import Component from "./BaseComponent";
import {styleUtil} from "../utils";

class InfoIcon extends Component {
  constructor(options = {}) {
    super(options);
    this._element = this.getIcon();

     styleUtil.addStyle(this._element, options);
  }

  getIcon() {
    const iconSvg = this.getIconSvg("bi-info-circle-fill");
    const iconPath = this.getIconPath("M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z");
    iconSvg.appendChild(iconPath);
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

export default InfoIcon;
