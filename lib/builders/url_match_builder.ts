import { RequestBuilder } from './request_builder';
import { ResponseBuilder } from './response_builder';

export class UrlMatchBuilder {

  constructor(private readonly requestBuilder: RequestBuilder, private readonly path: boolean = false) {};

  private _jsonObject = {};

  public toJSON = () => this._jsonObject;

  public equalTo(url: string): RequestBuilder {
    let urlType = this.path ? 'urlPath' : 'url';
    this._jsonObject = { [urlType]: url };
    return this.requestBuilder;
  }

  public matching(regexp: string): RequestBuilder {
    let urlType = this.path ? 'urlPathPattern' : 'urlPattern';
    this._jsonObject = { [urlType]: regexp };
    return this.requestBuilder;
  }
}
