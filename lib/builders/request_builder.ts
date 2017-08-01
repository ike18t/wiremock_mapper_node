import { MatchBuilder } from "../../lib/builders/match_builder";
import { UrlMatchBuilder } from "../../lib/builders/url_match_builder";

export interface RequestBuilder {
  isADelete(): RequestBuilder;
  isAGet(): RequestBuilder;
  isAHead(): RequestBuilder;
  isAnOptions(): RequestBuilder;
  isAnyVerb(): RequestBuilder;
  isAPost(): RequestBuilder;
  isAPut(): RequestBuilder;
  isATrace(): RequestBuilder;
  withBasicAuth(username: string, password: string): RequestBuilder;
  withBody(): MatchBuilder;
  withCookie(key: string): MatchBuilder;
  withHeader(key: string): MatchBuilder;
  withQueryParam(key: string): MatchBuilder;
  withUrl(): UrlMatchBuilder;
  withUrlPath(): UrlMatchBuilder;
}

export class RequestBuilderImpl implements RequestBuilder {
  protected options: any = {};
  protected urlMatchBuilder: UrlMatchBuilder = new UrlMatchBuilder(this);

  public clone() {
    const clone = new RequestBuilderImpl();
    clone.options = {...this.options};
    clone.urlMatchBuilder = this.urlMatchBuilder;
    return clone;
  }

  public isADelete() {
    this.options.method = "DELETE";
    return this;
  }

  public isAGet() {
    this.options.method = "GET";
    return this;
  }

  public isAHead() {
    this.options.method = "HEAD";
    return this;
  }

  public isAnOptions() {
    this.options.method = "OPTIONS";
    return this;
  }

  public isAnyVerb() {
    this.options.method = "ANY";
    return this;
  }

  public isAPost() {
    this.options.method = "POST";
    return this;
  }

  public isAPut() {
    this.options.method = "PUT";
    return this;
  }

  public isATrace() {
    this.options.method = "TRACE";
    return this;
  }

  public toJSON = () => ({ ...this.options, ...this.urlMatchBuilder.toJSON() });

  public withBasicAuth(username: string, password: string): RequestBuilder {
    this.options.basicAuth = { username, password };
    return this;
  }

  public withBody(): MatchBuilder {
    if (!this.options.bodyPatterns) {
      this.options.bodyPatterns = [];
    }
    const matchBuilder = new MatchBuilder(this);
    this.options.bodyPatterns.push(matchBuilder);
    return matchBuilder;
  }

  public withCookie(key: string): MatchBuilder {
    if (!this.options.cookies) {
      this.options.cookies = {};
    }
    const matchBuilder = new MatchBuilder(this);
    this.options.cookies[key] = matchBuilder;
    return matchBuilder;
  }

  public withHeader(key: string): MatchBuilder {
    if (!this.options.headers) {
      this.options.headers = {};
    }
    const matchBuilder = new MatchBuilder(this);
    this.options.headers[key] = matchBuilder;
    return matchBuilder;
  }

  public withQueryParam(key: string): MatchBuilder {
    if (!this.options.queryParameters) {
      this.options.queryParameters = {};
    }
    const matchBuilder = new MatchBuilder(this);
    this.options.queryParameters[key] = matchBuilder;
    return matchBuilder;
  }

  public withUrl(): UrlMatchBuilder {
    this.urlMatchBuilder = new UrlMatchBuilder(this);
    return this.urlMatchBuilder;
  }

  public withUrlPath(): UrlMatchBuilder {
    this.urlMatchBuilder = new UrlMatchBuilder(this, true);
    return this.urlMatchBuilder;
  }
}
