const { v4: uuidv4 } = require("uuid");
const mongoose = require('mongoose');
require('../DB/mongodb')
const LoginSchema = require('../DB/schemas/signupShema')
const express = require('express');
const router = express.Router();
const {setUser} = require('../config/auth')

const cookieParser = require('cookie-parser');


router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(cookieParser());


router.post("/login", async (req,res) => {
    const { phoneNumber,password } = req.body;
    let data = await LoginSchema.findOne({ phoneNumber,password });
    // console.log(data);

    if(data){
        const token = setUser(data);
        res.cookie("uid", token);
        res.redirect('/home')
    }else{
       console.log("Run")

    }

})





module.exports = router;