const currentTime = require('moment');
let moment = currentTime.utc();

module.exports.date = () =>{
    return moment.toString();
} 