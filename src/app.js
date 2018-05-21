var buildResJSON = require('./utils/buildResJSON.js');
var checkIfJSON = require('./utils/checkIfJSON');
var buildWithNoJson = require('./utils/buildResJSONWithNoJSON.js');
var generateCompCommand = require('./utils/generateCompCommand.js');

var compilersArr = require('./compilers.js');
var path = require('path');

var express = require('express');
var bodyParser = require('body-parser');
var spawn = require('child_process').spawn;
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
  var langId;
  var identifier;
  var langFolder;
  var dirToCopy;
  var dest;
  var codefile;
  var codeFileName;
  var filePath;
  var testFile;
  var testFileName;
  var testFilePath;
  var compCommand;
  var compSt;


  langId = parseInt(req.body.langid);
  console.log('Language id: ' + langId);

  if(langId>=compilersArr.length){
    return res.status(400).json({ error: "No current support for that language." });
  }

  if(req.files==null || !(req.files['codefile'] && req.files['testfile'])){
    return res.status(400).json({ error: "Required files are not in the request." });
  }

  identifier = Math.floor(Math.random() * 1000000);
  langFolder = compilersArr[langId][0];
  dirToCopy = path.join(__dirname, './usercode/' + langFolder);
  dest = path.join(__dirname, './code_to_compile/' + identifier);

  // Create temp directory
  fs.mkdirSync(dest);

  // Copy contents to temp directory
  ncp(dirToCopy, dest, function(err) {
    if(err) {
      throw Error(err);
    }

    codeFile = req.files['codefile'][0];
    codeFileName = codeFile.originalname;
    console.log('Code filename: ' + codeFileName);
    filePath = compilersArr[langId][1];

    testFile = req.files['testfile'][0];
    testFileName = testFile.originalname;
    console.log('Test filename: ' + testFileName);
    testFilePath = compilersArr[langId][4];

    // Write codefile to temp dir
    fs.writeFileSync(path.join(dest, filePath + codeFileName), codeFile.buffer);
    // Write testfile to temp dir
    fs.writeFileSync(path.join(dest, testFilePath + testFileName), testFile.buffer);

    // Get compiling command
    compCommand = generateCompCommand(langId, testFileName);
    // var compCommand = compilersArr[langId][2];
    // Build statement to be executed
    compSt = 'cd ' + dest + ' && ' + compCommand;
    console.log(compSt);

    var compile = spawn(compSt, {
      shell: true
    });

    var resToBeSent = {
      resJSON: {},
      error: '',
      status: 200
    };

    compile.stdout.on('data', function(data) {
      var parsedOutput;
      // console.log('stdOut: ' + data);

      if(checkIfJSON(data)) {
        console.log('Inside json true block');
        parsedOutput = JSON.parse(data);
        resJSON = buildResJSON(parsedOutput, langId);
        resToBeSent['resJSON'] = resJSON;
        resToBeSent['status'] = 200;
      } else {
        console.log('Inside not json blocl');
        resToBeSent['error'] = 'Your code could not be compiled.';
        resToBeSent['status'] = 400;
      }
    });

    compile.stderr.on('data', function(data) {
      // console.log('stdErr: ' + data);

      resToBeSent['error'] = 'Your code could not be compiled.';
      resToBeSent['status'] = 400;
    });

    compile.on('exit', function() {
      clearTimeout(to);
      console.log('Child process exited.');
      console.log('Sending response...');
      rimraf.sync(dest);

      if(resToBeSent['status'] == 200) {
        res.status(200).json(resToBeSent['resJSON']);
      } else {
        res.status(400).json({ error: resToBeSent['error'] });
      }
    });

    var to = setTimeout(function() {
      console.log("Killing the long lived child!");
      compile.kill();
      resToBeSent['error'] = 'Your code took too long to compile.';
      resToBeSent['status'] = 400;
    }, 70000);

  });
});

app.listen(port, function() {
  console.log("Listening on port " + port);
});
