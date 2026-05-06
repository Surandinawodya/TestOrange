import { expect } from '@playwright/test';

export class AssignClaimPage {
  constructor(page) {
    this.page = page;

    this.employeeInput = page
      .locator('input[placeholder="Type for hints..."]')
      .first();

    this.eventDropdown = page.locator('.oxd-select-text').first();
    this.submitBtn = page.locator('button').filter({
      hasText: /save|submit|assign/i
    });

    this.form = page.locator('form');
  }

  async navigate() {
    await this.page.goto(
      'https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewAssignClaim',
      { waitUntil: 'domcontentloaded' }
    );

    await this.page.waitForLoadState('networkidle');

    await expect(this.employeeInput).toBeVisible({ timeout: 30000 });
  }

  async fillForm() {
    await this.employeeInput.fill('a');
    await this.page.keyboard.press('Escape');

    await this.eventDropdown.click();

    const option = this.page.locator('.oxd-select-option').first();
    await option.click();
  }

  async submitForm() {

    await expect(this.submitBtn.first()).toBeVisible({ timeout: 20000 });
    await expect(this.submitBtn.first()).toBeEnabled();

    await this.submitBtn.first().click();
  }

  async isFormVisible() {
    return await this.form.isVisible();
  }
}