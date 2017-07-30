import { WireMockMapping } from './wiremock_mapping';
import { RequestBuilder, RequestBuilderImpl } from './builders/request_builder';
import { ResponseBuilder, ResponseBuilderImpl } from './builders/response_builder';

class NotImplementedException extends Error {};

export class Configuration {
  public static readonly requestBuilder: RequestBuilder = new RequestBuilderImpl();
  public static readonly responseBuilder: ResponseBuilder = new ResponseBuilderImpl();
  public static wireMockHost: string = 'localhost';
  public static wireMockPort: number = 8080;

  public static createGlobalMapping(wireMockMapping: WireMockMapping) {
    wireMockMapping(this.requestBuilder, this.responseBuilder);
    throw new NotImplementedException('If you know how to deep clone an object in typescript, submit a pull request and make the pending tests pass.');
  }
}
