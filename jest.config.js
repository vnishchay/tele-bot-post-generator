module.exports = {
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
  testMatch: ["**/tests/**/*.test.js"],
  // Setup a timeout of 10 seconds
  testTimeout: 10000,
};
