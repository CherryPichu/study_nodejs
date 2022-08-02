const express = require('express');
const multer = require('multer')
const path = require('path')
const fs = require('fs');

const { Post, Hashtag, User } = require('../models')
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
    fs.readdirSync('uploads')
}catch(err){
    console.log('uploads 폴더가 없어')
    fs.mkdirSync('uploads')
}

const upload = multer({
    storage : multer.diskStorage({
        destination(req, file, cb){
            cb(null, 'uploads/')
        },
        filename(req, file, cb){
            const ext = path.extname(file.originalname)
            cb(null,path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits : {fileSize : 5 * 1024 * 1024},
});

router.post('/img',isLoggedIn, upload.single('img'), (req, res) => { // input id='img" 를 받는다.
    // 이미지 업로드가 10초가 걸린다면 게시글 업로드는 몇초 안걸린다.
    // 사용자가 게시글을 작성하는 동안 서버에서 이미지를 압축해서 클라이언트에 보내주면.
    // 같이 업로드할 때 바로 업로드 할 수 있서 사용자들이 빠르다고 느껴진다.
    // 
    console.log(req.file);
    res.json({url : `/img/${req.file.filename}`}) // front로 업로드 주소를 보내놔서
    // 실제 업로드를 할 때 게시글 내용과 업로드 주소를 같이 보낼 수 있도록 한다.
})



router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
    try {
        // 해시태그 꺼내기 => 정규 표현식
        const hashtags = req.body.content.match(/#[^\s#]/); // #으로 시작해서 띄어쓰기와 #이 아닌 애들을 골라라.
        // Set으로 중복 제거.
        // [#노드, #익스프레스]
        // Map <= [노드, 익스프레스]
        // [findOrCreate(노드), findOrcreate(익스프레스)]
        // [ [해시태그, false], [해시태그, true] ] true면 create 한거 false면 find한거
        if(hashtags) {
            const requres = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where : {title : tag.slice(1).toLowerCase() },
                    })
                })
            )
            console.log("requres : ",requres.dataValue)
            // await post.addHashtags(requres.map(r => r[0]))
        }
        

        // console.log(req.user);
        const post = await Post.create({
          content: req.body.content,
          img: req.body.url,
          UserId: req.user.id,
        });
        res.redirect('/')
    } catch (error) {
        console.error(error);
        next(error);
    }
})


module.exports = router;
