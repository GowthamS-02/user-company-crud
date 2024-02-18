const Sequelize = require('sequelize');
require('dotenv').config();
const { UserModel } = require('./models/user.js');
const { CompanyModule } = require('./models/company.js');

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
        console.log("Read database Connection Established!");
        // await User.sync( {alter: true});
        Company.hasMany(User, { foreignKey: 'cmp_id' });
        User.belongsTo(Company, { foreignKey: 'cmp_id' });
        return models;
    }
    catch (error) {
        console.log("Error connecting to read database:", error);
    };
}
module.exports = databaseRead;