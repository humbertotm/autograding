function extractTestResults(testsArr, outcome) {
  var testOutcome;
  (outcome === 'pass') ? testOutcome = true : testOutcome = false;

  var outputJSON = {};
  testsArr.forEach(function(test) {
    var testTitle = test['title'];
    outputJSON[testTitle] = testOutcome;
  });

  return outputJSON;
}

function jsJsonResBuilder(stdOutJSON) {
  // These are arrays.
  var passedTests = stdOutJSON.passes;
  var failedTests = stdOutJSON.failures;

  var passObj = extractTestResults(passedTests, 'pass');
  var failObj = extractTestResults(failedTests, 'fail');

  var resJSON = Object.assign(passObj, failObj);
  return resJSON;
}

function javaJsonResBuilder(resJSON) {
  // var resJSON = {};
  // return resJSON;
}

function rubyJsonResBuilder(stdOutJSON) {
  var resJSON = {};
  // return resJSON;
  var testsArr = stdOutJSON['examples'];
  testsArr.forEach(function(test) {
    var outcome = (test['status'] === 'passed') ? true : false;
    var testTitle = test['full_description'];
    resJSON[testTitle] = outcome;
  });

  return resJSON;
}

module.exports = function(resJSON, langId) {
  // This sucks. Apply a some design pattern.
  if(langId === 0) {
    console.log('Building js response...');
    return jsJsonResBuilder(resJSON);
  } else if (langId === 1) {
    return javaJsonResBuilder(resJSON);
  } else {
    console.log('Building ruby response');
    return rubyJsonResBuilder(resJSON);
  }
}
