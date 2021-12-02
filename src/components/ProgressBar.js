import Component from "./BaseComponent";

class ProgressBar extends Component {
  constructor(
    progressWrapper,
    colors = [
      {color: "#85bcd7", offset: "0%"},
      {color: "#fbeb63", offset: "50%"},
      {color: "#ff944b", offset: "100%"},
    ]
  ) {
    super();

    const percentage = progressWrapper.dataset.percentage;
    // const { width, height } = progressWrapper.getBoundingClientRect();
    const height = progressWrapper.clientHeight;
    const width = progressWrapper.clientWidth;
    const svgNS = "http://www.w3.org/2000/svg";

    this._element = document.createElementNS(svgNS, "svg");

    this._element.setAttributeNS(null, "style", `width: ${width}px!important;height: ${height}px!important;`);
    this._element.setAttributeNS(null, "viewBox", `0 0 ${width} ${height}`);
    this._element.setAttributeNS(null, "preserveAspectRatio", "none");

    let defs = document.createElementNS(svgNS, "defs");

    let linearGradient = document.createElementNS(svgNS, "linearGradient");
    linearGradient.id = "progress-grad";
    linearGradient.setAttributeNS(null, "x1", "0%");
    linearGradient.setAttributeNS(null, "x2", "100%");
    linearGradient.setAttributeNS(null, "y1", "0%");
    linearGradient.setAttributeNS(null, "y2", "0%");

    colors.forEach((stop) => {
      let lgs = document.createElementNS(svgNS, "stop");
      lgs.setAttributeNS(null, "stop-color", stop.color);
      lgs.setAttributeNS(null, "offset", stop.offset);
      linearGradient.appendChild(lgs);
    });

    defs.appendChild(linearGradient);

    let clipPath = document.createElementNS(svgNS, "clipPath");
    clipPath.id = `progress-clip-${percentage}`;

    let clipRect = document.createElementNS(svgNS, "rect");
    clipRect.setAttributeNS(
      null,
      "width",
      (parseFloat(percentage) * width) / 100
    );
    clipRect.setAttributeNS(null, "height", height);
    clipRect.setAttributeNS(null, "x", "0");
    clipRect.setAttributeNS(null, "y", "0");
    clipRect.setAttributeNS(null, "rx", progressWrapper.style.borderRadius == "0px" || progressWrapper.style.borderRadius == "0" ? 0 : height / 2);

    clipPath.appendChild(clipRect);

    defs.appendChild(clipPath);

    this._element.appendChild(defs);

    let rect1 = document.createElementNS(svgNS, "rect");
    rect1.setAttributeNS(null, "width", width);
    rect1.setAttributeNS(null, "height", height);
    rect1.setAttributeNS(null, "x", "0");
    rect1.setAttributeNS(null, "y", "0");
    rect1.setAttributeNS(null, "fill", progressWrapper.style.backgroundColor);
    rect1.setAttributeNS(null, "rx", height / 2);

    this._element.appendChild(rect1);

    let rect2 = document.createElementNS(svgNS, "rect");
    rect2.setAttributeNS(null, "width", width);
    rect2.setAttributeNS(null, "height", height);
    rect2.setAttributeNS(null, "x", "0");
    rect2.setAttributeNS(null, "y", "0");
    rect2.setAttributeNS(
      null,
      "clip-path",
      `url(#progress-clip-${percentage})`
    );
    rect2.setAttributeNS(null, "fill", "url(#progress-grad)");

    this._element.appendChild(rect2);
  }
}

export default ProgressBar;
