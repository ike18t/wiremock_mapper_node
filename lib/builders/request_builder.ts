import { MatchBuilder } from '../../lib/builders/match_builder'
import { UrlMatchBuilder } from '../../lib/builders/url_match_builder'

export class RequestBuilder {
  private _options: any = {};
  private _urlMatchBuilder: UrlMatchBuilder = new UrlMatchBuilder(this);

  public toJSON = () => Object.assign({}, this._options, this._urlMatchBuilder.toJSON());

  public isAnyVerb() {
    this._options['method'] = 'ANY';
    return this;
  }

  public isADelete() {
    this._options['method'] = 'DELETE';
    return this;
  }

  public isAGet() {
    this._options['method'] = 'GET';
    return this;
  }

  public isAHead() {
    this._options['method'] = 'HEAD';
    return this;
  }

  public isAnOptions() {
    this._options['method'] = 'OPTIONS';
    return this;
  }

  public isAPost() {
    this._options['method'] = 'POST';
    return this;
  }

  public isAPut() {
    this._options['method'] = 'PUT';
    return this;
  }

  public isATrace() {
    this._options['method'] = 'TRACE';
    return this;
  }

  public withBasicAuth(username: string, password: string): RequestBuilder {
    this._options['basicAuth'] = { 'username': username, 'password': password };
    return this;
  }

  public withBody(): MatchBuilder {
    if (!this._options['bodyPatterns']) {
      this._options['bodyPatterns'] = []
    }
    const matchBuilder = new MatchBuilder(this);
    this._options['bodyPatterns'].push(matchBuilder);
    return matchBuilder;
  }

  public withCookie(key: string): MatchBuilder {
    if (!this._options['cookies']) {
      this._options['cookies'] = {}
    }
    const matchBuilder = new MatchBuilder(this);
    this._options['cookies'][key] = matchBuilder;
    return matchBuilder;
  }

  public withHeader(key: string): MatchBuilder {
    if (!this._options['headers']) {
      this._options['headers'] = {}
    }
    const matchBuilder = new MatchBuilder(this);
    this._options['headers'][key] = matchBuilder;
    return matchBuilder;
  }

  public withQueryParam(key: string): MatchBuilder {
    if (!this._options['queryParameters']) {
      this._options['queryParameters'] = {}
    }
    const matchBuilder = new MatchBuilder(this);
    this._options['queryParameters'][key] = matchBuilder;
    return matchBuilder;
  }

  public withUrl(): UrlMatchBuilder {
    this._urlMatchBuilder = new UrlMatchBuilder(this);
    return this._urlMatchBuilder;
  }

  public withUrlPath(): UrlMatchBuilder {
    this._urlMatchBuilder = new UrlMatchBuilder(this, true);
    return this._urlMatchBuilder;
  }
}
