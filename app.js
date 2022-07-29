const dotenv = require('dotenv');// .env 파일 데이터 가져오기
dotenv.config();
const express = require('express')
const app = express();
const path = require('path')
const nunjucks = require('nunjucks')
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const { sequelize } = require('./models'); // 모델 불러오기(데이터 베이스 조작)
const session = require('express-session') // 세션
const passport = require('passport');
const passportConfig = require('./passport');

passportConfig(); // 패스포트 설정
sequelize.sync({ force : false }).then(() => { // force : true , table 정보가 바뀌면 강제로 삭제뒤 재생성
    console.log('데이터베이스 연결 성공')
}).catch((err) => {
    console.error(err);
})



app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  }));

app.set('port', process.env.PORT || 8082);

app.set('views', path.join(__dirname, 'views')) // 뷰 폴더 정보 지정
app.use('/img', express.static(path.join(__dirname, 'uploads')));// img -> uploads 로 변환
app.set('public', path.join(__dirname, 'public'))

// 뷰 엔진 지정
app.set('view engine', 'html')
nunjucks.configure('views', {
    express: app, // app 객체 연결
    watch: true, // true - HTML 파일이 변경될 때 템플릿 엔진을 다시 렌더링함
  });

app.use(passport.initialize()); // 로그인 요청이 올 때마다 passport.deserializerUser를 실행해줌.
// 요청이 들어오면 id를 이용해 유저의 전체 정보를 복구해준다.
app.use(passport.session()); // express 세션보다 밑에 있어야하마.

// ---- route 정보------------

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
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


