import Component from "./BaseComponent";

class LoadingScreen extends Component {
  constructor(options = {}) {
    super();
    this._element = document.createElement("div");
    this._element.innerHTML = options.content || "Loading...";
    this._element.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 100;
      width: 100vw;
      height: 100vh;
      background-color: ${options.backgroundColor || "rgba(0, 0, 0, 0.5)"};
      text-align: center;
      vertical-align: middle;
      line-height: 100vh;
      background-position: center;
      font-family: ${options.fontFamily || "poppins"};
      font-size: ${options.fontSize || "medium"};
      font-weight: ${options.fontWeight || "normal"};
    `;
  }
}

export default LoadingScreen;
