module.exports.noOfPage = (user) => {
    return Math.ceil(user.count / 4);
};