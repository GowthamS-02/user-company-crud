const moment = require('moment');
let mome = moment();

module.exports.CompanyModule = (Sequelize, sequelize) => {
    return sequelize.define('Company', {
        cmp_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            unique: true
        },
        industry: Sequelize.STRING,
        founded_date: Sequelize.DATEONLY,
        website:Sequelize.STRING,
        cmp_address: Sequelize.STRING,
        cmp_phone: Sequelize.STRING,
        added_at: {
            type: Sequelize.DATEONLY,
            // defaultValue: mome.format("L")
        },
        added_ts: {
            type: Sequelize.DATE,
            // defaultValue: mome.toISOString()
        },
        updated_dt: {
            type: Sequelize.DATEONLY,
            // defaultValue: mome.format("L")
        },
        updated_ts: {
            type: Sequelize.DATE,
            // defaultValue: mome.toISOString()
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