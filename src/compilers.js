var path = require('path');

var jsImage = 'humbertotm/javascript_compiler';
var javaImage = 'eso31/junitimage';
var rubyImage = 'jxjxjxm/rubyimage';

var jsVolume = path.join(__dirname, './usercode/javascript');
var javaVolume = path.join(__dirname, './usercode/java');
var rubyVolume = path.join(__dirname, './usercode/ruby');

var jsPath = path.join(__dirname, './usercode/javascript/usercode.js');
var javaPath = path.join(__dirname, './usercode/java/src/main/java/Calculator.java');
var rubyPath = path.join(__dirname, './usercode/ruby/app/src/my_model.rb');

var jsCompile = 'docker run --rm -v ' + jsVolume + ':/usercode ' + jsImage + ' node /usercode/runtests.js';
var javaCompile = 'docker run --rm -v ' + javaVolume + ':/sourcecode ' + javaImage;
var rubyCompile = 'docker run --rm -v ' + rubyVolume + ':/code ' + rubyImage;

var jsUserFilePath = '/usercode.js';
var javaUserFilePath = '/src/main/java/Calculator.java';
var rubyUserFilePath = '/my_model.rb';

module.exports = [
  ['javascript', jsPath,  jsCompile, jsUserFilePath, 'node runtests.js'],
  ['java', javaPath, javaCompile, javaUserFilePath, 'mvn test'],
  ['ruby', rubyPath, rubyCompile, rubyUserFilePath, 'rpsec my_model_spec.rb --format j']
]

var compileJS = 'node runtests.js';
var compileJava = 'mvn test';
var compileRuby = 'rpsec my_model_spec.rb --format j';
