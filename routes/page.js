const express = require('express')
// const session = require('express-session') // 세션
const cookieParser = require('cookie-parser')// 쿠키
const bodyParser = require('body-parser'); // Post 요청 방식의 파리미터 정손은
// 우리의 눈에 보이지 않는 body에서 이루어진다.
// req.on() 을 사용 가능하지만 외장 모듈인 body-parser를 이용하면 편리하다.
const app = express(); // app.get 사용
const router = express.Router();

const path = require('path');
const { page } = require('../models'); // db 객체 안에 page 반환, 구조분해
const multer = require('multer') // 사진 업로드 용도
const fs = require('fs')

router.use(cookieParser())
router.use(bodyParser.json()); // json 등록
router.use(bodyParser.urlencoded({ extended : false })); // URL-encoded 등록

router.use('/', (req,res,next) =>{
        next();
})



// 첫번째 페이지 main.js
router.get('/', (req, res, next) => {
        res.render(app.get('views') + "/main.html", { title : "namjung", user :  req.session.user})
        // nunjucks에서 req.session.user 객체를 넘겨주면 객체에서 정보를 찾을 수 잇음.
})

router.get('/main.css', (req, res, next) => {
        res.sendfile('public' + "/main.css")
})



// join.html
router.get('/join', (req, res, next) => {
        res.render(app.get('views') + "/join.html", { title : "namjung", user :  req.session.user})
})

// profile.html
router.get('/profile', (req, res, next) => {
        res.render(app.get('views') + "/profile.html", { title : "namjung", user :  req.session.user})
})


module.exports = router