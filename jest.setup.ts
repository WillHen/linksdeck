import "@testing-library/jest-dom";


import { server } from './src/mocks/server';

const dotenv = require('dotenv');

dotenv.config({ path: './.env.test', override: true });

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

