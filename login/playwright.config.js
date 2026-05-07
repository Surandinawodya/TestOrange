// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 80000,
  retries: 2,

  reporter: [
    ['html', { open: 'always' }]
  ],

  use: {
    headless: false,
    screenshot: 'on',
    video: 'on',
    trace: 'on',
    actionTimeout: 15000,
    navigationTimeout: 60000,
  },

  projects: [
    {
      name: 'login',
      testMatch: '**/login/*.spec.js',
    },
    {
      name: 'pim',
      testMatch: '**/pim.spec.js',
      dependencies: ['login'],
    },
  ],
});
