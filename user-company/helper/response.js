module.exports.response = (code, showMsg, resCode, resStatus, data, msg) => {
let showMsgData;
let resStatusData;
    if(showMsg === 1){
        showMsgData = true;
    }else if(showMsg === 0){
        showMsgData = false;
    }

    if(resStatus === 1){
        resStatusData = "Success"
    }else if (resStatus === 0){
        resStatusData = "failure"
    }


    let output = {
        showMessage: showMsgData,
        responseCode: resCode,
        responseStatus: resStatusData,
        responseMessage: msg,
        response: data
    };
    return {
        statusCode: code,
        body: JSON.stringify(output)
    }
}
