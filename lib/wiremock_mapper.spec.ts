import nock from 'nock';

import { RequestBuilder } from './builders/request_builder';
import { ResponseBuilder } from './builders/response_builder';
import { Configuration } from './configuration';
import { WireMockMapper } from './wiremock_mapper';

describe('WireMockMapper', () => {
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
