const CryptoJS = require('crypto-js');
require('dotenv').config();
module.exports.encrypt = (data) => {
    return CryptoJS.AES.encrypt(data.toString(), process.env.SECRET_KEY).toString();
}
module.exports.decrypt = (data) => {
    const bytes  = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return parseInt(plaintext);
}