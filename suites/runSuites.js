const { execSync } = require('child_process');
const path = require('path');
const { TestSuite } = require('./testSuite');

// Register suites with priority (lower number = runs first)
const suites = [
  new TestSuite('Login',  'login/login-all.spec.js', 1),
  new TestSuite('PIM',    'login/pim.spec.js',        2),
  new TestSuite('Admin', 'login/admin.spec.js', 3),
   new TestSuite('Leave', 'login/leave.spec.js', 4),
  new TestSuite('TimeSheet', 'login/timesheet.spec.js', 5),

  // Add more suites here:
  // new TestSuite('Admin', 'login/admin.spec.js', 3),
  // new TestSuite('Leave', 'login/leave.spec.js', 4),
];

// Sort by priority
const sorted = suites.sort((a, b) => a.priority - b.priority);

const rootDir = path.resolve(__dirname, '..');
const configPath = path.join(rootDir, 'login', 'playwright.config.js');

console.log('Running test suites in priority order:\n');

for (const suite of sorted) {
  console.log(`[Priority ${suite.priority}] Running: ${suite.name} (${suite.specFile})`);
  try {
    execSync(
      `npx playwright test ${suite.specFile} --config="${configPath}"`,
      { stdio: 'inherit', cwd: rootDir }
    );
    console.log(`✅ ${suite.name} suite passed\n`);
  } catch {
    console.error(`❌ ${suite.name} suite failed — stopping execution\n`);
    process.exit(1);
  }
}

console.log('All suites completed.');
