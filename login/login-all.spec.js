const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { OrangeHRMPage } = require('../pages/orangehrm.page');

test.beforeEach(async ({ page }) => {
  page.setDefaultTimeout(80000);
});

test.afterEach(async ({ page }, testInfo) => {
  const screenshot = await page.screenshot();
  await testInfo.attach('Screenshot', { body: screenshot, contentType: 'image/png' });
});

test.describe('Test Suite - OrangeHRM', () => {
  test('TC-LOGIN-001: Valid Login', async ({ page }, testInfo) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('Admin', 'admin123');
    await login.waitForDashboard(); 

    await testInfo.attach('Dashboard Screenshot', { body: await page.screenshot(), contentType: 'image/png' });
    await expect(page.locator(login.dashboardHeader)).toBeVisible();
  });

  test('TC-LOGIN-002: Invalid Username', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('wrongUser', 'admin123');
    await expect(page.locator(login.errorMsg)).toHaveText(/Invalid credentials/);
  });

  test('TC-LOGIN-003: Invalid Password', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('Admin', 'wrongPass');
    await expect(page.locator(login.errorMsg)).toHaveText(/Invalid credentials/);
  });

  test('TC-LOGIN-004: Both Invalid', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('wrong', 'wrong');
    await expect(page.locator(login.errorMsg)).toHaveText(/Invalid credentials/);
  });

  test('TC-LOGIN-005: Empty Username', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('', 'admin123');
    await expect(page.locator(login.requiredMsg).first()).toBeVisible();
  });

  test('TC-LOGIN-006: Empty Password', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('Admin', '');
    await expect(page.locator(login.requiredMsg).first()).toBeVisible();
  });

  test('TC-LOGIN-007: Both Empty', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('', '');
    await expect(page.locator(login.requiredMsg)).toHaveCount(2);
  });

  test('TC-LOGIN-008: Spaces in Credentials', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login(' Admin ', ' admin123 ');
    await expect(page.locator(login.errorMsg)).toBeVisible();
  });

  test('TC-USER-001: Add New User', async ({ page }) => {
    const login = new LoginPage(page);
    const hrm = new OrangeHRMPage(page);

    await login.goto();
    await login.login('Admin', 'admin123');
    await login.waitForDashboard();

    await hrm.addUser();
  });

  test('TC-EMP-001: Add New Employee', async ({ page }) => {
    const login = new LoginPage(page);
    const hrm = new OrangeHRMPage(page);

    await login.goto();
    await login.login('Admin', 'admin123');
    await login.waitForDashboard();

    await hrm.addEmployee('John', 'Doe');
  });


});