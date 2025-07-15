import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { WireMockMapper, Configuration, wiremockMapperMatchers } from '../index';

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
        req.isAPost
          .withUrlPath.equalTo('/api/users')
          .withHeader('Content-Type').equalTo('application/json');
        
        res.withJsonBody({ id: 123, name: 'John Doe', email: 'john@example.com' })
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      });

      expect(response.status).toBe(201);
      const responseBody = await response.json() as { id: number; name: string; email: string };
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
        req.isAPut
          .withUrlPath.equalTo('/api/orders/123')
          .withHeader('Authorization').equalTo('Bearer token123');
        
        res.withJsonBody({ 
          orderId: 123, 
          status: 'updated',
          updatedAt: '2023-01-01T00:00:00Z'
        }).withStatus(200);
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
          'Authorization': 'Bearer token123'
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
});