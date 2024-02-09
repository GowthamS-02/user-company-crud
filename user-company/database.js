const Sequelize = require('sequelize');
require('dotenv').config();
const { UserModel } = require('./controller/user.js');

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

const writeData = new Sequelize(db_name, username, password, {
    dialect: 'mysql'
});

const readData = new Sequelize(db_name, username, password, {
    dialect: 'mysql'
});

const User = UserModel(Sequelize, writeData);
const models = { User };
const database = async () => {
    try {
        await writeData.authenticate();
        console.log("Connection Established!");
        // await User.sync();
        return models;
    }
    catch (err) {
        console.log("Error connecting to database:", err);
    };

}
module.exports = database;