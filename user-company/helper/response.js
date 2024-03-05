module.exports.response = (code, showMsg, resCode, resStatus, data, msg) => {
    let showMsgData;
    let resStatusData;
    showMsg === 1 ? (showMsgData = true) : (showMsgData = false);
    resStatus === 1 ? (resStatusData = "Success") : (resStatusData = "failure");
    return {
        statusCode: code,
        body: JSON.stringify({
            showMessage: showMsgData,
            responseCode: resCode,
            responseStatus: resStatusData,
            responseMessage: msg,
            response: data,
        }),
    };
};
