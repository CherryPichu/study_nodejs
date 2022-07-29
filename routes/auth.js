const express = require('express')
// const session = require('express-session') // 세션
const cookieParser = require('cookie-parser')// 쿠키
const bodyParser = require('body-parser'); // Post 요청 방식의 파리미터 정손은
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')
// 우리의 눈에 보이지 않는 body에서 이루어진다.
// req.on() 을 사용 가능하지만 외장 모듈인 body-parser를 이용하면 편리하다.
const app = express(); // app.get 사용
const router = express.Router();
const fs = require('fs')
const path = require('path');

//------- 암호화 이용
const passport = require('passport')
const bcypt = require('bcrypt')

//-------

const { User } = require('../models'); // db 객체 안에 page 반환, 구조분해
const { nextTick } = require('process');

router.use(cookieParser())
router.use(bodyParser.json()); // json 등록
router.use(bodyParser.urlencoded({ extended : false })); // URL-encoded 등록

/*
로그인은 카카오 로그인도 있고 세션 문제도 있기 때문에
패스포트 라이브러리를 이용하면 더 간단하다!
*/
router.post('/login', isNotLoggedIn, async (req, res, next) => { // 로그인 시도
        // 강의 코드
        // 
        passport.authenticate('local', (authError, user, info) => {  //  localStrategy.js에 3개의 인자와 동일하다.
                // 'local'이 실행되면
                //passport가 passport/index.js의 local(); 을 찾아간다.
                if(authError){
                        console.error(authError)
                        return next(authError)
                }
                if(!user){ // 로그인이 실패한 경우
                        return res.redirect(`/?loginError=${info.message}`)
                }
                return req.login(user, (loginError) => { // req.login은 passport/index.js의 passport.serializeUser((user, done) =>{}) 으로 간다.
                        if(loginError){
                                console.error(loginError);
                                return next(loginError)
                        }
                        return res.redirect('/');
                });
        })(req, res, next)// 미들웨어 내의 미들웨어는 (req, res, next)를 붙입니다.
     /*   
    const email = req.body.email
    const password = req.body.password
    if(req.session.user && req.session){
        res.send('<script>alert("이미 로그인된 회원입니다."); window.location.href = "/"</script>')
    }else{
            const { Op } = require('sequelize')
            try {
                const ExecuteQuery = await User.findOne(({ // 이메일과 패스워드가 일치한게 있는지 찾기
                        attributes : [ 'email', 'password', 'name' ],
                        where : { 
                                'email' :{[Op.like] : email},
                                'password' : {[Op.like] : password},
                        }
                }))
                if(ExecuteQuery){ // 결과가 있다면
                        req.session.user = {
                                email : ExecuteQuery.email,
                                nick : ExecuteQuery.name,
                                id : ExecuteQuery.email
                        }
                }else{ // 결과가 없다면
                        
                }
            }catch(err){
                    console.error(err);
            }
            
    }
    
    res.redirect('/') 
    */ // 이전코드
})

// 미들웨어를 통해서 검사를 진행할 수 있다.
router.post('/join', isNotLoggedIn, async (req, res) => { // 로그인 시도
    // console.log(req.body)
    const email = req.body.email
    const nick = req.body.nick
    const password = req.body.password
    // console.log(email)
    if(req.session.user && req.session){
            console.log("이미 로그인한 회원입니다.")
    }else{
        try{
                console.log(req.body)
                
                 // 강의 내용
                const exUser = await User.findOne({ where : { email }});
                if(exUser){
                        res.redirect('/join?error=exit')
                }
                const hash = await bcypt.hash(password, 12); // 비밀번호를 해쉬화, 12 숫자가 더 높을 수록 해쉬화가 더 복잡해짐.

                await User.create({ // insert 문
                    email : email, // email만 써도 됨.
                    password : hash,
                    nick : nick,
                })
                return res.redirect('/');
        }catch(err){
                console.error(err)
                res.send("<body><p> 회원가입 에러, 이미 사용중인 이메일입니다.</p><p><a href='/join'>돌아가기</a></p> </body>")
        }
    }
})

router.get('/kakao', passport.authenticate('kakao'))

router.get('/kakao/callback', passport.authenticate('kakao',{
        failureRedirect : "/",
}), (req, res) => {
        res.redirect('/')
})

router.get('/logout', (req, res) => {
//     req.logout();
    req.session.destroy();
    res.redirect('/');
})

module.exports = router