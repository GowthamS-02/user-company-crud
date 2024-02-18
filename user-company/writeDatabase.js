const Sequelize = require('sequelize');
require('dotenv').config();
const { UserModel } = require('./models/user.js');
const { CompanyModel } = require('./models/company.js');
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

const writeData = new Sequelize(db_name, username, password, {
    dialect: 'mysql'
});
const User = UserModel(Sequelize, writeData);
const Company = CompanyModel(Sequelize, writeData);
const models = { User,  Company };

const databaseWrite = async () => {
    try {
        await writeData.authenticate();
        console.log("Write datavase Connection Established!");
        return models;
    }
    catch (error) {
        console.log("Error connecting to write database:", error);
    };
}
module.exports = databaseWrite;