const moment = require('moment');
let m = moment();


module.exports.UserModel = (Sequelize, sequelize) => {
    return sequelize.define('User', {
        user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username:  Sequelize.STRING, 
        cmp_id: Sequelize.INTEGER,
        email: {
            type: Sequelize.STRING, 
            unique: true
        },
        password: Sequelize.STRING,
        first_name: Sequelize.STRING,
        last_name: Sequelize.STRING,
        gender: Sequelize.STRING,
        birth_date: Sequelize.DATEONLY,
        added_at: {
            type: Sequelize.DATEONLY,
            defaultValue: m.format("L")
        },
        added_ts: {
           type:  Sequelize.DATE,
        defaultValue: m.toISOString()
    },
        updated_dt: {
            type: Sequelize.DATEONLY,
            defaultValue: m.format("L")
        },
        updated_ts: {
            type:  Sequelize.DATE,
         defaultValue: m.toISOString()
     },
        is_active: { 
            type: Sequelize.BOOLEAN,
            defaultValue: 1
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0
        }
        },
        {
            freezeTableName: true,
            timestamps: false
        }
    );

}


//  = UserModel;