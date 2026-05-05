export class PimPage {
  constructor(page) {
    this.page = page;

    // Navigation
    this.pimMenu = page.getByRole('link', { name: 'PIM' });

    // Header
    this.employeeListHeader = page.getByRole('heading', { name: /Employee/i });

    // ✅ FIX: Target Employee Name field specifically
    this.employeeName = page
      .locator('label:has-text("Employee Name")')
      .locator('xpath=following::input[@placeholder="Type for hints..."][1]');

    // Buttons
    this.searchBtn = page.getByRole('button', { name: 'Search' });
    this.resetBtn = page.getByRole('button', { name: 'Reset' });
    this.addEmployeeBtn = page.getByRole('button', { name: 'Add' });

    // Table
    this.rows = page.locator('.oxd-table-card');
    this.noRecords = page.locator('text=No Records Found');

    // Loader
    this.loader = page.locator('.oxd-loading-spinner');
  }

  async waitForLoader() {
    await this.loader.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
  }

  async navigateToPIM() {
    await this.pimMenu.click();

    await this.page.waitForURL(/viewEmployeeList/, { timeout: 20000 });
    await this.waitForLoader();

    await this.employeeListHeader.first().waitFor({ state: 'visible' });
  }

  async searchEmployeeByName(name) {
    await this.employeeName.fill(name);
    await this.searchBtn.click();
    await this.waitForLoader();
  }

  async resetSearch() {
    await this.resetBtn.click();
    await this.waitForLoader();
  }

  async clickAddEmployee() {
    await this.addEmployeeBtn.click();
  }

  async getRowCount() {
    return await this.rows.count();
  }

  async isNoRecordsFound() {
    return await this.noRecords.isVisible().catch(() => false);
  }
}