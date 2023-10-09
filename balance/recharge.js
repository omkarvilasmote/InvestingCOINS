const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const router = express.Router()
const crypto = require('crypto');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const rechargShema = require('../DB/schemas/rechargeShema')
const SignUpSchema = require('../DB/schemas/signupShema');
const cors = require('cors')
const {secret} = require("../config/auth")
const { restrictToLoggedinUserOnly } = require('../midleware/midleware')


//app setting
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(bodyParser.json());
router.use(cookieParser());
router.use(cors())


router.route('/recharge')
    .get((req, res) => {
        res.render('recharge');
    });

const razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRETE,
});
router.route('/order',restrictToLoggedinUserOnly)
    .post(async (req, res) => {
        const amount = req.body.amount;
        // console.log(amount)

        const options = {
            amount: amount * 100,
            currency: 'INR',
        };
        try {
            razorpay.orders.create(options, function (err, order) {
                res.json(order);
                // console.log(order)
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Something went wrong');
        }
    });


router.route('/is-order-complete',restrictToLoggedinUserOnly)
    .post(async (req, res) => {
        try {
            const paymentDocument = await razorpay.payments.fetch(req.body.razorpay_payment_id);


            if (paymentDocument.status == 'captured') {
                const token = req.cookies;
                // console.log(token);
                const decodedToken = jwt.verify(token.uid, secret);
                const userId = decodedToken._id;
                const userRechargeData = await SignUpSchema.findOne({ _id: userId });
                const userPhoneNumber = userRechargeData.phoneNumber;
                // console.log(userPhoneNumber)

                const orderI = paymentDocument.id;
                const amountR = paymentDocument.amount;
                const amount = amountR / 100;
                // console.log(amount)

                const uniqueIdentifier = orderI;
                const paymentExists = await rechargShema.findOne({ ORDERID: uniqueIdentifier });
                if (paymentExists) {
                    // Payment with the same unique identifier already exists, so skip processing
                    const dataOfSending = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
                crossorigin="anonymous" referrerpolicy="no-referrer" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,500;0,600;0,800;1,900&display=swap"
                rel="stylesheet">
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error</title>
            <style>
                .centerOne{
                    width: 100%;
                    height: 200px;
                    display: flex;
            flex-wrap: wrap;
            justify-content: center;
                }
                .centerOne i{
                    color: red;
                    font-size: 120px;
                }

        
                .home-button {
                    justify-content: center;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    text-align: center;
                    display: flex;
            flex-wrap: wrap;
                }
        
            </style>
        </head>
        <body>
            <div class="centerOne">
        <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h1 style="text-align: center;font-family: 'Poppins', sans-serif;">Payment has already been processed</h1>

                        <a class="home-button" href="/home"style="text-align: center;font-family: 'Poppins', sans-serif;">Go to Home</a>

        </body>
        </html>`
                    res.send(dataOfSending);
                    return;
                }
                const multipleDocuments = [
                    {
                        phoneNumber: userPhoneNumber,
                        amount: amount,
                        ORDERID: orderI
                    },
                ];
                const insertManyResult = await rechargShema.insertMany(multipleDocuments);



                const updateResult = await SignUpSchema.updateOne(
                    { _id: userRechargeData },
                    { $inc: { recharge: amount } }
                );
                // console.log(updateResult)

                const datadoneSending = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
                crossorigin="anonymous" referrerpolicy="no-referrer" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,500;0,600;0,800;1,900&display=swap"
                rel="stylesheet">
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error</title>
            <style>
                .centerOne{
                    width: 100%;
                    height: 200px;
                    display: flex;
            flex-wrap: wrap;
            justify-content: center;
                }
                .centerOne i{
                    color: green;
                    font-size: 120px;
                }
                .home-button {
                    justify-content: center;
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    text-align: center;
                    display: flex;
            flex-wrap: wrap;
            </style>
        </head>
        <body>
            <div class="centerOne">
            <i class="fa-solid fa-circle-check"></i>
            </div>
            <h1 style="text-align: center;font-family: 'Poppins', sans-serif;">Payment was Done</h1>
            <a class="home-button" href="/home"style="text-align: center;font-family: 'Poppins', sans-serif;">Go to Home</a>
        </body>
        </html>`
                    res.send(datadoneSending)
            } else {
                res.status(400).send("Payment was not captured");
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred");
        }
    });


module.exports = router;

