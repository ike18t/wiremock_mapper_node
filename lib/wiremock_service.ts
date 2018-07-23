import * as http from 'http';
import { RequestBuilder } from './builders/request_builder';
import { ResponseBuilder } from './builders/response_builder';
import { ScenarioBuilder, ScenarioBuilderImpl } from './builders/scenario_builder';
import { Configuration } from './configuration';

export class WireMockService {
  public static async clearWireMockMappings(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = http.request({
        hostname: Configuration.wireMockHost,
        method: 'POST',
        path: this.WIREMOCK_CLEAR_MAPPINGS_PATH,
        port: Configuration.wireMockPort,
      },                           (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Unexpected Status Code: ${response.statusCode}`));
        }

        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', resolve);
      });

      request.on('error', reject);
      request.end();
    });
  }

  public static async deleteFromWireMock(mappingId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = http.request({
          hostname: Configuration.wireMockHost,
          method: 'DELETE',
          path: [this.WIREMOCK_MAPPINGS_PATH, mappingId].join('/'),
          port: Configuration.wireMockPort,
        },                         (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Unexpected Status Code: ${response.statusCode}`));
          }

          let data = '';
          response.on('data', (chunk) => data += chunk);
          response.on('end', resolve);
        });

      request.on('error', reject);
      request.end();
    });
  }

  public static async sendToWireMock(requestBuilder: RequestBuilder,
                                     responseBuilder: ResponseBuilder,
                                     scenarioBuilder: ScenarioBuilder): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const request = http.request({
        headers: { 'Content-Type': 'application/json' },
        hostname: Configuration.wireMockHost,
        method: 'POST',
        path: this.WIREMOCK_MAPPINGS_PATH,
        port: Configuration.wireMockPort,
      },                           (response) => {
        if (response.statusCode !== 201) {
          reject(new Error(`Unexpected Status Code: ${response.statusCode}`));
        }

        let data = '';
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => { resolve(data); });
      });

      request.on('error', reject);

      const wiremockRequest = { request: requestBuilder,
                                response: responseBuilder,
                                ...(scenarioBuilder as ScenarioBuilderImpl).toJSON() };
      request.write(JSON.stringify(wiremockRequest));
      request.end();
    });
  }

  private static readonly WIREMOCK_CLEAR_MAPPINGS_PATH = '/__admin/mappings/reset';
  private static readonly WIREMOCK_MAPPINGS_PATH = '/__admin/mappings';
}
