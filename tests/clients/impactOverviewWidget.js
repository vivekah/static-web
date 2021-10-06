import { JSDOM } from "jsdom";
import ImpactOverviewWidget from "../../src/clients/ImpactOverviewWidget";
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
import BeamFlexWrapper from "../../src/components/FlexWrapper";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("ImpactOverviewWidget", () => {
  const widgetWrapperId = "widget-wrapper";
  const fakeDataUrl = "/path/to/data";
  let widget;

  beforeEach(() => {
    const dom = new JSDOM(`<div id="${widgetWrapperId}"></div>`);
    global.document = dom.window.document;
    global.window = dom.window;
    global.window.HTMLDivElement = window.HTMLDivElement;
    global.window.HTMLAnchorElement = window.HTMLAnchorElement;

    widget = new ImpactOverviewWidget({
      dataUrl: fakeDataUrl,
      containerId: widgetWrapperId,
    });
  });

  describe("", () => {
    beforeEach(async () => {
      sinon.stub(widget, "makeAPIRequest");
      widget.makeAPIRequest.returns(impact_data);
      widget.data = await widget.getData({ user: "userbeamID" });
    });
    afterEach(() => {
      widget.makeAPIRequest.restore();
    });

    it("getData(args) should return personal and community data", () => {
      expect(widget.data).to.have.property("personal");
      expect(widget.data).to.have.property("community");
      expect(widget.data).to.have.property("chain");
      expect(widget.data).to.have.property("beam_logo");
    });

    it("buildPersonalComponent([cardWidth], [margin]) should return a beam container component", () => {
      let component = widget.buildPersonalComponent();
      expect(component instanceof BeamContainer).to.be.true;
    });

    it("buildLinkComponent(data, [cardWidth]) should return a beam flex wrapper component with links", () => {
      let component = widget.buildLinkComponent();
      let view = component.view;
      expect(component instanceof BeamFlexWrapper).to.be.true;
      expect(view.childElementCount).equals(2);
      expect(view.children[0].children[0] instanceof window.HTMLAnchorElement)
        .to.be.true;
      expect(view.children[1].children[0] instanceof window.HTMLAnchorElement)
        .to.be.true;
    });

    it("buildPersonalComponent(data, [cardWidth], [margin]) should return beam container", () => {
      let component = widget.buildPersonalComponent();
      expect(component instanceof BeamContainer).to.be.true;
    });

    it("buildCommunityComponent(data, [cardWidth], [margin]) should return beam container", () => {
      let component = widget.buildCommunityComponent();
      expect(component instanceof BeamContainer).to.be.true;
    });

    describe("render(args)", () => {
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
        await widget.render({ user: "beamuserID" });
        widget.buildMobileView.calledOnce;
        widget.buildMobileView.calledWith(impact_data);
        widget.buildDesktopView.notCalled;
      });

      it("should render desktop view if user agent is desktop", async () => {
        FakeNavigator.setPropValue("userAgent", DESKTOP_USER_AGENT);
        await widget.render({ user: "beamuserID" });
        widget.buildMobileView.notCalled;
        widget.buildDesktopView.calledOnce;
        widget.buildDesktopView.calledWith(impact_data);
      });
    });
  });
});
