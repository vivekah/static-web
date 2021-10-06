
class BaseTheme {
  constructor(options) {
    this.options = options;
  }

  static get id() {
    return "default";
  }

  get defaultColor() {
    let numberOfColors = this.options.gradientColors
      ? this.options.gradientColors.length
      : 0;
    return numberOfColors > 0
      ? this.options.gradientColors[numberOfColors - 1]
      : "#FF944B";
  }

  get gradientColors() {
    let numberOfColors = this.options.gradientColors
      ? this.options.gradientColors.length
      : 0;
    return numberOfColors > 0
      ? numberOfColors > 1
        ? this.options.gradientColors.join(", ")
        : `${this.options.gradientColors[0]}, ${this.options.gradientColors[0]}`
      : "#F7CE68, #FBAB7E";
  }
}

export default BaseTheme;
