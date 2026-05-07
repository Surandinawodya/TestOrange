import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { TestSuite } from './testSuite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register suites with priority (lower number = runs first)
const suites = [
  new TestSuite('All Modules', 'login/all-modules.spec.js', 1),
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
  } catch (error) {
    console.error(`❌ ${suite.name} suite failed — continuing to next suite\n`);
    console.error(`Error details: ${error.message}\n`);
    // Continue to next suite instead of exiting
  }
}

console.log('All suites completed.');
