export interface ResponseBuilder {
  withBody(value: string): ResponseBuilder;
  withDelay(milliseconds: number): ResponseBuilder;
  withHeader(key: string, value: string): ResponseBuilder;
  withStatus(statusCode: number): ResponseBuilder;
  withStatusMessage(statusMessage: string): ResponseBuilder;
  withTransformer(transformerName: string): ResponseBuilder;
}

export class ResponseBuilderImpl implements ResponseBuilder {
  private jsonObject: any = {};

  public toJSON = () => this.jsonObject;

  public withBody(value: string): ResponseBuilder {
    this.jsonObject.body = value;
    return this;
  }

  public withDelay(milliseconds: number): ResponseBuilder {
    this.jsonObject.fixedDelayMilliseconds = milliseconds;
    return this;
  }

  public withHeader(key: string, value: string): ResponseBuilder {
    if (!this.jsonObject.headers) {
      this.jsonObject.headers = {};
    }
    this.jsonObject.headers[key] = value;
    return this;
  }

  public withStatus(statusCode: number): ResponseBuilder {
    this.jsonObject.status = statusCode;
    return this;
  }

  public withStatusMessage(statusMessage: string): ResponseBuilder {
    this.jsonObject.statusMessage = statusMessage;
    return this;
  }

  public withTransformer(transformerName: string): ResponseBuilder {
    this.jsonObject.transformer = transformerName;
    return this;
  }
}
