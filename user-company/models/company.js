module.exports.CompanyModel = (Sequelize, sequelize) => {
    return sequelize.define('Company', {
        cmp_id: {
            type: Sequelize.INTEGER(50),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(50),
            unique: true,
            allowNull: false
        },
        industry: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        founded_date: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        website: {
            type: Sequelize.STRING(250),
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(50),
            unique: true,
            allowNull: false
        },
        cmp_address: {
            type: Sequelize.STRING(250),
            allowNull: false
        },
        cmp_phone: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        added_at: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        added_ts: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updated_dt: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        updated_ts: {
            type: Sequelize.DATE,
            allowNull: false
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: 1,
            allowNull: true
        },
        is_deleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0,
            allowNull: true
        }
    },
        {
            initialAutoIncrement: 101,
            freezeTableName: true,
            timestamps: false
        }
    );

}