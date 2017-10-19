import { Configuration } from "./configuration";
import { WireMockMapping } from "./wiremock_mapping";
import { WireMockService } from "./wiremock_service";

export class WireMockMapper {
  public static async clearAllMappings(): Promise<void> {
    return WireMockService.clearWireMockMappings();
  }

  public static async createMapping(wireMockMapping: WireMockMapping): Promise<string> {
    const requestBuilder = Configuration.requestBuilder.clone();
    const responseBuilder = Configuration.responseBuilder.clone();

    wireMockMapping(requestBuilder, responseBuilder);
    return new Promise<string>((resolve, reject) => {
      const response = WireMockService.sendToWireMock({ request: requestBuilder, response: responseBuilder });
      response.then((data) => { resolve(JSON.parse(data).id); })
              .catch(reject) ;
    });
  }

  public static async deleteMapping(mappingId: string): Promise<void> {
    return WireMockService.deleteFromWireMock(mappingId);
  }
}
