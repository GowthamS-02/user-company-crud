module.exports.UserModel = (Sequelize, sequelize) => {
    return sequelize.define('User', {
        user_id: {
            type: Sequelize.INTEGER(50),
            primaryKey: true,
            autoIncrement: true,
            //allowNull: false
        },
        username: {
            type: Sequelize.STRING(250),
            allowNull: false
        },
        cmp_id: {
            type: Sequelize.INTEGER(50),
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(250),
            unique: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(250),
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
        gender: {
            type: Sequelize.STRING(250),
            allowNull: false
        },
        birth_date: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        user_phone: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        image_url:{
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