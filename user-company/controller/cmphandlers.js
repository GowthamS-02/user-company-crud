const databaseWrite = require('../writeDatabase.js');
const databaseRead = require('../readDatabase.js');
const { response } = require('../helper/response.js');
const {validateCompay} = require('../helper/validation.js');
const message = require('../helper/message.js');
const { noOfPage } = require('../helper/noOfPage.js');
const moment = require('moment');
let m = moment();


//date
module.exports.createNewCompany = async (event) => {
    try {
        if ((event.body) === null) {
            return response(400, " ", message.ENTER_DATA);
        }
        const inputData = JSON.parse(event.body);

        console.log(inputData);

        const models = await databaseWrite();
     
        console.log(models);
        const { Company } = models;
        await Company.sync( {alter: true});
        console.log(Company);
        const cmpName = inputData.name;
        const existCmp = await Company.findOne({ where: { name: cmpName, is_deleted: 0 } });
        let msg = "This company name is already exist. Please enter another another company name";
        if (existCmp) {
            return response(201, "", msg)
        }

        //validation
        const { error, value } = await validateCompay(inputData);
        if (error) {
            console.log(error.message);
            return error.message;
        }
        // console.log(value);

        let newCmp = await Company.create(value);
        return response(201, "", message.CMP_CREATE);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};