![NPM Version](https://img.shields.io/npm/v/wiremock-mapper?color=brightgreen)
[![Node.js CI](https://github.com/ike18t/wiremock_mapper_node/actions/workflows/test.yml/badge.svg)](https://github.com/ike18t/wiremock_mapper_node/actions/workflows/test.yml)
[![Code Climate](https://codeclimate.com/github/ike18t/wiremock_mapper_node/badges/gpa.svg)](https://codeclimate.com/github/ike18t/wiremock_mapper_node)
[![Test Coverage](https://codeclimate.com/github/ike18t/wiremock_mapper_node/badges/coverage.svg)](https://codeclimate.com/github/ike18t/wiremock_mapper_node/coverage)

# wiremock-mapper

DSL for setting up WireMock mappings

A TypeScript/JavaScript library that provides a fluent API for creating [WireMock](http://wiremock.org/) mappings. WireMock is a simulator for HTTP-based APIs that allows you to stub and mock web services during development and testing.

## Prerequisites

- A running WireMock server (default: `http://localhost:8080`)
- Node.js 12+
- TypeScript (recommended)

## Installation

```bash
npm install wiremock-mapper
```

## Configuring

```typescript
import { Configuration } from 'wiremock-mapper';

Configuration.wireMockBaseUrl = 'http://localhost:8080/some_path_prefix'; // default is 'http://localhost:8080'
```

### Creating a global mapping

Global mappings are a way to predefine part of your request/response configuration that will be applied to all mappings created afterwards.

```typescript
import { Configuration } from 'wiremock-mapper';

// Set up global configuration that applies to all future mappings
Configuration.createGlobalMapping((request, response) => {
  // Add common headers to all requests
  request.withHeader('Authorization').equalTo('Bearer token123');

  // Add common response headers
  response.withHeader('Content-Type').equalTo('application/json');
  response.withHeader('X-API-Version').equalTo('v1');
});

// Now all subsequent mappings will include these configurations
```

### Reset global mapping

```typescript
import { Configuration } from 'wiremock-mapper';

// Clear all global mappings
Configuration.reset();
```

## Create a mapping

Import the library

```typescript
import { WireMockMapper } from 'wiremock-mapper';
```

Mappings are created with `WireMockMapper.createMapping()` which takes a function argument defining the mock behavior. It asynchronously sends the configuration to the WireMock server.

```typescript
await WireMockMapper.createMapping((req, res) => {});
```

### Define matching parameters

All request modifiers are set from `req` provided by `createMapping`, and return an instance of `RequestBuilder`, `MatchBuilder`, or `UrlMatchBuilder`. These can be chained together to form a complete request expectation.

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
| `matching`         | `value: string`                                                      | `RequestBuilder` |
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

The interface for the returned object can be found [here](https://github.com/ike18t/wiremock_mapper_node/blob/master/lib/requests_response.ts#L1-L7).

## Jest Matchers

The library provides custom Jest matchers for testing WireMock interactions with built-in retry logic for handling asynchronous operations.

### Setup

```typescript
import { wiremockMapperMatchers } from 'wiremock-mapper';

// Extend Jest with WireMock matchers
expect.extend(wiremockMapperMatchers);
```

### Available Matchers

#### `toHaveBeenRequested(options?)`

Verifies that a stub received at least one request.

```typescript
const stubId = await WireMockMapper.createMapping((req, res) => {
  req.isAGet.withUrlPath.equalTo('/api/users');
  res.withJsonBody([]).withStatus(200);
});

// Make API call
await fetch('http://localhost:8080/api/users');

// Verify the stub was called
await expect(stubId).toHaveBeenRequested();

// With custom retry options
await expect(stubId).toHaveBeenRequested({ retries: 5, delay: 100 });
```

#### `toHaveBeenRequestedWith(expected, options?)`

Verifies that a stub received a request with the specified payload.

```typescript
const stubId = await WireMockMapper.createMapping((req, res) => {
  req.isAPost.withUrlPath.equalTo('/api/users');
  res.withJsonBody({ id: 123 }).withStatus(201);
});

const userData = { name: 'John Doe', email: 'john@example.com' };

// Make API call with payload
await fetch('http://localhost:8080/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
});

// Verify the stub was called with expected payload
await expect(stubId).toHaveBeenRequestedWith(userData);
```

#### `toHaveBeenRequestedTimes(expectedCount, options?)`

Verifies that a stub received exactly the specified number of requests.

```typescript
const stubId = await WireMockMapper.createMapping((req, res) => {
  req.isAGet.withUrlPath.equalTo('/api/health');
  res.withBody('OK').withStatus(200);
});

// Make multiple API calls
await fetch('http://localhost:8080/api/health');
await fetch('http://localhost:8080/api/health');
await fetch('http://localhost:8080/api/health');

// Verify the stub was called exactly 3 times
await expect(stubId).toHaveBeenRequestedTimes(3);
```

### Global Matcher Configuration

You can configure global defaults for all matchers:

```typescript
import { Configuration } from 'wiremock-mapper';

// Set global retry options
Configuration.setMatcherOptions({
  retries: 10, // Number of retry attempts (default: 15)
  delay: 100 // Delay between retries in milliseconds (default: 200)
});
```

Individual matchers can override global settings:

```typescript
// Override global settings for this specific assertion
await expect(stubId).toHaveBeenRequested({ retries: 3, delay: 50 });
```

### Matcher Options

| Option    | Type     | Default | Description                                        |
| --------- | -------- | ------- | -------------------------------------------------- |
| `retries` | `number` | `15`    | Number of retry attempts when waiting for requests |
| `delay`   | `number` | `200`   | Delay in milliseconds between retry attempts       |

### Example Test

```typescript
import {
  WireMockMapper,
  Configuration,
  wiremockMapperMatchers
} from 'wiremock-mapper';

expect.extend(wiremockMapperMatchers);

describe('API Tests', () => {
  beforeAll(() => {
    Configuration.wireMockBaseUrl = 'http://localhost:8080';
  });

  beforeEach(async () => {
    await WireMockMapper.clearAllMappings();
  });

  it('should handle user creation', async () => {
    const stubId = await WireMockMapper.createMapping((req, res) => {
      req.isAPost.withUrlPath.equalTo('/api/users');
      res.withJsonBody({ id: 123, name: 'John Doe' }).withStatus(201);
    });

    const userData = { name: 'John Doe', email: 'john@example.com' };

    await fetch('http://localhost:8080/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    await expect(stubId).toHaveBeenRequestedWith(userData);
  });
});
```

## Troubleshooting

### Common Issues

**WireMock server not running**

- Ensure WireMock is running on the expected port (default: 8080)
- Check if the `Configuration.wireMockBaseUrl` is correctly set

**Connection refused errors**

- Verify the WireMock server URL and port
- Check if there are any firewall restrictions
- Ensure the WireMock server is accessible from your application

**Mapping not working as expected**

- Check the WireMock server logs for any errors
- Verify your request matching patterns are correct
- Use `WireMockMapper.getRequests()` to see what requests were actually received

**TypeScript compilation errors**

- Ensure you have the latest version of TypeScript installed
- Check that your `tsconfig.json` includes the necessary type definitions

### Getting Help

- Check the [GitHub Issues](https://github.com/ike18t/wiremock_mapper_node/issues) for existing problems
- Review the [WireMock documentation](http://wiremock.org/docs/) for underlying concepts
- Create a new issue with a minimal reproduction case if needed
