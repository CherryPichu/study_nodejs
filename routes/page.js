const express = require('express')
const { Post,  User, Hashtag } = require('../models')
// const session = require('express-session') // 세션
const cookieParser = require('cookie-parser')// 쿠키
const bodyParser = require('body-parser'); // Post 요청 방식의 파리미터 정손은
// 우리의 눈에 보이지 않는 body에서 이루어진다.
// req.on() 을 사용 가능하지만 외장 모듈인 body-parser를 이용하면 편리하다.
const app = express(); // app.get 사용
const router = express.Router();
/*
require 구조
var require = function(src){
var fileAsStr = readFile(src)                //line 2
    var module.exports = {}                  //line 3
    eval(fileAsStr)   // eval안에서 선언된 비동기 함수는! (router.get, post 등등)
    // 함수 안에 에러가 있는 코드가 있어도
    // 함수를 직접 실행하기 전 까지는 에러가 나지 않는다!
    return module.exports                    //line 5
}
*/

const path = require('path');
const multer = require('multer') // 사진 업로드 용도
const fs = require('fs');

router.use(cookieParser())
router.use(bodyParser.json()); // json 등록
router.use(bodyParser.urlencoded({ extended : false })); // URL-encoded 등록


router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user ? req.user.Followers.length : 0;
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
    next();
});

// 첫번째 페이지 main.js
router.get('/', async (req, res, next) => {
        // res.render(app.get('views') + "/main.html", { title : "namjung"})

        try {
            const posts = await Post.findAll({
              include: {
                model: User,
                attributes: ['id', 'nick'],
              },
              order: [['createdAt', 'DESC']],
            });
            res.render('main', {
              title: 'NodeBird',
              twits: posts,
            });
          } catch (err) {
            console.error(err);
            next(err);
          }
    
        // nunjucks에서 req.session.user 객체를 넘겨주면 객체에서 정보를 찾을 수 잇음.
})

router.get('/main.css', (req, res, next) => {
        res.sendfile('public' + "/main.css")
})

// join.html
router.get('/join', (req, res, next) => {
        res.render(app.get('views') + "/join.html", { title : "namjung"})
})

// profile.html
router.get('/profile', (req, res, next) => {
        res.render(app.get('views') + "/profile.html", { title : "namjung"})
})





module.exports = router