import { JSDOM } from "jsdom";
import CommunityImpactWidget from "../../src/clients/CommunityImpactWidget";
import chai from "chai";
import sinon from "sinon";
import {
  FakeNavigator,
  MOBILE_USER_AGENT,
  DESKTOP_USER_AGENT,
} from "../helpers";
import { impact_data } from "../fakeData";
import BeamCard from "../../src/components/Card";

const expect = chai.expect;

describe("CommunityImpactWidget", () => {
  const widgetWrapperId = "widget-wrapper";
  const fakeDataUrl = "/path/to/data";
  let widget;

  beforeEach(() => {
    const dom = new JSDOM(`<div id="${widgetWrapperId}"></div>`);
    global.document = dom.window.document;
    global.window = dom.window;
    global.window.HTMLDivElement = window.HTMLDivElement;

    widget = new CommunityImpactWidget({
      dataUrl: fakeDataUrl,
      containerId: widgetWrapperId,
    });
  });

  it("causes should return list of string causes", () => {
    widget.data = impact_data;
    let causes = widget.causes;
    expect(causes).is.an("array");
  });

  describe("nonprofits", () => {
    it("should return all nonprofits when cause isn't specified", () => {
      widget.data = impact_data;
      let nonprofits = widget.nonprofits;
      expect(nonprofits.length).equals(impact_data.nonprofits.length);
    });

    it("should return only cause's nonprofits when cause is specified", () => {
      widget.data = impact_data;
      widget.currentCause = widget.causes[1];

      let nonprofits = widget.nonprofits;
      expect(nonprofits.length).equals(
        impact_data.nonprofits.filter((x) => x.cause === widget.currentCause).length
      );
    });
  });

  it("buildNonprofitComponent(nonprofit, [cardWidth], [margin]) should return a beam card component", () => {
    let nonprofit = impact_data.nonprofits[0];
    let component = widget.buildNonprofitComponent(nonprofit);
    expect(component instanceof BeamCard).to.be.true;
  });

  it("buildMobileView() should return an HTMLDivElement", () => {
    widget.data = impact_data;
    let view = widget.buildMobileView();
    expect(view instanceof window.HTMLDivElement).to.be.true;
  });

  it("buildDesktopView() should return an HTMLDivElement", () => {
    widget.data = impact_data;
    let view = widget.buildDesktopView();
    expect(view instanceof window.HTMLDivElement).to.be.true;
  });

  describe("render(args)", () => {
    beforeEach(() => {
      sinon.spy(widget, "buildMobileView");
      sinon.spy(widget, "buildDesktopView");
      sinon.stub(widget, "makeAPIRequest");
      widget.makeAPIRequest.returns(impact_data);
    });
    afterEach(() => {
      widget.makeAPIRequest.restore();
      widget.buildMobileView.restore();
      widget.buildDesktopView.restore();
    });

    it("should render mobile view if user agent is mobile", async () => {
      FakeNavigator.setPropValue("userAgent", MOBILE_USER_AGENT);
      await widget.render();
      widget.buildMobileView.calledOnce;
      widget.buildMobileView.calledWith(impact_data);
      widget.buildDesktopView.notCalled;
    });

    it("should render desktop view if user agent is desktop", async () => {
      FakeNavigator.setPropValue("userAgent", DESKTOP_USER_AGENT);
      await widget.render();
      widget.buildMobileView.notCalled;
      widget.buildDesktopView.calledOnce;
      widget.buildDesktopView.calledWith(impact_data, null);
    });
  });
});
