import { expect } from '@playwright/test';

export class LeavePage {
  constructor(page) {
    this.page = page;

    // Navigation
    this.leaveMenu = page.getByRole('link', { name: 'Leave' });
    this.leaveListMenu = page.getByRole('link', { name: 'Leave List' });

    // Filters
    this.employeeName = page.locator('input[placeholder="Type for hints..."]').first();

    // Actions
    this.searchBtn = page.getByRole('button', { name: 'Search' });
    this.resetBtn = page.getByRole('button', { name: 'Reset' });

    // Results
    this.rows = page.locator('.oxd-table-card');
    this.noRecords = page.locator('text=No Records Found');

    // Loader
    this.loader = page.locator('.oxd-loading-spinner');
  }

  async waitForLoader() {
    await this.loader.waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {});
  }

  async navigateToLeaveList() {
    await this.leaveMenu.click();
    await this.leaveListMenu.click();

    await this.page.waitForURL(/viewLeaveList/, { timeout: 20000 });

    await this.waitForLoader();

    await this.page.waitForTimeout(2000);
  }

  async searchByEmployee(name) {
    await this.employeeName.fill(name);
    await this.searchBtn.click();

    await this.waitForLoader();
    await this.page.waitForTimeout(2000);
  }

  async resetSearch() {
    await this.resetBtn.click();

    await this.waitForLoader();
    await expect.poll(async () => {
      return await this.employeeName.inputValue();
    }, { timeout: 20000 }).toBe('');
  }

  async hasValidResult() {
    await this.page.waitForTimeout(2000);

    const rowCount = await this.rows.count();
    const noData = await this.noRecords.isVisible().catch(() => false);

    return rowCount > 0 || noData;
  }

  async getRowCount() {
    return await this.rows.count();
  }
}