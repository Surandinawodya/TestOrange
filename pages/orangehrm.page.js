class OrangeHRMPage {
  constructor(page) {
    this.page = page;

  
    this.adminMenu = 'a[href*="admin"]';
    this.pimMenu = 'a[href*="pim"]';
    this.leaveMenu = 'a[href*="leave"]';

   
    this.addBtn = 'button:has-text("Add")';
    this.saveBtn = 'button:has-text("Save")';

    this.employeeHeader = 'h6:has-text("Add Employee")';

    this.applyBtn = 'button:has-text("Apply")';
    this.leaveDropdown = '.oxd-select-text';
    this.leaveTypeOption = 'div[role="option"] >> text=CAN - FMLA';
    this.leaveDateInput = 'input[placeholder="yyyy-mm-dd"]';
    this.applyLeaveBtn = 'button:has-text("Apply")';
  }
  async waitForLoader() {
    await this.page.waitForSelector('.oxd-form-loader', {
      state: 'hidden',
      timeout: 60000
    }).catch(() => {});
  }
  async addUser() {
    await this.page.click(this.adminMenu);
    await this.waitForLoader();
    await this.page.waitForSelector(this.addBtn, {
      state: 'visible',
      timeout: 60000
    });

    await this.page.click(this.addBtn);
    await this.page.waitForSelector('input[placeholder="Type for hints..."]');

    await this.page.fill('input[placeholder="Type for hints..."]', 'Paul');
    await this.page.waitForSelector('.oxd-autocomplete-dropdown');
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(9000);
  }
  async addEmployee(firstName, lastName) {
    await this.page.click(this.pimMenu);

    await this.waitForLoader();

    await this.page.waitForSelector(this.addBtn);
    await this.page.click(this.addBtn);

    await this.page.waitForSelector(this.employeeHeader);

    await this.page.fill('input[name="firstName"]', firstName);
    await this.page.fill('input[name="lastName"]', lastName);

    await this.page.click(this.saveBtn);
    await this.waitForLoader();
  }
  async applyLeave() {
    await this.page.click(this.leaveMenu);
    await this.page.click(this.applyBtn);
    await this.waitForLoader();

    const dropdown = this.page.locator(this.leaveDropdown).first();

    await dropdown.waitFor({ state: 'visible', timeout: 80000 });
    await dropdown.click({ force: true });
    await this.page.waitForSelector('div[role="option"]', {
      timeout: 80000
    });

    await this.page.locator(this.leaveTypeOption).click();

    await this.page.fill(this.leaveDateInput, '2026-04-10');

    await this.page.click(this.applyLeaveBtn);

    await this.waitForLoader();
  }
}

module.exports = { OrangeHRMPage };