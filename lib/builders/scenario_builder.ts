export interface ScenarioJSON {
  newScenarioState?: string;
  requiredScenarioState?: string;
  scenarioName?: string;
}

export interface ScenarioBuilder {
  name(name: string): ScenarioBuilder;
  newState(name: string): ScenarioBuilder;
  requiredState(name: string): ScenarioBuilder;
}

export class ScenarioBuilderImpl implements ScenarioBuilder {
  protected jsonObject: ScenarioJSON = {};

  public name(name: string): ScenarioBuilder {
    this.jsonObject.scenarioName = name;
    return this;
  }

  public newState(stateName: string): ScenarioBuilder {
    this.jsonObject.newScenarioState = stateName;
    return this;
  }

  public requiredState(stateName: string): ScenarioBuilder {
    this.jsonObject.requiredScenarioState = stateName;
    return this;
  }

  public toJSON = () => this.jsonObject;
}
