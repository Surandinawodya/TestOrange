export class PimPage {
  constructor(page) {
    this.page = page;

    this.pimMenu = page.getByRole('link', { name: 'PIM' });

    this.employeeListHeader = page.locator('h5:has-text("Employee Information")');

    this.employeeName = page.locator('input[placeholder="Type for hints..."]').first();
    this.employeeId = page.locator('input[class*="oxd-input"]').nth(1);

    this.searchBtn = page.getByRole('button', { name: 'Search' });
    this.resetBtn = page.getByRole('button', { name: 'Reset' });
    this.addBtn = page.getByRole('button', { name: 'Add' });

    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
    this.noRecordsText = page.locator('.oxd-text--span:has-text("No Records Found")');

    this.addEmployeeHeader = page.locator('h6:has-text("Add Employee")');

    this.loader = page.locator('.oxd-form-loader');
  }

  async waitForLoader() {
    await this.loader.waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {});
  }

  async navigateToPIM() {
    await this.pimMenu.click();
    await this.waitForLoader();
    await this.employeeListHeader.waitFor({ state: 'visible' });
  }

  async searchEmployeeByName(name) {
    await this.employeeName.fill(name);
    await this.searchBtn.click();
    await this.waitForLoader();
    await Promise.race([
      this.tableRows.first().waitFor({ state: 'visible' }).catch(() => {}),
      this.noRecordsText.waitFor({ state: 'visible' }).catch(() => {})
    ]);
  }

  async resetSearch() {
    await this.resetBtn.click();
    await this.waitForLoader();
  }

  async clickAddEmployee() {
    await this.addBtn.click();
    await this.addEmployeeHeader.waitFor();
  }

  async getRowCount() {
    await this.waitForLoader();
    return await this.tableRows.count();
  }

  async isNoRecordsFound() {
    return await this.noRecordsText.isVisible().catch(() => false);
  }
}
