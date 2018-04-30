function jsJsonResBuilder(resJSON) {
  // var resJSON = {};
  // return resJSON;
}

function javaJsonResBuilder(resJSON) {
  // var resJSON = {};
  // return resJSON;
}

function rubyJsonResBuilder(resJSON) {
  // var resJSON = {};
  // return resJSON;
}

module.exports = function(resJSON, langId) {
  // This sucks. Apply a some design pattern.
  if(langId === 0) {
    return jsJsonResBuilder(resJSON);
  } else if (langId === 1) {
    return javaJsonResBuilder(resJSON);
  } else {
    return rubyJsonResBuilder(resJSON);
  }
}
