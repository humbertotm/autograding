module.exports = function(langId, testFileName) {
  var compCommand;

  if(langId == 1) {
    return compilersArr[1][2];
  }

  compCommand = compilersArr[langId][2] + ' ' + testFileName + ' ' + compilersArr[langId][3];
  return compCommand;
}
