var jsUserFilePath = '/';
var javaUserFilePath = '/src/main/java/';
var rubyUserFilePath = '/';

module.exports = [
  ['javascript', jsUserFilePath, 'mocha tests.js --reporter json'],
  ['java', javaUserFilePath, 'mvn test'],
  ['ruby', rubyUserFilePath, 'rspec my_model_spec.rb --format j']
]
