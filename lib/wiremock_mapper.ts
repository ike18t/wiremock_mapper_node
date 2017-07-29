import { RequestBuilder } from './builders/request_builder';
import { ResponseBuilder } from './builders/response_builder';

export type WireMockMapping = (request: RequestBuilder, response: ResponseBuilder) => void;

export class WireMockMapper {

  public static create_mapping(url: string, wireMockMapping: WireMockMapping): number {
    let requestBuilder = new RequestBuilder();
    let responseBuilder = new ResponseBuilder();
    wireMockMapping(requestBuilder, responseBuilder);
    let response = this.sendToWireMock(url, { request: requestBuilder, response: ResponseBuilder });
    return 1;
  }

  static readonly WIREMOCK_MAPPINGS_PATH = '__admin/mappings';

  private static sendToWireMock(url: string, body: any): any {
    let uri = [this.WIREMOCK_MAPPINGS_PATH, url].join('/');
  }
}
