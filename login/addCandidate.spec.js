import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { AddCandidatePage } from '../pages/addCandidatePage';

test.describe('Add Candidate Tests', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('Admin', 'admin123');
    await login.waitForDashboard();
  });

  test('Verify Add Candidate page loads', async ({ page }) => {
    const c = new AddCandidatePage(page);

    await c.navigate();

    await expect(page).toHaveURL(/addCandidate/);
    await expect(c.firstName).toBeVisible();
  });

  test('Verify candidate can be added', async ({ page }) => {
    const c = new AddCandidatePage(page);

    await c.navigate();

    await c.fillCandidate({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      vacancy: true
    });

    await c.saveCandidate();
    await expect(c.form).toBeVisible();
  });

});