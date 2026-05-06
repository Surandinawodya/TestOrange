import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { PerformancePage } from '../pages/performancePage';

test.describe('Performance Review Tests', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('Admin', 'admin123');
    await login.waitForDashboard();
  });

  test('Verify Performance Review page loads', async ({ page }) => {
    const perf = new PerformancePage(page);

    await perf.navigate();

    await expect(page).toHaveURL(/searchEvaluatePerformanceReview/);
    await expect(perf.searchBtn).toBeVisible();
  });

  test('Verify employee search works', async ({ page }) => {
    const perf = new PerformancePage(page);

    await perf.navigate();

    await perf.searchEmployee('a');
    await expect(perf.table).toBeVisible();
  });

  test('Verify reset functionality', async ({ page }) => {
    const perf = new PerformancePage(page);

    await perf.navigate();

    await perf.searchEmployee('a');
    await perf.resetSearch();

    await expect(perf.employeeInput).toHaveValue('');
  });

  test('Verify table visibility', async ({ page }) => {
    const perf = new PerformancePage(page);

    await perf.navigate();
    await expect(perf.table).toBeVisible();
  });

});