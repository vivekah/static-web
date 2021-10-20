import Component from "./BaseComponent";
import {styleUtil} from "../utils";

class RoundCheckbox extends Component {
  constructor(options = {}) {
    super(options);
    this._element = options.noSelections ? this.getNeverSelectedIcon() : options.isSelected ? this.getSelectedIcon() : this.getUnselectedIcon();

    if (options.style) {
      styleUtil.addStyle(this._element, options);
      if (options.noSelections) {
        this._element.style.filter = `brightness(550%)`;
      } else if (!options.isSelected) {
        this._element.style.filter = `brightness(400%)`;
      }
    }
  }

  getSelectedIcon() {
    const iconSvg = this.getIconSvg("bi bi-check-circle-fill");
    const iconPath = this.getIconPath("M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05zz");
    iconSvg.appendChild(iconPath);
    return iconSvg;
  }

  getUnselectedIcon() {
    const iconSvg = this.getIconSvg("bi bi-circle");
    const iconPath = this.getIconPath("M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z");
    iconSvg.appendChild(iconPath)
    return iconSvg;
  }

  getNeverSelectedIcon() {
    const iconSvg = this.getIconSvg("bi bi-arrow-right-circle-fill");
    const iconPath = this.getIconPath("M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z");
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

export default RoundCheckbox;
