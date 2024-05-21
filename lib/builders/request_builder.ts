import { MatchBuilder } from '../../lib/builders/match_builder';
import { UrlMatchBuilder } from '../../lib/builders/url_match_builder';

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
  isADelete: RequestBuilder;
  isAGet: RequestBuilder;
  isAHead: RequestBuilder;
  isAnOptions: RequestBuilder;
  isAnyVerb: RequestBuilder;
  isAPost: RequestBuilder;
  isAPut: RequestBuilder;
  isATrace: RequestBuilder;
  withBody: MatchBuilder;
  withUrl: UrlMatchBuilder;
  withUrlPath: UrlMatchBuilder;
  withBasicAuth(username: string, password: string): RequestBuilder;
  withCookie(key: string): MatchBuilder;
  withHeader(key: string): MatchBuilder;
  withQueryParam(key: string): MatchBuilder;
}

export class RequestBuilderImpl implements RequestBuilder {
  protected request: Partial<Request> = {};
  protected urlMatchBuilder: UrlMatchBuilder = new UrlMatchBuilder(this);

  public clone() {
    const clone = new RequestBuilderImpl();
    clone.request = { ...this.request };
    clone.urlMatchBuilder = this.urlMatchBuilder;
    return clone;
  }

  get isADelete() {
    this.request.method = 'DELETE';
    return this;
  }

  get isAGet() {
    this.request.method = 'GET';
    return this;
  }

  get isAHead() {
    this.request.method = 'HEAD';
    return this;
  }

  get isAnOptions() {
    this.request.method = 'OPTIONS';
    return this;
  }

  get isAnyVerb() {
    this.request.method = 'ANY';
    return this;
  }

  get isAPost() {
    this.request.method = 'POST';
    return this;
  }

  get isAPut() {
    this.request.method = 'PUT';
    return this;
  }

  get isATrace() {
    this.request.method = 'TRACE';
    return this;
  }

  public toJSON: () => RequestJSON = () => ({
    ...this.request,
    ...this.urlMatchBuilder.toJSON()
  });

  public withBasicAuth(username: string, password: string): RequestBuilder {
    this.request.basicAuthCredentials = { username, password };
    return this;
  }

  get withBody(): MatchBuilder {
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

  get withUrl(): UrlMatchBuilder {
    this.urlMatchBuilder = new UrlMatchBuilder(this);
    return this.urlMatchBuilder;
  }

  get withUrlPath(): UrlMatchBuilder {
    this.urlMatchBuilder = new UrlMatchBuilder(this, true);
    return this.urlMatchBuilder;
  }
}
