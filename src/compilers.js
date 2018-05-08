var jsUserFilePath = '/';
var javaUserFilePath = '/src/main/java/';
var rubyUserFilePath = '/';

var jsTestFilePath = '/';
var javaTestFilePath = '/src/test/java/';
var rubyTestFilePath = '/';

module.exports = [
  ['javascript', jsUserFilePath, 'mocha', '--reporter json' ,jsTestFilePath],
  ['java', javaUserFilePath, 'bash create_json_output.sh', '', javaTestFilePath],
  ['ruby', rubyUserFilePath, 'rspec', '--format j', rubyTestFilePath]
]
