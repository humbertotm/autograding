var fs = require('fs');
var compilersArr = require('../compilers.js');

module.exports = function(langId, buff) {
  var dirPath = compilersArr[langId][1]
  var filePath = dirPath + 'usercode_' + Math.floor(Math.random() * 1000000) + compilersArr[langId][3];

  fs.writeFile(filePath, buff, function(err) {
    if(err) {
      console.log("Error while writing code file");
    }
  });

  return filePath;
}
