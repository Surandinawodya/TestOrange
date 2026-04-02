// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  reporter: 'html',  

  use: {
    screenshot: 'only-on-failure',  
    video: 'retain-on-failure',      
    trace: 'retain-on-failure',     
  },
});