import { JSDOM } from "jsdom";
import BaseImpactWidget from "../../src/clients/BaseImpactWidget";
import chai from "chai";
import sinon from "sinon";
import { impact_data } from "../fakeData";

const expect = chai.expect;

describe("BaseImpactWidget", () => {
  const widgetWrapperId = "widget-wrapper";
  const fakeDataUrl = "/path/to/data";
  let widget;

  beforeEach(() => {
    const dom = new JSDOM(`<div id="${widgetWrapperId}"></div>`);
    global.document = dom.window.document;
    global.window = dom.window;

    widget = new BaseImpactWidget({
      dataUrl: fakeDataUrl,
      containerId: widgetWrapperId,
    });

    sinon.stub(widget, "makeAPIRequest");
    widget.makeAPIRequest.returns(impact_data);
  });

  afterEach(() => {
    widget.makeAPIRequest.restore();
  });

  describe("getData(args)", () => {
    it("should call makeAPIRequest only once for the same set of args", async () => {
      let args = { nonprofit: 1, user: "beamID" };
      let data = await widget.getData(args);

      // subsequent call
      data = await widget.getData(args);

      widget.makeAPIRequest.calledOnce;
      widget.makeAPIRequest.calledWith(fakeDataUrl, args);
      expect(data).to.be.null;
      expect(widget.input.nonprofit).equals(args.nonprofit);
      expect(widget.input.user).equals(args.user);
      expect(widget.cacheKey).equals(widget.getCacheKey(args));
    });

    it("should call makeAPIRequest again for the different set of args", async () => {
      let args = { nonprofit: 1, user: "beamID" };
      let data = await widget.getData(args);
      let cacheKey1 = widget.cacheKey;

      // change arg
      args.nonprofit = 2;

      // subsequent call
      data = await widget.getData(args);
      let cacheKey2 = widget.cacheKey;

      widget.makeAPIRequest.calledTwice;
      widget.makeAPIRequest.calledWith(fakeDataUrl, args);
      expect(data).equals(impact_data);
      expect(widget.input.nonprofit).equals(args.nonprofit);
      expect(widget.input.user).equals(args.user);
      expect(cacheKey1).not.equals(cacheKey2);
    });
  });
});
