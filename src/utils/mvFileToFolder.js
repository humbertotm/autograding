var compilersArr = require('../compilers.js');
var fs = require('fs');
var path = require('path');

module.exports = function(langId, fileName) {
  var lang = compilersArr[langId][0];

  var source = path.join(__dirname, '../usercode/' + fileName);
  var dest = compilersArr[langId][1];

  fs.renameSync(source, dest);
}
