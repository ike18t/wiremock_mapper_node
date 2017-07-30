export interface ResponseBuilder {
  withBody(value: string): ResponseBuilder;
  withDelay(milliseconds: number): ResponseBuilder;
  withHeader(key: string, value: string): ResponseBuilder;
  withStatus(statusCode: number): ResponseBuilder;
  withStatusMessage(statusMessage: string): ResponseBuilder;
  withTransformer(transformerName: string): ResponseBuilder;
}

export class ResponseBuilderImpl implements ResponseBuilder {
  private _jsonObject: any = {};

  public toJSON = () => this._jsonObject;

  public withBody(value: string): ResponseBuilder {
    this._jsonObject['body'] = value;
    return this;
  }

  public withDelay(milliseconds: number): ResponseBuilder {
    this._jsonObject['fixedDelayMilliseconds'] = milliseconds;
    return this;
  }

  public withHeader(key: string, value: string): ResponseBuilder {
    if(!this._jsonObject['headers']) {
      this._jsonObject['headers'] = {};
    }
    this._jsonObject['headers'][key] = value;
    return this;
  }

  public withStatus(statusCode: number): ResponseBuilder {
    this._jsonObject['status'] = statusCode;
    return this;
  }

  public withStatusMessage(statusMessage: string): ResponseBuilder {
    this._jsonObject['statusMessage'] = statusMessage;
    return this;
  }

  public withTransformer(transformerName: string): ResponseBuilder {
    this._jsonObject['transformer'] = transformerName;
    return this;
  }
}
