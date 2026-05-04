// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60000,

  retries: 1,

  reporter: [
    ['html', { open: 'always' }]
  ],

  use: {
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    // Stability
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
});