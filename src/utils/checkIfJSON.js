module.exports = function(data) {
  var isJson = false;
  try {
    console.log('Checking if json');
    JSON.parse(data);
    isJson = true;
  } catch(e) {
    isJson = false;
  }
  return isJson;
}
