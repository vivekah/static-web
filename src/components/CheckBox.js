import Component from "./BaseComponent";

class CheckBox extends Component {
  constructor(options = {}) {
    super();

    this._element = document.createElement("label");
    this._element.style.cssText = `
      margin: ${options.margin || "0"};
      padding: ${options.padding || "0"};
      font-family: ${options.fontFamily || "poppins"};
      font-size: ${options.fontSize || "medium"};
      font-weight: ${options.fontWeight || "normal"};
      color: ${options.color || "#000"};
    `;

    let checkLabel = document.createElement("label");
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = options.checked;
    checkbox.style.cssText = `
      width: ${options.width || "3em"} !important;
      height: ${options.height || "3em"} !important;
      background-color: ${options.backgroundColor || "transparent"};
      border-radius: ${options.cornerRadius || "50%"} !important;
      vertical-align: middle;
      border: ${options.borderWidth || "1px"} solid ${
      options.borderColor || "#ddd"
    };
      -webkit-appearance: none;
      outline: none;
      cursor: pointer;
      margin: 0 0 0 ${options.labelCheckSpace || "10px"}
    `;

    if (options.backgroundImage) {
      checkLabel.style.cssText += `
      position: absolute;
      right: 8px;
      width: ${options.width || "3em"};
      height: ${options.height || "3em"};
      background-image: url(${options.backgroundImage}); 
      background-repeat: no-repeat;
      background-position: 0% 0%;
      background-size: contain;
      background-color: transparent;
      cursor: pointer;`;
      checkLabel.addEventListener("click", (e) => {
        this._element.dispatchEvent(new Event("change"));
      });
    }

    checkLabel.appendChild(checkbox);

    if (options.textLeft) {
      this._element.innerHTML = options.text;
      this._element.appendChild(checkbox);
      this._element.appendChild(checkLabel);
    } else {
      this._element.appendChild(checkbox);
      this._element.appendChild(checkLabel);
      this._element.innerHTML += options.text;
    }

    options.changeListener &&
      this._element.addEventListener("change", options.changeListener);
  }
}

export default CheckBox;
