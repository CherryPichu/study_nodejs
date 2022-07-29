// 팔로잉 기능

const express = require("express")
const { isLoggedIn } = require('./middlewares')
const User = require('../models/user')

const router = express.Router();


// POST /user/1/follow
// rest api는 동사는 쓰지않는 것이 원칙이다.
// 그러나 동사를 안쓰면 의미가 애매할 수 있어서 타협을 볼 수는 있다.
// http api 라고 부르는게 더 맞다.
router.post("/:id/follow", isLoggedIn, async(req,res,next) =>{
    try{
        const user = await User.findOne({where : {id : req.user.id }});
        if(user){
            await user.addFollowing(parseInt(req.params.id , 10)); // user 모델의 관계는 as followers, followings 으로 정해짐.
            // setFloowings, removefollowing, get following.
            res.send('success')
        } else {
            res.status(404).send('no user')
        }
    }catch(error){
        res.status(404).send('no user')
        next(error);
    }
})


module.exports = router