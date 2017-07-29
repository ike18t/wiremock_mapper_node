import { WireMockMapping } from './wiremock_mapping';
import { RequestBuilder } from './builders/request_builder';
import { ResponseBuilder } from './builders/response_builder';

export class Configuration {
  public static readonly requestBuilder: RequestBuilder = new RequestBuilder();
  public static readonly responseBuilder: ResponseBuilder = new ResponseBuilder();
  public static wireMockHost?: string = undefined;
  public static wireMockPort: number = 8080;

  public static createGlobalMapping(wireMockMapping: WireMockMapping) {
    wireMockMapping(this.requestBuilder, this.responseBuilder);
  }
}
