const Sequelize = require('sequelize');
require('dotenv').config();
const { UserModel } = require('./models/user.js');
const { CompanyModule } = require('./models/company.js');
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

const writeData = new Sequelize(db_name, username, password, {
    dialect: 'mysql'
});

const User = UserModel(Sequelize, writeData);
const Company = CompanyModule(Sequelize, writeData);
const models = { User,  Company };

const databaseWrite = async () => {
    try {
        await writeData.authenticate();
        console.log("Write datavase Connection Established!");
        // await User.sync();
        return models;
    }
    catch (err) {
        console.log("Error connecting to write database:", err);
    };
}
module.exports = databaseWrite;