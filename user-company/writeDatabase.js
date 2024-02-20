const Sequelize = require('sequelize');
require('dotenv').config();
const { UserModel } = require('./models/user.js');
const { CompanyModel } = require('./models/company.js');

const writeDatabase = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: 'mysql'
});
const User = UserModel(Sequelize, writeDatabase);
const Company = CompanyModel(Sequelize, writeDatabase);
const models = { User,  Company };

const databaseWrite = async () => {
    try {
        await writeDatabase.authenticate();
        console.log("Write datavase Connection Established!");
        return models;
    }
    catch (error) {
        console.log("Error connecting to write database:", error);
    };
}
module.exports = databaseWrite;