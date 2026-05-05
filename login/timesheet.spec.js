import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { TimesheetPage } from '../pages/timesheetPage';

test.describe('Employee Timesheet Tests', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('Admin', 'admin123');
    await login.waitForDashboard();
  });

  test('Verify Employee Timesheet page loads', async ({ page }) => {
    const ts = new TimesheetPage(page);

    await ts.navigate();

    await expect(page).toHaveURL(/viewEmployeeTimesheet/);
    await expect(ts.employeeInput).toBeVisible();
  });

  test('Verify employee search works', async ({ page }) => {
    const ts = new TimesheetPage(page);

    await ts.navigate();

    await ts.searchEmployee('a');

    const result = await ts.hasResults();
    expect(result).toBeTruthy();
  });

  test('Verify reset functionality', async ({ page }) => {
    const ts = new TimesheetPage(page);

    await ts.navigate();

    await ts.searchEmployee('a');
    await ts.resetSearch();

    await expect(ts.employeeInput).toHaveValue('');
  });

  test('Verify timesheet table visibility', async ({ page }) => {
    const ts = new TimesheetPage(page);

    await ts.navigate();

    const result = await ts.hasResults();
    expect(result).toBeTruthy();
  });

});