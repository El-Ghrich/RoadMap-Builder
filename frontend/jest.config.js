/** @type {import("jest").Config} **/
export default {
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Whenever Jest sees "utils/envConfig", it loads the mock instead
    ".*utils/envConfig$": "<rootDir>/src/__mocks__/envConfigMock.ts",
    // Mock CSS modules
    "\\.module\\.css$": "identity-obj-proxy",
    "\\.css$": "identity-obj-proxy",
  },
  testMatch: [
    "**/__tests__/**/*.(test|spec).(ts|tsx)",
    "**/*.(test|spec).(ts|tsx)"
  ],
};