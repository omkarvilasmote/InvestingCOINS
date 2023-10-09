const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken'); 
const SignUpSchema = require('../DB/schemas/signupShema');
require('../DB/mongodb');
const router = express.Router();
const {secret} = require("../config/auth")

const {restrictToLoggedinUserOnly} = require('../midleware/midleware')

const cookieParser = require('cookie-parser');
router.use(cookieParser());

router.get("/profile",restrictToLoggedinUserOnly, async (req, res) => {
    // res.render('profile');
    try {
        const token = req.cookies;
        // console.log(token);
        // res.send("token");

        if (!token) {
            return res.redirect('/login');
        }
        const decodedToken = jwt.verify(token.uid, secret);
        // console.log(decodedToken)
        const userId = decodedToken._id;
        // console.log(userId);
        const userRechargeData = await SignUpSchema.findOne({ _id: userId });

        if (!userRechargeData) {
            return res.redirect('/login'); 
        }
        const rechargeAmount = userRechargeData.recharge;
        res.render('profile', { rechargeAmount });

        // res.send(`User's recharge amount: ${rechargeAmount}`);
    } catch (error) {
        console.error("Error:", error);
        res.send("<h1>Something went wrong, please re-login</h1>");
    }
});

module.exports = router;
