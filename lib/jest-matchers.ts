import { diff } from 'jest-diff';

import { WireMockMapper } from './wiremock_mapper';
import { Configuration, MatcherOptions } from './configuration';

interface JestMatcherResult {
  pass: boolean;
  message: () => string;
}

const mergeOptions = (options?: Partial<MatcherOptions>): MatcherOptions => {
  return { ...Configuration.matcherOptions, ...options };
};

export const wiremockMapperMatchers = {
  async toHaveBeenRequested(
    stubId: string,
    options?: Partial<MatcherOptions>
  ): Promise<JestMatcherResult> {
    const { retries: maxRetries, delay } = mergeOptions(options);
    let retries = maxRetries;

    while (retries > 0) {
      try {
        const { requests } = await WireMockMapper.getRequests({
          stubId
        });
        if (requests.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          retries -= 1;

          continue;
        } else {
          return {
            message: () => 'Request found',
            pass: true
          };
        }
      } catch (_error) {
        retries -= 1;
      }
    }
    return {
      message: () => 'Request not found',
      pass: false
    };
  },

  async toHaveBeenRequestedWith(
    stubId: string,
    expected: unknown,
    options?: Partial<MatcherOptions>
  ): Promise<JestMatcherResult> {
    const { retries: maxRetries, delay } = mergeOptions(options);
    let retries = maxRetries;

    while (retries > 0) {
      try {
        const { requests } = await WireMockMapper.getRequests({
          stubId
        });
        if (requests.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          retries -= 1;

          continue;
        } else {
          const diffResult = diff(
            JSON.parse(requests[0].request.body),
            JSON.parse(JSON.stringify(expected))
          );

          return {
            message: () => diffResult || 'no visual difference',
            pass:
              diffResult === null || diffResult.includes('no visual difference')
          };
        }
      } catch (_error) {
        retries -= 1;
      }
    }
    return {
      message: () => 'Request not found',
      pass: false
    };
  },

  async toHaveBeenRequestedTimes(
    stubId: string,
    expectedCount: number,
    options?: Partial<MatcherOptions>
  ): Promise<JestMatcherResult> {
    const { retries: maxRetries, delay } = mergeOptions(options);
    let retries = maxRetries;

    while (retries > 0) {
      try {
        const { requests } = await WireMockMapper.getRequests({
          stubId
        });

        if (requests.length === expectedCount) {
          return {
            message: () =>
              `Expected stub ${stubId} not to have been requested ${expectedCount} time(s), but it was`,
            pass: true
          };
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
        retries -= 1;
      } catch (_error) {
        retries -= 1;
      }
    }

    // Final check to get actual count for error message
    try {
      const { requests } = await WireMockMapper.getRequests({ stubId });
      const actualCount = requests.length;

      return {
        message: () =>
          `Expected stub ${stubId} to have been requested ${expectedCount} time(s), but it was requested ${actualCount} time(s)`,
        pass: false
      };
    } catch (_error) {
      return {
        message: () =>
          `Expected stub ${stubId} to have been requested ${expectedCount} time(s), but could not retrieve requests`,
        pass: false
      };
    }
  }
};

// Type declarations for TypeScript users
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toHaveBeenRequested(options?: Partial<MatcherOptions>): Promise<R>;
      toHaveBeenRequestedWith(expected: unknown, options?: Partial<MatcherOptions>): Promise<R>;
      toHaveBeenRequestedTimes(
        expectedCount: number,
        options?: Partial<MatcherOptions>
      ): Promise<R>;
    }
  }
}
