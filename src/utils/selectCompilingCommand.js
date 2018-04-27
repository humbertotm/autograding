var compilersArr = require('../compilers.js');

module.exports = function(langId) {
  return compilersArr[langId][2];
}
