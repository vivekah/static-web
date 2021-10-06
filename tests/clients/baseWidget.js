import { JSDOM } from "jsdom";
import BaseWidget from "../../src/clients/BaseWidget";
import chai from "chai";
import sinon from "sinon";
import {
  jsonRes,
  FakeResponse,
  FakeNavigator,
  DESKTOP_USER_AGENT,
  MOBILE_USER_AGENT,
} from "../helpers";
import Component from "../../src/components/BaseComponent";

const expect = chai.expect;

describe("BaseWidget", () => {
  const widgetWrapperId = "widget-wrapper";
  const fakeDataUrl = "/path/to/data";

  beforeEach(() => {
    const dom = new JSDOM(`<div id="${widgetWrapperId}"></div>`);
    global.document = dom.window.document;
    global.window = dom.window;
    global.window.fetch = () => new Promise();
    global.window.Response = FakeResponse;
  });

  describe("Constructor", () => {
    it("without dataUrl should throw reference error", () => {
      expect(() => new BaseWidget()).to.throw(
        ReferenceError,
        "Provide data url"
      );
    });

    it("without containerId should throw reference error", () => {
      expect(() => new BaseWidget({ dataUrl: fakeDataUrl })).to.throw(
        ReferenceError,
        "Cannot find widget wrapper"
      );
    });

    it("with dataUrl and containerId should construct without errors", () => {
      expect(
        () =>
          new BaseWidget({
            dataUrl: fakeDataUrl,
            containerId: widgetWrapperId,
          })
      ).to.not.throw(ReferenceError);
    });
  });

  describe("Instance", () => {
    let widget;

    beforeEach(() => {
      widget = new BaseWidget({
        dataUrl: fakeDataUrl,
        containerId: widgetWrapperId,
      });
    });

    it("should setup props and install default font (poppins)", () => {
      expect(widget).to.have.deep.property("options", {
        containerId: widgetWrapperId,
        textColor: "#737373",
        themeColors: ["#F7CE68", "#FF944B"],
        fontFamily: "poppins",
        dataUrl: fakeDataUrl,
        loadingScreenContent: "Please wait...",
      });
      expect(widget).to.have.property("widgetWrapper");
      expect(widget).to.have.property("loadingScreen");
      expect(document.head.children.item(0).href).equals(
        "https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800&display=swap"
      );
    });

    it("isBusy(true|false) should show/hide loading screen", () => {
      widget.isBusy(true);
      expect(widget.loadingScreen.style.display).equals("block");
      widget.isBusy(false);
      expect(widget.loadingScreen.style.display).equals("none");
    });

    it("getCacheKey() should return hex string", () => {
      let cacheKey = widget.getCacheKey("cacheKey");
      expect(/[0-9A-Fa-f]{6}/g.test(cacheKey)).to.be.true;
    });

    describe("makeAPIRequest(url, body)", () => {
      beforeEach(() => {
        sinon.stub(window, "fetch");
      });
      afterEach(() => {
        window.fetch.restore();
      });

      it("should return null if status code is not 200", async () => {
        window.fetch.returns(jsonRes(400, "BadRequest"));
        let data = await widget.makeAPIRequest("/path/url", {});
        expect(data).to.be.null;
      });

      it("should return json if status code is 200", async () => {
        window.fetch.returns(jsonRes(200, "Ok", { message: "hello, world" }));
        let data = await widget.makeAPIRequest("/path/url", {});
        expect(data).to.be.not.null;
        expect(data).is.a("object");
      });
    });

    it("defaultColor should return last color in themeColors", () => {
      let color = widget.defaultColor;
      let lastColor =
        widget.options.themeColors[widget.options.themeColors.length - 1];
      expect(color).equals(lastColor);
    });

    describe("gradientColors", () => {
      it("should return comma separated colors", () => {
        widget.options.themeColors = ["green", "orange", "white"];
        let colors = widget.gradientColors;
        expect(colors).equals("green, orange, white");
      });

      it("should return at least two colors if one is specified", () => {
        widget.options.themeColors = ["green"];
        let colors = widget.gradientColors;
        expect(colors).equals("green, green");
      });

      it("should return default colors if no theme colors are specified", () => {
        widget.options.themeColors = null;
        let colors = widget.gradientColors;
        expect(colors).equals("#F7CE68, #FBAB7E");
      });
    });

    describe("buildPoweredByComponent()", () => {
      it("should return undefined if data is not specified", () => {
        let logo = widget.buildPoweredByComponent();
        expect(logo).to.be.null;
      });

      it("should return component if data is specified", () => {
        widget.data = { beam_logo: "/img/url" };
        let logo = widget.buildPoweredByComponent();
        expect(logo instanceof Component).to.be.true;
      });
    });

    describe("isMobile()", () => {
      it("should return false for desktop user agent", () => {
        FakeNavigator.setPropValue("userAgent", DESKTOP_USER_AGENT);
        expect(widget.isMobile).to.be.false;
      });

      it("should return true for mobile user agent", () => {
        FakeNavigator.setPropValue("userAgent", MOBILE_USER_AGENT);
        expect(widget.isMobile).to.be.true;
      });
    });

    describe("render(args, callback)", () => {
      beforeEach(() => {
        sinon.stub(widget, "getData");
      });
      afterEach(() => {
        widget.getData.restore();
      });

      it("should render ui if data is returned", async () => {
        widget.getData.returns(Promise.resolve({ message: "Hello, World!" }));
        await widget.render({}, () => {
          let ui = document.createElement("div");
          ui.id = "beam-ui";
          ui.innerHTML = widget.data.message;
          return ui;
        });
        expect(widget.widgetWrapper.innerHTML).contains("beam-ui");
        expect(widget.widgetWrapper.innerHTML).contains("Hello, World!");
      });

      it("should not render ui if data is not returned", async () => {
        widget.getData.returns(Promise.resolve(null));
        await widget.render({}, () => {
          let ui = document.createElement("div");
          ui.id = "beam-ui";
          ui.innerHTML = widget.data.message;
          return ui;
        });
        expect(widget.widgetWrapper.innerHTML).does.not.contain("beam-ui");
      });
    });
  });
});
