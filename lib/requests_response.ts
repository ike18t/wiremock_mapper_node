export interface RequestsResponse {
  requests: Request[];
  meta: {
    total: number;
  };
  requestJournalDisabled: boolean;
}

interface Request {
  id: string;
  request: RequestData;
  responseDefinition: {
    status: number;
    statusMessage: string;
    jsonBody?: { [key: string]: unknown };
  };
  response: {
    status: number;
    headers: { [key: string]: string };
    bodyAsBase64: string;
    body: string;
  };
  wasMatched: boolean;
  timing: Timing;
  subEvents: unknown[];
  stubMapping: {
    id: string;
    request: {
      urlPath: string;
      method: string;
    };
    response: {
      status: number;
      statusMessage: string;
      jsonBody?: { [key: string]: unknown };
    };
    uuid: string;
  };
}

interface RequestData {
  url: string;
  absoluteURL: string;
  method: string;
  clientIP: string;
  headers: { [key: string]: string };
  cookies: { [key: string]: string };
  browserProxyRequest: boolean;
  loggedDate: number;
  bodyAsBase64: string;
  body: string;
  protocol: string;
  scheme: string;
  host: string;
  port: number;
  loggedDateString: string;
  queryParams: { [key: string]: string };
  formParams: { [key: string]: string };
}

interface Timing {
  addedDelay: number;
  processTime: number;
  responseSendTime: number;
  serveTime: number;
  totalTime: number;
}
