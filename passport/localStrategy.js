const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')

const User = require('../models/user')

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField : 'email', // req.body.email
        passwordField : 'password', // req.body.password
    }, async(email, password , done) => {
        try {
            const exUser = await User.findOne({ where : { email }})
            if(exUser){ // 이메일이 있다면
                const result = await bcrypt.compare(password, exUser.password); // 비밀번호와 해시화된 비밀번호와 비교한다.
                console.log(result)
                if(result){
                    done(null, exUser)// 익명함수의 3번째 매개변수 -> 함수. 
                    // 보통 doen은 함수를 매개변수로 받은 변수의 이름으로 쓰임.
                } else {
                    done(null, false , {message : "비밀번호가 일치하지 않습니다."})
                    // 강의 설명 :
                    // done 첫번째 인자 : 서버에러, 두번째는 : 로그인이 성공했을 때, 세번째는 : 로그인 실패했을 때 메세지
                } 
            }else {
                done(null, false, { message : "가입되지 않은 회원입니다. "})
            }

        }catch (err){
            console.error(err)
            done(err)
        }
    }))
}

