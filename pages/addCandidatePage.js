import { expect } from '@playwright/test';

export class AddCandidatePage {
  constructor(page) {
    this.page = page;

    
    this.firstName = page.locator('input[name="firstName"]');
    this.lastName = page.locator('input[name="lastName"]');
    this.email = page.locator('input[placeholder="Type here"]').nth(0);

    this.vacancyDropdown = page.locator('.oxd-select-text').first();

  
    this.resumeUpload = page.locator('input[type="file"]');

    this.saveBtn = page.getByRole('button', { name: 'Save' });
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' });

  
    this.form = page.locator('form');
  }

  async navigate() {
    await this.page.goto(
      'https://opensource-demo.orangehrmlive.com/web/index.php/recruitment/addCandidate',
      { waitUntil: 'domcontentloaded' }
    );

    await this.page.waitForLoadState('networkidle');

    await expect(this.firstName).toBeVisible({ timeout: 20000 });
  }

  async fillCandidate(data) {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.email.fill(data.email);

    if (data.vacancy) {
      await this.vacancyDropdown.click();

      const option = this.page.locator('.oxd-select-option').first();
      await option.click();
    }
  }
  async saveCandidate() {
    await expect(this.saveBtn).toBeVisible();
    await expect(this.saveBtn).toBeEnabled();

    await this.saveBtn.click();
  }
  async isFormVisible() {
    return await this.form.isVisible();
  }
}