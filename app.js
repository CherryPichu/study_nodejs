const express = require('express')
const app = express();
const path = require('path')
const nunjucks = require('nunjucks')
const pageRoute = require('./routes/page')

app.set('port', process.env.PORT || 8082);

app.set('views', path.join(__dirname, 'views')) // 뷰 폴더 정보 지정
app.set('public', path.join(__dirname, 'public'))

// 뷰 엔진 지정
app.set('view engine', 'html')
nunjucks.configure('views', {
    express: app, // app 객체 연결
    watch: true, // true - HTML 파일이 변경될 때 템플릿 엔진을 다시 렌더링함
  });
// ------------

app.use('/', pageRoute)
// console.log(pageRoute)

app.use((err, req, res, next) =>{ // 에러처리 미들웨어
    res.status(404).send("Error 404")
    console.log(err)
})

app.listen(app.get('port'), () => {
    console.log("서버 작동 시작")
})


