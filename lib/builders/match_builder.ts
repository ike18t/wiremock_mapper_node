import { RequestBuilder } from '../../lib/builders/request_builder'

export class MatchBuilder {
  constructor(private readonly requestBuilder) {}

  private _type: string;
  private _value: string | boolean;
  private _options: any = {};

  public toJSON = () => Object.assign({}, { [this._type]: this._value }, this._options);

  public absent(): RequestBuilder {
    this._type = 'absent';
    this._value = true;
    return this.requestBuilder;
  }

  public containing(value: string): RequestBuilder {
    this._type = 'contains';
    this._value = value;
    return this.requestBuilder;
  }

  public equalTo(value: string): RequestBuilder {
    this._type = 'equalTo';
    this._value = value;
    return this.requestBuilder;
  }

  public equalToJson(json: any, ignoreArrayOrder: boolean = false, ignoreExtraElements: boolean = false) {
    this._type = 'equalToJson';
    this._value = json;

    if(ignoreArrayOrder) {
      this._options['ignoreArrayOrder'] = ignoreArrayOrder;
    }

    if(ignoreExtraElements) {
      this._options['ignoreExtraElements'] = ignoreExtraElements;
    }

    return this.requestBuilder;
  }

  public equalToXml(xml: string) {
    this._type = 'equalToXml';
    this._value = xml;
    return this.requestBuilder;
  }

  public matching(value: string) {
    this._type = 'matches';
    this._value = value;
    return this.requestBuilder;
  }

  public matchingJsonPath(value: string) {
    this._type = 'matchesJsonPath';
    this._value = value;
    return this.requestBuilder;
  }

  public matchingXPath(xpath: string) {
    this._type = 'matchesXPath';
    this._value = xpath;
    return this.requestBuilder;
  }

  public notMatching(value: string) {
    this._type = 'doesNotMatch';
    this._value = value;
    return this.requestBuilder;
  }
}
