var buildResJSON = require('./utils/buildResJSON.js');
var checkIfJSON = require('./utils/checkIfJSON');
var buildWithNoJson = require('./utils/buildResJSONWithNoJSON.js');
var generateCompCommand = require('./utils/generateCompCommand.js');

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

var upload = multer({ storage: storage });

var app = express();
var port = 4000;

// app.use(express.static(__dirname));
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/compile', upload.fields([{
  name: 'codefile', maxCount: 1 }, {
  name: 'testfile', maxCount: 1
}]), function(req, res) {
  var langId = parseInt(req.body.langid);
  console.log('Language id: ' + langId);

  if(langId>=compilersArr.length){
    return res.status(400).send({error:"langid requested is out of range"});
  }

  if(req.files==null || !(req.files['codefile'] && req.files['testfile'])){
    return res.status(400).send({error:"Required files are not in the request."});
  }

  var identifier = Math.floor(Math.random() * 1000000);
  var langFolder = compilersArr[langId][0];
  var dirToCopy = path.join(__dirname, './usercode/' + langFolder);
  var dest = path.join(__dirname, './code_to_compile/' + identifier);

  // Create temp directory
  fs.mkdirSync(dest);

  // Copy contents to temp directory
  ncp(dirToCopy, dest, function(err) {
    if(err) {
      throw Error(err);
    }

    var codeFile = req.files['codefile'][0];
    var codeFileName = codeFile.originalname;
    console.log('Code filename: ' + codeFileName);
    var filePath = compilersArr[langId][1];

    var testFile = req.files['testfile'][0];
    var testFileName = testFile.originalname;
    console.log('Test filename: ' + testFileName);
    var testFilePath = compilersArr[langId][4];

    // Write codefile to temp dir
    fs.writeFileSync(path.join(dest, filePath + codeFileName), codeFile.buffer);
    // Write testfile to temp dir
    fs.writeFileSync(path.join(dest, testFilePath + testFileName), testFile.buffer);

    // Get compiling command
    var compCommand = generateCompCommand(langId, testFileName);
    // var compCommand = compilersArr[langId][2];
    // Build statement to be executed
    var compSt = 'cd ' + dest + ' && ' + compCommand;

    exec(compSt, function(err, stdOut, stdErr) {
      var parsedOutputparsedOutput;
      var resJSON;
      // Remove temp dir
      rimraf.sync(dest);
      try{
        if(err) {
          throw Error(err);
        } else if(stdErr) {
          console.log('stdErr: ' + stdErr);
          // What would be a more appropriate http status?
          return res.send(500).json({
            error: stdErr
          });
        } else {
            if(checkIfJSON(stdOut)){
              parsedOutput = JSON.parse(stdOut);
              resJSON = buildResJSON(parsedOutput, langId);
              res.status(200).json(resJSON);
            }else res.status(400).json((stdOut.length==0)?"Your code cannot be tested, some methods not found":stdOut);
        }
      }
      catch(e){
        resJSON= buildWithNoJson(err.stack, langId);
        return res.status(400).send(resJSON);
      }
    });
  });
});

app.listen(port, function() {
  console.log("Listening on port " + port);
});
