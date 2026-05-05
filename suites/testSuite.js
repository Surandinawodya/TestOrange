class TestSuite {
  constructor(name, specFile, priority) {
    this.name = name;
    this.specFile = specFile;
    this.priority = priority;
  }
}

module.exports = { TestSuite };
