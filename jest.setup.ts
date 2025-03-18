process.env = Object.assign(process.env, {
    LAYER: '<rootDir>/test/jest-utils',
    ENVIRONMENT: 'local',
    LOCAL: 'true',
    BASE_URL: 'http://localhost:8080',
  });