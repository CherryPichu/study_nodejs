const express = require('express')
const router = express.Router();
const fs = require('fs')
const path = require('path')
const app = express()

app.use('/', (req,res,next) =>{
        next();
})

// 첫번째 페이지 main.js
router.get('/', (req, res, next) => {
        res.render(app.get('views') + "/main.html", { title : "epxress"})
})
router.get('/main.css', (resq, res, next) => {
        res.sendfile('public' + "/main.css")
})

// join.html
router.get('/join', (req, res, next) => {
        res.render(app.get('views') + "/join.html", { title : "epxress"})
})
// profile.html
router.get('/profile', (req, res, next) => {
        res.render(app.get('views') + "/profile.html", { title : "epxress"})
})


module.exports = router
