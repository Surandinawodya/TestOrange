// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 80000,
  retries: 2,

  reporter: [
    ['html', { open: 'always' }]
  ],

  use: {
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 60000,
  },

  projects: [
    {
      name: 'login',
      testMatch: '**/login-all.spec.js',
    },
    {
      name: 'pim',
      testMatch: '**/pim.spec.js',
      dependencies: ['login'],
    },
  ],
});
