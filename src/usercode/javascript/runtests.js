// var Mocha = require('mocha');
var Mocha = require('/usr/local/lib/node_modules/mocha');

var mocha = new Mocha({
  reporter: 'json'
});

var testFile = './usercode/tests.js';

// var testResults = {};

mocha.addFile(testFile);

mocha.run()
    .on('test', function(test) {
        // console.log('Test started: '+test.title);
    })
    .on('test end', function(test) {
        // console.log('Test done: '+test.title);
    })
    .on('pass', function(test) {
        // console.log('Test passed');
        // console.log(test);
        // testResults[test.title] = true;
    })
    .on('fail', function(test, err) {
        // console.log('Test fail');
        // console.log(test);
        // console.log(err);
        // testResults[test.title] = false;
    })
    .on('end', function() {
        // console.log('All done');
        // testResultsJSON = JSON.stringify(testResults);
        // console.log('testRes: ' + testResultsJSON);
    });
