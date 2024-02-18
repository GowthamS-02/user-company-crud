const databaseWrite = require('../writeDatabase.js');
const databaseRead = require('../readDatabase.js');
const { response } = require('../helper/response.js');
const { cmpSchema, updateSchema } = require('../helper/validation.js');
const message = require('../helper/message.js');
const { noOfPage } = require('../helper/noOfPage.js');
const { date } = require('../helper/moment.js');


module.exports.createCompany = async (event) => {
    try {
        if ((event.body) === null) {
            return response(400, [], message.ENTER_DATA);
        }
        const inputData = JSON.parse(event.body);
        const { error, value } = await cmpSchema.validate(inputData);
        if (error) {
            console.log(error.message);
            return error.message;
        }
        const readModels = await databaseRead();
        let Company  = readModels.Company;
        // await Company.sync( {alter: true});
        const cmpMail = inputData.email;
        const existEmail = await Company.findOne({ where: { email: cmpMail, is_deleted: 0 } });//emai;
        if (existEmail) {
            let responseMessage = message.EXIST_CMP;
            return response(200, [], responseMessage);
        }
        const writeModels = await databaseWrite();
        Company  = writeModels.Company;

        value.added_at = date();
        value.added_ts = date();//utc
        value.updated_dt = date();
        value.updated_ts = date();

        await Company.create(value);
        return response(201, [], message.CMP_CREATE);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};


module.exports.getAllCompany = async (event) => {
    const readModels = await databaseRead();
    let Company  = readModels.Company;
    try {
        let body = JSON.stringify(event.body)

        let page = 1;
        if (body !== null) {
            if(body.page > 0){
                page = pageNum
            }
        }
        let cmpData = await Company.findAll({
            attributes: [['name', 'Company_name'], ['cmp_id', 'Company_ID'], ['website', 'Official_website']],
            where: { is_deleted: 0 },
            order: [['cmp_id', 'ASC']],
            limit: 4,
            offset: 4 * (page - 1),
        });
        if ((cmpData.length) === 0) {
            let responseMessage = message.NO_DATA;
            return response(201, cmpData, responseMessage);
        }

        let cmpCount = await Company.count({
            where: { is_deleted: 0 }
        });
        if (page > (noOfPage(cmpCount))) {
            responseMessage = message.NO_PAGE;
            return response(200, [], responseMessage);
        }

        let responseData = {
            count: cmpCount,
            rows: cmpData,
            currentPage: page,
            noOfPages: noOfPage(userCount)
        }
        return response(200, responseData, message.FOUND_DATA);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports.getCompany = async (event) => {
    const readModels = await databaseRead();
    let Company  = readModels.Company;
    try {
        const { cmp_id } = event.pathParameters;
        let cmpData = await Company.findOne({ 
            attributes: [['name', 'Company_name'], ['cmp_id', 'Company_ID'], ['website', 'Official_website']],
            where: { cmp_id, is_deleted: 0 } 
        });
        let responseMessage = message.FOUND_DATA;
        if (!cmpData) {
            responseMessage = message.REQ_NOT_FOUND;
        }
        // let cmpObj = { Company: cmpData };
        return response(201, cmpData, responseMessage);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};


module.exports.updateCompany = async (event) => {
    try {
        const cmpData = JSON.parse(event.body);
        let responseMessage;
        if ( cmpData.email) {
            responseMessage = message.DEFAULT_EMAIL;
            return response(200, [], responseMessage);
        }
        const { error, value } = await updateSchema.validate(userObj);
        if (error) {
            console.log(error.message);
            return error.message;
        }
        const readModels = await databaseRead();
        let Company  = readModels.Company;
        const { cmp_id } = event.pathParameters;//
        const cmpId = await Company.findOne({ where: { cmp_id, is_deleted: 0 } });
        if (!cmpId) {
            responseMessage = message.REQ_NOT_FOUND;
            return response(200, [], responseMessage);
        }
        const writeModels = await databaseWrite();
        Company  = writeModels.Company;
        value.updated_dt = date();
        value.updated_ts = date();
        await Company.update(value, { where: { cmp_id } });
        responseMessage = message.DATA_UPDATE;
        return response(200, [], responseMessage);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};


module.exports.deleteCompany = async (event) => {
    try {
        const readModels = await databaseRead();
        let  Company = readModels.Company;
        const { cmp_id } = event.pathParameters;
        const cmpId = await Company.findOne({ where: { cmp_id, is_deleted: 0 } });
        let responseMessage;
        if (!cmpId) {
            responseMessage = message.REQ_NOT_FOUND;
            return response(200, [], responseMessage);
        }
        const writeModels = await databaseWrite();
        Company  = writeModels.Company;
        await Company.update({ is_deleted: 1, updated_dt: date(), updated_ts: date() }, { where: { cmp_id } });
        responseMessage = message.DATA_DELETE;
        return response(200, [], responseMessage);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};


// module.exports.usersInCompany = async (event) => {
//     const models = await databaseRead();
//     const { User, Company } = models;
//     try {
//         const { cmp_id } = event.pathParameters;
//         let cmpData = await Company.findOne({
//             attributes: [['name', 'Company_name'], ['cmp_id', 'Company_ID'], ['website', 'Official_website']],
//             include: {
//                 model: User,
//                 where: { cmp_id, is_deleted: 0 },
//                 attributes: ["user_id", "username", "email"],
//             }
//         });
//         let responseMessage;
//         if (!cmpData) {
//             responseMessage = message.REQ_NOT_FOUND;
//         }
//         return response(200, cmpData, responseMessage);
//     }
//     catch (error) {
//         console.log(error);
//         throw error;
//     }
// };


// module.exports.companyOfUser = async (event) => {
//     const models = await databaseRead();
//     const { User, Company } = models;
//     try {
//         const { user_id } = event.pathParameters;
//         let userObj = await User.findOne({
//             attributes: ["user_id", "username", "email"],
//             where: { user_id, is_deleted: 0 },
//             include: {
//                 model: Company,
//                 attributes: [['name', 'cmp_name'], ['cmp_id', 'Company ID'], ['website', 'Official website']],
//             }
//         });
//         let responseMessage;
        // if (!userObj) {
//             responseMessage = message.REQ_NOT_FOUND;
//         }
//         return response(200, userObj, responseMessage);
//     }
//     catch (error) {
//         console.log(error);
//         throw error;
//     }
// };