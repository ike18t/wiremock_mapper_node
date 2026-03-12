import { RequestBuilder } from './request_builder';

export class UrlMatchBuilder {
  private jsonObject = {};

  constructor(
    private readonly requestBuilder: RequestBuilder,
    private readonly path: boolean = false
  ) {}

  public equalTo(url: string): RequestBuilder {
    const urlType = this.path ? 'urlPath' : 'url';
    this.jsonObject = { [urlType]: url };
    return this.requestBuilder;
  }

  public matching(regexp: string): RequestBuilder {
    const urlType = this.path ? 'urlPathPattern' : 'urlPattern';
    this.jsonObject = { [urlType]: regexp };
    return this.requestBuilder;
  }

  public clone(newRequestBuilder: RequestBuilder): UrlMatchBuilder {
    const clone = new UrlMatchBuilder(newRequestBuilder, this.path);
    clone.jsonObject = { ...this.jsonObject };
    return clone;
  }

  public toJSON = () => this.jsonObject;
}
