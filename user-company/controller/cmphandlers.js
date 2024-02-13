const databaseWrite = require('../writeDatabase.js');
const databaseRead = require('../readDatabase.js');
const { response } = require('../helper/response.js');
const { validateCompay } = require('../helper/validation.js');
const message = require('../helper/message.js');
// const { noOfPage } = require('../helper/noOfPage.js');
const moment = require('moment');
let m = moment();


module.exports.createNewCompany = async (event) => {
    try {
        if ((event.body) === null) {
            return response(400, " ", message.ENTER_DATA);
        }
        const inputData = JSON.parse(event.body);

        const models = await databaseWrite();
        const { Company } = models;
        // await Company.sync( {alter: true});
        const cmpName = inputData.name;
        const existCmp = await Company.findOne({ where: { name: cmpName, is_deleted: 0 } });
        let msg = "This company name is already exist. Please enter another another company name";
        if (existCmp) {
            return response(201, "", msg)
        }
        const cmpId = inputData.cmp_id;
        const existId = await Company.findOne({ where: { cmp_id: cmpId, is_deleted: 0 } });
        msg = "This company ID is already exist. Please enter another another company ID";
        if (existId) {
            return response(201, "", msg)
        }
        //validation
        const { error, value } = await validateCompay(inputData);
        if (error) {
            console.log(error.message);
            return error.message;
        }
        value.added_at = m.format("L");
        value.added_ts = m.toISOString();
        value.updated_dt = m.format("L");
        value.updated_ts = m.toISOString();

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
    const { User, Company } = models;
    try {
        let userObj = await Company.findAll({ attributes: [['name', 'cmp_name'], ['cmp_id', 'Company ID'], ['website', 'Official website']], where: { is_deleted: 0 }, order: [['cmp_id', 'ASC']] });
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


module.exports.getSingleCompany = async (event) => {
    const models = await databaseRead();
    const { User, Company } = models;
    try {
        const { cmp_id } = event.pathParameters;
        let userObj = await Company.findOne({ attributes: [['name', 'cmp_name'], ['cmp_id', 'Company ID'], ['website', 'Official website']], where: { cmp_id, is_deleted: 0 } });
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


module.exports.updateCmpData = async (event) => {
    try {
        const models1 = await databaseRead();
        var { User, Company } = models1;
        const { cmp_id } = event.pathParameters;
        const CmpId = await Company.findOne({ where: { cmp_id, is_deleted: 0 } });
        let msg = message.DATA_UPDATE;
        if (!CmpId) {
            msg = message.REQ_NOT_FOUND;
        }

        const userObj = JSON.parse(event.body);
        console.log(userObj);
        const models2 = await databaseWrite();
        var { User, Company } = models2;
        let updateUser2 = await Company.update(userObj, { where: { cmp_id } });
        let updateUser = await Company.update({ updated_dt: m.format("L"), updated_ts: m.toISOString() }, { where: { cmp_id } });

        return response(201, "", msg);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};


module.exports.deleteCompany = async (event) => {

    try {
        const models1 = await databaseRead();
        var { User, Company } = models1;
        const { cmp_id } = event.pathParameters;
        const CmpId = await Company.findOne({ where: { cmp_id, is_deleted: 0 } });
        let msg = message.DATA_DELETE;
        if (!CmpId) {
            msg = message.REQ_NOT_FOUND;
        }

        const models2 = await databaseWrite();
        var { User, Company } = models2;
        let userObj = await Company.update({ is_deleted: 1 }, { where: { cmp_id } });
        return response(201, "", msg);
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
        let msg;
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

        let msg;
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