import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { DirectoryPage } from '../pages/directoryPage';

test.describe('Directory Module Tests', () => {

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login('Admin', 'admin123');
    await login.waitForDashboard();
  });

  test('Verify Directory page loads', async ({ page }) => {
    const dir = new DirectoryPage(page);

    await dir.navigate();

    await expect(page).toHaveURL(/viewDirectory/);
    await expect(dir.employeeCards.first()).toBeVisible();
  });

  test('Verify employee cards visible', async ({ page }) => {
    const dir = new DirectoryPage(page);

    await dir.navigate();

    await expect(dir.employeeCards.first()).toBeVisible();
  });

  test('Verify search works', async ({ page }) => {
    const dir = new DirectoryPage(page);

    await dir.navigate();

    await dir.searchEmployee('a');

    await expect(dir.employeeCards.first()).toBeVisible();
  });

  test('Verify reset functionality', async ({ page }) => {
    const dir = new DirectoryPage(page);

    await dir.navigate();

    await dir.searchEmployee('a');
    await dir.resetSearch();

    await expect(dir.employeeInput).toHaveValue('');
  });

});