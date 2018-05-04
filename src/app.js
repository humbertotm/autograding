var buildResJSON = require('./utils/buildResJSON.js');
var checkIfJSON = require('./utils/checkIfJSON');
var buildWithNoJson = require('./utils/buildResJSONWithNoJSON.js');

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
var port = 3000;

// app.use(express.static(__dirname));
app.use(bodyParser());

app.post('/compile', upload.single('codefile'), function(req, res) {
  var langId = parseInt(req.body.langid);
  if(langId>=compilersArr.length){
    return res.status(400).send({error:"Requested langid is out of range"});
  }
  if(req.file==null){
    return res.status(400).send({error:"File not found in the request"});
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

    var fileName = req.file.originalname;
    var filePath = compilersArr[langId][1];
    // Write codefile to temp dir
    fs.writeFileSync(path.join(dest, filePath + fileName), req.file.buffer);
    // Get compiling command
    var compCommand = compilersArr[langId][2];
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
          console.log('stdOut: ' + stdOut);
          parsedOutput = JSON.parse(stdOut);
          resJSON = buildResJSON(parsedOutput, langId);
          res.status(200).json(resJSON);   
        }
      }
      catch(e){
        resJSON=stdOut;
        // Check if the stdOut is not in JSON format to handle the Java's and JS's errors
        if(checkIfJSON(stdOut)){
          parsedOutput = JSON.parse(stdOut);
          resJSON= buildResJSON(parsedOutput, langId);
          return res.status(400).json({error: "Source file code error",message:resJSON});
        }
        resJSON= buildWithNoJson(err.stack, langId);
        return res.status(500).send(resJSON);
      }
    });
  });
});

app.listen(port, function() {
  console.log("Listening on port " + port);
});
