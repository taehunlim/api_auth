const express = require('express');
const router = express.Router();

const userModel = require('../models/user');

// @@ route POST user/signup
// @@ desc  user signup route
// @@ access public
router.post('/signup', async (req, res) => {
   const {username, email, password} = req.body;

   const foundUser = await userModel.findOne({email});
   if(foundUser) {
    //user 가 잇다면
       return res.status(403).json({
          error : 'email is already in use'
       });
   }
   else{
       // user가 없다면
       const newUser = new userModel({ username, email, password});
       await newUser
           .save()
           .then(user => {
               res.status(200).json(user);
           })
           .catch(err => res.json(err));
   }


});


// @@ route POST user/login
// @@ desc  user login route
// @@ access public
router.post('/login', async (req, res) => {
   res.json({
       msg : "work!"
   });
});

module.exports = router;