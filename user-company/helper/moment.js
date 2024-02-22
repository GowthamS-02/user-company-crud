const moment = require('moment');
let currentTime = moment.utc();

module.exports.date = () => {
    return currentTime.toString();
}

module.exports.displayDate = (obj) => {
    return moment(obj).format('D MMM YYYY h:mmA');
}