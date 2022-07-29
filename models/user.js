const Sequelize = require("sequelize")

module.exports = class User extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            email : {
                type : Sequelize.STRING(50),
                allowNull : false,
                unique : true,
            },
            password : {
                type : Sequelize.STRING(100),
                allowNull : true, // 카카오톡 로그인은 비밀번호가 없음.
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
              },
              provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local',
              },
              snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
              },
        },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: 'User',
                tableName: 'users',
                paranoid : true, // 회원 탈퇴한 회원에 정보를 삭제한 척 해둔다.
                charset : 'utf8',
                collate : 'utf8_general_ci',
            },
        )
    }
    static associate(db){
        db.User.hasMany(db.Post)
        db.User.belongsToMany(db.User, {
            foreignKey : 'followingId',
            as : "Followers",
            through : "Follow" // 1대다 관계에서 중간 테이블
        });
        db.User.belongsToMany(db.User, {
            foreignKey : 'followerId',
            as : "Followings",
            through : "Follow"
        })
    }
}