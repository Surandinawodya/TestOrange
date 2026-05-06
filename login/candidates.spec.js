import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { CandidatesPage } from '../pages/candidatesPage';

test.describe('Recruitment Candidates Tests', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('Admin', 'admin123');
    await login.waitForDashboard();
  });

  test('Verify Candidates page loads', async ({ page }) => {
    const c = new CandidatesPage(page);

    await c.navigate();

    await expect(page).toHaveURL(/viewCandidates/);
    await expect(c.table).toBeVisible();
  });

  test('Verify search works', async ({ page }) => {
    const c = new CandidatesPage(page);

    await c.navigate();

    await c.searchCandidate('a');

    await expect(c.table).toBeVisible();
  });

  test('Verify reset works', async ({ page }) => {
    const c = new CandidatesPage(page);

    await c.navigate();

    await c.searchCandidate('a');
    await c.resetSearch();

    await expect(c.nameInput).toHaveValue('');
  });

});