const moment = require('moment');
let m = moment();

module.exports.CompanyStu = (Sequelize, sequelize) => {
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
        cmp_phone: Sequelize.INTEGER,
        added_at: {
            type: Sequelize.DATEONLY,
            defaultValue: m.format("L")
        },
        added_ts: {
            type: Sequelize.DATE,
            defaultValue: m.toISOString()
        },
        updated_dt: {
            type: Sequelize.DATEONLY,
            defaultValue: m.format("L")
        },
        updated_ts: {
            type: Sequelize.DATE,
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