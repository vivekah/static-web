class Component {
  constructor(options = {}) {
    this._element = null;
    this.options = options;
  }

  get view() {
    return this._element;
  }

}

export default Component;
