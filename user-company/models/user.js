const currentTime = require('moment');
let moment = currentTime.utc();

module.exports.UserModel = (Sequelize, sequelize) => {
    return sequelize.define('User', {
        user_id: {
            type: Sequelize.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING(15),
            allowNull: false
        },
        cmp_id: Sequelize.INTEGER(10),
        email: {
            type: Sequelize.STRING(20),
            allowNull: false,
            unique: true
        },
        password: Sequelize.STRING(20),
        first_name: Sequelize.STRING(10),
        last_name: Sequelize.STRING(10),
        gender: Sequelize.STRING(10),
        birth_date: Sequelize.DATEONLY,
        added_at: Sequelize.DATEONLY,
        added_ts:  Sequelize.DATE,
        updated_dt:  Sequelize.DATEONLY,
        updated_ts:  Sequelize.DATE,
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