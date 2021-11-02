import * as clients from "./clients";

class App {
  constructor() {
    this.NonprofitWidget = clients.NonprofitWidget;
    this.ImpactOverviewWidget = clients.ImpactOverviewWidget;
    this.PersonalImpactWidget = clients.PersonalImpactWidget;
    this.CommunityImpactWidget = clients.CommunityImpactWidget;
    this.GoalImpactWidget = clients.GoalImpactWidget;
    this.TextCommunityImpactWidget = clients.TextCommunityImpactWidget;
    this.CommunityImpactAggregateWidget = clients.CommunityImpactAggregateWidget;
    this.CarbonOffsetWidget = clients.CarbonOffsetWidget;
    this.CarbonOffsetSuccessWidget = clients.CarbonOffsetSuccessWidget;
    this.CommunityImpactCarbonOffsetWidget = clients.CommunityImpactCarbonOffsetWidget;
    this.CommunityImpactCarbonAvoidanceWidget = clients.CommunityImpactCarbonAvoidanceWidget;
    this.InstacartCommunityImpactWidget = clients.InstacartCommunityImpactWidget;
  }
}

window.beamApps = new App();
export default window.beamApps;