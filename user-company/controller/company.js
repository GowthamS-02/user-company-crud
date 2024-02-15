const databaseWrite = require('../writeDatabase.js');
const databaseRead = require('../readDatabase.js');
const { response } = require('../helper/response.js');
const { validateCompay, validateUpdate } = require('../helper/validation.js');
const message = require('../helper/message.js');
// const { noOfPage } = require('../helper/noOfPage.js');
const currentTime = require('moment');
let moment = currentTime.utc();


module.exports.createCompany = async (event) => {
    try {
        if ((event.body) === null) {
            return response(400, " ", message.ENTER_DATA);
        }
        const inputData = JSON.parse(event.body);

        const { error, value } = await validateCompay(inputData);
        if (error) {
            console.log(error.message);
            return error.message;
        }

        const readModels = await databaseRead();
        var { Company } = readModels;
        // await Company.sync( {alter: true});

        const cmpMail = inputData.email;//
        const existMail = await Company.findOne({ where: { email: cmpMail, is_deleted: 0 } });//emai;
        let reply;
        if (existMail) {
            reply = message.EXIST_CMP;
            return response(201, "", reply);
        }

        const writeModels = await databaseWrite();
        var { Company } = writeModels;

        value.added_at = moment.toString();
        value.added_ts = moment.toString();//utc
        value.updated_dt = moment.toString();
        value.updated_ts = moment.toString();

        let newCmp = await Company.create(value);
        return response(201, "", message.CMP_CREATE);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};


module.exports.getAllCompany = async (event) => {
    const models = await databaseRead();
    const { Company } = models;
    try {
        let userObj = await Company.findAll({ attributes: [['name', 'cmp_name'], ['cmp_id', 'Company ID'], ['website', 'Official website']], where: { is_deleted: 0 }, order: [['cmp_id', 'ASC']] });
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


module.exports.getCompany = async (event) => {
    const models = await databaseRead();
    const { Company } = models;
    try {
        const { cmp_id } = event.pathParameters;
        let userObj = await Company.findOne({ attributes: [['name', 'cmp_name'], ['cmp_id', 'Company ID'], ['website', 'Official website']], where: { cmp_id, is_deleted: 0 } });
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


module.exports.updateCompany = async (event) => {
    try {
        const userObj = JSON.parse(event.body);
        const { error, value } = await validateUpdate(userObj);
        if (error) {
            console.log(error.message);
            return error.message;
        }
        let reply;
        if (userObj.founded_date || userObj.email) {
            reply = message.DEFAULT_CMP;
            return response(201, "", reply);
        }

        const readModels = await databaseRead();
        var { Company } = readModels;
        const { cmp_id } = event.pathParameters;//valid
        const CmpId = await Company.findOne({ where: { cmp_id, is_deleted: 0 } });

        if (!CmpId) {
            reply = message.REQ_NOT_FOUND;
            return response(201, "", reply);
        }

        const writeModels = await databaseWrite();
        var { Company } = writeModels;
        //
        value.updated_dt = moment.toString();
        value.updated_ts = moment.toString();
        await Company.update(value, { where: { cmp_id } });
        reply = message.DATA_UPDATE;
        return response(201, "", reply);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};


module.exports.deleteCompany = async (event) => {

    try {
        const readModels = await databaseRead();
        var { Company } = readModels;
        const { cmp_id } = event.pathParameters;
        const CmpId = await Company.findOne({ where: { cmp_id, is_deleted: 0 } });
        let reply;
        if (!CmpId) {
            reply = message.REQ_NOT_FOUND;
            return response(201, "", reply);
        }

        const writeModels = await databaseWrite();
        var { Company } = writeModels;
        await Company.update({ is_deleted: 1, updated_dt: moment.toString(), updated_ts: moment.toString() }, { where: { cmp_id } });
        reply = message.DATA_DELETE;
        return response(201, "", reply);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};


module.exports.usersInCompany = async (event) => {

    const models = await databaseRead();
    const { User, Company } = models;

    Company.hasMany(User, { foreignKey: 'cmp_id' });
    User.belongsTo(Company, { foreignKey: 'cmp_id' });

    try {
        const { cmp_id } = event.pathParameters;
        let userObj = await Company.findOne({
            attributes: [['name', 'cmp_name'], ['cmp_id', 'Company ID'], ['website', 'Official website']],
            include: {
                model: User,
                where: { cmp_id, is_deleted: 0 },
                attributes: ["user_id", "username", "email"],
            }
        });
        let reply;
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


module.exports.companyOfUser = async (event) => {

    const models = await databaseRead();
    const { User, Company } = models;

    Company.hasMany(User, { foreignKey: 'cmp_id' });
    User.belongsTo(Company, { foreignKey: 'cmp_id' });

    try {
        const { user_id } = event.pathParameters;

        // let userObj = await Company.findOne({
        //     attributes: [['name', 'cmp_name'], ['cmp_id', 'Company ID'], ['website', 'Official website']],
        //     include: {
        //         model: User,
        //         attributes: ["user_id", "username", "email"],
        //         where: { user_id, is_deleted: 0 },
        //     }
        // });

        let userObj = await User.findOne({
            attributes: ["user_id", "username", "email"],
            where: { user_id, is_deleted: 0 },
            include: {
                model: Company,
                attributes: [['name', 'cmp_name'], ['cmp_id', 'Company ID'], ['website', 'Official website']],
            }
        });

        let reply;
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