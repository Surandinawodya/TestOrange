class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = 'input[name="username"]';
    this.password = 'input[name="password"]';
    this.loginBtn = 'button[type="submit"]';
    this.dashboardHeader = 'h6:has-text("Dashboard")';
    this.errorMsg = '.oxd-alert-content-text';
    this.requiredMsg = '.oxd-input-field-error-message';
  }

  async goto(retries = 3) {
    for (let i = 1; i <= retries; i++) {
      try {
        await this.page.goto(
          'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
          { waitUntil: 'domcontentloaded', timeout: 90000 }
        );
        await this.page.waitForSelector(this.username, { state: 'visible', timeout: 90000 });
        return;
      } catch (e) {
        if (i === retries) throw e;
        console.warn(`goto attempt ${i} failed, retrying in 5s...`);
        await this.page.waitForTimeout(5000);
      }
    }
  }

  async login(user, pass) {
    await this.page.fill(this.username, user);
    await this.page.fill(this.password, pass);
    await this.page.click(this.loginBtn);
  }

  async waitForDashboard() {
    await this.page.waitForSelector(this.dashboardHeader, { timeout: 90000 });
  }
}

module.exports = { LoginPage };