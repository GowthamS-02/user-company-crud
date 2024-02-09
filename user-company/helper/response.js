module.exports.response = (code, data, msg) => {
    let result = msg;
    if(data){
        result = JSON.stringify(data);
    }
    return {
        statusCode: code,
        body: result
    }
}
