const Sequelize = require('sequelize');
require('dotenv').config();
const { UserModel } = require('./controller/user.js');
const { CompanyModule } = require('./controller/company.js');

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
        console.log("Write data Connection Established!");
        // await User.sync();
        // await Company.sync();
        return models;
    }
    catch (err) {
        console.log("Error connecting to database:", err);
    };
}
module.exports = databaseWrite;