export class TimesheetPage {
  constructor(page) {
    this.page = page;

    this.employeeInput = page.locator('input[placeholder="Type for hints..."]').first();
    this.searchBtn = page.locator('button:has-text("Search")');
    this.resetBtn = page.locator('button:has-text("Reset")');

    this.rows = page.locator('.oxd-table-card');
    this.noRecords = page.locator('text=No Records Found');
  }

  async navigate() {
    await this.page.goto(
      'https://opensource-demo.orangehrmlive.com/web/index.php/time/viewEmployeeTimesheet',
      { waitUntil: 'load', timeout: 70000 }
    );

    await this.employeeInput.waitFor({ state: 'visible', timeout: 30000 });
  }

  async searchEmployee(name) {
    await this.employeeInput.fill(name);

   
    await this.page.keyboard.press('Escape');

    await this.searchBtn.click();

    await this.waitForResults();
  }

  async resetSearch() {
    await this.resetBtn.click();

    await this.page.waitForFunction(
      el => el.value === '',
      this.employeeInput
    );
  }

  async waitForResults() {
    await this.page.waitForFunction(() => {
      const rows = document.querySelectorAll('.oxd-table-card').length;
      const noData = document.body.innerText.includes('No Records Found');
      return rows > 0 || noData;
    }, { timeout: 30000 });
  }

  async hasResults() {
    const count = await this.rows.count();
    const noData = await this.noRecords.isVisible().catch(() => false);

    return count > 0 || noData;
  }
}