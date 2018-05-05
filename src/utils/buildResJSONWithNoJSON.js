//Regex to replace the path of the file for security
const regex = /home([^\d]*)(\d*)([^\w]*)/;
function jsJsonResBuilder(stdOutJSON) {
    var resJSON = {
      tests: [],
      messages:[]
    }
    var stringOutput=JSON.stringify(stdOutJSON).replace(regex,"xxxx/xxxx/");
    var lines=stringOutput.split("\\n");
    console.log(lines);
    var parsed=JSON.parse(lines);
    resJSON.messages.push(parsed);
    return resJSON;
  }
  
  function javaJsonResBuilder(stdOutJSON) {
    var resJSON = {
        tests: [],
        messages:[]
      }
    var stringOutput=JSON.stringify(stdOutJSON).replace(regex,"xxxx/xxxx/");
    var lines=stringOutput.split("\\n");
    resJSON.messages.push(lines);
    return resJSON;
  }


module.exports = function(resJSON, langId) {
    if(langId === 0) {
      console.log('Building js response...');
      return jsJsonResBuilder(resJSON);
    } else if (langId === 1) {
      console.log('Building java response...');
      return javaJsonResBuilder(resJSON);
    }
  }
  