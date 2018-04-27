// var mvFileToFolder = require('./utils/mvFileToFolder.js');
// var wrFileToFolder = require('./utils/wrFileToFolder.js');
// var selectCompilingCommand = require('./utils/selectCompilingCommand.js');
var compilersArr = require('./compilers.js');
var path = require('path');

var express = require('express');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var fs = require('fs');
var ncp = require('ncp');
var rimraf = require('rimraf');

var multer = require('multer');
var storage = multer.memoryStorage();
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, __dirname + '/usercode')
//   },
//   filename: function (req, file, cb) {
//     cb(null, 'usercode.js')
//   }
// });
var upload = multer({ storage: storage });

var app = express();
var port = 3000;

// app.use(express.static(__dirname));
app.use(bodyParser());

app.post('/compile', upload.single('codefile'), function(req, res) {
  var langId = parseInt(req.body.langid);
  var identifier = Math.floor(Math.random() * 1000000);
  // var codeFile = wrFileToFolder(langId, req.file.buffer);
  // console.log(codeFile);
  // mvFileToFolder(langId, 'usercode.js');

  // var st = selectCompilingCommand(langId);

  var langFolder = compilersArr[langId][0];
  var dirToCopy = path.join(__dirname, './usercode/' + langFolder);
  var dest = path.join(__dirname, './code_to_compile/' + identifier);

  // var copyDirSt = 'cp -R ' + dirToCopy + ' ' + dest;

  fs.mkdirSync(dest);

  ncp(dirToCopy, dest, function(err) {
    if(err) {
      throw Error(err);
    }
    fs.writeFileSync(path.join(dest, compilersArr[langId][3]), req.file.buffer);

    // var compSt = 'cd ' + dest + ' && ' + compilersArr[langId][4];
    compCommand = compilersArr[langId][4];
    var compSt = 'cd ' + dest + ' && ' + compCommand;

    exec(compSt, function(err, stdOut, stdErr) {
      rimraf.sync(dest);

      if(err) {
        console.log(err);
      } else if(stdErr) {
        console.log('stdErr: ' + stdErr);
        return res.send(200).json({
          error: stdErr
        });
      } else {
        console.log('stdOut: ' + stdOut);
        var parsedOutput = JSON.parse(stdOut);
        res.status(200).json(parsedOutput);
      }




        // var fileToRm = compilersArr[langId][1];
        // fs.unlink(codeFile, function(err) {
        //   if(err) {
        //     console.log(err);
        //   }
        //   res.status(200).json(parsedOutput);
        // });
    });
  });

  // execSync('mkdir ' + dest + ' && ' + copyDirSt);

  // fs.writeFileSync(path.join(dest, compilersArr[langId][3]), req.file.buffer);

      // var fileToRm = compilersArr[langId][1];
      // fs.unlink(codeFile, function(err) {
      //   if(err) {
      //     console.log(err);
      //   }
      //   res.status(200).json(parsedOutput);
      // });


  // exec(st, function(err, stdOut, stdErr) {
  //   if(err) {
  //     console.log('Some error occured.');
  //   } else if(stdErr) {
  //     console.log('stdErr: ' + stdErr);
  //   } else {
  //     console.log('stdOut: ' + stdOut);
  //   }
  //
  //   var parsedOutput = JSON.parse(stdOut);
  //
  //   // var fileToRm = compilersArr[langId][1];
  //   fs.unlink(codeFile, function(err) {
  //     if(err) {
  //       console.log(err);
  //     }
  //     res.status(200).json(parsedOutput);
  //   });
  // });

});

app.listen(port, function() {
  console.log("Listening on port " + port);
});
