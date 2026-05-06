import { expect } from '@playwright/test';

export class DirectoryPage {
  constructor(page) {
    this.page = page;
    this.employeeCards = page.locator('.oxd-grid-item');

    this.employeeInput = page
      .locator('input[placeholder="Type for hints..."]')
      .first();

    this.searchBtn = page.getByRole('button', { name: 'Search' });
    this.resetBtn = page.getByRole('button', { name: 'Reset' });
  }


  async navigate() {
    await this.page.goto(
      'https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory',
      { waitUntil: 'domcontentloaded' }
    );

    await this.page.waitForLoadState('networkidle');
    await this.employeeCards.first().waitFor({ state: 'visible', timeout: 50000 });
  }

  async searchEmployee(name) {
    await this.employeeInput.fill(name);

    await this.page.keyboard.press('Escape');

    await this.searchBtn.click();

    await this.waitForResults();
  }

  async resetSearch() {
    await this.resetBtn.click();

    await expect(this.employeeInput).toHaveValue('');
  }
  async waitForResults() {
    await this.employeeCards.first().waitFor({ state: 'visible' });
  }
  async hasCards() {
    const count = await this.employeeCards.count();
    return count > 0;
  }
}