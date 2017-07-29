import { Configuration } from '../lib/configuration';

describe('Configuration', () => {
  describe('createGlobalMapping', () => {
    it('should set the request builder on configuration', () => {
      Configuration.createGlobalMapping((requestBuilder, responseBuilder) => {
        requestBuilder.withHeader('foo').equalTo('bar');
      });
      const expectedJSON = JSON.stringify({ headers: { foo: { equalTo: 'bar' } } });
      expect(JSON.stringify(Configuration.requestBuilder)).toEqual(expectedJSON);
    });

    it('should set the response builder on configuration', () => {
      Configuration.createGlobalMapping((requestBuilder, responseBuilder) => {
        responseBuilder.withDelay(500);
      });
      const expectedJSON = JSON.stringify({ fixedDelayMilliseconds: 500 });
      expect(JSON.stringify(Configuration.responseBuilder)).toEqual(expectedJSON);
    });
  });
});
