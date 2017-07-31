import { RequestBuilder } from "../../lib/builders/request_builder";

export class MatchBuilder {
  private matchType: string;
  private options: any = {};
  private value: string | boolean;

  constructor(private readonly requestBuilder: RequestBuilder) {}

  public absent(): RequestBuilder {
    this.matchType = "absent";
    this.value = true;
    return this.requestBuilder;
  }

  public containing(value: string): RequestBuilder {
    this.matchType = "contains";
    this.value = value;
    return this.requestBuilder;
  }

  public equalTo(value: string): RequestBuilder {
    this.matchType = "equalTo";
    this.value = value;
    return this.requestBuilder;
  }

  public equalToJson(json: any, ignoreArrayOrder: boolean = false, ignoreExtraElements: boolean = false) {
    this.matchType = "equalToJson";
    this.value = json;

    if (ignoreArrayOrder) {
      this.options.ignoreArrayOrder = ignoreArrayOrder;
    }

    if (ignoreExtraElements) {
      this.options.ignoreExtraElements = ignoreExtraElements;
    }

    return this.requestBuilder;
  }

  public equalToXml(xml: string) {
    this.matchType = "equalToXml";
    this.value = xml;
    return this.requestBuilder;
  }

  public matching(value: string) {
    this.matchType = "matches";
    this.value = value;
    return this.requestBuilder;
  }

  public matchingJsonPath(value: string) {
    this.matchType = "matchesJsonPath";
    this.value = value;
    return this.requestBuilder;
  }

  public matchingXPath(xpath: string) {
    this.matchType = "matchesXPath";
    this.value = xpath;
    return this.requestBuilder;
  }

  public notMatching(value: string) {
    this.matchType = "doesNotMatch";
    this.value = value;
    return this.requestBuilder;
  }

  public toJSON = () => ({ [this.matchType]: this.value, ...this.options });
}
