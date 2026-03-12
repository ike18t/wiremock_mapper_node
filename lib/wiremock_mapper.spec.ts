import nock from 'nock';

import { RequestBuilder } from './builders/request_builder';
import { ResponseBuilder } from './builders/response_builder';
import { Configuration } from './configuration';
import { WireMockMapper } from './wiremock_mapper';

describe('WireMockMapper', () => {
  beforeEach(() => {
    Configuration.reset();
  });

  describe('createMapping', () => {
    it('posts the correct json to wiremock with a string response', async () => {
      const expectedRequestBody = {
        request: {
          bodyPatterns: [{ matches: 'some request body' }],
          headers: { some_header: { equalTo: 'some header value' } },
          method: 'POST',
          urlPath: '/some/path'
        },
        response: { body: 'some response body' }
      };

      nock('http://localhost:8080', {
        reqheaders: { 'Content-Type': 'application/json' }
      })
        .post('/__admin/mappings', expectedRequestBody)
        .reply(201, { id: '123' });

      const promise = WireMockMapper.createMapping(
        (request: RequestBuilder, respond: ResponseBuilder) => {
          request.isAPost.withUrlPath
            .equalTo('/some/path')
            .withHeader('some_header')
            .equalTo('some header value')
            .withBody.matching('some request body');

          respond.withBody('some response body');
        }
      );

      await expect(promise).resolves.toBe('123');
    });

    it('posts the correct json to wiremock with a json response', async () => {
      const expectedRequestBody = {
        request: {
          method: 'GET',
          urlPath: '/some/path'
        },
        response: { jsonBody: { test: 'some response body' } }
      };

      nock('http://localhost:8080', {
        reqheaders: { 'Content-Type': 'application/json' }
      })
        .post('/__admin/mappings', expectedRequestBody)
        .reply(201, { id: '123' });

      const promise = WireMockMapper.createMapping(
        (request: RequestBuilder, respond: ResponseBuilder) => {
          request.isAGet.withUrlPath.equalTo('/some/path');

          respond.withJsonBody({ test: 'some response body' });
        }
      );

      await expect(promise).resolves.toBe('123');
    });

    it('posts the correct json to wiremock with scenarios', async () => {
      const expectedRequestBody = {
        newScenarioState: 'some new scenario state',
        request: {
          bodyPatterns: [{ matches: 'some request body' }],
          headers: { some_header: { equalTo: 'some header value' } },
          method: 'POST',
          urlPath: '/some/path'
        },
        requiredScenarioState: 'some scenario state',
        response: { body: 'some response body' },
        scenarioName: 'some scenario'
      };

      nock('http://localhost:8080', {
        reqheaders: { 'Content-Type': 'application/json' }
      })
        .post('/__admin/mappings', expectedRequestBody)
        .reply(201, { id: '123' });

      const promise = WireMockMapper.createMapping(
        (request, respond, scenario) => {
          request.isAPost.withUrlPath
            .equalTo('/some/path')
            .withHeader('some_header')
            .equalTo('some header value')
            .withBody.matching('some request body');

          respond.withBody('some response body');

          scenario
            .name('some scenario')
            .requiredState('some scenario state')
            .newState('some new scenario state');
        }
      );

      await expect(promise).resolves.toBe('123');
    });

    it('resolves the promise with the mapping id', async () => {
      const expectedRequestBody = {
        request: {
          bodyPatterns: [{ matches: 'some request body' }],
          headers: { some_header: { equalTo: 'some header value' } },
          method: 'POST',
          urlPath: '/some/path'
        },
        response: { body: 'some response body' }
      };

      nock('http://localhost:8080', {
        reqheaders: { 'Content-Type': 'application/json' }
      })
        .post('/__admin/mappings', expectedRequestBody)
        .reply(201, { id: '123' });

      const promise = WireMockMapper.createMapping(
        (request: RequestBuilder, respond: ResponseBuilder) => {
          request.isAPost.withUrlPath
            .equalTo('/some/path')
            .withHeader('some_header')
            .equalTo('some header value')
            .withBody.matching('some request body');

          respond.withBody('some response body');
        }
      );

      await expect(promise).resolves.toBe('123');
    });

    it('rejects the promise with an error if the status code is not 201', async () => {
      const expectedRequestBody = {
        request: {
          bodyPatterns: [{ matches: 'some request body' }],
          headers: { some_header: { equalTo: 'some header value' } },
          method: 'POST',
          urlPath: '/some/path'
        },
        response: { body: 'some response body' }
      };

      nock('http://localhost:8080', {
        reqheaders: { 'Content-Type': 'application/json' }
      })
        .post('/__admin/mappings', expectedRequestBody)
        .reply(400);

      const promise = WireMockMapper.createMapping(
        (request: RequestBuilder, respond: ResponseBuilder) => {
          request.isAPost.withUrlPath
            .equalTo('/some/path')
            .withHeader('some_header')
            .equalTo('some header value')
            .withBody.matching('some request body');

          respond.withBody('some response body');
        }
      );

      await expect(promise).rejects.toThrow();
    });

    it('rejects the promise if there was an error with the request', async () => {
      const expectedRequestBody = {
        request: { method: 'POST', urlPath: '/some/path' },
        response: { body: 'some response body' }
      };

      nock('http://localhost:8080', {
        reqheaders: { 'Content-Type': 'application/json' }
      })
        .post('/__admin/mappings', expectedRequestBody)
        .replyWithError('something went wrong...sorry dude...');

      const promise = WireMockMapper.createMapping(
        (request: RequestBuilder, respond: ResponseBuilder) => {
          request.isAPost.withUrlPath.equalTo('/some/path');

          respond.withBody('some response body');
        }
      );

      await expect(promise).rejects.toThrow();
    });

    it('sends the global mappings', async () => {
      Configuration.createGlobalMapping((request: RequestBuilder) => {
        request.withHeader('some_header').equalTo('some header value');
      });

      const expectedRequestBody = {
        request: {
          bodyPatterns: [{ matches: 'some request body' }],
          headers: { some_header: { equalTo: 'some header value' } },
          method: 'POST',
          urlPath: '/some/path'
        },
        response: { body: 'some response body' }
      };

      nock('http://localhost:8080', {
        reqheaders: { 'Content-Type': 'application/json' }
      })
        .post('/__admin/mappings', expectedRequestBody)
        .reply(201, { id: '123' });

      const promise = WireMockMapper.createMapping(
        (request: RequestBuilder, respond: ResponseBuilder) => {
          request.isAPost.withUrlPath
            .equalTo('/some/path')
            .withBody.matching('some request body');

          respond.withBody('some response body');
        }
      );

      await expect(promise).resolves.toBe('123');
    });

    it('does not bleed request headers between mappings', async () => {
      Configuration.createGlobalMapping((request: RequestBuilder) => {
        request.withHeader('X-Global').equalTo('global-value');
      });

      const firstExpectedBody = {
        request: {
          headers: {
            'X-Global': { equalTo: 'global-value' },
            'X-First': { equalTo: 'first-value' }
          },
          method: 'GET',
          urlPath: '/first'
        },
        response: { body: 'first' }
      };

      const secondExpectedBody = {
        request: {
          headers: {
            'X-Global': { equalTo: 'global-value' },
            'X-Second': { equalTo: 'second-value' }
          },
          method: 'GET',
          urlPath: '/second'
        },
        response: { body: 'second' }
      };

      nock('http://localhost:8080')
        .post('/__admin/mappings', firstExpectedBody)
        .reply(201, { id: '1' });

      nock('http://localhost:8080')
        .post('/__admin/mappings', secondExpectedBody)
        .reply(201, { id: '2' });

      await WireMockMapper.createMapping(
        (request: RequestBuilder, respond: ResponseBuilder) => {
          request.isAGet.withUrlPath
            .equalTo('/first')
            .withHeader('X-First')
            .equalTo('first-value');
          respond.withBody('first');
        }
      );

      const promise = WireMockMapper.createMapping(
        (request: RequestBuilder, respond: ResponseBuilder) => {
          request.isAGet.withUrlPath
            .equalTo('/second')
            .withHeader('X-Second')
            .equalTo('second-value');
          respond.withBody('second');
        }
      );

      await expect(promise).resolves.toBe('2');
    });

    it('does not bleed response headers between mappings', async () => {
      Configuration.createGlobalMapping(
        (_request: RequestBuilder, respond: ResponseBuilder) => {
          respond.withHeader('X-Global', 'global-value');
        }
      );

      const firstExpectedBody = {
        request: { method: 'GET', urlPath: '/first' },
        response: {
          body: 'first',
          headers: { 'X-Global': 'global-value', 'X-First': 'first-value' }
        }
      };

      const secondExpectedBody = {
        request: { method: 'GET', urlPath: '/second' },
        response: {
          body: 'second',
          headers: { 'X-Global': 'global-value', 'X-Second': 'second-value' }
        }
      };

      nock('http://localhost:8080')
        .post('/__admin/mappings', firstExpectedBody)
        .reply(201, { id: '1' });

      nock('http://localhost:8080')
        .post('/__admin/mappings', secondExpectedBody)
        .reply(201, { id: '2' });

      await WireMockMapper.createMapping(
        (request: RequestBuilder, respond: ResponseBuilder) => {
          request.isAGet.withUrlPath.equalTo('/first');
          respond.withBody('first').withHeader('X-First', 'first-value');
        }
      );

      const promise = WireMockMapper.createMapping(
        (request: RequestBuilder, respond: ResponseBuilder) => {
          request.isAGet.withUrlPath.equalTo('/second');
          respond.withBody('second').withHeader('X-Second', 'second-value');
        }
      );

      await expect(promise).resolves.toBe('2');
    });

    it('subsequent requests do not have state from first', async () => {
      const expectedRequestBody = {
        request: {
          bodyPatterns: [{ matches: 'some request body' }],
          headers: { some_header: { equalTo: 'some header value' } },
          method: 'POST',
          urlPath: '/some/path'
        },
        response: { body: 'some response body' }
      };

      const secondExpectedRequestBody = {
        request: {
          bodyPatterns: [{ matches: 'some other request body' }],
          headers: { some_header: { equalTo: 'some header value' } },
          method: 'POST',
          urlPath: '/some/path'
        },
        response: { body: 'some other response body' }
      };

      nock('http://localhost:8080', {
        reqheaders: { 'Content-Type': 'application/json' }
      })
        .post('/__admin/mappings', expectedRequestBody)
        .reply(201, { id: '123' });

      nock('http://localhost:8080', {
        reqheaders: { 'Content-Type': 'application/json' }
      })
        .post('/__admin/mappings', secondExpectedRequestBody)
        .reply(201, { id: '456' });

      Configuration.createGlobalMapping((request: RequestBuilder) => {
        request.withHeader('some_header').equalTo('some header value');
      });

      const promise1 = WireMockMapper.createMapping(
        (request: RequestBuilder, respond: ResponseBuilder) => {
          request.isAPost.withUrlPath
            .equalTo('/some/path')
            .withBody.matching('some request body');

          respond.withBody('some response body');
        }
      );

      const promise2 = WireMockMapper.createMapping(
        (request: RequestBuilder, respond: ResponseBuilder) => {
          request.isAPost.withUrlPath
            .equalTo('/some/path')
            .withBody.matching('some other request body');

          respond.withBody('some other response body');
        }
      );

      await expect(Promise.all([promise1, promise2])).resolves.toEqual([
        '123',
        '456'
      ]);
    });
  });

  describe('deleteMapping', () => {
    it('sends a DELETE request with the provided mapping id to wiremock', async () => {
      nock('http://localhost:8080').delete('/__admin/mappings/123').reply(200);

      const promise = WireMockMapper.deleteMapping('123');

      await expect(promise).resolves.toBeUndefined();
    });

    it('rejects the promise if the response is not a 200', async () => {
      nock('http://localhost:8080').delete('/__admin/mappings/123').reply(404);

      const promise = WireMockMapper.deleteMapping('123');

      await expect(promise).rejects.toThrow();
    });

    it('rejects the promise if there was an error with the request', async () => {
      nock('http://localhost:8080')
        .delete('/__admin/mappings/123')
        .replyWithError('something went wrong...sorry dude...');

      const promise = WireMockMapper.deleteMapping('123');

      await expect(promise).rejects.toThrow();
    });
  });

  describe('clearAllMappings', () => {
    it('sends the correct request to WireMock', async () => {
      nock('http://localhost:8080').post('/__admin/mappings/reset').reply(200);

      const promise = WireMockMapper.clearAllMappings();

      await expect(promise).resolves.toBeUndefined();
    });

    it('rejects the promise if the request returns a status code that is not 200', async () => {
      nock('http://localhost:8080').post('/__admin/mappings/reset').reply(400);

      const promise = WireMockMapper.clearAllMappings();

      await expect(promise).rejects.toThrow();
    });

    it('rejects the promise if there was an error with the request', async () => {
      nock('http://localhost:8080')
        .post('/__admin/mappings/reset')
        .replyWithError('something went wrong...sorry dude...');

      const promise = WireMockMapper.clearAllMappings();

      await expect(promise).rejects.toThrow();
    });
  });

  describe('getRequests', () => {
    describe('no provided options', () => {
      it('calls the request endpoint wo args and returns response', async () => {
        const response = {
          requests: [],
          meta: { total: 0 },
          requestJournalDisabled: false
        };

        nock('http://localhost:8080', {
          reqheaders: { 'Content-Type': 'application/json' }
        })
          .get('/__admin/requests')
          .reply(200, response);

        const promise = WireMockMapper.getRequests();

        await expect(promise).resolves.toEqual(response);
      });
    });

    describe('by stub id', () => {
      it('calls the request endpoint w matchingStub query param and returns response', async () => {
        const stubId = 'abc';
        const response = {
          requests: [],
          meta: { total: 0 },
          requestJournalDisabled: false
        };

        nock('http://localhost:8080', {
          reqheaders: { 'Content-Type': 'application/json' }
        })
          .get(`/__admin/requests?matchingStub=${stubId}`)
          .reply(200, response);

        const promise = WireMockMapper.getRequests({ stubId });

        await expect(promise).resolves.toEqual(response);
      });
    });

    it('rejects the promise if the request returns a status code that is not 200', async () => {
      nock('http://localhost:8080').get('/__admin/requests').reply(400);

      const promise = WireMockMapper.getRequests();

      await expect(promise).rejects.toThrow();
    });
  });

  describe('deleteRequests', () => {
    it('sends a DELETE request to wiremock', async () => {
      nock('http://localhost:8080', {}).delete('/__admin/requests').reply(200);

      const promise = WireMockMapper.deleteRequests();

      await expect(promise).resolves.toBeUndefined();
    });

    it('sends a DELETE request with stub id to wiremock', async () => {
      const stubId = 'abc';

      nock('http://localhost:8080', {})
        .delete(`/__admin/requests/${stubId}`)
        .reply(200);

      const promise = WireMockMapper.deleteRequests({ stubId });

      await expect(promise).resolves.toBeUndefined();
    });

    it('rejects the promise if there was an error with the request', async () => {
      nock('http://localhost:8080')
        .delete('/__admin/requests')
        .replyWithError('something went wrong...sorry dude...');

      const promise = WireMockMapper.deleteRequests();

      await expect(promise).rejects.toThrow();
    });
  });
});
