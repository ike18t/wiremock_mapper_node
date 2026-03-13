import { MatchBuilder } from './match_builder';
import { RequestBuilderImpl } from './request_builder';

describe('MatchBuilder', () => {
  describe('absent', () => {
    it('json stringifies to { absent: true }', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.absent; // tslint:disable-line:no-unused-expression

      const expectedJSON = JSON.stringify({ absent: true });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('returns the constructor arg request builder for chaining', () => {
      const requestBuilder = new RequestBuilderImpl();
      const builder = new MatchBuilder(requestBuilder);
      expect(builder.absent).toEqual(requestBuilder);
    });
  });

  describe('containing', () => {
    it('json stringifies to { contains: value }', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.containing('foo');

      const expectedJSON = JSON.stringify({ contains: 'foo' });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('returns the constructor arg request builder for chaining', () => {
      const requestBuilder = new RequestBuilderImpl();
      const builder = new MatchBuilder(requestBuilder);
      expect(builder.containing('')).toEqual(requestBuilder);
    });
  });

  describe('equalTo', () => {
    it('json stringifies to { equalTo: value }', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.equalTo('foo');

      const expectedJSON = JSON.stringify({ equalTo: 'foo' });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('returns the constructor arg request builder for chaining', () => {
      const requestBuilder = new RequestBuilderImpl();
      const builder = new MatchBuilder(requestBuilder);
      expect(builder.equalTo('')).toEqual(requestBuilder);
    });
  });

  describe('equalToJson', () => {
    it('json stringifies to { equalToJson: value }', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.equalToJson('foo');

      const expectedJSON = JSON.stringify({ equalToJson: 'foo' });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('json stringifies to { equalToJson: value, ignoreArrayOrder: true }', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.equalToJson('foo', true);

      const expectedJSON = JSON.stringify({
        equalToJson: 'foo',
        ignoreArrayOrder: true
      });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('json stringifies to { equalToJson: value, ignoreExtraElements: true }', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.equalToJson('foo', false, true);

      const expectedJSON = JSON.stringify({
        equalToJson: 'foo',
        ignoreExtraElements: true
      });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('json stringifies to { equalToJson: value, ignoreArrayOrder: true, ignoreExtraElements: true }', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.equalToJson('foo', true, true);

      const expectedJSON = JSON.stringify({
        equalToJson: 'foo',
        ignoreArrayOrder: true,
        ignoreExtraElements: true
      });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('returns the constructor arg request builder for chaining', () => {
      const requestBuilder = new RequestBuilderImpl();
      const builder = new MatchBuilder(requestBuilder);
      expect(builder.equalToJson('foo')).toEqual(requestBuilder);
    });

    it('json stringifies the json argument if it is an object', () => {
      const requestBuilder = new RequestBuilderImpl();
      const builder = new MatchBuilder(requestBuilder);
      builder.equalToJson({ foo: 'bar' });

      const expectedJSON = JSON.stringify({
        equalToJson: JSON.stringify({ foo: 'bar' })
      });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('does not json stringy the json argument if it is already a stringified', () => {
      const requestBuilder = new RequestBuilderImpl();
      const builder = new MatchBuilder(requestBuilder);
      builder.equalToJson(JSON.stringify({ foo: 'bar' }));

      const expectedJSON = JSON.stringify({
        equalToJson: JSON.stringify({ foo: 'bar' })
      });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });
  });

  describe('equalToXml', () => {
    it('json stringifies to { equalToXml: value }', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.equalToXml('<foo>bar</foo>');

      const expectedJSON = JSON.stringify({ equalToXml: '<foo>bar</foo>' });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('returns the constructor arg request builder for chaining', () => {
      const requestBuilder = new RequestBuilderImpl();
      const builder = new MatchBuilder(requestBuilder);
      expect(builder.equalToXml('')).toEqual(requestBuilder);
    });
  });

  describe('matching', () => {
    it('json stringifies to { matches: value }', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.matching('hi');

      const expectedJSON = JSON.stringify({ matches: 'hi' });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('returns the constructor arg request builder for chaining', () => {
      const requestBuilder = new RequestBuilderImpl();
      const builder = new MatchBuilder(requestBuilder);
      expect(builder.matching('')).toEqual(requestBuilder);
    });
  });

  describe('matchingJsonPath', () => {
    it('json stringifies to { matchesJsonPath: value }', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.matchingJsonPath('hi');

      const expectedJSON = JSON.stringify({ matchesJsonPath: 'hi' });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('returns the constructor arg request builder for chaining', () => {
      const requestBuilder = new RequestBuilderImpl();
      const builder = new MatchBuilder(requestBuilder);
      expect(builder.matchingJsonPath('')).toEqual(requestBuilder);
    });
  });

  describe('matchingXPath', () => {
    it('json stringifies to { matchesXPath: value }', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.matchingXPath('hi');

      const expectedJSON = JSON.stringify({ matchesXPath: 'hi' });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('returns the constructor arg request builder for chaining', () => {
      const requestBuilder = new RequestBuilderImpl();
      const builder = new MatchBuilder(requestBuilder);
      expect(builder.matchingXPath('')).toEqual(requestBuilder);
    });
  });

  describe('notMatching', () => {
    it('json stringifies to { doesNotMatch: value }', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.notMatching('hi');

      const expectedJSON = JSON.stringify({ doesNotMatch: 'hi' });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('returns the constructor arg request builder for chaining', () => {
      const requestBuilder = new RequestBuilderImpl();
      const builder = new MatchBuilder(requestBuilder);
      expect(builder.notMatching('')).toEqual(requestBuilder);
    });
  });

  describe('thunk support', () => {
    it('resolves a thunk in equalTo at toJSON time', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.equalTo(() => 'lazy-value');

      const expectedJSON = JSON.stringify({ equalTo: 'lazy-value' });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('resolves a thunk in containing at toJSON time', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.containing(() => 'lazy-value');

      const expectedJSON = JSON.stringify({ contains: 'lazy-value' });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('resolves a thunk in matching at toJSON time', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.matching(() => 'lazy-pattern');

      const expectedJSON = JSON.stringify({ matches: 'lazy-pattern' });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('resolves a thunk in notMatching at toJSON time', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.notMatching(() => 'lazy-pattern');

      const expectedJSON = JSON.stringify({ doesNotMatch: 'lazy-pattern' });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('resolves a thunk in matchingJsonPath at toJSON time', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.matchingJsonPath(() => '$.store.book');

      const expectedJSON = JSON.stringify({
        matchesJsonPath: '$.store.book'
      });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('resolves a thunk in matchingXPath at toJSON time', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.matchingXPath(() => '//book');

      const expectedJSON = JSON.stringify({ matchesXPath: '//book' });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('resolves a thunk in equalToXml at toJSON time', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.equalToXml(() => '<foo>bar</foo>');

      const expectedJSON = JSON.stringify({
        equalToXml: '<foo>bar</foo>'
      });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('resolves a thunk in equalToJson at toJSON time', () => {
      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.equalToJson(() => '{"key":"val"}');

      const expectedJSON = JSON.stringify({
        equalToJson: '{"key":"val"}'
      });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it('evaluates thunk at serialization time, not at method call time', () => {
      let counter = 0;
      const thunk = () => `call-${++counter}`;

      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.equalTo(thunk);

      expect(JSON.stringify(builder)).toEqual(
        JSON.stringify({ equalTo: 'call-1' })
      );
      expect(JSON.stringify(builder)).toEqual(
        JSON.stringify({ equalTo: 'call-2' })
      );
    });

    it('shared builder with thunk returns different values per serialization', () => {
      let context = 'test-A';
      const thunk = () => context;

      const builder = new MatchBuilder(new RequestBuilderImpl());
      builder.equalTo(thunk);

      expect(JSON.stringify(builder)).toEqual(
        JSON.stringify({ equalTo: 'test-A' })
      );

      context = 'test-B';
      expect(JSON.stringify(builder)).toEqual(
        JSON.stringify({ equalTo: 'test-B' })
      );
    });
  });
});
