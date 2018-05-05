module.exports=function (data)
{
    var isJson = false;
    try
    {
        var json = JSON.parse(data);
        isJson = (typeof(json) === 'object');
    }
    catch (ex) {}
    return isJson;
}