'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

// Run tests for each available framework
['Ace', 'CoreMirror', 'Orion'].forEach(webFramework => {
  describe(`generator-xtext with ${webFramework}`, () => {
    beforeAll(() => {
      return helpers.run(path.join(__dirname, '../generators/app'))
        .withPrompts({
          projectName: 'com.example.somedsl',
          fqLanguageName: 'com.example.SomeDsl',
          fileExtension: 'somedsl',
          facets: ['ide', 'web'],
          webFramework: webFramework
        })
        .on('ready', generator => {
          Object.getPrototypeOf(generator).install = () => {}; // skip Gradle execution
        });
    });

    it('build.gradle is generated for the ide project', () => {
      assert.file('com.example.somedsl.ide/build.gradle');
    });

    it('build.gradle is generated for the web project', () => {
      assert.file('com.example.somedsl.web/build.gradle');
    });

    it('MWE2 workflow contains proper web framework', () => {
      const mwe2File = 'com.example.somedsl/src/main/java/com/example/GenerateSomeDsl.mwe2';
      assert.fileContent(mwe2File, new RegExp(`[\\s\\S]*webSupport = {\\s+framework = "${webFramework}"\\s+}[\\s\\S]*`));
    });
  });
});
