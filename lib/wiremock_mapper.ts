// import { Configuration } from './configuration';
import { RequestBuilderImpl } from "./builders/request_builder";
import { ResponseBuilderImpl } from "./builders/response_builder";
import { WireMockMapping } from "./wiremock_mapping";
import { WireMockService } from "./wiremock_service";

export class WireMockMapper {
  public static clearAllMappings(): Promise<void> {
    return WireMockService.clearWireMockMappings();
  }

  public static createMapping(wireMockMapping: WireMockMapping): Promise<string> {
    // TODO: fix global mapping by deep cloning somehow
    // const requestBuilder = Configuration.requestBuilder;
    // const requestBuilder = Configuration.requestBuilder;
    const requestBuilder = new RequestBuilderImpl();
    const responseBuilder = new ResponseBuilderImpl();

    wireMockMapping(requestBuilder, responseBuilder);
    return new Promise<string>((resolve, reject) => {
      const response = WireMockService.sendToWireMock({ request: requestBuilder, response: responseBuilder });
      response.then((data) => resolve(JSON.parse(data).id))
              .catch(reject) ;
    });
  }

  public static deleteMapping(mappingId: string): Promise<void> {
    return WireMockService.deleteFromWireMock(mappingId);
  }
}
