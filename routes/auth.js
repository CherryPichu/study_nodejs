const express = require('express')
// const session = require('express-session') // 세션
const cookieParser = require('cookie-parser')// 쿠키
const bodyParser = require('body-parser'); // Post 요청 방식의 파리미터 정손은
// 우리의 눈에 보이지 않는 body에서 이루어진다.
// req.on() 을 사용 가능하지만 외장 모듈인 body-parser를 이용하면 편리하다.
const app = express(); // app.get 사용
const router = express.Router();
const fs = require('fs')
const path = require('path');
const { User } = require('../models'); // db 객체 안에 page 반환, 구조분해

router.use(cookieParser())
router.use(bodyParser.json()); // json 등록
router.use(bodyParser.urlencoded({ extended : false })); // URL-encoded 등록

router.post('/login', async (req, res) => { // 로그인 시도
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
})

router.post('/join', (req, res) => { // 로그인 시도
    // console.log(req.body)
    const email = req.body.email
    const nick = req.body.nick
    const password = req.body.password
    // console.log(email)
    if(req.session.user && req.session){
            console.log("이미 로그인한 회원입니다.")
    }else{
        console.log(req.body)
        
        User.create({ // insert 문
            email : email,
            password : password,
            name : nick,
        }).then(() =>{
                res.redirect('/') // 성공시
        }).catch((err) => {
            res.send("<body><p> 회원가입 에러, 이미 사용중인 이메일입니다.</p><p><a href='/join'>돌아가기</a></p> </body>")
        })
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

module.exports = router