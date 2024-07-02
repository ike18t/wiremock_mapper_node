import { RequestBuilderImpl } from './builders/request_builder';
import { ResponseBuilderImpl } from './builders/response_builder';
import { GlobalWireMockMapping } from './wiremock_mapping';

export class Configuration {
  public static get requestBuilder(): RequestBuilderImpl {
    return Configuration.requestBuilderImpl;
  }

  public static get responseBuilder(): ResponseBuilderImpl {
    return Configuration.responseBuilderImpl;
  }

  public static get baseUrl(): URL | undefined {
    return Configuration.baseURL;
  }

  public static set wireMockBaseUrl(url: string) {
    const urlObj = new URL(url);
    Configuration.baseURL = urlObj;

    Configuration.wireMockHost = urlObj.hostname;
    Configuration.wireMockPort = Number(urlObj.port);
  }

  /**
   * @deprecated - Use wireMockBaseUrl instead
   */
  public static wireMockHost = 'localhost';
  /**
   * @deprecated - Use wireMockBaseUrl instead
   */
  public static wireMockPort = 8080;

  public static createGlobalMapping(wireMockMapping: GlobalWireMockMapping) {
    wireMockMapping(this.requestBuilder, this.responseBuilder);
  }

  public static reset() {
    Configuration.requestBuilderImpl = new RequestBuilderImpl();
    Configuration.responseBuilderImpl = new ResponseBuilderImpl();
  }

  private static baseURL?: URL;
  private static requestBuilderImpl: RequestBuilderImpl =
    new RequestBuilderImpl();
  private static responseBuilderImpl: ResponseBuilderImpl =
    new ResponseBuilderImpl();
}
