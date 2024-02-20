const databaseWrite = require('../writeDatabase.js');
const databaseRead = require('../readDatabase.js');
const { response } = require('../helper/response.js');
const { companyData, updateCompanyData } = require('../helper/validation.js');
const message = require('../helper/message.js');
// const { noOfPage } = require('../helper/noOfPage.js');
const { date } = require('../helper/moment.js');


module.exports.createCompany = async (event) => {
    try {
        if ((event.body) === null) {
            return response(400, [], message.ENTER_DATA);
        }
        const inputData = JSON.parse(event.body);
        const { error, value } = await companyData.validate(inputData);
        if (error) {
            console.log(error.message);
            return error.message;
        }
        const readModels = await databaseRead();
        let { Company } = readModels;//
        // await Company.sync( {alter: true});
        const cmpMail = inputData.email;
        const existEmail = await Company.findOne({ where: { email: cmpMail, is_deleted: 0 } });
        if (existEmail) {
            let responseMessage = message.EXIST_CMP;
            return response(200, [], responseMessage);
        }
        const writeModels = await databaseWrite();
        Company = writeModels.Company;
        let currentDate = date()
        value.added_at = currentDate;
        value.added_ts = currentDate;//utc
        value.updated_dt = currentDate;
        value.updated_ts = currentDate;

        await Company.create(value);
        return response(201, [], message.CMP_CREATE);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};


module.exports.getAllCompany = async (event) => {
    try {
        const body = JSON.stringify(event.body);
        if ((event.body) === null) {
            return response(400, [], message.ENTER_DATA);
        }
        const { error, value } = await queryDataValues.validate(body);
        if (error) {
            console.log(error.message);
            return error.message;
        }
        let page = body.page;
        let limit = body.limit;

        const readModels = await databaseRead();
        let { Company } = readModels;
        let cmpObj = await Company.findAll({
            attributes: [['name', 'Company_name'], ['cmp_id', 'Company_ID'], ['website', 'Official_website'],
            ['added_ts', 'Added_date'], ['updated_ts', 'Last_updated']],
            where: { is_deleted: 0 },
            order: [['cmp_id', 'ASC']],
            limit: limit,//
            offset: limit * (page - 1),
        });
        cmpObjObj = cmpObj.map(company => {
            company = company.toJSON();
            company.Added_date = moment(company.Added_date).format('D MMM YYYY h:mmA');
            company.Last_updated = moment(company.Last_updated).format('D MMM YYYY h:mmA');
            return company;
        });
        if ((cmpObj.length) === 0) {
            let responseMessage = message.NO_DATA;
            return response(201, cmpObj, responseMessage);
        }

        let cmpCount = await Company.count({
            where: { is_deleted: 0 }
        });
        // if (page > (noOfPage(cmpCount))) {
        //     responseMessage = message.NO_PAGE;
        //     return response(200, [], responseMessage);
        // }

        let responseData = {
            count: cmpCount,
            rows: cmpObj,
            currentPage: page,
            // noOfPages: noOfPage(userCount)
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
    let { Company } = readModels;
    try {
        const { cmp_id } = event.pathParameters;
        let cmpObj = await Company.findOne({
            attributes: [['name', 'Company_name'], ['cmp_id', 'Company_ID'], ['website', 'Official_website'],
            ['added_ts', 'Added_date'], ['updated_ts', 'Last_updated']],
            where: { cmp_id, is_deleted: 0 }
        });
        let responseMessage = message.FOUND_DATA;
        if (!cmpObj) {
            responseMessage = message.REQ_NOT_FOUND;
        }
        cmpObjObj = cmpObj.map(company => {
            company = company.toJSON();
            company.Added_date = moment(company.Added_date).format('D MMM YYYY h:mmA');
            company.Last_updated = moment(company.Last_updated).format('D MMM YYYY h:mmA');
            return company;
        });
        // let cmpObj = { Company: cmpData };
        return response(201, cmpObj, responseMessage);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};


module.exports.updateCompany = async (event) => {
    try {
        const cmpObj = JSON.parse(event.body);
        const { error, value } = await updateCompanyData.validate(cmpObj);
        if (error) {
            console.log(error.message);
            return error.message;
        }
        const readModels = await databaseRead();
        let { Company } = readModels;
        const { email } = event.pathParameters;//
        const cmpMail = await Company.findOne({ where: { email, is_deleted: 0 } });
        let responseMessage;
        if (!cmpMail) {
            responseMessage = message.REQ_NOT_FOUND;
            return response(200, [], responseMessage);
        }
        const writeModels = await databaseWrite();
        Company = writeModels;
        let currentDate = date();
        value.updated_dt = currentDate;
        value.updated_ts = currentDate;
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
        let { Company } = readModels;
        const { cmp_id } = event.pathParameters;
        const cmpId = await Company.findOne({ where: { cmp_id, is_deleted: 0 } });
        let responseMessage;
        if (!cmpId) {
            responseMessage = message.REQ_NOT_FOUND;
            return response(200, [], responseMessage);
        }
        const writeModels = await databaseWrite();
        Company = writeModels;
        let { User } = writeModels;
        let currentDate = date();
        await Company.update({ is_deleted: 1, updated_dt: currentDate, updated_ts: currentDate }, { where: { cmp_id } });
        await User.update({ is_deleted: 1, updated_dt: currentDate, updated_ts: currentDate }, { where: { cmp_id, is_deleted: 0 } });
        responseMessage = message.DATA_DELETE;
        return response(200, [], responseMessage);
        //user delete
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