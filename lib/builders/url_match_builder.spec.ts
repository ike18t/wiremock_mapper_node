import { RequestBuilderImpl } from './request_builder';
import { UrlMatchBuilder } from './url_match_builder';

describe('UrlMatchBuilder', () => {
  describe('constructed with path = true', () => {
    describe('equalTo', ()  => {
      it('json stringifies to { urlPath: value }', ()  => {
        const builder = new UrlMatchBuilder(new RequestBuilderImpl(), true);
        builder.equalTo('/some/path');

        const expectedJSON = JSON.stringify({ urlPath: '/some/path' });
        expect(JSON.stringify(builder)).toEqual(expectedJSON);
      });

      it('returns the constructor arg request builder for chaining', () => {
        const requestBuilder = new RequestBuilderImpl();
        const builder = new UrlMatchBuilder(requestBuilder, true);
        expect(builder.equalTo('/some/path')).toEqual(requestBuilder);
      });
    });

    describe('matching', ()  => {
      it('json stringifies to { urlPattern: value }', ()  => {
        const builder = new UrlMatchBuilder(new RequestBuilderImpl(), true);
        builder.matching('/some/path');

        const expectedJSON = JSON.stringify({ urlPathPattern: '/some/path' });
        expect(JSON.stringify(builder)).toEqual(expectedJSON);
      });

      it('returns the constructor arg request builder for chaining', () => {
        const requestBuilder = new RequestBuilderImpl();
        const builder = new UrlMatchBuilder(requestBuilder, true);
        expect(builder.matching('/some/path')).toEqual(requestBuilder);
      });
    });
  });

  describe('constructed with path = false', () => {
    describe('equalTo', ()  => {
      it('json stringifies to { url: value }', ()  => {
        const builder = new UrlMatchBuilder(new RequestBuilderImpl(), false);
        builder.equalTo('/some/path');

        const expectedJSON = JSON.stringify({ url: '/some/path' });
        expect(JSON.stringify(builder)).toEqual(expectedJSON);
      });
    });

    describe('matching', ()  => {
      it('json stringifies to { urlPattern: value }', ()  => {
        const builder = new UrlMatchBuilder(new RequestBuilderImpl(), false);
        builder.matching('/some/path');

        const expectedJSON = JSON.stringify({ urlPattern: '/some/path' });
        expect(JSON.stringify(builder)).toEqual(expectedJSON);
      });
    });
  });
});
