import * as nock from 'nock';
import { RequestBuilder } from './builders/request_builder';
import { ResponseBuilder } from './builders/response_builder';
import { ScenarioBuilder } from './builders/scenario_builder';
import { Configuration } from './configuration';
import { WireMockMapper } from './wiremock_mapper';

/* tslint:disable:no-unnecessary-callback-wrapper */

describe('WireMockMapper', () => {
  describe('createMapping', () => {
    it('posts the correct json to wiremock with a string response', (done) => {
      const expectedRequestBody = {
        request: {
          bodyPatterns: [{matches: 'some request body'}],
          headers: {some_header: {equalTo: 'some header value'}},
          method: 'POST',
          urlPath: '/some/path'
        },
        response: {body: 'some response body'}
      };

      nock('http://localhost:8080', {reqheaders: {'Content-Type': 'application/json'}})
          .post('/__admin/mappings', expectedRequestBody)
          .reply(201, {id: 123});

      const promise = WireMockMapper.createMapping((request: RequestBuilder, respond: ResponseBuilder) => {
        request.isAPost
               .withUrlPath.equalTo('/some/path')
               .withHeader('some_header').equalTo('some header value')
               .withBody.matching('some request body');

        respond.withBody('some response body');
      });

      promise.then(done).catch(() => { done.fail(); });
    });

    it('posts the correct json to wiremock with a json response', (done) => {
      const expectedRequestBody = {
        request: {
          method: 'GET',
          urlPath: '/some/path'
        },
        response: {jsonBody: {test: 'some response body'}}
      };

      nock('http://localhost:8080', {reqheaders: {'Content-Type': 'application/json'}})
          .post('/__admin/mappings', expectedRequestBody)
          .reply(201, {id: 123});

      const promise = WireMockMapper.createMapping((request: RequestBuilder, respond: ResponseBuilder) => {
        request.isAGet
               .withUrlPath.equalTo('/some/path');

        respond.withJsonBody({test: 'some response body'});
      });

      promise.then(done)
             .catch(() => { done.fail(); });
    });

    it('posts the correct json to wiremock with scenarios', (done) => {
      const expectedRequestBody = {
        newScenarioState: 'some new scenario state',
        request: {
          bodyPatterns: [{matches: 'some request body'}],
          headers: {some_header: {equalTo: 'some header value'}},
          method: 'POST',
          urlPath: '/some/path'
        },
        requiredScenarioState: 'some scenario state',
        response: {body: 'some response body'},
        scenarioName: 'some scenario'
      };

      nock('http://localhost:8080', {reqheaders: {'Content-Type': 'application/json'}})
          .post('/__admin/mappings', expectedRequestBody)
          .reply(201, {id: 123});

      const promise = WireMockMapper.createMapping((request: RequestBuilder,
                                                    respond: ResponseBuilder,
                                                    scenario: ScenarioBuilder) => {
        request.isAPost
               .withUrlPath.equalTo('/some/path')
               .withHeader('some_header').equalTo('some header value')
               .withBody.matching('some request body');

        respond.withBody('some response body');

        scenario.name('some scenario')
                .requiredState('some scenario state')
                .newState('some new scenario state');
      });

      promise.then(done)
             .catch(() => { done.fail(); });
    });

    it('resolves the promise with the mapping id', (done) => {
      const expectedRequestBody = {
        request: {
          bodyPatterns: [{matches: 'some request body'}],
          headers: {some_header: {equalTo: 'some header value'}},
          method: 'POST',
          urlPath: '/some/path'
        },
        response: {body: 'some response body'}
      };

      nock('http://localhost:8080', {reqheaders: {'Content-Type': 'application/json'}})
          .post('/__admin/mappings', expectedRequestBody)
          .reply(201, {id: '123'});

      const promise = WireMockMapper.createMapping((request: RequestBuilder, respond: ResponseBuilder) => {
        request.isAPost
               .withUrlPath.equalTo('/some/path')
               .withHeader('some_header').equalTo('some header value')
               .withBody.matching('some request body');

        respond.withBody('some response body');
      });

      promise.then((id) => {
        expect(id).toEqual('123');
        done();
      })
             .catch(() => { done.fail(); });
    });

    it('rejects the promise with an error if the status code is not 201', (done) => {
      const expectedRequestBody = {
        request: {
          bodyPatterns: [{matches: 'some request body'}],
          headers: {some_header: {equalTo: 'some header value'}},
          method: 'POST',
          urlPath: '/some/path'
        },
        response: {body: 'some response body'}
      };

      nock('http://localhost:8080', {reqheaders: {'Content-Type': 'application/json'}})
          .post('/__admin/mappings', expectedRequestBody)
          .reply(400);

      const promise = WireMockMapper.createMapping((request: RequestBuilder, respond: ResponseBuilder) => {
        request.isAPost
               .withUrlPath.equalTo('/some/path')
               .withHeader('some_header').equalTo('some header value')
               .withBody.matching('some request body');

        respond.withBody('some response body');
      });

      promise.then(() => { done.fail(); })
             .catch(() => done());
    });

    it('rejects the promise if there was an error with the request', (done) => {
      const expectedRequestBody = {
        request: {method: 'POST', urlPath: '/some/path'},
        response: {body: 'some response body'}
      };

      nock('http://localhost:8080', {reqheaders: {'Content-Type': 'application/json'}})
          .post('/__admin/mappings', expectedRequestBody)
          .replyWithError('something went wrong...sorry dude...');

      const promise = WireMockMapper.createMapping((request: RequestBuilder, respond: ResponseBuilder) => {
        request.isAPost
               .withUrlPath.equalTo('/some/path');

        respond.withBody('some response body');
      });

      promise.then(() => { done.fail(); })
             .catch(() => done());
    });

    it('sends the global mappings', (done) => {
      Configuration.createGlobalMapping((request: RequestBuilder, respond: ResponseBuilder) => {
        request.withHeader('some_header').equalTo('some header value');
      });
      const expectedRequestBody = {
        request: {
          bodyPatterns: [{matches: 'some request body'}],
          headers: {some_header: {equalTo: 'some header value'}},
          method: 'POST',
          urlPath: '/some/path'
        },
        response: {body: 'some response body'}
      };

      nock('http://localhost:8080', {reqheaders: {'Content-Type': 'application/json'}})
          .post('/__admin/mappings', expectedRequestBody)
          .reply(201, {id: 123});

      const promise = WireMockMapper.createMapping((request: RequestBuilder, respond: ResponseBuilder) => {
        request.isAPost
               .withUrlPath.equalTo('/some/path')
               .withBody.matching('some request body');

        respond.withBody('some response body');
      });

      promise.then(done)
             .catch(() => { done.fail(); });
    });

    it('subsequent requests do not have state from first', (done) => {
      const expectedRequestBody = {
        request: {
          bodyPatterns: [{matches: 'some request body'}],
          headers: {some_header: {equalTo: 'some header value'}},
          method: 'POST',
          urlPath: '/some/path',
        },
        response: {body: 'some response body'},
      };

      const secondExpectedRequestBody = {
        request: {
          bodyPatterns: [{matches: 'some other request body'}],
          headers: {some_header: {equalTo: 'some header value'}},
          method: 'POST',
          urlPath: '/some/path'
        },
        response: {body: 'some other response body'},
      };

      nock('http://localhost:8080', {reqheaders: {'Content-Type': 'application/json'}})
          .post('/__admin/mappings', expectedRequestBody)
          .reply(201, {id: 123});

      nock('http://localhost:8080', {reqheaders: {'Content-Type': 'application/json'}})
          .post('/__admin/mappings', secondExpectedRequestBody)
          .reply(201, {id: 123});

      Configuration.createGlobalMapping((request: RequestBuilder, respond: ResponseBuilder) => {
        request.withHeader('some_header').equalTo('some header value');
      });

      const promise1 = WireMockMapper.createMapping((request: RequestBuilder, respond: ResponseBuilder) => {
        request.isAPost
               .withUrlPath.equalTo('/some/path')
               .withBody.matching('some request body');

        respond.withBody('some response body');
      });

      const promise2 = WireMockMapper.createMapping((request: RequestBuilder, respond: ResponseBuilder) => {
        request.isAPost
               .withUrlPath.equalTo('/some/path')
               .withBody.matching('some other request body');

        respond.withBody('some other response body');
      });

      Promise.all([promise1, promise2]).then(done)
             .catch(() => { done.fail(); });
    });
  });

  describe('deleteMapping', () => {
    it('sends a DELETE request with the provided mapping id to wiremock', (done) => {
      nock('http://localhost:8080')
          .delete('/__admin/mappings/123')
          .reply(200);
      const promise = WireMockMapper.deleteMapping('123');
      promise.then(done)
             .catch(() => { done.fail(); });
    });

    it('rejects the promise if the response is not a 200', (done) => {
      nock('http://localhost:8080')
          .delete('/__admin/mappings/123')
          .reply(404);
      const promise = WireMockMapper.deleteMapping('123');
      promise.then(() => { done.fail(); })
             .catch(() => done());
    });

    it('rejects the promise if there was an error with the request', (done) => {
      nock('http://localhost:8080')
          .delete('/__admin/mappings/123')
          .replyWithError('something went wrong...sorry dude...');
      const promise = WireMockMapper.deleteMapping('123');
      promise.then(() => { done.fail(); })
             .catch(() => done());
    });
  });

  describe('clearAllMappings', () => {
    it('sends the correct request to WireMock', (done) => {
      nock('http://localhost:8080')
          .post('/__admin/mappings/reset')
          .reply(200);
      const promise = WireMockMapper.clearAllMappings();
      promise.then(done)
             .catch(() => { done.fail(); });
    });

    it('rejects the promise if the request returns the a status code that is not 200', (done) => {
      nock('http://localhost:8080')
          .post('/__admin/mappings/reset')
          .reply(400);
      const promise = WireMockMapper.clearAllMappings();
      promise.then(() => { done.fail(); })
             .catch(() => done());
    });

    it('rejects the promise if there was an error with the request', (done) => {
      nock('http://localhost:8080')
          .post('/__admin/mappings/reset')
          .replyWithError('something went wrong...sorry dude...');
      const promise = WireMockMapper.clearAllMappings();
      promise.then(() => { done.fail(); })
             .catch(() => done());
    });
  });
});
