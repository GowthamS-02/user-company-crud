module.exports.response = (code, data, msg) => {

    let output = {
        showMessage: true,
        responseCode: 1,
        responseStatus: "Success",
        responseMessage: msg,
        response: data
    };
    return {
        statusCode: code,
        body: JSON.stringify(output)
    }
}
