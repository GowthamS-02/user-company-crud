const databaseWrite = require("../writeDatabase.js");
const databaseRead = require("../readDatabase.js");
const { response } = require("../helper/response.js");
const {
    targetData,
    queryTargetData,
    updateTargetData,
} = require("../helper/validation.js");
const message = require("../helper/message.js");
const { date, displayDate } = require("../helper/moment.js");

module.exports.createTarget = async (event) => {
    try {
        if (event.body === null) {
            return response(400, 1, 0, 0, [], message.ENTER_DATA);
        }
        const inputData = JSON.parse(event.body);
        const { error, value } = await targetData.validate(inputData);
        if (error) {
            console.log(error.message);
            return response(400, 1, 0, 0, [], error.message);
        }
        const readModels = await databaseRead();
        let { Company, User, Target } = readModels;

        let userId = inputData.user_id;
        let cmpId = inputData.cmp_id;
        let userData = await User.findOne({
            attributes: ["first_name", "last_name"],
            where: { user_id: userId, cmp_id: cmpId, is_deleted: 0 },
        });
        let responseMessage;
        if (!userData) {
            responseMessage = message.USER_NOT_FOUND;
            return response(200, 1, 1, 0, [], responseMessage);
        }
        let targetObj = await Target.findOne({
            where: { user_id: userId, cmp_id: cmpId, is_deleted: 0 },
        });
        const writeModels = await databaseWrite();
        // await writeModels.Target.sync( {alter: true});
        let currentDate = date();
        if (targetObj) {
            await writeModels.Target.update(
                {
                    is_deleted: 1,
                    is_active: 0,
                    updated_dt: currentDate,
                    updated_ts: currentDate,
                },
                { where: { user_id: userId, cmp_id: cmpId, is_deleted: 0 } }
            );
            console.log("existing user deleted");
        }
        value.first_name = userData.first_name;
        value.last_name = userData.last_name;
        value.added_at = currentDate;
        value.added_ts = currentDate;
        value.updated_dt = currentDate;
        value.updated_ts = currentDate;
        await writeModels.Target.create(value);
        return response(201, 1, 1, 1, [], message.TARGET_CREATE);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports.getAllTargets = async (event) => {
    try {
        const body = JSON.parse(event.body);
        if (body === null) {
            return response(400, 1, 0, 0, [], message.ENTER_DATA);
        }
        const { error, value } = await queryTargetData.validate(body);
        if (error) {
            console.log(error.message);
            return response(400, 1, 0, 0, [], error.message);
        }

        let query = { is_deleted: 0 };
        let page = body.page;
        let limit = body.limit;
        if (body.cmp_id) {
            query.cmp_id = body.cmp_id;
        }
        if (body.user_id) {
            query.user_id = body.user_id;
        }
        if (body.date) {
            query.added_at = body.date;
        }
        console.log(query);
        const { Target } = await databaseRead();
        let targetObj = await Target.findAll({
            attributes: [
                ["user_id", "user_id"],
                ["cmp_id", "company_id"],
                ["assoc_team_name", "team_name"],
                ["assoc_target_mthly", "monthly_target"],
                ["assoc_target_mthly_usd", "monthly_target_usd"],
                ["currency", "currency"],
                ["assoc_st_dt", "start_date"],
                ["assoc_en_dt", "end_date"],
                ["added_ts", "added_date"],
                ["updated_ts", "last_updated"],
            ],
            where: query,
            order: [["target_id", "ASC"]],
            limit: limit,
            offset: limit * (page - 1),
        });
        if (targetObj.length === 0) {
            let responseMessage = message.NO_DATA;
            return response(200, 1, 1, 1, [], responseMessage);
        }
        targetObj = targetObj.map((target) => {
            target = target.toJSON();
            target.Added_date = displayDate(target.Added_date);
            target.Last_updated = displayDate(target.Last_updated);
            return target;
        });
        let targetCount = await Target.count({
            where: query,
        });
        let responseData = {
            count: targetCount,
            rows: targetObj,
            currentPage: page,
        };
        return response(200, 1, 1, 1, responseData, message.FOUND_DATA);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports.updateTarget = async (event) => {
    try {
        const targetObj = JSON.parse(event.body);
        const { error, value } = await updateTargetData.validate(targetObj);
        if (error) {
            console.log(error.message);
            return response(400, 1, 0, 0, [], error.message);
        }
        const readModels = await databaseRead();
        let { Target } = readModels;
        const { target_id } = event.pathParameters;
        const targetId = await Target.findOne({
            where: { target_id, is_deleted: 0 },
        });
        let responseMessage;
        if (!targetId) {
            responseMessage = message.REQ_NOT_FOUND;
            return response(200, 1, 1, 0, [], responseMessage);
        }
        const writeModels = await databaseWrite();
        let currentDate = date();
        value.updated_dt = currentDate;
        value.updated_ts = currentDate;
        await writeModels.Target.update(value, {
            where: { target_id, is_deleted: 0 },
        });
        responseMessage = message.DATA_UPDATE;
        return response(200, 1, 1, 1, [], responseMessage);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports.deleteTarget = async (event) => {
    try {
        const readModels = await databaseRead();
        let { Target } = readModels;
        const { target_id } = event.pathParameters;
        const targetId = await Target.findOne({
            where: { target_id, is_deleted: 0 },
        });
        let responseMessage;
        if (!targetId) {
            responseMessage = message.REQ_NOT_FOUND;
            return response(200, 1, 1, 0, [], responseMessage);
        }
        const writeModels = await databaseWrite();
        let currentDate = date();
        await writeModels.Target.update(
            {
                is_deleted: 1,
                updated_dt: currentDate,
                updated_ts: currentDate,
            },
            { where: { target_id, is_deleted: 0 } }
        );
        responseMessage = message.DATA_DELETE;
        return response(200, 1, 1, 1, [], responseMessage);
    } catch (error) {
        console.log(error);
        throw error;
    }
};
