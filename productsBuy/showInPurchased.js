const express = require("express")
const mongoose = require("mongoose")
const productShecma = require('../DB/schemas/Product');
const userpurchasedShema = require('../DB/schemas/userpurchasedShema')
const SignUpSchema = require('../DB/schemas/signupShema')
const { restrictToLoggedinUserOnly } = require('../midleware/midleware');
const jwt = require('jsonwebtoken')
const schedule = require('node-schedule');
const signupShema = require("../DB/schemas/signupShema");
const {secret} = require('../config/auth')


require('dotenv').config();
const router = express.Router();
router.use(express.urlencoded({ extended: false }))
const cookieParser = require('cookie-parser');
router.use(cookieParser());


router.get("/purchased", restrictToLoggedinUserOnly, async (req, res) => {
    try {
        const token = req.cookies;
        const decodedToken = jwt.verify(token.uid, secret);
        const userId = decodedToken._id;
        const userRechargeData = await SignUpSchema.findOne({ _id: userId });
        const userPhoneNumber = userRechargeData.phoneNumber;


        // const findthePhoneNumber = await userpurchasedShema.find({ phoneNumber: userPhoneNumber }, { ProduccID: userPhoneNumber });
        // const valueTest = await findthePhoneNumber.ProduccID;
        const findthePhoneNumber = await userpurchasedShema.find({ phoneNumber: userPhoneNumber });
        const purchasedProductIds = findthePhoneNumber.map(product => product.ProduccID);
        // console.log(purchasedProductIds);
        const startingDataShow = await userpurchasedShema.find({ ProduccID: { $in: purchasedProductIds } });
        // console.log(startingDataShow)
        const anotherProductCollection = await productShecma.find({ ProductID: { $in: purchasedProductIds } });
        // console.log(anotherProductCollection)
        // console.log(anotherProductCollection);
        // const anotherProductCollection = await productShecma.find({ ProductID: { $in: purchasedProductIds } });
        

        res.render('purchased', { anotherProductCollection, startingDataShow });



    } catch (error) {
        console.log(error)
    }



})

module.exports = router;
