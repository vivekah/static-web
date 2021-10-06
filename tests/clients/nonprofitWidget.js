import { JSDOM } from "jsdom";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import { nonprofit_data } from "../fakeData";
import NonprofitWidget from "../../src/clients/NonprofitWidget";
import {
  FakeNavigator,
  MOBILE_USER_AGENT,
  DESKTOP_USER_AGENT,
} from "../helpers";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("NonprofitWidget", () => {
  const widgetWrapperId = "widget-wrapper";
  const fakeDataUrl = "/path/to/data";
  let widget;

  beforeEach(() => {
    const dom = new JSDOM(`<div id="${widgetWrapperId}"></div>`);
    global.document = dom.window.document;
    global.window = dom.window;
    global.window.HTMLDivElement = window.HTMLDivElement;

    widget = new NonprofitWidget({
      dataUrl: fakeDataUrl,
      containerId: widgetWrapperId,
      userDidMatchCallback: (matched, amount) => {
        console.log(`called with ${matched} and ${amount.toFixed(2)}`);
      },
    });

    sinon.stub(widget, "makeAPIRequest");
    widget.makeAPIRequest.returns(nonprofit_data);
  });

  afterEach(() => {
    widget.makeAPIRequest.restore();
  });

  describe("getData(args)", () => {
    it("should call makeAPIRequest only once for the same set of args", async () => {
      let args = { user: "beamID", cartTotal: 100.0 };
      widget.data = await widget.getData(args);

      // subsequent call
      widget.data = await widget.getData(args);

      widget.makeAPIRequest.calledOnce;
      widget.makeAPIRequest.calledWith(fakeDataUrl, args);
      expect(widget.data).equals(nonprofit_data);
      expect(widget.cacheKey).not.null;
      expect(widget.cartTotal).equals(args.cartTotal);
      expect(widget.input.user).equals(args.user);
    });

    it("should call makeAPIRequest again for the different set of args", async () => {
      let args = { user: "beamID", store: 6, cartTotal: 100.0 };
      widget.data = await widget.getData(args);
      let cacheKey1 = widget.cacheKey;

      // change arg
      args.user = "beamID2";
      args.cartTotal = 200.0;

      // subsequent call
      widget.data = await widget.getData(args);
      let cacheKey2 = widget.cacheKey;

      widget.makeAPIRequest.calledTwice;
      widget.makeAPIRequest.calledWith(fakeDataUrl, args);
      expect(widget.data).equals(nonprofit_data);
      expect(widget.cacheKey).not.null;
      expect(cacheKey1).not.equals(cacheKey2);
      expect(widget.cartTotal).equals(args.cartTotal);
      expect(widget.input.user).equals(args.user);
    });
  });

  describe("render(args)", () => {
    beforeEach(() => {
      sinon.spy(widget.options, "userDidMatchCallback");
      sinon.spy(widget, "buildMobileSelectedView");
      sinon.spy(widget, "buildMobileListView");
      sinon.spy(widget, "buildDesktopListView");
      sinon.spy(widget, "buildMatchDonationComponent");
    });
    afterEach(() => {
      widget.options.userDidMatchCallback.restore();
      widget.buildMobileSelectedView.restore();
      widget.buildMobileListView.restore();
      widget.buildDesktopListView.restore();
    });

    it("should not render if isPreCheckout is true and last_nonprofit is null", async () => {
      widget.options.isPreCheckout = true;
      nonprofit_data.last_nonprofit = null;
      await widget.render();
      widget.buildMobileSelectedView.notCalled;
    });

    it("should render if isPreCheckout is true and last_nonprofit is not null", async () => {
      widget.options.isPreCheckout = true;
      nonprofit_data.last_nonprofit = nonprofit_data.nonprofits[0];
      await widget.render();
      widget.buildMobileSelectedView.calledOnce;
    });

    it("should not render match component if last_nonprofit is null and user_can_match is false", async () => {
      nonprofit_data.last_nonprofit = null;
      nonprofit_data.user_can_match = false;
      await widget.render();
      widget.buildMatchDonationComponent.notCalled;
    });

    it("should render match component if last_nonprofit is not null and user_can_match is true", async () => {
      nonprofit_data.last_nonprofit = nonprofit_data.nonprofits[0];
      nonprofit_data.user_can_match = true;
      await widget.render();
      widget.buildMatchDonationComponent.calledOnce;
      widget.buildMatchDonationComponent.calledWith(nonprofit_data);
    });

    it("should render mobile view if user agent is mobile", async () => {
      FakeNavigator.setPropValue("userAgent", MOBILE_USER_AGENT);
      await widget.render();
      widget.buildMobileListView.calledOnce;
      widget.buildMobileListView.calledWith(nonprofit_data);
      widget.buildDesktopListView.notCalled;
    });

    it("should render desktop view if user agent is desktop", async () => {
      FakeNavigator.setPropValue("userAgent", DESKTOP_USER_AGENT);
      await widget.render();
      widget.buildMobileListView.notCalled;
      widget.buildDesktopListView.calledOnce;
      widget.buildDesktopListView.calledWith(nonprofit_data);
    });
  });
});
