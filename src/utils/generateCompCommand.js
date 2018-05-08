var compilersArr = require('../compilers.js');

module.exports = function(langId, testFileName) {
  var compCommand;

  if(langId == 1) {
    return compilersArr[langId][2];
  }

  compCommand = compilersArr[langId][2] + ' ' + testFileName + ' ' + compilersArr[langId][3];
  return compCommand;
}
