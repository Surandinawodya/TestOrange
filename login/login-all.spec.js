const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');

test.beforeEach(async ({ page }) => {
  page.setDefaultTimeout(70000);
});

test.afterEach(async ({ page }, testInfo) => {
  const screenshot = await page.screenshot();

  await testInfo.attach('Screenshot', {
    body: screenshot,
    contentType: 'image/png',
  });
});

test.describe('Login Test Suite - OrangeHRM', () => {

  // TC-LOGIN-001: Valid Login
  test('TC-LOGIN-001: Valid Login', async ({ page }, testInfo) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('Admin', 'admin123');

    await page.waitForSelector(login.dashboardHeader, { timeout: 19000 });

    await testInfo.attach('Dashboard Screenshot', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });

    await expect(page.locator(login.dashboardHeader)).toBeVisible();
  });

  //  TC-LOGIN-002: Invalid Username
  test('TC-LOGIN-002: Invalid Username', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('wrongUser', 'admin123');

    await expect(page.locator(login.errorMsg))
      .toHaveText(/Invalid credentials/);
  });

  // TC-LOGIN-003: Invalid Password
  test('TC-LOGIN-003: Invalid Password', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('Admin', 'wrongPass');

    await expect(page.locator(login.errorMsg))
      .toHaveText(/Invalid credentials/);
  });

  // TC-LOGIN-004: Both Invalid
  test('TC-LOGIN-004: Both Invalid', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('wrong', 'wrong');

    await expect(page.locator(login.errorMsg))
      .toHaveText(/Invalid credentials/);
  });

  // TC-LOGIN-005: Empty Username
  test('TC-LOGIN-005: Empty Username', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('', 'admin123');

    await expect(page.locator(login.requiredMsg).first()).toBeVisible();
  });

  //  TC-LOGIN-006: Empty Password
  test('TC-LOGIN-006: Empty Password', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('Admin', '');

    await expect(page.locator(login.requiredMsg).first()).toBeVisible();
  });

  // TC-LOGIN-007: Both Empty
  test('TC-LOGIN-007: Both Empty', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('', '');

    const errors = page.locator(login.requiredMsg);
    await expect(errors).toHaveCount(2);
  });

  // TC-LOGIN-008: Spaces
  test('TC-LOGIN-008: Spaces in Credentials', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login(' Admin ', ' admin123 ');

    await expect(page.locator(login.errorMsg)).toBeVisible();
  });

});