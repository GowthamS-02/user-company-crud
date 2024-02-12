const Sequelize = require('sequelize');
require('dotenv').config();
const { UserModel } = require('./controller/user.js');
const { CompanyModule } = require('./controller/company.js');

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

const readData = new Sequelize(db_name, username, password, {
    dialect: 'mysql'
});

const User = UserModel(Sequelize, readData);
const Company = CompanyModule(Sequelize, readData);
const models = { User, Company };

const databaseRead = async () => {
    try {
        await readData.authenticate();
        console.log("Read data Connection Established!");
        // await User.sync();
        return models;
    }
    catch (err) {
        console.log("Error connecting to database:", err);
    };
}
module.exports = databaseRead;