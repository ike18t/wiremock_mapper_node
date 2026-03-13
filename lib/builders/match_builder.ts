import { RequestBuilder } from '../../lib/builders/request_builder';

type StringOrThunk = string | (() => string);

interface Options {
  ignoreArrayOrder: boolean;
  ignoreExtraElements: boolean;
}

export class MatchBuilder {
  private matchType = '';
  private readonly options: Partial<Options> = {};
  private value?: string | boolean | (() => string);

  constructor(private readonly requestBuilder: RequestBuilder) {}

  get absent(): RequestBuilder {
    this.matchType = 'absent';
    this.value = true;
    return this.requestBuilder;
  }

  public containing(value: StringOrThunk): RequestBuilder {
    this.matchType = 'contains';
    this.value = value;
    return this.requestBuilder;
  }

  public equalTo(value: StringOrThunk): RequestBuilder {
    this.matchType = 'equalTo';
    this.value = value;
    return this.requestBuilder;
  }

  public equalToJson(
    json: object | StringOrThunk,
    ignoreArrayOrder: boolean = false,
    ignoreExtraElements: boolean = false
  ) {
    this.matchType = 'equalToJson';
    if (typeof json === 'function') {
      this.value = json as () => string;
    } else if (typeof json === 'object') {
      this.value = JSON.stringify(json);
    } else {
      this.value = json;
    }

    if (ignoreArrayOrder) {
      this.options.ignoreArrayOrder = ignoreArrayOrder;
    }

    if (ignoreExtraElements) {
      this.options.ignoreExtraElements = ignoreExtraElements;
    }

    return this.requestBuilder;
  }

  public equalToXml(xml: StringOrThunk) {
    this.matchType = 'equalToXml';
    this.value = xml;
    return this.requestBuilder;
  }

  public matching(value: StringOrThunk) {
    this.matchType = 'matches';
    this.value = value;
    return this.requestBuilder;
  }

  public matchingJsonPath(value: StringOrThunk) {
    this.matchType = 'matchesJsonPath';
    this.value = value;
    return this.requestBuilder;
  }

  public matchingXPath(xpath: StringOrThunk) {
    this.matchType = 'matchesXPath';
    this.value = xpath;
    return this.requestBuilder;
  }

  public notMatching(value: StringOrThunk) {
    this.matchType = 'doesNotMatch';
    this.value = value;
    return this.requestBuilder;
  }

  public toJSON = () => {
    const resolved =
      typeof this.value === 'function' ? this.value() : this.value;
    return { [this.matchType]: resolved, ...this.options };
  };
}
