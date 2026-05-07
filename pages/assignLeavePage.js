import { expect } from '@playwright/test';

export class AssignLeavePage {
  constructor(page) {
    this.page = page;

  
    this.employeeInput = page.locator('input[placeholder="Type for hints..."]').first();

   
    this.leaveTypeDropdown = page.locator('.oxd-select-text').first();

   
    this.allInputs = page.locator('input.oxd-input');

    
    this.comment = page.locator('textarea');

   
    this.assignBtn = page.getByRole('button', { name: 'Assign' });


    this.form = page.locator('form');
  }


  async navigate() {
    await this.page.goto(
      'https://opensource-demo.orangehrmlive.com/web/index.php/leave/assignLeave',
      { waitUntil: 'domcontentloaded' }
    );

    await this.page.waitForLoadState('networkidle');

    await expect(this.employeeInput).toBeVisible({ timeout:   30000 });
  }


  async selectEmployee(name) {
    await this.employeeInput.click();
    await this.employeeInput.fill(name);

    const suggestion = this.page.locator('.oxd-autocomplete-option').first();
    await suggestion.waitFor({ state: 'visible', timeout: 15000 });

    await suggestion.click();
  }

 
  async selectLeaveType() {
    await this.leaveTypeDropdown.click();

    const option = this.page.locator('.oxd-select-option').first();
    await option.waitFor({ state: 'visible' });

    await option.click();

    await this.page.waitForTimeout(1500);
  }

  async enterDates(from, to) {
  
    await this.allInputs.first().waitFor({ state: 'visible', timeout: 15000 });

    const inputsCount = await this.allInputs.count();

    const fromInput = this.allInputs.nth(inputsCount - 4);
    const toInput = this.allInputs.nth(inputsCount - 3);

    await fromInput.click();
    await fromInput.fill(from);

    await toInput.click();
    await toInput.fill(to);
  }
  async enterComment(text) {
    if (await this.comment.isVisible().catch(() => false)) {
      await this.comment.fill(text);
    }
  }
  async assignLeave() {
    await expect(this.assignBtn).toBeVisible({ timeout: 20000 });
    await expect(this.assignBtn).toBeEnabled();

    await this.assignBtn.click();
  }
  async assignLeaveFlow(data) {
    await this.selectEmployee(data.employee);
    await this.selectLeaveType();
    await this.enterDates(data.from, data.to);
    await this.enterComment(data.comment);

    await this.assignLeave();
  }
}