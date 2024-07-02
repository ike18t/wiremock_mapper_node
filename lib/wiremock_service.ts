import * as http from 'http';
import { RequestBuilder } from './builders/request_builder';
import { ResponseBuilder } from './builders/response_builder';
import {
  ScenarioBuilder,
  ScenarioBuilderImpl
} from './builders/scenario_builder';
import { Configuration } from './configuration';

export class WireMockService {
  public static async clearWireMockMappings(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = http.request(
        {
          hostname: Configuration.wireMockHost,
          method: 'POST',
          path: this.WIREMOCK_CLEAR_MAPPINGS_PATH,
          port: Configuration.wireMockPort
        },
        WireMockService.responseHandler(() => {
          resolve();
        }, reject)
      );
      request.on('error', reject);
      request.end();
    });
  }

  public static async deleteFromWireMock(mappingId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = http.request(
        {
          hostname: Configuration.wireMockHost,
          method: 'DELETE',
          path: [this.WIREMOCK_MAPPINGS_PATH, mappingId].join('/'),
          port: Configuration.wireMockPort
        },
        WireMockService.responseHandler(() => {
          resolve();
        }, reject)
      );
      request.on('error', reject);
      request.end();
    });
  }

  public static async getRequests(option?: GetRequestOptions): Promise<string> {
    const queryString = option?.stubId ? `matchingStub=${option.stubId}` : '';

    return new Promise<string>((resolve, reject) => {
      const request = http.request(
        {
          headers: { 'Content-Type': 'application/json' },
          hostname: Configuration.wireMockHost,
          method: 'GET',
          path: [this.WIREMOCK_REQUESTS_PATH, queryString]
            .filter(Boolean)
            .join('?'),
          port: Configuration.wireMockPort
        },
        WireMockService.responseHandler(resolve, reject)
      );
      request.on('error', reject);
      request.end();
    });
  }

  public static async sendToWireMock(
    requestBuilder: RequestBuilder,
    responseBuilder: ResponseBuilder,
    scenarioBuilder: ScenarioBuilder
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const request = http.request(
        {
          headers: { 'Content-Type': 'application/json' },
          hostname: Configuration.wireMockHost,
          method: 'POST',
          path: this.WIREMOCK_MAPPINGS_PATH,
          port: Configuration.wireMockPort
        },
        WireMockService.responseHandler(resolve, reject, 201)
      );
      request.on('error', reject);

      const wiremockRequest = {
        request: requestBuilder,
        response: responseBuilder,
        ...(scenarioBuilder as ScenarioBuilderImpl).toJSON()
      };
      request.write(JSON.stringify(wiremockRequest));
      request.end();
    });
  }

  private static get WIREMOCK_CLEAR_MAPPINGS_PATH() {
    return `${Configuration.baseUrl?.pathname || ''}/__admin/mappings/reset`;
  }

  private static get WIREMOCK_MAPPINGS_PATH() {
    return `${Configuration.baseUrl?.pathname || ''}/__admin/mappings`;
  }

  private static get WIREMOCK_REQUESTS_PATH() {
    return `${Configuration.baseUrl?.pathname || ''}/__admin/requests`;
  }

  private static responseHandler(
    resolve: (value: string) => void,
    reject: (reason?: unknown) => void,
    successStatusCode = 200
  ) {
    return (response: http.IncomingMessage) => {
      if (response.statusCode !== successStatusCode) {
        reject(new Error(`Unexpected Status Code: ${response.statusCode}`));
      }

      let data = '';
      response.on('data', (chunk: string) => (data += chunk));
      response.on('end', () => resolve(data));
    };
  }
}

type RequestsByStubId = { stubId: string };
export type GetRequestOptions = undefined | RequestsByStubId;
