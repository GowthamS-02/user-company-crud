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
        // let { page, cmp_id, added_at } = event.queryStringParameters;
        let body = event.queryStringParameters;
        let pageAsNum = Number.parseInt(body.page);
        let cmpIdAsNum = Number.parseInt(body.cmp_id);
        let dateGiv = body.added_at;
        console.log(pageAsNum);
        console.log(cmpIdAsNum);
        console.log(dateGiv);
        let page = 1;
        if(!Number.isNaN(pageAsNum) && pageAsNum > 0){
            page = pageAsNum
        }
        let cmp_id = 143;
        if(!Number.isNaN(cmpIdAsNum) && cmpIdAsNum > 0){
            cmp_id = cmpIdAsNum;
        }

        let added_at = "2024-02-09";
        if(!isNaN(dateGiv)){
            added_at = dateGiv
        }


        const CmpId = await User.findOne({ where: { cmp_id, is_deleted: 0 } });
        let msg = message.FOUND_DATA;
        if (!CmpId) {
            msg = message.REQ_NOT_FOUND;
        }

        let userObj = await User.findAndCountAll({
            attributes: [['user_id', 'ID'], ['username', 'Username'], ['email', 'User-mail']],
            where: { cmp_id, added_at, is_deleted: 0 },
            order: [["added_ts", "ASC"]],
            limit: 4,
            offset: 4 * (page-1),
        });
        
        // return response(201, userObj, msg);



        let noOfPage = Math.ceil(userObj.count / 4);
        let output = {
            data: userObj,
           No_of_pages: noOfPage
           };
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