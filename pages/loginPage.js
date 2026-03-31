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

  async goto() {
    await this.page.goto(
      'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
      { timeout: 60000 }
    );
  }

  async login(user, pass) {
    await this.page.fill(this.username, user);
    await this.page.fill(this.password, pass);
    await this.page.click(this.loginBtn);
  }
}

module.exports = { LoginPage };