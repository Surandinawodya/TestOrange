import { test, expect } from '@playwright/test';
const { LoginPage } = require('../pages/loginPage');
import { PimPage } from '../pages/pimPage';

test.describe('PIM Employee List Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    await loginPage.waitForDashboard();
  });

  test('Verify PIM page loads', async ({ page }) => {
    const pimPage = new PimPage(page);

    await pimPage.navigateToPIM();
    await expect(page).toHaveURL(/viewEmployeeList/);
  });

  test('Verify employee search functionality', async ({ page }) => {
    const pimPage = new PimPage(page);

    await pimPage.navigateToPIM();
    await pimPage.searchEmployeeByName('a');

    const rowCount = await pimPage.getRowCount();
    const noData = await pimPage.isNoRecordsFound();

    expect(rowCount > 0 || noData).toBeTruthy();
  });

  test('Verify reset functionality', async ({ page }) => {
    const pimPage = new PimPage(page);

    await pimPage.navigateToPIM();
    await pimPage.searchEmployeeByName('a');

    await pimPage.resetSearch();

    await expect(pimPage.employeeName).toHaveValue('');
  });

  test('Verify Add Employee navigation', async ({ page }) => {
    const pimPage = new PimPage(page);

    await pimPage.navigateToPIM();
    await pimPage.clickAddEmployee();

    await expect(page).toHaveURL(/addEmployee/);
  });

  test('Verify employee table is visible', async ({ page }) => {
    const pimPage = new PimPage(page);

    await pimPage.navigateToPIM();
    await page.waitForLoadState('networkidle');

    const rowCount = await pimPage.getRowCount();
    const noData = await pimPage.isNoRecordsFound();

    expect(rowCount > 0 || noData).toBeTruthy();
  });

});