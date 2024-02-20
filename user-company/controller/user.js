const databaseWrite = require('../writeDatabase.js');
const databaseRead = require('../readDatabase.js');
const { response } = require('../helper/response.js');
const { userData, updateUserData, queryDataValues } = require('../helper/validation.js');
const message = require('../helper/message.js');
// const { noOfPage } = require('../helper/noOfPage.js');
const { date } = require('../helper/moment.js');
const moment = require('moment');
const {Op} = require('sequelize');
// const Op = Sequelize.Op;

module.exports.createUser = async (event) => {
    try {
        if ((event.body) === null) {
            return response(400, [], message.ENTER_DATA);
        }
        const inputData = JSON.parse(event.body);
        const { error, value } = await userData.validate(inputData);
        if (error) {
            console.log(error.message);
            return error.message;
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
        User = writeModels.User;
        let currentDate = date();
        //inputData.added_at = date();
        value.added_at = currentDate;
        value.added_ts = currentDate;//utc
        value.updated_dt = currentDate;
        value.updated_ts = currentDate;

        await User.create(value);//inputData
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


        const { error, value } = await queryDataValues.validate(body);
        if (error) {
            console.log(error.message);
            return error.message;
        }

        let page = body.page;
        let limit = body.limit;
        // queryUser.cmp_id = body.cmp_id;
        if (body.cmp_id) {
            queryUser.cmp_id = body.cmp_id;
        }
        if (body.date) {
            queryUser.added_at = body.date;
        }
        if (body.cmp_name) {
            queryCmp.name = { [Op.like]: '%' + body.cmp_name + '%' };
        }
        if (body.username) {
            queryUser.username = { [Op.like]: '%' + body.username + '%' };
        }

        // const models = await databaseRead();
        // const { User, Company } = models;
        const { User, Company } = await databaseRead();
        let userObj = await User.findAll({
            attributes: [['username', 'User_name'], ['cmp_id', 'Company_ID'], ['email', 'User_mail'],
            ['added_ts', 'Added_date'], ['updated_ts', 'Last_updated']],
            // [ moment('added_ts').format('D MMM YYYY h:mmA'), 'Added_date']],
            where: queryUser,
            order: [['username', 'ASC']],
            include: {
                model: Company,
                where: queryCmp,
                attributes: [['name', 'Company_name'], ['email', 'Company_mail']],
            },
            limit: limit,
            offset: limit * (page - 1)
        })
        // .map((user) =>{
        //     user.Added_date = moment(user.Added_date).format('D MMM YYYY h:mmA');
        //     return user
        // });
        // userData.Added_date = moment(userData.Added_date).format('D MMM YYYY h:mmA');

        userObj = userObj.map(user => {
            user = user.toJSON();
            user.Added_date = moment(user.Added_date).format('D MMM YYYY h:mmA');
            user.Last_updated = moment(user.Last_updated).format('D MMM YYYY h:mmA');
            return user;
        });

        if ((userObj.length) === 0) {
            let responseMessage = message.NO_DATA;
            return response(200, userObj, responseMessage);
        }
        let userCount = await User.count({
            where: queryUser,
            include: {
                model: Company,
                where: queryCmp
            }
        });
        // if (page > (noOfPage(userCount))) {
        //     responseMessage = message.NO_PAGE;
        //     return response(200, [], responseMessage);
        // }

        let responseData = {
            count: userCount,
            rows: userObj,
            currentPage: page,
            // noOfPages: noOfPage(userCount)
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
    let { User } = readModels;
    try {
        const { user_id } = event.pathParameters;
        let userObj = await User.findOne({
            attributes: [['username', 'User_name'], ['cmp_id', 'Company_ID'], ['email', 'User_mail'],
            ['added_ts', 'Added_date'], ['updated_ts', 'Last_updated']],
            where: { user_id, is_deleted: 0 }
        });
        let responseMessage = message.FOUND_DATA;
        if (!userObj) {
            responseMessage = message.REQ_NOT_FOUND;
        }
        userObj = userObj.map(user => {
            user = user.toJSON();
            user.Added_date = moment(user.Added_date).format('D MMM YYYY h:mmA');
            user.Last_updated = moment(user.Last_updated).format('D MMM YYYY h:mmA');
            return user;
        });
        // let userObj = { User: userData };
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
            return error.message;
        }
        const readModels = await databaseRead();
        let { User } = readModels;
        const { email } = event.pathParameters;//email
        const userEmail = await User.findOne({ where: { email, is_deleted: 0 } });
        let responseMessage;
        if (!userEmail) {
            responseMessage = message.REQ_NOT_FOUND;
            return response(200, [], responseMessage);
        }
        const writeModels = await databaseWrite();
        User = writeModels.User;
        let currentDate = date();
        value.updated_dt = currentDate;
        value.updated_ts = currentDate;
        await User.update(value, { where: { email, is_deleted: 0 } });
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
        User = writeModels.User;
        let currentDate = date();
        await User.update({ is_deleted: 1, updated_dt: currentDate, updated_ts: currentDate }, { where: { user_id } });
        responseMessage = message.DATA_DELETE;
        return response(200, [], responseMessage);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};