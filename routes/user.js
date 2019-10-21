const express = require('express');
const router = express.Router();

// @@ route POST user/signup
// @@ desc  user signup route
// @@ access public
router.post('/signup', async (req, res) => {
   res.json({
       msg : "work!"
   });
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