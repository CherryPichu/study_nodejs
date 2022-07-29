const passport= require('passport')
const local = require('./localStrategy')
const kakao = require('./kakaoStrategy')
const User = require('../models/user')

// 로그인으 어떻게 할지 적어놓은 파일 => passport, 전략
module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id); // 세션의 user.id만 저장한다.
        // 서버 메모리가 한정되어 있어
        // 세션에 회원 정보는 가능한 최소로 저장되어야 한다.
        // 회원 id만 있어도 어떤 정보든 불러올 수 있다.

        // 나중에는 메모리 저장용 DB를 사용한다.
    })

    // { id : 3, 'connect.sid' : s%31565453254} , id와 세션쿠키가 메모리에 저장된다.

    passport.deserializeUser((id, done) => {// 3번 사용자의 아이디로 필요한 정보를 복구해준다.
        User.findOne({ where : { id }})
        .then(user => done(null, user)) // req.user 으로 사용자 정보를 볼 수 있음., req.isAturhenticated() == true
        .catch(err => done(err))
    })

    local();
    kakao();
}
