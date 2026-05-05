import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { LeavePage } from '../pages/leavePage';

test.describe('Leave List Tests', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('Admin', 'admin123');
    await login.waitForDashboard();
  });

  test('Verify Leave List page loads', async ({ page }) => {
    const leave = new LeavePage(page);

    await leave.navigateToLeaveList();

    await expect(page).toHaveURL(/viewLeaveList/);
  });

  test('Verify leave search by employee name', async ({ page }) => {
    const leave = new LeavePage(page);

    await leave.navigateToLeaveList();
    await leave.searchByEmployee('a');

    const valid = await leave.hasValidResult();

    expect(valid).toBeTruthy();
  });

  test('Verify reset functionality', async ({ page }) => {
    const leave = new LeavePage(page);

    await leave.navigateToLeaveList();
    await leave.searchByEmployee('a');

    await leave.resetSearch();

    await expect(leave.employeeName).toHaveValue('');
  });

  test('Verify leave table is visible', async ({ page }) => {
    const leave = new LeavePage(page);

    await leave.navigateToLeaveList();

    const valid = await leave.hasValidResult();

    expect(valid).toBeTruthy();
  });

});