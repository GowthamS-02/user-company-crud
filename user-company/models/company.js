module.exports.CompanyModule = (Sequelize, sequelize) => {
    return sequelize.define('Company', {
        cmp_id: {
            type: Sequelize.INTEGER(10),
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(30),
            unique: true,
            allowNull: false
        },
        industry: Sequelize.STRING(20),
        founded_date: Sequelize.DATEONLY,
        website:Sequelize.STRING(25),
        email: {
            type: Sequelize.STRING(20),
            unique: true
        },
        cmp_address: Sequelize.STRING(50),
        cmp_phone: Sequelize.STRING(15),
        added_at:  Sequelize.DATEONLY,
        added_ts:  Sequelize.DATE,
        updated_dt:  Sequelize.DATEONLY,
        updated_ts: Sequelize.DATE,
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
            initialAutoIncrement: 101,
            freezeTableName: true,
            timestamps: false
        }
    );

}