import * as http from "http";
import { ResponseBuilder } from './builders/response_builder';
import { WireMockMapping } from './wiremock_mapping';
import { Configuration } from './configuration';

export class WireMockMapper {
  public static clear_mappings(): void {
    this.clearWireMockMappings();
  }

  public static create_mapping(wireMockMapping: WireMockMapping): Promise<number> {
    let requestBuilder = Configuration.requestBuilder;
    let responseBuilder = Configuration.responseBuilder;

    wireMockMapping(requestBuilder, responseBuilder);
    return new Promise<number>((resolve) => {
      let response = this.sendToWireMock({ request: requestBuilder, response: ResponseBuilder });
      response.then((data) => resolve(JSON.parse(data).id));
    });
  }

  public static delete_mapping(mappingId: string): void {
    this.deleteFromWireMock(mappingId);
  }

  static readonly WIREMOCK_MAPPINGS_PATH = '__admin/mappings';
  static readonly WIREMOCK_CLEAR_MAPPINGS_PATH = '__admin/mappings/reset';

  private static clearWireMockMappings(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = http.request({
        hostname: Configuration.wireMockHost,
        method: 'POST',
        path: this.WIREMOCK_CLEAR_MAPPINGS_PATH,
        port: Configuration.wireMockPort,
      }, (response) => {
        if (response.statusCode != 200) {
          reject(new Error("Unexpected Status Code: " + response.statusCode));
        }
        response.on('end', function() {
          resolve();
        });
      });

      request.on('error', function(error) {
        reject(error);
      });

      request.end();
    });
  }

  private static async deleteFromWireMock(mappingId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = http.request({
        hostname: Configuration.wireMockHost,
        method: 'DELETE',
        path: [this.WIREMOCK_MAPPINGS_PATH, mappingId].join('/'),
        port: Configuration.wireMockPort,
      }, (response) => {
        if (response.statusCode != 200) {
          reject(new Error("Unexpected Status Code: " + response.statusCode));
        }
        response.on('end', function() {
          resolve();
        });
      });

      request.on('error', function(error) {
        reject(error);
      });

      request.end();
    });
  }

  private static async sendToWireMock(body: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const request = http.request({
        hostname: Configuration.wireMockHost,
        method: 'POST',
        path: this.WIREMOCK_MAPPINGS_PATH,
        port: Configuration.wireMockPort
      }, (response) => {
        if (response.statusCode != 201) {
          reject(new Error("Unexpected Status Code: " + response.statusCode));
        }

        let data = '';
        response.on('data', function(chunk) {
          data += chunk;
        });

        response.on('end', function() {
          resolve(data);
        });
      });

      request.on('error', function(error) {
        reject(error);
      });

      request.write(body);
      request.end();
    });
  }
}
