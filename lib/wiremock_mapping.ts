import { RequestBuilder } from "./builders/request_builder";
import { ResponseBuilder } from "./builders/response_builder";

export type WireMockMapping = (request: RequestBuilder, response: ResponseBuilder) => void;
