import { expect } from '@playwright/test';

export class CandidatesPage {
  constructor(page) {
    this.page = page;

  
    this.nameInput = page.locator('input[placeholder="Type for hints..."]').first();

    this.searchBtn = page.getByRole('button', { name: 'Search' });
    this.resetBtn = page.getByRole('button', { name: 'Reset' });

    this.rows = page.locator('.oxd-table-card');
    this.table = page.locator('.oxd-table');
  }
  async navigate() {
    await this.page.goto(
      'https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/viewCandidates',
      { waitUntil: 'domcontentloaded' }
    );

    await this.page.waitForLoadState('networkidle');

    await expect(this.searchBtn).toBeVisible({ timeout: 20000 });
  }
  async searchCandidate(name) {
    await this.nameInput.fill(name);

    await this.page.keyboard.press('Escape');

    await expect(this.searchBtn).toBeVisible();
    await expect(this.searchBtn).toBeEnabled();

    await this.searchBtn.click();

    await this.waitForResults();
  }
  async resetSearch() {
    await this.resetBtn.click();

    await expect(this.nameInput).toHaveValue('');
  }

  async waitForResults() {
    await this.table.waitFor({ state: 'visible' });
  }
  async hasResults() {
    const count = await this.rows.count();
    return count >= 0; 
}}