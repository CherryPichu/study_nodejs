const express = require('express')
const app = express();
const path = require('path')
const nunjucks = require('nunjucks')
const pageRoute = require('./routes/page')
const authRoute = require('./routes/auth')
const { sequelize } = require('./models'); // 모델 불러오기(데이터 베이스 조작)
const session = require('express-session') // 세션



sequelize.sync({ force : false }).then(() => { // force : true , table 정보가 바뀌면 강제로 삭제뒤 재생성
    console.log('데이터베이스 연결 성공')
}).catch((err) => {
    console.error(err);
})


app.use(session({ // 미들웨어 방식으로 실행
        resave : true,
        saveUninitialized : true,
        secret : 'namjung',
        cookie : {
                httpOnly : true,
        },
        name : 'connect.sid' // 쿠키로 저자될 세션 이름
}))

app.set('port', process.env.PORT || 8082);

app.set('views', path.join(__dirname, 'views')) // 뷰 폴더 정보 지정
app.set('public', path.join(__dirname, 'public'))

// 뷰 엔진 지정
app.set('view engine', 'html')
nunjucks.configure('views', {
    express: app, // app 객체 연결
    watch: true, // true - HTML 파일이 변경될 때 템플릿 엔진을 다시 렌더링함
  });
// ---- route 정보------------

app.use('/auth', authRoute)

app.use('/', pageRoute)
// console.log(pageRoute)

app.use((req, res, next) =>{ // 에러처리 미들웨어
    res.status(404).send("Error 404")
})
// app.use((err, req,res, next) => {
//     res.locals.message = err.message;
//     res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
//     res.status(err.status || 500);
//     console.log(err.status)
//     res.render('error')
// })

app.listen(app.get('port'), () => {
    console.log("서버 작동 시작")
})


