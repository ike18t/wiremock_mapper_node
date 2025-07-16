import { GenericContainer, StartedTestContainer } from 'testcontainers';
import {
  WireMockMapper,
  Configuration,
  wiremockMapperMatchers
} from '../index';

expect.extend(wiremockMapperMatchers);

describe('WireMock E2E Tests', () => {
  let container: StartedTestContainer;
  let wireMockUrl: string;

  beforeAll(async () => {
    container = await new GenericContainer('wiremock/wiremock:latest')
      .withExposedPorts(8080)
      .withCommand(['--port', '8080'])
      .start();

    const host = container.getHost();
    const port = container.getMappedPort(8080);
    wireMockUrl = `http://${host}:${port}`;

    Configuration.wireMockBaseUrl = wireMockUrl;
    Configuration.setMatcherOptions({
      retries: 10,
      delay: 100
    });
  }, 30000);

  afterAll(async () => {
    if (container) {
      await container.stop();
    }
  });

  beforeEach(async () => {
    await WireMockMapper.clearAllMappings();
  });

  describe('API endpoint stubbing and verification', () => {
    it('stub an endpoint and verify it was called with expected payload', async () => {
      const stubId = await WireMockMapper.createMapping((req, res) => {
        req.isAPost.withUrlPath
          .equalTo('/api/users')
          .withHeader('Content-Type')
          .equalTo('application/json');

        res
          .withJsonBody({
            id: 123,
            name: 'John Doe',
            email: 'john@example.com'
          })
          .withStatus(201)
          .withHeader('Content-Type', 'application/json');
      });

      const requestPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      };

      const response = await fetch(`${wireMockUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      });

      expect(response.status).toBe(201);
      const responseBody = (await response.json()) as {
        id: number;
        name: string;
        email: string;
      };
      expect(responseBody).toEqual({
        id: 123,
        name: 'John Doe',
        email: 'john@example.com'
      });

      await expect(stubId).toHaveBeenRequested();
      await expect(stubId).toHaveBeenRequestedWith(requestPayload);
    });

    it('verify endpoint was called specific number of times', async () => {
      const stubId = await WireMockMapper.createMapping((req, res) => {
        req.isAGet.withUrlPath.equalTo('/api/health');
        res.withBody('OK').withStatus(200);
      });

      await fetch(`${wireMockUrl}/api/health`);
      await fetch(`${wireMockUrl}/api/health`);
      await fetch(`${wireMockUrl}/api/health`);

      await expect(stubId).toHaveBeenRequestedTimes(3);
    });

    it('handle complex JSON payloads', async () => {
      const stubId = await WireMockMapper.createMapping((req, res) => {
        req.isAPut.withUrlPath
          .equalTo('/api/orders/123')
          .withHeader('Authorization')
          .equalTo('Bearer token123');

        res
          .withJsonBody({
            orderId: 123,
            status: 'updated',
            updatedAt: '2023-01-01T00:00:00Z'
          })
          .withStatus(200);
      });

      const complexPayload = {
        items: [
          { id: 1, name: 'Product A', quantity: 2, price: 29.99 },
          { id: 2, name: 'Product B', quantity: 1, price: 49.99 }
        ],
        shipping: {
          address: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zip: '62701'
          },
          method: 'standard'
        },
        total: 109.97
      };

      const response = await fetch(`${wireMockUrl}/api/orders/123`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token123'
        },
        body: JSON.stringify(complexPayload)
      });

      expect(response.status).toBe(200);
      await expect(stubId).toHaveBeenRequestedWith(complexPayload);
    });
  });

  describe('Matcher configuration', () => {
    it('respect global matcher options', async () => {
      Configuration.setMatcherOptions({
        retries: 5,
        delay: 50
      });

      const stubId = await WireMockMapper.createMapping((req, res) => {
        req.isAGet.withUrlPath.equalTo('/api/test');
        res.withBody('test').withStatus(200);
      });

      await fetch(`${wireMockUrl}/api/test`);
      await expect(stubId).toHaveBeenRequested();
    });

    it('allow override of global matcher options', async () => {
      const stubId = await WireMockMapper.createMapping((req, res) => {
        req.isAGet.withUrlPath.equalTo('/api/override-test');
        res.withBody('test').withStatus(200);
      });

      await fetch(`${wireMockUrl}/api/override-test`);
      await expect(stubId).toHaveBeenRequested({ retries: 3, delay: 25 });
    });
  });

  describe('Negative assertions (not)', () => {
    describe('toHaveBeenRequested', () => {
      it('passes when endpoint was not requested', async () => {
        const stubId = await WireMockMapper.createMapping((req, res) => {
          req.isAGet.withUrlPath.equalTo('/api/not-called');
          res.withBody('should not be called').withStatus(200);
        });

        await expect(stubId).not.toHaveBeenRequested();
      });

      it('fails when endpoint was actually requested', async () => {
        const stubId = await WireMockMapper.createMapping((req, res) => {
          req.isAGet.withUrlPath.equalTo('/api/was-called');
          res.withBody('was called').withStatus(200);
        });

        await fetch(`${wireMockUrl}/api/was-called`);

        await expect(async () => {
          await expect(stubId).not.toHaveBeenRequested();
        }).rejects.toThrow();
      });

      it('works with custom matcher options', async () => {
        const stubId = await WireMockMapper.createMapping((req, res) => {
          req.isAGet.withUrlPath.equalTo('/api/options-test');
          res.withBody('test').withStatus(200);
        });

        await expect(stubId).not.toHaveBeenRequested({ retries: 2, delay: 10 });
      });
    });

    describe('toHaveBeenRequestedWith', () => {
      it('passes when endpoint was not requested with specific payload', async () => {
        const stubId = await WireMockMapper.createMapping((req, res) => {
          req.isAPost.withUrlPath.equalTo('/api/payload-test');
          res.withJsonBody({ id: 1 }).withStatus(201);
        });

        const wrongPayload = { name: 'Wrong User' };
        const correctPayload = { name: 'Correct User' };

        await fetch(`${wireMockUrl}/api/payload-test`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(correctPayload)
        });

        await expect(stubId).not.toHaveBeenRequestedWith(wrongPayload);
        await expect(stubId).toHaveBeenRequestedWith(correctPayload);
      });

      it('fails when endpoint was requested with the exact payload', async () => {
        const stubId = await WireMockMapper.createMapping((req, res) => {
          req.isAPost.withUrlPath.equalTo('/api/exact-payload');
          res.withJsonBody({ success: true }).withStatus(200);
        });

        const payload = { user: 'test', action: 'create' };

        await fetch(`${wireMockUrl}/api/exact-payload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        await expect(async () => {
          await expect(stubId).not.toHaveBeenRequestedWith(payload);
        }).rejects.toThrow();
      });

      it('passes when no requests were made at all', async () => {
        const stubId = await WireMockMapper.createMapping((req, res) => {
          req.isAPost.withUrlPath.equalTo('/api/no-requests');
          res.withJsonBody({ id: 1 }).withStatus(200);
        });

        const payload = { name: 'Any User' };
        await expect(stubId).not.toHaveBeenRequestedWith(payload);
      });

      it('works with complex nested payloads', async () => {
        const stubId = await WireMockMapper.createMapping((req, res) => {
          req.isAPost.withUrlPath.equalTo('/api/complex-payload');
          res.withJsonBody({ processed: true }).withStatus(200);
        });

        const actualPayload = {
          user: { id: 1, name: 'John' },
          metadata: { timestamp: '2023-01-01', version: 1 }
        };

        const differentPayload = {
          user: { id: 2, name: 'Jane' },
          metadata: { timestamp: '2023-01-01', version: 1 }
        };

        await fetch(`${wireMockUrl}/api/complex-payload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(actualPayload)
        });

        await expect(stubId).not.toHaveBeenRequestedWith(differentPayload);
        await expect(stubId).toHaveBeenRequestedWith(actualPayload);
      });
    });

    describe('toHaveBeenRequestedTimes', () => {
      it('passes when endpoint was not requested the specified number of times', async () => {
        const stubId = await WireMockMapper.createMapping((req, res) => {
          req.isAGet.withUrlPath.equalTo('/api/times-test');
          res.withBody('OK').withStatus(200);
        });

        await fetch(`${wireMockUrl}/api/times-test`);
        await fetch(`${wireMockUrl}/api/times-test`);

        await expect(stubId).not.toHaveBeenRequestedTimes(1);
        await expect(stubId).not.toHaveBeenRequestedTimes(3);
        await expect(stubId).not.toHaveBeenRequestedTimes(5);
        await expect(stubId).toHaveBeenRequestedTimes(2);
      });

      it('fails when endpoint was requested exactly the specified number of times', async () => {
        const stubId = await WireMockMapper.createMapping((req, res) => {
          req.isAGet.withUrlPath.equalTo('/api/exact-times');
          res.withBody('OK').withStatus(200);
        });

        await fetch(`${wireMockUrl}/api/exact-times`);
        await fetch(`${wireMockUrl}/api/exact-times`);
        await fetch(`${wireMockUrl}/api/exact-times`);

        await expect(async () => {
          await expect(stubId).not.toHaveBeenRequestedTimes(3);
        }).rejects.toThrow();
      });

      it('passes when endpoint was not requested at all (0 times)', async () => {
        const stubId = await WireMockMapper.createMapping((req, res) => {
          req.isAGet.withUrlPath.equalTo('/api/zero-times');
          res.withBody('OK').withStatus(200);
        });

        await expect(stubId).not.toHaveBeenRequestedTimes(1);
        await expect(stubId).not.toHaveBeenRequestedTimes(5);
        await expect(stubId).toHaveBeenRequestedTimes(0);
      });

      it('works with custom matcher options', async () => {
        const stubId = await WireMockMapper.createMapping((req, res) => {
          req.isAGet.withUrlPath.equalTo('/api/options-times');
          res.withBody('OK').withStatus(200);
        });

        await fetch(`${wireMockUrl}/api/options-times`);

        await expect(stubId).not.toHaveBeenRequestedTimes(2, {
          retries: 3,
          delay: 20
        });
      });
    });

    describe('Mixed scenarios', () => {
      it('handles multiple stubs with different request patterns', async () => {
        const stub1 = await WireMockMapper.createMapping((req, res) => {
          req.isAGet.withUrlPath.equalTo('/api/endpoint1');
          res.withBody('endpoint1').withStatus(200);
        });

        const stub2 = await WireMockMapper.createMapping((req, res) => {
          req.isAGet.withUrlPath.equalTo('/api/endpoint2');
          res.withBody('endpoint2').withStatus(200);
        });

        const stub3 = await WireMockMapper.createMapping((req, res) => {
          req.isAPost.withUrlPath.equalTo('/api/endpoint3');
          res.withJsonBody({ created: true }).withStatus(201);
        });

        await fetch(`${wireMockUrl}/api/endpoint1`);
        await fetch(`${wireMockUrl}/api/endpoint1`);

        await expect(stub1).toHaveBeenRequested();
        await expect(stub1).toHaveBeenRequestedTimes(2);
        await expect(stub1).not.toHaveBeenRequestedTimes(1);
        await expect(stub1).not.toHaveBeenRequestedTimes(3);

        await expect(stub2).not.toHaveBeenRequested();
        await expect(stub2).not.toHaveBeenRequestedTimes(1);
        await expect(stub2).toHaveBeenRequestedTimes(0);

        await expect(stub3).not.toHaveBeenRequested();
        await expect(stub3).not.toHaveBeenRequestedWith({ any: 'payload' });
      });
    });
  });
});
