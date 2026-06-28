import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './'
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jest-fixed-jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    "^uuid$": "uuid"
  },
  testMatch: ['<rootDir>/app/**/*.test.{ts,tsx}']
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
const jestConfig = createJestConfig(config);

// msw 2.14+ pulls in a chain of ESM-only deps (rettime, until-async,
// @mswjs/interceptors, etc.). next/jest's default transformIgnorePatterns
// ignores all of node_modules (except next/geist), so inject those packages
// into that allowlist instead of appending a new pattern (Jest ignores a file
// if it matches ANY pattern, so appending wouldn't work).
const esmPackages = [
  'rettime',
  'until-async',
  'outvariant',
  'strict-event-emitter',
  'headers-polyfill',
  'is-node-process',
  '@mswjs',
  '@open-draft',
  '@bundled-es-modules'
];

export default async () => {
  const resolved = await jestConfig();
  let injected = false;
  resolved.transformIgnorePatterns = resolved.transformIgnorePatterns?.map((p) => {
    const next = p.replace('(?!(geist|', `(?!(geist|${esmPackages.join('|')}|`);
    if (next !== p) injected = true;
    return next;
  });
  // Fail loudly if next/jest reshapes its transformIgnorePatterns and the
  // anchor above no longer matches — otherwise the ESM deps silently break
  // again with an opaque "Cannot use import statement outside a module" error.
  if (!injected) {
    throw new Error(
      'jest.config: could not inject MSW ESM packages into next/jest transformIgnorePatterns. ' +
        'The expected "(?!(geist|" anchor was not found — next/jest likely changed its config shape.'
    );
  }
  return resolved;
};
