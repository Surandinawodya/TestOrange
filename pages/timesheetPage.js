import { expect } from '@playwright/test';

export class TimesheetPage {
  constructor(page) {
    this.page = page;

    this.employeeInput = page
      .locator('input[placeholder="Type for hints..."]')
      .first();


    this.rows = page.locator('.oxd-table-card');
    this.noRecords = page.locator('text=No Records Found');
  }

  async navigate() {
    await this.page.goto(
      'https://opensource-demo.orangehrmlive.com/web/index.php/time/viewEmployeeTimesheet',
      { waitUntil: 'domcontentloaded' }
    );

    await this.page.waitForLoadState('networkidle');

    await expect(this.employeeInput).toBeVisible({ timeout: 30000 });
  }

  async enterEmployee(name) {
    await this.employeeInput.fill(name);
    await this.page.keyboard.press('Escape');
  }

  async waitForResults() {
    await this.page.waitForFunction(() => {
      const rows = document.querySelectorAll('.oxd-table-card').length;
      const noData = document.body.innerText.includes('No Records Found');
      return rows > 0 || noData;
    });
  }

  async hasResults() {
    const count = await this.rows.count();
    const noData = await this.noRecords.isVisible().catch(() => false);

    return count > 0 || noData;
  }

  async resetInput() {
    await this.employeeInput.fill('');
  }
}