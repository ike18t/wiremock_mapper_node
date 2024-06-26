import { RequestBuilder } from './builders/request_builder';
import { ResponseBuilder } from './builders/response_builder';
import { ScenarioBuilder } from './builders/scenario_builder';

export type GlobalWireMockMapping = (
  request: RequestBuilder,
  response: ResponseBuilder
) => void;
export type WireMockMapping = (
  request: RequestBuilder,
  response: ResponseBuilder,
  scenario: ScenarioBuilder
) => void;
