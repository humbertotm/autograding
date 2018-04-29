var jsUserFilePath = '/usercode.js';
var javaUserFilePath = '/src/main/java/Calculator.java';
var rubyUserFilePath = '/my_model.rb';

module.exports = [
  ['javascript', jsUserFilePath, 'mocha tests.js --reporter json'],
  ['java', javaUserFilePath, 'mvn test'],
  ['ruby', rubyUserFilePath, 'rspec my_model_spec.rb --format j']
]
