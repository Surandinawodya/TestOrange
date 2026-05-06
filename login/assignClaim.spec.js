import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { AssignClaimPage } from '../pages/assignClaimPage';

test.describe('Assign Claim Tests', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('Admin', 'admin123');
    await login.waitForDashboard();
  });

  test('Verify Assign Claim page loads', async ({ page }) => {
    const claim = new AssignClaimPage(page);

    await claim.navigate();

    await expect(page).toHaveURL(/viewAssignClaim/);
    await expect(claim.employeeInput).toBeVisible();
  });

  test('Verify form fills correctly', async ({ page }) => {
    const claim = new AssignClaimPage(page);

    await claim.navigate();

    await claim.fillForm();

    await expect(claim.employeeInput).not.toHaveValue('');
  });

  test('Verify submit action works', async ({ page }) => {
    const claim = new AssignClaimPage(page);

    await claim.navigate();

    await claim.fillForm();

    await claim.submitForm();
    await expect(claim.form).toBeVisible();
  });

});