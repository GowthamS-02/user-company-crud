module.exports.TargetModel = (Sequelize, sequelize) => {
    return sequelize.define('sales_associates', {
        target_id: {
            type: Sequelize.INTEGER(50),
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.INTEGER(50),
            allowNull: false
        },
        first_name: {
            type: Sequelize.STRING(250),
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING(250),
            allowNull: false
        },
        assoc_team_name: {
            type: Sequelize.STRING(250),
            allowNull: false
        },
        assoc_target_mthly: {
            type: Sequelize.INTEGER(250),
            defaultValue: null,
            allowNull: true
        },
        cmp_id: {
            type: Sequelize.INTEGER(50),
            allowNull: false
        },
        assoc_st_dt: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        assoc_en_dt: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        assoc_target_mthly_usd: {
            type: Sequelize.INTEGER(250),
            defaultValue: null,
            allowNull: true
        },
        is_team_lead: {
            type: Sequelize.BOOLEAN,
            defaultValue: 0,
            allowNull: true
        },
        currency: {
            type: Sequelize.STRING(250),
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
            freezeTableName: true,
            timestamps: false
        }
    );
}