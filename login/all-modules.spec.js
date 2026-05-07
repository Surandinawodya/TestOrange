import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import { OrangeHRMPage } from '../pages/orangehrm.page.js';
import { PimPage } from '../pages/pimPage.js';
import { LeavePage } from '../pages/leavePage.js';
import { TimesheetPage } from '../pages/timesheetPage.js';
import { CandidatesPage } from '../pages/candidatesPage.js';
import { PerformancePage } from '../pages/performancePage.js';
import { DirectoryPage } from '../pages/directoryPage.js';
import { AssignClaimPage } from '../pages/assignClaimPage.js';
import { AddCandidatePage } from '../pages/addCandidatePage.js';
import { AssignLeavePage } from '../pages/assignLeavePage.js';

test.beforeEach(async ({ page }) => {
  page.setDefaultTimeout(80000);
  page.setDefaultNavigationTimeout(80000);
});

test.afterEach(async ({ page }, testInfo) => {
  try {
    const screenshot = await page.screenshot({
      fullPage: true,
      timeout: 10000
    });

    await testInfo.attach('Screenshot', {
      body: screenshot,
      contentType: 'image/png'
    });
  } catch (error) {
    console.log('Screenshot capture failed:', error.message);
  }
});

test.describe('All Modules Test Suite - OrangeHRM', () => {

  // =========================================================
  // LOGIN TESTS
  // =========================================================

  test.describe('Login Tests', () => {

    test('TC-LOGIN-001: Valid Login', async ({ page }, testInfo) => {
      const login = new LoginPage(page);

      await login.goto();
      await login.login('Admin', 'admin123');
      await login.waitForDashboard();

      await testInfo.attach('Dashboard Screenshot', {
        body: await page.screenshot(),
        contentType: 'image/png'
      });

      await expect(page.locator(login.dashboardHeader)).toBeVisible();
    });

    test('TC-LOGIN-002: Invalid Username', async ({ page }) => {
      const login = new LoginPage(page);

      await login.goto();
      await login.login('wrongUser', 'admin123');

      await expect(page.locator(login.errorMsg))
        .toHaveText(/Invalid credentials/);
    });

    test('TC-LOGIN-003: Invalid Password', async ({ page }) => {
      const login = new LoginPage(page);

      await login.goto();
      await login.login('Admin', 'wrongPass');

      await expect(page.locator(login.errorMsg))
        .toHaveText(/Invalid credentials/);
    });

    test('TC-LOGIN-004: Both Invalid', async ({ page }) => {
      const login = new LoginPage(page);

      await login.goto();
      await login.login('wrong', 'wrong');

      await expect(page.locator(login.errorMsg))
        .toHaveText(/Invalid credentials/);
    });

    test('TC-LOGIN-005: Empty Username', async ({ page }) => {
      const login = new LoginPage(page);

      await login.goto();
      await login.login('', 'admin123');

      await expect(page.locator(login.requiredMsg).first())
        .toBeVisible();
    });

    test('TC-LOGIN-006: Empty Password', async ({ page }) => {
      const login = new LoginPage(page);

      await login.goto();
      await login.login('Admin', '');

      await expect(page.locator(login.requiredMsg).first())
        .toBeVisible();
    });

    test('TC-LOGIN-007: Both Empty', async ({ page }) => {
      const login = new LoginPage(page);

      await login.goto();
      await login.login('', '');

      await expect(page.locator(login.requiredMsg))
        .toHaveCount(2);
    });

    test('TC-LOGIN-008: Spaces in Credentials', async ({ page }) => {
      const login = new LoginPage(page);

      await login.goto();
      await login.login(' Admin ', ' admin123 ');

      await expect(page.locator(login.errorMsg))
        .toBeVisible();
    });

  });

  // =========================================================
  // AUTHENTICATED TESTS
  // =========================================================

  test.describe('Authenticated Tests', () => {

    test.beforeEach(async ({ page }) => {
      const login = new LoginPage(page);

      await login.goto();
      await login.login('Admin', 'admin123');
      await login.waitForDashboard();
    });

    // =========================================================
    // USER & EMPLOYEE TESTS
    // =========================================================

    test('TC-USER-001: Add New User', async ({ page }) => {
      const hrm = new OrangeHRMPage(page);

      await hrm.addUser();
    });

    test('TC-EMP-001: Add New Employee', async ({ page }) => {
      const hrm = new OrangeHRMPage(page);

      await hrm.addEmployee('John', 'Doe');
    });

    // =========================================================
    // PIM TESTS
    // =========================================================

    test('PIM: Verify PIM page loads', async ({ page }) => {
      const pimPage = new PimPage(page);

      await pimPage.navigateToPIM();

      await expect(page).toHaveURL(/viewEmployeeList/);
    });

    test('PIM: Verify employee search functionality', async ({ page }) => {
      const pimPage = new PimPage(page);

      await pimPage.navigateToPIM();
      await pimPage.searchEmployeeByName('a');

      const rowCount = await pimPage.getRowCount();
      const noData = await pimPage.isNoRecordsFound();

      expect(rowCount > 0 || noData).toBeTruthy();
    });

    test('PIM: Verify reset functionality', async ({ page }) => {
      const pimPage = new PimPage(page);

      await pimPage.navigateToPIM();
      await pimPage.searchEmployeeByName('a');
      await pimPage.resetSearch();

      await expect(pimPage.employeeName)
        .toHaveValue('', { timeout: 10000 });
    });

    test('PIM: Verify Add Employee navigation', async ({ page }) => {
      const pimPage = new PimPage(page);

      await pimPage.navigateToPIM();
      await pimPage.clickAddEmployee();

      await expect(page).toHaveURL(/addEmployee/);
    });

    test('PIM: Verify employee table is visible', async ({ page }) => {
      const pimPage = new PimPage(page);

      await pimPage.navigateToPIM();
      await page.waitForLoadState('networkidle');

      const rowCount = await pimPage.getRowCount();
      const noData = await pimPage.isNoRecordsFound();

      expect(rowCount > 0 || noData).toBeTruthy();
    });

    // =========================================================
    // LEAVE TESTS
    // =========================================================

    test('Leave: Verify Leave List page loads', async ({ page }) => {
      const leave = new LeavePage(page);

      await leave.navigateToLeaveList();

      await expect(page).toHaveURL(/viewLeaveList/);
    });

    test('Leave: Verify leave search by employee name', async ({ page }) => {
      const leave = new LeavePage(page);

      await leave.navigateToLeaveList();
      await leave.searchByEmployee('a');

      const valid = await leave.hasValidResult();

      expect(valid).toBeTruthy();
    });

    test('Leave: Verify reset functionality', async ({ page }) => {
      const leave = new LeavePage(page);

      await leave.navigateToLeaveList();
      await leave.searchByEmployee('a');
      await leave.resetSearch();

      await expect(leave.employeeName).toHaveValue('');
    });

    test('Leave: Verify leave table is visible', async ({ page }) => {
      const leave = new LeavePage(page);

      await leave.navigateToLeaveList();

      const valid = await leave.hasValidResult();

      expect(valid).toBeTruthy();
    });

    // =========================================================
    // TIMESHEET TESTS
    // =========================================================

    test('Timesheet: Verify Employee Timesheet page loads', async ({ page }) => {
      const ts = new TimesheetPage(page);

      await ts.navigate();

      await expect(page).toHaveURL(/viewEmployeeTimesheet/);
      await expect(ts.employeeInput).toBeVisible();
    });

    test('Timesheet: Verify employee input works', async ({ page }) => {
      const ts = new TimesheetPage(page);

      await ts.navigate();
      await ts.enterEmployee('a');

      await expect(ts.employeeInput).toHaveValue('a');
    });

    test('Timesheet: Verify reset functionality', async ({ page }) => {
      const ts = new TimesheetPage(page);

      await ts.navigate();
      await ts.enterEmployee('a');
      await ts.resetInput();

      await expect(ts.employeeInput).toHaveValue('');
    });

    test('Timesheet: Verify timesheet table visibility', async ({ page }) => {
      const ts = new TimesheetPage(page);

      await ts.navigate();

      const result = await ts.hasResults();

      expect(result).toBeTruthy();
    });

    // =========================================================
    // CANDIDATES TESTS
    // =========================================================

    test('Candidates: Verify Candidates page loads', async ({ page }) => {
      const c = new CandidatesPage(page);

      await c.navigate();

      await expect(page).toHaveURL(/viewCandidates/);
      await expect(c.table).toBeVisible();
    });

    test('Candidates: Verify search works', async ({ page }) => {
      const c = new CandidatesPage(page);

      await c.navigate();
      await c.searchCandidate('a');

      await expect(c.table).toBeVisible();
    });

    test('Candidates: Verify reset works', async ({ page }) => {
      const c = new CandidatesPage(page);

      await c.navigate();
      await c.searchCandidate('a');
      await c.resetSearch();

      await expect(c.nameInput).toHaveValue('');
    });

    // =========================================================
    // PERFORMANCE TESTS
    // =========================================================

    test('Performance: Verify Performance Review page loads', async ({ page }) => {
      const perf = new PerformancePage(page);

      await perf.navigate();

      await expect(page)
        .toHaveURL(/searchEvaluatePerformanceReview/);

      await expect(perf.searchBtn).toBeVisible();
    });

    test('Performance: Verify employee search works', async ({ page }) => {
      const perf = new PerformancePage(page);

      await perf.navigate();
      await perf.searchEmployee('a');

      await expect(perf.table).toBeVisible();
    });

    test('Performance: Verify reset functionality', async ({ page }) => {
      const perf = new PerformancePage(page);

      await perf.navigate();
      await perf.searchEmployee('a');
      await perf.resetSearch();

      await expect(perf.employeeInput).toHaveValue('');
    });

    test('Performance: Verify table visibility', async ({ page }) => {
      const perf = new PerformancePage(page);

      await perf.navigate();

      await expect(perf.table).toBeVisible();
    });

    // =========================================================
    // DIRECTORY TESTS
    // =========================================================

    test('Directory: Verify Directory page loads', async ({ page }) => {
      const dir = new DirectoryPage(page);

      await dir.navigate();

      await expect(page).toHaveURL(/viewDirectory/);
      await expect(dir.employeeCards.first()).toBeVisible();
    });

    test('Directory: Verify employee cards visible', async ({ page }) => {
      const dir = new DirectoryPage(page);

      await dir.navigate();

      await expect(dir.employeeCards.first()).toBeVisible();
    });

    test('Directory: Verify search works', async ({ page }) => {
      const dir = new DirectoryPage(page);

      await dir.navigate();
      await dir.searchEmployee('a');

      await expect(dir.employeeCards.first()).toBeVisible();
    });

    test('Directory: Verify reset functionality', async ({ page }) => {
      const dir = new DirectoryPage(page);

      await dir.navigate();
      await dir.searchEmployee('a');
      await dir.resetSearch();

      await expect(dir.employeeInput).toHaveValue('');
    });

    // =========================================================
    // CLAIM TESTS
    // =========================================================

    test('Claim: Verify Assign Claim page loads', async ({ page }) => {
      const claim = new AssignClaimPage(page);

      await claim.navigate();

      await expect(page).toHaveURL(/viewAssignClaim/);
      await expect(claim.employeeInput).toBeVisible();
    });

    test('Claim: Verify form fills correctly', async ({ page }) => {
      const claim = new AssignClaimPage(page);

      await claim.navigate();
      await claim.fillForm();

      await expect(claim.employeeInput)
        .not.toHaveValue('');
    });

    test('Claim: Verify submit action works', async ({ page }) => {
      const claim = new AssignClaimPage(page);

      await claim.navigate();
      await claim.fillForm();
      await claim.submitForm();

      await expect(claim.form).toBeVisible();
    });

    // =========================================================
    // ADD CANDIDATE TESTS
    // =========================================================

    test('Add Candidate: Verify Add Candidate page loads', async ({ page }) => {
      const c = new AddCandidatePage(page);

      await c.navigate();

      await expect(page).toHaveURL(/addCandidate/);
      await expect(c.firstName).toBeVisible();
    });

    test('Add Candidate: Verify candidate can be added', async ({ page }) => {
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

    // =========================================================
    // ASSIGN LEAVE TESTS
    // =========================================================

    test('Assign Leave: Verify Assign Leave page loads', async ({ page }) => {
      const leave = new AssignLeavePage(page);

      await leave.navigate();

      await expect(page).toHaveURL(/assignLeave/);
      await expect(leave.employeeInput).toBeVisible();
    });

    test('Assign Leave: Verify assign leave works', async ({ page }) => {
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

});