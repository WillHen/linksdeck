import "@testing-library/jest-dom";


import { server } from './src/mocks/server';

// const dotenv = require('dotenv');

// dotenv.config({ path: './.env.test', override: true });

// Start the MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset handlers after each test to avoid test interference
afterEach(() => server.resetHandlers());

// Stop the MSW server after all tests
afterAll(() => server.close());

