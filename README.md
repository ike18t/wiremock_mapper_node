[![Node.js CI](https://github.com/ike18t/wiremock_mapper_node/actions/workflows/test.yml/badge.svg)](https://github.com/ike18t/wiremock_mapper_node/actions/workflows/test.yml)
[![Code Climate](https://codeclimate.com/github/ike18t/wiremock_mapper_node/badges/gpa.svg)](https://codeclimate.com/github/ike18t/wiremock_mapper_node)
[![Test Coverage](https://codeclimate.com/github/ike18t/wiremock_mapper_node/badges/coverage.svg)](https://codeclimate.com/github/ike18t/wiremock_mapper_node/coverage)
[![npm version](https://badge.fury.io/js/wiremock-mapper.svg)](https://badge.fury.io/js/wiremock-mapper)

# wiremock-mapper

DSL for setting up WireMock mappings

# Installation

```bash
npm install wiremock-mapper
```

## Create a mapping

Import the library

```typescript
import { WireMockMapper } from 'wiremock-mapper';
```

Mappings are created with `WireMockMapper.createMapping()` which takes a function argument defining the mock behavior. It asyncronously sends the configuration to the WireMock server.

```typescript
await WireMockMapper.createMapping((req, res) => {});
```

### Define matching parameters

All request modifiers are set from `res` provided by `createMapping`, and return an instance of `RequestBuilder`, `MatchBuilder`, or `UrlMatchBuilder`. These can be chained together to form a complete request expectation.

It should read like a sentence when set up properly.

```typescript
await WireMockMapper.createMapping((req, res) => {
  req.isAGet.withUrlPath.matching('/my/.*/path');
});
```

#### Interfaces

`RequestBuilder`

| Method           | Argument(s)                          | Effect                                  | Returns           |
| ---------------- | ------------------------------------ | --------------------------------------- | ----------------- |
| `isAGet`         | none                                 | sets request method to `GET`            | `RequestBuilder`  |
| `isAPost`        | none                                 | sets request method to `POST`           | `RequestBuilder`  |
| `isAPut`         | none                                 | sets request method to `PUT`            | `RequestBuilder`  |
| `isADelete`      | none                                 | sets request method to `DELETE`         | `RequestBuilder`  |
| `isAHead`        | none                                 | sets request method to `HEAD`           | `RequestBuilder`  |
| `isAnOptions`    | none                                 | sets request method to `OPTIONS`        | `RequestBuilder`  |
| `isATrace`       | none                                 | sets request method to `TRACE`          | `RequestBuilder`  |
| `isAnyVerb`      | none                                 | sets request method to `ANY`            | `RequestBuilder`  |
| `withBody`       | none                                 | sets request body                       | `RequestBuilder`  |
| `withBasicAuth`  | `username: string, password: string` | sets basic auth                         | `RequestBuilder`  |
| `withUrl`        | none                                 | sets expected URL                       | `UrlMatchBuilder` |
| `withUrlPath`    | none                                 | sets URL path match to `urlPathPattern` | `UrlMatchBuilder` |
| `withCookie`     | `key: string`                        | sets request cookie                     | `MatchBuilder`    |
| `withHeader`     | `key: string`                        | sets request header                     | `MatchBuilder`    |
| `withQueryParam` | `key: string`                        | sets request query parameter            | `MatchBuilder`    |

`UrlMatchBuilder`

| Method     | Arguments        | Effect                          | Returns          |
| ---------- | ---------------- | ------------------------------- | ---------------- |
| `equalTo`  | `url: string`    | Matches text given              | `RequestBuilder` |
| `matching` | `regexp: string` | Matches with regular expression | `RequestBuilder` |

`MatchBuilder`

| Method             | Argument(s)                                                          | Returns          |
| ------------------ | -------------------------------------------------------------------- | ---------------- |
| `absent`           | none                                                                 | `RequestBuilder` |
| `containing`       | `value: string`                                                      | `RequestBuilder` |
| `equalTo`          | `value: string`                                                      | `RequestBuilder` |
| `equalToJson`      | `json: any, ignoreArrayOrder: boolean, ignoreExtraElements: boolean` | `RequestBuilder` |
| `equalToXml`       | `xml: string`                                                        | `RequestBuilder` |
| `macthing`         | `value: string`                                                      | `RequestBuilder` |
| `matchingJsonPath` | `path: string`                                                       | `RequestBuilder` |
| `matchingXPath`    | `xpath: string`                                                      | `RequestBuilder` |
| `notMatching`      | `value: string`                                                      | `RequestBuilder` |

### Define response behavior

Responses are created from `res` provided by `WireMockMapper.createMapping()`

```typescript
await WireMockMapper.createMapping((req, res) => {
  res
    .withJsonBody({
      someKey: 'theValue',
      otherKey: 'otherValue'
    })
    .withStatus(200)
    .withStatusMessage('ok');
});
```

#### Interface

`ResponseBuilder`

| Method              | Argument(s)               | Returns           |
| ------------------- | ------------------------- | ----------------- |
| `withBody`          | `value: string`           | `ResponseBuilder` |
| `withDelay`         | `milliseconds: number`    | `ResponseBuilder` |
| `withHeader`        | `key: string`             | `ResponseBuilder` |
| `withJsonBody`      | `value: object`           | `ResponseBuilder` |
| `withStatus`        | `statusCode: object`      | `ResponseBuilder` |
| `withStatusMessage` | `statusMessage: string`   | `ResponseBuilder` |
| `withTransformer`   | `transformerName: string` | `ResponseBuilder` |

### Example

```typescript
await WireMockMapper.createMapping((req, res) => {
  req.isAGet.withUrlPath.equalTo('/my/api/path');
  res
    .withJsonBody({
      someKey: 'theValue',
      otherKey: 'otherValue'
    })
    .withStatus(200)
    .withStatusMessage('ok');
});
```

## Get Requests Received

Get all requests

```typescript
await WireMockMapper.getRequests();
```

Get all requests for a given stub id

```typescript
await WireMockMapper.getRequests({ stubId: 'some_stub_id' });
```

The interface for the returned object can be found [here](https://github.com/ike18t/wiremock_mapper_node/blob/master/lib/request_response.ts#L1-L7).
