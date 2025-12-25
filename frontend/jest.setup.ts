// jest.setup.ts
import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';
// Import the Web Streams API from Node.js
import { TransformStream, ReadableStream, WritableStream } from 'node:stream/web';

// 1. Polyfill TextEncoder/Decoder
Object.assign(global, { TextDecoder, TextEncoder });

// 2. Polyfill Web Streams (The fix for your current error)
Object.assign(global, {
  TransformStream,
  ReadableStream,
  WritableStream,
});

// 3. Setup React Testing Library (if available)
try {
  const { configure } = require('@testing-library/jest-dom');
  configure();
} catch (e) {
  // @testing-library/jest-dom not installed, skip
}

// 4. Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});