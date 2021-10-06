import { JSDOM } from "jsdom";
import PersonalImpactWidget from "../../src/clients/PersonalImpactWidget";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import {
  FakeNavigator,
  MOBILE_USER_AGENT,
  DESKTOP_USER_AGENT,
} from "../helpers";
import { impact_data } from "../fakeData";
import BeamContainer from "../../src/components/Container";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("PersonalImpactWidget", () => {
  const widgetWrapperId = "widget-wrapper";
  const fakeDataUrl = "/path/to/data";
  let widget;

  beforeEach(() => {
    const dom = new JSDOM(`<div id="${widgetWrapperId}"></div>`);
    global.document = dom.window.document;
    global.window = dom.window;
    global.window.HTMLDivElement = window.HTMLDivElement;

    widget = new PersonalImpactWidget({
      dataUrl: fakeDataUrl,
      containerId: widgetWrapperId,
    });

    sinon.stub(widget, "makeAPIRequest");
    widget.makeAPIRequest.returns(impact_data);
  });

  afterEach(() => {
    widget.makeAPIRequest.restore();
  });

  it("buildNonprofitComponent([cardWidth]) should return a beam container component", async () => {
    widget.data = await widget.getData({user: "beamId"});
    let component = widget.buildNonprofitComponent();
    expect(component instanceof BeamContainer).to.be.true;
  });

  it("buildMobileView(data) should return an HTMLDivElement", async () => {
    widget.data = await widget.getData({user: "beamId"});
    let view = widget.buildMobileView();
    expect(view instanceof window.HTMLDivElement).to.be.true;
  });

  it("buildDesktopView(data) should return an HTMLDivElement", async () => {
    widget.data = await widget.getData({user: "beamId"});
    let view = widget.buildDesktopView();
    expect(view instanceof window.HTMLDivElement).to.be.true;
  });

  describe("render(user, [nonprofit])", () => {
    beforeEach(() => {
      sinon.spy(widget, "buildMobileView");
      sinon.spy(widget, "buildDesktopView");
    });
    afterEach(() => {
      widget.buildMobileView.restore();
      widget.buildDesktopView.restore();
    });

    it("should throw error if user beam ID isn't specified", async () => {
      await expect(widget.render()).to.be.rejectedWith(Error);
    });

    it("should render mobile view if user agent is mobile", async () => {
      FakeNavigator.setPropValue("userAgent", MOBILE_USER_AGENT);
      await widget.render("userbeamID");
      widget.buildMobileView.calledOnce;
      widget.buildMobileView.calledWith(impact_data);
      widget.buildDesktopView.notCalled;
    });

    it("should render desktop view if user agent is desktop", async () => {
      FakeNavigator.setPropValue("userAgent", DESKTOP_USER_AGENT);
      await widget.render("userbeamID");
      widget.buildMobileView.notCalled;
      widget.buildDesktopView.calledOnce;
      widget.buildDesktopView.calledWith(impact_data, null);
    });
  });
});
