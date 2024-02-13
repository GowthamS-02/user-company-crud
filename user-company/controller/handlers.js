const databaseWrite = require('../writeDatabase.js');
const databaseRead = require('../readDatabase.js');
const { response } = require('../helper/response.js');
const {validateUser} = require('../helper/validation.js');
const message = require('../helper/message.js');
const { noOfPage } = require('../helper/noOfPage.js');
const moment = require('moment');
let m = moment();


module.exports.createNewUser = async (event) => {
    try {
        if ((event.body) === null) {
            return response(400, "", message.ENTER_DATA);
        }
        const inputData = JSON.parse(event.body);

        const models = await databaseWrite();
        const { User, Company } = models;

        const userName = inputData.username;
        const existUser = await User.findOne({ where: { username: userName, is_deleted: 0 } });
        let msg = "This username is already exist. Please enter another another username";
        if (existUser) {
            return response(201, "", msg)
        }

        const userEmail = inputData.email;
        const existEmail = await User.findOne({ where: { email: userEmail, is_deleted: 0 } });
        if (existEmail) {
            let msg = "This user email is already exist. Please enter another email address";
            return response(201, "", msg)
        }

        const cmpId = inputData.cmp_id;
        const existCmpId = await Company.findOne({ where: {cmp_id: cmpId, is_deleted: 0}});
        if (!existCmpId) {
            let msg = "There is no company available as given";
            return response(201, "", msg)
        }
        //validation
        const { error, value } = await validateUser(inputData);
        if (error) {
            console.log(error.message);
            return error.message;
        }

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
    const { User, Company } = models;
    try {
        let userObj = await User.findAll({ attributes: [['username', 'Username'], ['cmp_id', 'Company ID'], ['email', 'userMail']], where: { is_deleted: 0 }, order: [['username', 'ASC']] });
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


module.exports.getFilter = async (event) => {
    const models = await databaseRead();
    const { User, Company } = models;
    try {
        // let { page, cmp_id, added_at } = event.queryStringParameters;
        let body = event.queryStringParameters;
        console.log(body);
        let msg;
        //If no query string
        if (body === null) {
            let userObj = await User.findAndCountAll({
                attributes: [['user_id', 'ID'], ['username', 'Username'], ['cmp_id', 'Company ID'], ['email', 'User-mail']],
                where: { is_deleted: 0 },
                order: [["added_ts", "ASC"]],
                // limit: 4,
                // offset: 4 * (page - 1),
            });
            return response(201, userObj, msg);
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
                msg = message.CMP_NOT_FOUND;
                return response(201, "", msg);
            }
        }

        if (dateGiv) {
            const fetchDate = await User.findOne({ where: { added_at: dateGiv, is_deleted: 0 } })
            if (!fetchDate) {
                msg = message.DATE_NOT_FOUND;
                return response(201, "", msg);
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


module.exports.getSingleUser = async (event) => {
    const models = await databaseRead();
    const { User, Company } = models;
    try {
        const { user_id } = event.pathParameters;
        let userObj = await User.findOne({ attributes: [['user_id', 'ID'], ['username', 'Username'], ['cmp_id', 'Company ID'], ['email', 'User-mail']], where: { user_id, is_deleted: 0 } });//
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
    try {
        const models1 = await databaseRead();
        var { User, Company } = models1;
        const { user_id } = event.pathParameters;
        const UserId = await User.findOne({ where: { user_id, is_deleted: 0 } });
        let msg = message.DATA_UPDATE;
        if (!UserId) {
            msg = message.REQ_NOT_FOUND;
        }

        const userObj = JSON.parse(event.body);
        // console.log(userObj);
        const models2 = await databaseWrite();
        var { User, Company } = models2;
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
    try {       
         const models1 = await databaseRead();
        var { User, Company } = models1;
        const { user_id } = event.pathParameters;
        const UserId = await User.findOne({ where: { user_id, is_deleted: 0 } });
        let msg = message.DATA_DELETE;
        if (!UserId) {
            msg = message.REQ_NOT_FOUND;
        }

        const models2 = await databaseWrite();
        var { User, Company } = models2;
        let userObj = await User.update({ is_deleted: 1 }, { where: { user_id } });
        return response(201, "", msg);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};