const databaseRead = require("../readDatabase.js");
const { response } = require("./response.js");
const { smsNotification } = require("./smsNotification.js");
const { emailNotification } = require("./emailNotification.js");
const { validNotification } = require("./validation.js");
const { decrypt } = require("./encrdecr.js");

module.exports.userNotification = async (event) => {
    try {
        if (event.body === null) {
            return response(400, 1, 0, 0, [], message.ENTER_DATA);
        }
        const inputData = JSON.parse(event.body);
        const { error, value } = await validNotification.validate(inputData);
        if (error) {
            console.log(error.message);
            return response(400, 1, 0, 0, [], error.message);
        }
        const readModels = await databaseRead();
        let { User } = readModels;
        let queryUser = { cmp_id: inputData.cmp_id, is_deleted: 0 };
        if (inputData.user_id) {
            queryUser.user_id = decrypt(inputData.user_id);
            // queryUser.user_id = inputData.user_id;
        }
        let page = inputData.page;
        let limit = inputData.limit;
        let userObj = await User.findAll({
            attributes: [
                ["user_id", "userId"],
                ["username", "user_name"],
                ["cmp_id", "company_id"],
                ["email", "user_mail"],
                ["user_phone", "ph_number"],
            ],
            where: queryUser,
            limit: limit,
            offset: limit * (page - 1),
        });
        // userObj = userObj.map((user) => {
        //     user = user.toJSON();
        //     user.message = inputData.message;
        //     return user;
        // });
        let mailAddress;
        const emailAddress = userObj.map((user) => {
            user = user.toJSON();
            mailAddress = user.user_mail;
            return mailAddress;
        });
        let userPhone;
        const phoneNumber = userObj.map((user) => {
            user = user.toJSON();
            userPhone = user.ph_number;
            return userPhone;
        });
        let userCount = await User.count({
            where: queryUser,
        });
        let responseData = {
            count: userCount,
            userDetails: userObj,
            currentPage: page,
        };
        await emailNotification(emailAddress, inputData.message);
        await smsNotification(phoneNumber, inputData.message);
        return response(200, 1, 1, 1, responseData, "Data Found");
    } catch (error) {
        console.log(error);
        throw error;
    }
};
