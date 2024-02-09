const database = require('../database.js');
const { response } = require('../helper/response.js');
const validateUser = require('../helper/validation.js');
const message = require('../helper/message.js');
const moment = require('moment');
let m = moment();


module.exports.createNewUser = async (event) => {
    try {
        if ((event.body) === null) {
            return response(400, " ", message.ENTER_DATA);
        }
        const inputData = JSON.parse(event.body);

        console.log(inputData);
        //validation
        const { error, value } = await validateUser(inputData);

        if (error) {
            console.log(error.message);
        }
        console.log(value);
        const models = await database();
        const { User } = models;

        let newUser = await User.create(value);
        return response(201, "", message.USER_CREATE);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};


module.exports.getAllUsers = async (event) => {
    const models = await database();
    const { User } = models;
    try {
        let userObj = await User.findAll({ attributes: [['username', 'Username'], ['email', 'userMail']], where: { is_deleted: 0 }, order: [['username', 'ASC']] });
        let msg = message.FOUND_DATA;
        if ((userObj.length) === 0) {
            msg = message.NO_DATA;
        }
        return response(201, userObj, msg);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};



module.exports.getCompany = async (event) => {
    const models = await database();
    const { User } = models;
    try {
        const { cmp_id } = event.pathParameters;
        const CmpId = await User.findOne({ where: { cmp_id, is_deleted: 0 } });
        let msg = message.FOUND_DATA;
        if (!CmpId) {
            msg = message.REQ_NOT_FOUND;
        }
        let userObj = await User.findAndCountAll({
            attributes: [['user_id', 'ID'], ['username', 'Username'], ['email', 'User-mail']],
            where: { cmp_id, is_deleted: 0 },
            limit: 4,
            offset: 0,
        });

        return response(201, userObj, msg);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};




module.exports.getSingleUser = async (event) => {
    const models = await database();
    const { User } = models;
    try {
        const { email } = event.pathParameters;
        let userObj = await User.findOne({ attributes: [['user_id', 'ID'], ['username', 'Username'], ['email', 'User-mail']], where: { email, is_deleted: 0 } });//
        let msg = message.FOUND_DATA;
        if (!userObj) {
            msg = message.REQ_NOT_FOUND;
        }
        return response(201, userObj, msg);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};


module.exports.updateUserData = async (event) => {
    const models = await database();
    const { User } = models;
    try {
        const { user_id } = event.pathParameters;
        const UserId = await User.findOne({ where: { user_id, is_deleted: 0 } });
        let msg = message.DATA_UPDATE;
        if (!UserId) {
            msg = message.REQ_NOT_FOUND;
        }

        const userObj = JSON.parse(event.body);
        console.log(userObj);
        let updateUser2 = await User.update(userObj, { where: { user_id } });
        let updateUser = await User.update({ updated_dt: m.format("L"), updated_ts: m.toISOString() }, { where: { user_id } });

        return response(201, "", msg);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};



module.exports.deleteUser = async (event) => {
    const models = await database();
    const { User } = models;
    try {
        const { user_id } = event.pathParameters;
        const UserId = await User.findOne({ where: { user_id, is_deleted: 0 } });
        let msg = message.DATA_DELETE;
        if (!UserId) {
            msg = message.REQ_NOT_FOUND;
        }

        let userObj = await User.update({ is_deleted: 1 }, { where: { user_id } });
        return response(201, "", msg);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};