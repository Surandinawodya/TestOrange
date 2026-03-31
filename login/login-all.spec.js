const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');

// Global stability fix
test.beforeEach(async ({ page }) => {
  page.setDefaultTimeout(60000);
});

test.describe('Login Test Suite - OrangeHRM', () => {

  // Valid Login
  test('TC-LOGIN-001: Valid Login', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('Admin', 'admin123');

    await page.waitForSelector(login.dashboardHeader, { timeout: 15000 });
    await expect(page.locator(login.dashboardHeader)).toBeVisible();
  });

  // Invalid Username
  test('TC-LOGIN-002: Invalid Username', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('wrongUser', 'admin123');

    await expect(page.locator(login.errorMsg))
      .toHaveText(/Invalid credentials/);
  });

  // Invalid Password
  test('TC-LOGIN-003: Invalid Password', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('Admin', 'wrongPass');

    await expect(page.locator(login.errorMsg))
      .toHaveText(/Invalid credentials/);
  });

  // Both Invalid
  test('TC-LOGIN-004: Both Invalid', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('wrong', 'wrong');

    await expect(page.locator(login.errorMsg))
      .toHaveText(/Invalid credentials/);
  });

  // Empty Username
  test('TC-LOGIN-005: Empty Username', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('', 'admin123');

    await expect(page.locator(login.requiredMsg).first()).toBeVisible();
  });

  //  Empty Password
  test('TC-LOGIN-006: Empty Password', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('Admin', '');

    await expect(page.locator(login.requiredMsg).first()).toBeVisible();
  });

  //  Both Empty 
  test('TC-LOGIN-007: Both Empty', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('', '');

    const errors = page.locator(login.requiredMsg);
    await expect(errors).toHaveCount(2); 
  });

  //  SQL Injection
  test('TC-LOGIN-008: SQL Injection Attempt', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login("' OR '1'='1", '123');

    await expect(page.locator(login.errorMsg)).toBeVisible();
  });

  //  XSS Attempt 
  test('TC-LOGIN-009: XSS Attempt', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('<script>alert(1)</script>', '123');

    await expect(page).toHaveURL(/auth\/login/); 
  });

  // Spaces
  test('TC-LOGIN-010: Spaces in Credentials', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login(' Admin ', ' admin123 ');

    await expect(page.locator(login.errorMsg)).toBeVisible();
  });

});