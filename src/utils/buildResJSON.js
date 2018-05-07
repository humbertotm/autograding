function extractJsTestResults(testsArr, outcome) {
  var testOutcome;
  (outcome === 'pass') ? testOutcome = true : testOutcome = false;

  var newTestsArr = [];
  testsArr.forEach(function(test) {
    var testTitle = test['title'];
    var testObj = { [testTitle]: testOutcome }
    newTestsArr.push(testObj);
    // outputJSON[testTitle] = testOutcome;
  });

  return newTestsArr;
}

function jsJsonResBuilder(stdOutJSON) {
  // These are arrays.
  var resJSON = {
    tests: [],
    messages:[]
  }
  var passedTests = stdOutJSON.passes;
  var failedTests = stdOutJSON.failures;

  var passArr = extractJsTestResults(passedTests, 'pass');
  var failArr = extractJsTestResults(failedTests, 'fail');

  resJSON['tests'] = resJSON['tests'].concat(passArr, failArr);
  return resJSON;
}

function javaJsonResBuilder(stdOutJSON) {
  return stdOutJSON;
}

function rubyJsonResBuilder(stdOutJSON) {
  //Regex to replace the path of the file for server security
  const regex = /home([^\d]*)(\d*)([^\w]*)/;
  var resJSON = {
    tests: [],
    messages:[]
  };
  var testsArr = stdOutJSON['examples'];
  testsArr.forEach(function(test) {
    var outcome = (test['status'] === 'passed') ? true : false;
    var testTitle = test['full_description'];
    var testObj = {
      [testTitle]: outcome
    }
    resJSON['tests'].push(testObj);
  });
  if(stdOutJSON['messages']){
    var msgArray = stdOutJSON['messages'];
    msgArray.forEach(function(message) {
      arrLines=message.split("\n");
      arrLines.forEach(function(msg){
        var line=msg.replace(regex,"/xxxx/xxxx/");
        resJSON['messages'].push(line);
      });
    });
  }

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
