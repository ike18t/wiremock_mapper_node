import { ResponseBuilderImpl } from "../../lib/builders/response_builder";

describe("ResponseBuilderImpl", () => {
  describe("withBody", () => {
    it("json stringifies to { body: value }", () => {
      const builder = new ResponseBuilderImpl();
      builder.withBody("whatevs");
      const expectedJSON = JSON.stringify({ body: "whatevs" });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it("json stringifies the body value: {\"body\":\"{\"a\":\"b\"}\"}", () => {
      const responseObject = {a: "b"};
      const builder = new ResponseBuilderImpl();
      builder.withBody(responseObject);
      const expectedJSON = JSON.stringify(builder);
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it("returns self for chaining", () => {
      const builder = new ResponseBuilderImpl();
      expect(builder.withBody("whatevs")).toEqual(builder);
    });
  });

  describe("withHeader", () => {
    it("jsons an added header to { headers: { key: value } }", () => {
      const builder = new ResponseBuilderImpl();
      builder.withHeader("key", "value");
      const expectedJSON = JSON.stringify({ headers: { key: "value" } });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it("returns self for chaining", () => {
      const builder = new ResponseBuilderImpl();
      expect(builder.withHeader("whatevs", "whatevs")).toEqual(builder);
    });
  });

  describe("withStatus", () => {
    it("json stringifies to { status: value }", () => {
      const builder = new ResponseBuilderImpl();
      builder.withStatus(400);
      const expectedJSON = JSON.stringify({ status: 400 });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it("returns self for chaining", () => {
      const builder = new ResponseBuilderImpl();
      expect(builder.withStatus(400)).toEqual(builder);
    });
  });

  describe("withStatusMessage", () => {
    it("json stringifies to { statusMessage: value }", () => {
      const builder = new ResponseBuilderImpl();
      builder.withStatusMessage("hi");
      const expectedJSON = JSON.stringify({ statusMessage: "hi" });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it("returns self for chaining", () => {
      const builder = new ResponseBuilderImpl();
      expect(builder.withStatusMessage("hi")).toEqual(builder);
    });
  });

  describe("withDelay", () => {
    it("json stringifies to { fixedDelayMilliseconds: value }", () => {
      const builder = new ResponseBuilderImpl();
      builder.withDelay(123);
      const expectedJSON = JSON.stringify({ fixedDelayMilliseconds: 123 });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it("returns self for chaining", () => {
      const builder = new ResponseBuilderImpl();
      expect(builder.withDelay(123)).toEqual(builder);
    });
  });

  describe("withTransformer", () => {
    it("json stringifies to { transformer: value }", () => {
      const builder = new ResponseBuilderImpl();
      builder.withTransformer("optimus prime");
      const expectedJSON = JSON.stringify({ transformer: "optimus prime" });
      expect(JSON.stringify(builder)).toEqual(expectedJSON);
    });

    it("returns self for chaining", () => {
      const builder = new ResponseBuilderImpl();
      expect(builder.withTransformer("optimus prime")).toEqual(builder);
    });
  });
});
