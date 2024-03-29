const Sequelize = require('sequelize');
require('dotenv').config();
const { UserModel } = require('./models/user.js');
const { CompanyModel } = require('./models/company.js');
const { TargetModel } = require('./models/target.js')

const readDatabase = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: 'mysql'
});
const User = UserModel(Sequelize, readDatabase);
const Company = CompanyModel(Sequelize, readDatabase);
const Target = TargetModel(Sequelize, readDatabase);
Company.hasMany(User, { foreignKey: 'cmp_id' });
User.belongsTo(Company, { as: 'company', foreignKey: 'cmp_id' });
User.hasMany(Target, { as: 'salesAssociates', foreignKey: 'user_id'})
const models = { User, Company, Target };

const databaseRead = async () => {
    try {
        await readDatabase.authenticate();
        console.log("Read database Connection Established!");
        return models;
    }
    catch (error) {
        console.log("Error connecting to read database:", error);
    };
}
module.exports = databaseRead;