const databaseWrite = require('../writeDatabase.js');
const databaseRead = require('../readDatabase.js');
const { response } = require('../helper/response.js');
const { userSchema, updateSchema } = require('../helper/validation.js');
const message = require('../helper/message.js');
const { noOfPage } = require('../helper/noOfPage.js');
const { date } = require('../helper/moment.js');


module.exports.createUser = async (event) => {
    try {
        if ((event.body) === null) {
            return response(400, [], message.ENTER_DATA);
        }
        const inputData = JSON.parse(event.body);
        const { error, value } = await userSchema.validate(inputData);
        if (error) {
            console.log(error.message);
            return error.message;
        }
        const readModels = await databaseRead();
        let User = readModels.User;
        // await User.sync( {alter: true});
        const userEmail = inputData.email;
        const existEmail = await User.findOne({ where: { email: userEmail, is_deleted: 0 } });
        if (existEmail) {
            let responseMessage = message.EXIST_EMAIL;
            return response(200, [], responseMessage)
        }
        const writeModels = await databaseWrite();
        User = writeModels.User;

        //inputData.added_at = date();
        value.added_at = date();
        value.added_ts = date();//utc
        value.updated_dt = date();
        value.updated_ts = date();

        await User.create(value);
        return response(201, [], message.USER_CREATE);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports.getAllUsers = async (event) => {
    const models = await databaseRead();
    const { User, Company } = models;
    try {
        // let body = event.queryStringParameters;
        const body = JSON.parse(event.body);
        let queryUser = { is_deleted: 0 };//for query in user table
        let queryCmp = { is_deleted: 0 };//for query in company table
        let page = 1;

        if (body !== null) {
            if (body.page > 0) {
                page = body.page
            }
            if (body.cmp_id) {
                queryUser.cmp_id = body.cmp_id;
            }
            if (body.date) {
                queryUser.added_at = body.date;
            }
            if (body.cmp_name) {
                queryCmp.name = body.cmp_name;
            }
            if (body.username) {
                queryUser.username = body.username;
            }
        }

        let userData = await User.findAll({
            attributes: [['username', 'User_name'], ['cmp_id', 'Company_ID'], ['email', 'User_mail']],
            where: queryUser,
            order: [['username', 'ASC']],
            include: {
                model: Company,
                where: queryCmp,
                attributes: [['name', 'Company_name'], ['email', 'Company_mail']],
            },
            limit: 4,
            offset: 4 * (page - 1)
        });
        if ((userData.length) === 0) {
            let responseMessage = message.NO_DATA;
            return response(200, userData, responseMessage);
        }
        let userCount = await User.count({
            where: queryUser,
            include: {
                model: Company,
                where: queryCmp
            }
        });
        if (page > (noOfPage(userCount))) {
            responseMessage = message.NO_PAGE;
            return response(200, [], responseMessage);
        }
        
        let responseData = {
            count: userCount,
            rows: userData,
            currentPage: page,
            noOfPages: noOfPage(userCount)
        }
        return response(200, responseData, message.FOUND_DATA)
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports.getUser = async (event) => {
    const readModels = await databaseRead();
    let User = readModels.User;
    try {
        const { user_id } = event.pathParameters;
        let userData = await User.findOne({
            attributes: [ ['username', 'User_name'], ['cmp_id', 'Company_ID'], ['email', 'User_mail']],
            where: { user_id, is_deleted: 0 }
        });
        let responseMessage = message.FOUND_DATA;//don't
        if (!userData) {
            responseMessage = message.REQ_NOT_FOUND;
        }
        // let userObj = { User: userData };
        return response(200, userData, responseMessage);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports.updateUser = async (event) => {
    try {
        const userData = JSON.parse(event.body);
        let responseMessage;
        if (userData.email) {
            responseMessage = message.DEFAULT_EMAIL;
            return response(200, [], responseMessage);
        }
        // console.log(userObj);
        const { error, value } = await updateSchema.validate(userData);
        if (error) {
            console.log(error.message);
            return error.message;
        }
        const readModels = await databaseRead();
        let User = readModels.User;
        const { user_id } = event.pathParameters;
        const userId = await User.findOne({ where: { user_id, is_deleted: 0 } });
        if (!userId) {
            responseMessage = message.REQ_NOT_FOUND;
            return response(200, [], responseMessage);
        }
        const writeModels = await databaseWrite();
        User = writeModels.User;
        value.updated_dt = date();
        value.updated_ts = date();
        await User.update(value, { where: { user_id } });
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
        let User = readModels.User;
        const { user_id } = event.pathParameters;
        const userId = await User.findOne({ where: { user_id, is_deleted: 0 } });
        let responseMessage;
        if (!userId) {
            responseMessage = message.REQ_NOT_FOUND;
            return response(200, [], responseMessage);
        }
        const writeModels = await databaseWrite();
        User = writeModels.User;
        await User.update({ is_deleted: 1, updated_dt: date(), updated_ts: date() }, { where: { user_id } });
        responseMessage = message.DATA_DELETE;
        return response(200, [], responseMessage);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};