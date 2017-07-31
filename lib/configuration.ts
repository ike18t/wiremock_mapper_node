import { RequestBuilder, RequestBuilderImpl } from "./builders/request_builder";
import { ResponseBuilder, ResponseBuilderImpl } from "./builders/response_builder";
import { WireMockMapping } from "./wiremock_mapping";

/* tslint:disable:max-classes-per-file */
class NotImplementedException extends Error {}

export class Configuration {
  public static readonly requestBuilder: RequestBuilder = new RequestBuilderImpl();
  public static readonly responseBuilder: ResponseBuilder = new ResponseBuilderImpl();
  public static wireMockHost = "localhost";
  public static wireMockPort = 8080;

  public static createGlobalMapping(wireMockMapping: WireMockMapping) {
    wireMockMapping(this.requestBuilder, this.responseBuilder);
    const exceptionMessage = `
      If you know how to deep clone an object in typescript, submit a pull request and make the pending tests pass.
    `;
    throw new NotImplementedException(exceptionMessage);
  }
}
/* tslint:enable:max-classes-per-file */
