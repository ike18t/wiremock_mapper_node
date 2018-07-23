import { RequestBuilderImpl } from './builders/request_builder';
import { ResponseBuilderImpl } from './builders/response_builder';
import { WireMockMapping } from './wiremock_mapping';

export class Configuration {
  public static get requestBuilder(): RequestBuilderImpl {
    return Configuration.requestBuilderImpl;
  }

  public static get responseBuilder(): ResponseBuilderImpl {
    return Configuration.responseBuilderImpl;
  }

  public static wireMockHost = 'localhost';
  public static wireMockPort = 8080;

  public static createGlobalMapping(wireMockMapping: WireMockMapping) {
    wireMockMapping(this.requestBuilder, this.responseBuilder);
  }

  public static reset() {
    Configuration.requestBuilderImpl = new RequestBuilderImpl();
    Configuration.responseBuilderImpl = new ResponseBuilderImpl();
  }

  private static requestBuilderImpl: RequestBuilderImpl = new RequestBuilderImpl();
  private static responseBuilderImpl: ResponseBuilderImpl = new ResponseBuilderImpl();
}
