const databaseWrite = require('../writeDatabase.js');
const databaseRead = require('../readDatabase.js');
const { response } = require('../helper/response.js');
const { userData, updateUserData, queryUserData } = require('../helper/validation.js');
const message = require('../helper/message.js');
const { date, displayDate } = require('../helper/moment.js');
const { noOfPage } = require('../helper/noOfPage.js');
const { Op } = require('sequelize');

module.exports.createUser = async (event) => {
    try {
        if ((event.body) === null) {
            return response(400, [], message.ENTER_DATA);
        }
        const inputData = JSON.parse(event.body);
        const { error, value } = await userData.validate(inputData);
        if (error) {
            console.log(error.message);
            return response(200, [], error.message)

        }
        const readModels = await databaseRead();
        let { User } = readModels;
        // await User.sync( {alter: true});
        const userEmail = inputData.email;
        const existUser = await User.findOne({ where: { email: userEmail, is_deleted: 0 } });
        if (existUser) {
            let responseMessage = message.EXIST_EMAIL;
            return response(200, [], responseMessage)
        }
        const writeModels = await databaseWrite();

        let currentDate = date();
        //inputData.added_at = date();
        value.added_at = currentDate;
        value.added_ts = currentDate;
        value.updated_dt = currentDate;
        value.updated_ts = currentDate;

        await writeModels.User.create(value);//inputData
        return response(201, [], message.USER_CREATE);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports.getAllUsers = async (event) => {
    try {
        const body = JSON.parse(event.body);
        if ((event.body) === null) {
            return response(400, [], message.ENTER_DATA);
        }
        let queryUser = { is_deleted: 0 };//for query in user table
        let queryCmp = { is_deleted: 0 };//for query in company table
        let queryTarget = { is_deleted: 0 }//new

        const { error, value } = await queryUserData.validate(body);
        if (error) {
            console.log(error.message);
            return response(200, [], error.message)
        }

        let page = body.page;
        let limit = body.limit;
        queryUser.cmp_id = body.cmp_id;
        if (body.date) {
            queryUser.added_at = body.date;
        }
        if (body.cmp_name) {
            queryCmp.name = { [Op.like]: '%' + body.cmp_name + '%' };
        }
        if (body.username) {
            queryUser.username = { [Op.like]: '%' + body.username + '%' };
        }

        const { User, Company, Target } = await databaseRead();
        let userObj = await User.findAll({
            attributes: [['username', 'user_name'], ['cmp_id', 'company_id'], ['email', 'user_mail'],
            ['added_ts', 'added_date'], ['updated_ts', 'last_updated']],
            where: queryUser,
            order: [['username', 'ASC']],
            include: [
                {model: Company, as: 'company',
                // where: queryCmp, 
                attributes: [['name', 'company_name'], ['email', 'company_mail']],},
                {model: Target, as: "salesAssociates",
                    // where: queryTarget,
                    attributes: [['assoc_team_name', 'team_name'],
                    ['assoc_target_mthly', 'monthly_target'], ['currency', 'currency']]},
            ],
            limit: limit,
            offset: limit * (page - 1)
        })

        if ((userObj.length) === 0) {
            let responseMessage = message.NO_DATA;
            return response(200, userObj, responseMessage);
        }

        userObj = userObj.map(user => {
            user = user.toJSON();
            user.added_date = displayDate(user.added_date);
            user.last_updated = displayDate(user.last_updated);
            return user;
        });

        let userCount = await User.count({
            where: queryUser
        });

        let responseData = {
            count: userCount,
            userDetails: userObj,
            currentPage: page,
        }
        return response(200, responseData, message.FOUND_DATA)
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports.getUser = async (event) => {
    try {
        const { user_id } = event.pathParameters;
        const readModels = await databaseRead();
        let { User } = readModels;
        let userObj = await User.findOne({
            attributes: [['username', 'user_name'], ['cmp_id', 'company_id'], ['email', 'user_mail'],
            ['added_ts', 'added_date'], ['updated_ts', 'last_updated']],
            where: { user_id, is_deleted: 0 }
        });
        let responseMessage = message.FOUND_DATA;
        if (!userObj) {
            responseMessage = message.REQ_NOT_FOUND;
            return response(200, userObj, responseMessage);
        }
        userObj = userObj.map(user => {
            user = user.toJSON();
            user.added_date = displayDate(user.added_date);
            user.last_updated = displayDate(user.last_updated);
            return user;
        });
        return response(200, userObj, responseMessage);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports.updateUser = async (event) => {
    try {
        const userObj = JSON.parse(event.body);
        const { error, value } = await updateUserData.validate(userObj);
        if (error) {
            console.log(error.message);
            return response(200, [], error.message)
        }
        const readModels = await databaseRead();
        let { User } = readModels;
        const { email } = event.pathParameters;
        const userEmail = await User.findOne({ where: { email, is_deleted: 0 } });
        let responseMessage;
        if (!userEmail) {
            responseMessage = message.REQ_NOT_FOUND;
            return response(200, [], responseMessage);
        }
        const writeModels = await databaseWrite();
        // User = writeModels.User;
        let currentDate = date();
        value.updated_dt = currentDate;
        value.updated_ts = currentDate;
        await writeModels.User.update(value, { where: { email, is_deleted: 0 } });
        responseMessage = message.DATA_UPDATE;
        return response(200, [], responseMessage);//201
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports.deleteUser = async (event) => {
    try {
        const readModels = await databaseRead();
        let { User } = readModels;
        const { user_id } = event.pathParameters;
        const userId = await User.findOne({ where: { user_id, is_deleted: 0 } });
        let responseMessage;
        if (!userId) {
            responseMessage = message.REQ_NOT_FOUND;
            return response(200, [], responseMessage);
        }
        const writeModels = await databaseWrite();
        let currentDate = date();
        await writeModels.User.update({ is_deleted: 1, updated_dt: currentDate, updated_ts: currentDate }, { where: { user_id, is_deleted: 0 } });
        responseMessage = message.DATA_DELETE;
        return response(200, [], responseMessage);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};