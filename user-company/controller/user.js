const databaseWrite = require('../writeDatabase.js');
const databaseRead = require('../readDatabase.js');
const { response } = require('../helper/response.js');
const { validateUser, validateUpdate } = require('../helper/validation.js');
const message = require('../helper/message.js');
const { noOfPage } = require('../helper/noOfPage.js');
const moment = require('moment');
let m = moment();


module.exports.createUser = async (event) => {
    try {
        if ((event.body) === null) {
            return response(400, "", message.ENTER_DATA);
        }
        const inputData = JSON.parse(event.body);

        const { error, value } = await validateUser(inputData);
        if (error) {
            console.log(error.message);
            return error.message;
        }

        const readModels = await databaseRead();
        var { User, Company } = readModels;

        const userName = inputData.username;
        const existUser = await User.findOne({ where: { username: userName, is_deleted: 0 } });
        let reply;
        if (existUser) {
            reply = message.EXIST_USER;
            return response(201, "", reply)
        }

        const userEmail = inputData.email;
        const existEmail = await User.findOne({ where: { email: userEmail, is_deleted: 0 } });
        if (existEmail) {
            let reply = message.EXIST_EMAIL;
            return response(201, "", reply)
        }

        const cmpId = inputData.cmp_id;
        const existCmpId = await Company.findOne({ where: { cmp_id: cmpId, is_deleted: 0 } });
        if (!existCmpId) {
            let reply = message.CMP_NOT_FOUND;
            return response(201, "", reply)
        }

        const writeModels = await databaseWrite();
        var { User, Company } = writeModels;

        value.added_at = moment.toString();
        value.added_ts = moment.toString();//utc
        value.updated_dt = moment.toString();
        value.updated_ts = moment.toString();

        let newUser = await User.create(value);
        return response(201, "", message.USER_CREATE);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};


module.exports.getAllUsers = async (event) => {
    const models = await databaseRead();
    const { User } = models;
    try {
        let userObj = await User.findAll({ attributes: [['username', 'Username'], ['cmp_id', 'Company ID'], ['email', 'userMail']], where: { is_deleted: 0 }, order: [['username', 'ASC']] });
        let reply = message.FOUND_DATA;
        if ((userObj.length) === 0) {
            reply = message.NO_DATA;
        }
        return response(201, userObj, reply);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};


module.exports.getFilter = async (event) => {
    const models = await databaseRead();
    const { User } = models;
    try {
        // let { page, cmp_id, added_at } = event.queryStringParameters;
        let body = event.queryStringParameters;
        console.log(body);
        let reply;
        //If no query string
        if (body === null) {
            let userObj = await User.findAndCountAll({
                attributes: [['user_id', 'ID'], ['username', 'Username'], ['cmp_id', 'Company ID'], ['email', 'User-mail']],
                where: { is_deleted: 0 },
                order: [["added_ts", "ASC"]],
                // limit: 4,
                // offset: 4 * (page - 1),
            });
            return response(201, userObj, reply);
        }

        let pageNum = Number.parseInt(body.page);
        let cmpIdNum = Number.parseInt(body.cmp_id);
        let dateGiv = body.added_at;

        let page = 1;
        if (!Number.isNaN(pageNum) && pageNum > 0) {
            page = pageNum
        }

        if (cmpIdNum) {
            const CmpId = await User.findOne({ where: { cmp_id: cmpIdNum, is_deleted: 0 } });
            if (!CmpId) {
                reply = message.CMP_NOT_FOUND;
                return response(201, "", reply);
            }
        }

        if (dateGiv) {
            const fetchDate = await User.findOne({ where: { added_at: dateGiv, is_deleted: 0 } })
            if (!fetchDate) {
                reply = message.DATE_NOT_FOUND;
                return response(201, "", reply);
            }
        }

        let output = {
            data: "",
            No_of_pages: ""
        };

        //if both date and cmp ID given
        if (cmpIdNum && dateGiv) {
            let userObj = await User.findAndCountAll({
                attributes: [['user_id', 'ID'], ['username', 'Username'], ['cmp_id', 'Company ID'], ['email', 'User-mail']],
                where: { cmp_id: cmpIdNum, added_at: dateGiv, is_deleted: 0 },
                order: [["added_ts", "ASC"]],
                limit: 4,
                offset: 4 * (page - 1),
            });

            // let noOfPage = Math.ceil(userObj.count / 4);
            output = {
                data: userObj,
                No_of_pages: noOfPage(userObj)
            };
            console.log("Both cmp and date");
        }

        //if only compay ID given
        else if (cmpIdNum) {
            let userObj = await User.findAndCountAll({
                attributes: [['user_id', 'ID'], ['username', 'Username'], ['cmp_id', 'Company ID'], ['email', 'User-mail']],
                where: { cmp_id: cmpIdNum, is_deleted: 0 },
                order: [["added_ts", "ASC"]],
                limit: 4,
                offset: 4 * (page - 1),
            });

            output = {
                data: userObj,
                No_of_pages: noOfPage(userObj)
            };
            console.log("only cmp");
        }

        //if only date given
        else if (dateGiv) {
            let userObj = await User.findAndCountAll({
                attributes: [['user_id', 'ID'], ['username', 'Username'], ['cmp_id', 'Company ID'], ['email', 'User-mail']],
                where: { added_at: dateGiv, is_deleted: 0 },
                order: [["added_ts", "ASC"]],
                limit: 4,
                offset: 4 * (page - 1),
            });

            output = {
                data: userObj,
                No_of_pages: noOfPage(userObj)
            };
            console.log("only date");
        }

        return {
            statusCode: 201,
            body: JSON.stringify(output)
        };
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};


module.exports.getUser = async (event) => {
    const models = await databaseRead();
    const { User } = models;
    try {
        const { user_id } = event.pathParameters;
        let userObj = await User.findOne({ attributes: [['user_id', 'ID'], ['username', 'Username'], ['cmp_id', 'Company ID'], ['email', 'User-mail']], where: { user_id, is_deleted: 0 } });//
        let reply = message.FOUND_DATA;
        if (!userObj) {
            reply = message.REQ_NOT_FOUND;
        }
        return response(201, userObj, reply);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};


module.exports.updateUser = async (event) => {
    try {
        const userObj = JSON.parse(event.body);
        const { error, value } = await validateUpdate(userObj);
        if (error) {
            console.log(error.message);
            return error.message;
        }
        let reply;
        if (userObj.email) {
            reply = message.DEFAULT_USER;
            return response(201, "", reply);
        }

        const readModels = await databaseRead();
        var { User } = readModels;
        const { user_id } = event.pathParameters;
        const UserId = await User.findOne({ where: { user_id, is_deleted: 0 } });

        if (!UserId) {
            reply = message.REQ_NOT_FOUND;
            return response(201, "", reply);
        }

        const writeModels = await databaseWrite();
        var { User } = writeModels;
        value.updated_dt = moment.toString();
        value.updated_ts = moment.toString();
        await User.update(userObj, { where: { user_id } });
        reply = message.DATA_UPDATE;
        return response(201, "", reply);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};


module.exports.deleteUser = async (event) => {
    try {
        const readModels = await databaseRead();
        var { User } = readModels;
        const { user_id } = event.pathParameters;
        const UserId = await User.findOne({ where: { user_id, is_deleted: 0 } });
        let reply;
        if (!UserId) {
            reply = message.REQ_NOT_FOUND;
            return response(201, "", reply);
        }

        const writeModels = await databaseWrite();
        var { User } = writeModels;
        await User.update({ is_deleted: 1, updated_dt: moment.toString(), updated_ts: moment.toString() }, { where: { user_id } });
        reply = message.DATA_DELETE;
        return response(201, "", reply);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};