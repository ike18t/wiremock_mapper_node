import {
  ScenarioBuilder,
  ScenarioBuilderImpl
} from './builders/scenario_builder';
import { Configuration } from './configuration';
import { WireMockMapping } from './wiremock_mapping';
import { GetRequestOptions, WireMockService } from './wiremock_service';
import { RequestsResponse } from './requests_response';

export class WireMockMapper {
  public static async clearAllMappings(): Promise<void> {
    return WireMockService.clearWireMockMappings();
  }

  public static async createMapping(
    wireMockMapping: WireMockMapping
  ): Promise<string> {
    const requestBuilder = Configuration.requestBuilder.clone();
    const responseBuilder = Configuration.responseBuilder.clone();
    const scenarioBuilder: ScenarioBuilder = new ScenarioBuilderImpl();

    wireMockMapping(requestBuilder, responseBuilder, scenarioBuilder);
    return new Promise<string>((resolve, reject) => {
      const response = WireMockService.sendToWireMock(
        requestBuilder,
        responseBuilder,
        scenarioBuilder
      );
      response
        .then((data) => {
          resolve((JSON.parse(data) as { id: string }).id);
        })
        .catch(reject);
    });
  }

  public static async deleteMapping(stubId: string): Promise<void> {
    return WireMockService.deleteFromWireMock(stubId);
  }

  public static async getRequests(
    getRequestOptions?: GetRequestOptions
  ): Promise<RequestsResponse> {
    return new Promise<RequestsResponse>((resolve, reject) => {
      const response = WireMockService.getRequests(getRequestOptions);
      response
        .then((data) => {
          resolve(JSON.parse(data) as RequestsResponse);
        })
        .catch(reject);
    });
  }
}
