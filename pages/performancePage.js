import { expect } from '@playwright/test';

export class PerformancePage {
  constructor(page) {
    this.page = page;

   
    this.employeeInput = page
      .locator('input[placeholder="Type for hints..."]')
      .first();

    this.searchBtn = page.getByRole('button', { name: 'Search' });
    this.resetBtn = page.getByRole('button', { name: 'Reset' });


    this.table = page.locator('.oxd-table');
    this.rows = page.locator('.oxd-table-card');
    this.noRecords = page.locator('text=No Records Found');
  }

  async navigate() {
    await this.page.goto(
      'https://opensource-demo.orangehrmlive.com/web/index.php/performance/searchEvaluatePerformanceReview',
      { waitUntil: 'domcontentloaded' }
    );

    await this.page.waitForLoadState('networkidle');

    await expect(this.searchBtn).toBeVisible({ timeout: 30000 });
  }
  async searchEmployee(name) {
    await this.employeeInput.fill(name);

    await this.page.keyboard.press('Escape');

    await expect(this.searchBtn).toBeVisible();
    await expect(this.searchBtn).toBeEnabled();

    await this.searchBtn.click();

    await this.waitForResults();
  }

  async resetSearch() {
    await expect(this.resetBtn).toBeVisible();

    await this.resetBtn.click();

    await expect(this.employeeInput).toHaveValue('');
  }

  async waitForResults() {
    await this.table.waitFor({ state: 'visible', timeout: 15000 });
  }
}