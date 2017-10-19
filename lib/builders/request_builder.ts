import { MatchBuilder } from "../../lib/builders/match_builder";
import { UrlMatchBuilder } from "../../lib/builders/url_match_builder";

export interface Request {
  basicAuthCredentials?: { password: string; username: string };
  bodyPatterns?: MatchBuilder[];
  cookies?: { [key: string]: MatchBuilder };
  headers?: { [key: string]: MatchBuilder };
  method?: string;
  queryParameters?: { [key: string]: MatchBuilder };
  urlMatchBuilder?: UrlMatchBuilder;
}

export interface RequestJSON extends Request {
  url?: string;
  urlPath?: string;
  urlPathPattern?: string;
  urlPattern?: string;
}

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
  protected request: any = {};
  protected urlMatchBuilder: UrlMatchBuilder = new UrlMatchBuilder(this);

  public clone() {
    const clone = new RequestBuilderImpl();
    clone.request = { ...this.request };
    clone.urlMatchBuilder = this.urlMatchBuilder;
    return clone;
  }

  public isADelete() {
    this.request.method = "DELETE";
    return this;
  }

  public isAGet() {
    this.request.method = "GET";
    return this;
  }

  public isAHead() {
    this.request.method = "HEAD";
    return this;
  }

  public isAnOptions() {
    this.request.method = "OPTIONS";
    return this;
  }

  public isAnyVerb() {
    this.request.method = "ANY";
    return this;
  }

  public isAPost() {
    this.request.method = "POST";
    return this;
  }

  public isAPut() {
    this.request.method = "PUT";
    return this;
  }

  public isATrace() {
    this.request.method = "TRACE";
    return this;
  }

  public toJSON: () => RequestJSON = () => ({ ...this.request, ...this.urlMatchBuilder.toJSON() });

  public withBasicAuth(username: string, password: string): RequestBuilder {
    this.request.basicAuthCredentials = { username, password };
    return this;
  }

  public withBody(): MatchBuilder {
    if (!this.request.bodyPatterns) {
      this.request.bodyPatterns = [];
    }
    const matchBuilder = new MatchBuilder(this);
    this.request.bodyPatterns.push(matchBuilder);
    return matchBuilder;
  }

  public withCookie(key: string): MatchBuilder {
    if (!this.request.cookies) {
      this.request.cookies = {};
    }
    const matchBuilder = new MatchBuilder(this);
    this.request.cookies[key] = matchBuilder;
    return matchBuilder;
  }

  public withHeader(key: string): MatchBuilder {
    if (!this.request.headers) {
      this.request.headers = {};
    }
    const matchBuilder = new MatchBuilder(this);
    this.request.headers[key] = matchBuilder;
    return matchBuilder;
  }

  public withQueryParam(key: string): MatchBuilder {
    if (!this.request.queryParameters) {
      this.request.queryParameters = {};
    }
    const matchBuilder = new MatchBuilder(this);
    this.request.queryParameters[key] = matchBuilder;
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
