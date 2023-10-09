const express = require('express');
// const midleware = require('../midleware/midleware')
const cookieParser = require('cookie-parser');
const {restrictToLoggedinUserOnly,checkAuth} = require('../midleware/midleware')

const router = express.Router();
router.use(cookieParser())


// router.get('/home',restrictToLoggedinUserOnly,(req, res) => {
//   res.render('index');
// });



router.get('/',checkAuth,(req, res) => {
  res.render('register');
});

router.get('/login',checkAuth, (req, res) => {
  res.render('login');
});

router.get('/services',restrictToLoggedinUserOnly,(req, res) => {
  res.render('services');
});

// router.get('/profile',restrictToLoggedinUserOnly,(req, res) => {
//   // res.render('profile');
//   res.send("profile")
// });


// router.get('/purchased',restrictToLoggedinUserOnly,(req, res) => {
//   res.render('purchased');
// });

// router.get('/recharge',restrictToLoggedinUserOnly,(req,res)=>{
//   res.render('recharge')
//   // res.send("done")
// })

module.exports = router;
