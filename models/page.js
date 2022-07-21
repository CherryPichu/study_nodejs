const Sequelize = require("sequelize")

module.exports = class USER extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            email : {
                type : Sequelize.STRING(50),
                allowNull : false,
                unique : true,
            },
            password : {
                type : Sequelize.STRING(50),
                allowNull : false,
            },
            name : {
                type : Sequelize.STRING(50),
                allowNull : false,
            },
        },
            {
                sequelize,
                timestamps : false,
                underscored : true,
                modelName : "page",
                tableName:'USER',
                paranoid : false,
                charset : 'utf8',
                collate : 'utf8_general_ci',
            },
        )
    }
    static associate(db){}
}



