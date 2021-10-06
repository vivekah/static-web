class FakeBody {
  constructor(body) {
    this.body = body;
  }
  json() {
    return Promise.resolve(this.body);
  }
}

export class FakeResponse extends FakeBody {
  constructor(body, options = {}) {
    super(body);
    this.status = options.status;
    this.statusText = options.statusText;
    this.headers = options.headers;
  }
}

export const jsonRes = (status = 200, statusText = "Ok", body = {}) => {
  let res = new window.Response(body, {
    status,
    statusText,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return Promise.resolve(res);
};

export class FakeNavigator {
  static setPropValue(prop, val) {
    Object.defineProperty(window.navigator, prop, {
      value: val,
    });
  }
}

export const DESKTOP_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36";
export const MOBILE_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1";
