import { RequestBuilderImpl } from "./builders/request_builder";
import { ResponseBuilderImpl } from "./builders/response_builder";
import { WireMockMapping } from "./wiremock_mapping";

export class Configuration {
  public static readonly requestBuilder: RequestBuilderImpl = new RequestBuilderImpl();
  public static readonly responseBuilder: ResponseBuilderImpl = new ResponseBuilderImpl();
  public static wireMockHost = "localhost";
  public static wireMockPort = 8080;

  public static createGlobalMapping(wireMockMapping: WireMockMapping) {
    wireMockMapping(this.requestBuilder, this.responseBuilder);
  }
}
