const databaseWrite = require("../writeDatabase.js");
const databaseRead = require("../readDatabase.js");
const { response } = require("../helper/response.js");
const { companyData, updateCompanyData } = require("../helper/validation.js");
const message = require("../helper/message.js");
const { date, displayDate } = require("../helper/moment.js");

module.exports.createCompany = async (event) => {
    try {
        if (event.body === null) {
            return response(400, 1, 0, 0, [], message.ENTER_DATA);
        }
        const inputData = JSON.parse(event.body);
        const { error, value } = await companyData.validate(inputData);
        if (error) {
            console.log(error.message);
            return response(400, 1, 0, 0, [], error.message);
        }
        const readModels = await databaseRead();
        let { Company } = readModels;
        const cmpMail = inputData.email;
        const existEmail = await Company.findOne({
            where: { email: cmpMail, is_deleted: 0 },
        });
        if (existEmail) {
            let responseMessage = message.EXIST_CMP;
            return response(200, 1, 1, 1, [], responseMessage);
        }
        const writeModels = await databaseWrite();
        // await writeModels.Company.sync( {alter: true});
        let currentDate = date();
        value.added_at = currentDate;
        value.added_ts = currentDate;
        value.updated_dt = currentDate;
        value.updated_ts = currentDate;

        await writeModels.Company.create(value);
        return response(201, 1, 1, 1, [], message.USER_CREATE);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports.getAllCompany = async (event) => {
    try {
        const body = JSON.stringify(event.body);
        if (event.body === null) {
            return response(400, 1, 0, 0, [], message.ENTER_DATA);
        }
        const { error, value } = await queryDataValues.validate(body);
        if (error) {
            console.log(error.message);
            return response(400, 1, 0, 0, [], error.message);
        }
        let page = body.page;
        let limit = body.limit;

        const readModels = await databaseRead();
        let { Company } = readModels;
        let cmpObj = await Company.findAll({
            attributes: [
                ["name", "company_name"],
                ["cmp_id", "company_ID"],
                ["website", "official_website"],
                ["added_ts", "added_date"],
                ["updated_ts", "last_updated"],
            ],
            where: { is_deleted: 0 },
            order: [["cmp_id", "ASC"]],
            limit: limit,
            offset: limit * (page - 1),
        });
        if (cmpObj.length === 0) {
            let responseMessage = message.NO_DATA;
            return response(200, 1, 1, 1, [], responseMessage);
        }
        cmpObj = cmpObj.map((company) => {
            company = company.toJSON();
            company.added_date = displayDate(company.added_date);
            company.last_updated = displayDate(company.last_updated);
            return company;
        });
        let cmpCount = await Company.count({
            where: { is_deleted: 0 },
        });
        let responseData = {
            count: cmpCount,
            rows: cmpObj,
            currentPage: page,
        };
        return response(200, 1, 1, 1, responseData, message.FOUND_DATA);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports.getCompany = async (event) => {
    try {
        const { cmp_id } = event.pathParameters;
        const readModels = await databaseRead();
        let { Company } = readModels;
        let cmpObj = await Company.findOne({
            attributes: [
                ["name", "company_name"],
                ["cmp_id", "company_ID"],
                ["website", "official_website"],
                ["added_ts", "added_date"],
                ["updated_ts", "last_updated"],
            ],
            where: { cmp_id, is_deleted: 0 },
        });
        let responseMessage = message.FOUND_DATA;
        if (!cmpObj) {
            responseMessage = message.REQ_NOT_FOUND;
            return response(200, 1, 1, 0, [], responseMessage);
        }
        return response(200, 1, 1, 1, cmpObj, responseMessage);
    } catch (error) {
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
            return response(400, 1, 0, 0, [], error.message);
        }
        const readModels = await databaseRead();
        let { Company } = readModels;
        const { email } = event.pathParameters;
        const cmpMail = await Company.findOne({
            where: { email, is_deleted: 0 },
        });
        let responseMessage;
        if (!cmpMail) {
            responseMessage = message.REQ_NOT_FOUND;
            return response(200, 1, 1, 0, [], responseMessage);
        }
        const writeModels = await databaseWrite();
        let currentDate = date();
        value.updated_dt = currentDate;
        value.updated_ts = currentDate;
        await writeModels.Company.update(value, {
            where: { email, is_deleted: 0 },
        });
        responseMessage = message.DATA_UPDATE;
        return response(200, 1, 1, 1, [], responseMessage);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports.deleteCompany = async (event) => {
    try {
        const readModels = await databaseRead();
        let { Company } = readModels;
        const { cmp_id } = event.pathParameters;
        const cmpId = await Company.findOne({
            where: { cmp_id, is_deleted: 0 },
        });
        let responseMessage;
        if (!cmpId) {
            responseMessage = message.REQ_NOT_FOUND;
            return response(200, 1, 1, 0, [], responseMessage);
        }
        const writeModels = await databaseWrite();
        let { User } = writeModels;
        let currentDate = date();
        await writeModels.Company.update(
            { is_deleted: 1, updated_dt: currentDate, updated_ts: currentDate },
            { where: { cmp_id, is_deleted: 0 } }
        );
        await User.update(
            { is_deleted: 1, updated_dt: currentDate, updated_ts: currentDate },
            { where: { cmp_id, is_deleted: 0 } }
        );
        responseMessage = message.DATA_DELETE;
        return response(200, 1, 1, 1, [], responseMessage);
    } catch (error) {
        console.log(error);
        throw error;
    }
};
