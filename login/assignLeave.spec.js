import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { AssignLeavePage } from '../pages/assignLeavePage';

test.describe('Assign Leave Tests', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('Admin', 'admin123');
    await login.waitForDashboard();
  });

  test('Verify Assign Leave page loads', async ({ page }) => {
    const leave = new AssignLeavePage(page);

    await leave.navigate();

    await expect(page).toHaveURL(/assignLeave/);
    await expect(leave.employeeInput).toBeVisible();
  });

  test('Verify assign leave works', async ({ page }) => {
    const leave = new AssignLeavePage(page);

    await leave.navigate();

    await leave.assignLeaveFlow({
      employee: 'a', 
      from: '2026-05-10',
      to: '2026-05-10',
      comment: 'Automation leave test'
    });

    await expect(leave.assignBtn).toBeVisible();
  });

});