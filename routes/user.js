const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../passport');

signToken = user => {
  return jwt.sign({
     iss : 'limtae',
     sub : user.id,
     iat : new Date().getTime(),
     exp : new Date().setDate(new Date().getTime() + 1)
  }, process.env.SECRET);
};




const userModel = require('../models/user');

// @@ route POST user/signup
// @@ desc  user signup route
// @@ access public
router.post('/signup', async (req, res) => {
   const {username, email, password} = req.body;

   const foundUser = await userModel.findOne({"local.email": email});
   if(foundUser) {
    //user 가 잇다면
       return res.status(403).json({
          error : 'email is already in use'
       });
   }
   else{
       // user가 없다면
       const newUser = new userModel({
           method : 'local',
           local : {
               username : username,
               email : email,
               password : password

           }
       });
       const token = signToken(newUser);
       await newUser
           .save()
           .then(user => {
               res.status(200).json({
                   userInfo : user,
                   tokenInfo : 'bearer ' + token
               });
           })
           .catch(err => res.json(err));
   }


});


// @@ route POST user/login
// @@ desc  user login route
// @@ access public
router.post('/login', passport.authenticate('local', {session : false}), async (req, res) => {
    const token = signToken(req.user);
    res.status(200).json({token});
});


// @@ route POST user/google
// @@ desc  google login route
// @@ access public
router.post('/google', passport.authenticate('googleToken', {session : false}), (req, res) => {
    const token = signToken(req.user);
    res.status(200).json({
        tokenInfo : token
    });
});



// @@ route GET user/secret
// @@ desc  current user route
// @@ access private
router.get('/secret', passport.authenticate('jwt', {session : false}), (req, res) => {
    res.json({
        msg : "resource"
    })
});

module.exports = router;