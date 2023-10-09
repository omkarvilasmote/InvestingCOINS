const express = require('express');
const mongoose = require('mongoose');
// const router = require('../routes');
const { restrictToLoggedinUserOnly } = require('../midleware/midleware');
const productShecma = require('../DB/schemas/Product');
const userpurchasedShema = require('../DB/schemas/userpurchasedShema')
const SignUpSchema = require('../DB/schemas/signupShema')
const jwt = require('jsonwebtoken')
const ejs = require('ejs')
const {secret} = require('../config/auth')

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Months are 0-indexed
const day = currentDate.getDate();


router = express.Router();
router.use(express.urlencoded({ extended: false }))
const cookieParser = require('cookie-parser');
router.use(cookieParser());
try {
    router.route('/home', restrictToLoggedinUserOnly)

        .get((req, res) => {
            res.render('index');
        })
        .post(async (req, res) => {
            const userData = req.body.product;
            const userProductData = await productShecma.findOne({ ProductID: userData });
            const userProductPrice = userProductData.price;
            // console.log(userProductPrice)

            const token = req.cookies;
            const decodedToken = jwt.verify(token.uid, secret);
            const userId = decodedToken._id;
            const userRechargeData = await SignUpSchema.findOne({ _id: userId });
            const userPhoneNumber = userRechargeData.phoneNumber;
            let rechargeAmount = userRechargeData.recharge;
            // console.log(rechargeAmount)


            const findthePhoneNumber = await userpurchasedShema.find({ phoneNumber: userPhoneNumber, ProduccID: userData });
            // console.log(findthePhoneNumber)
            if (findthePhoneNumber.length > 0) {
                const dataOfSendingOne = `<!DOCTYPE html>
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
            </style>
        </head>
        <body>
            <div class="centerOne">
            <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h1 style="text-align: center;font-family: 'Poppins', sans-serif;">You have purchased alredy</h1>
        </body>
        </html>`
                res.send(dataOfSendingOne)
                // console.log(findthePhoneNumber);
                // Continue with the rest of your code here
            }
            else {
                if (rechargeAmount >= userProductPrice) {
                    rechargeAmount -= userProductPrice;
                    userRechargeData.recharge = rechargeAmount;
                    await userRechargeData.save();

                    // const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
                    const formattedDate = new Date();
                    // const findStartingdate = await userpurchasedShema.findOne(userRechargeData.StartingDate);
                    // console.log(findStartingdate)
                    // const daysValueFromDatabase = await productShecma.findOne(userData.Days);
                    const daysValueFromDatabase = await productShecma.findOne({ ProductID: userData });
                    const daysFromBD = daysValueFromDatabase.Days;
                    const ErnningValue = daysValueFromDatabase.Ernning;
                    console.log(ErnningValue);
                    // console.log("ernning",ErnningValueFromDatabase)

                    const calculatedDate = new Date(formattedDate.getTime() + daysFromBD * 24 * 60 * 60 * 1000);

                    let data = new userpurchasedShema({
                        phoneNumber: userPhoneNumber,
                        StartingDate: formattedDate,
                        EndingDate: calculatedDate,
                        Ernning: ErnningValue,
                        ProduccID: userData
                    });
                    data.save()
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
                    color: green;
                    font-size: 120px;
                }
            </style>
        </head>
        <body>
            <div class="centerOne">
            <i class="fa-solid fa-circle-check"></i>
            </div>
            <h1 style="text-align: center;font-family: 'Poppins', sans-serif;">successfully purchased</h1>
        </body>
        </html>`
                    res.send(dataOfSending)
                    
                } else {
                    const dataOfSendingTwo = `<!DOCTYPE html>
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
            </style>
        </head>
        <body>
            <div class="centerOne">
            <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h1 style="text-align: center;font-family: 'Poppins', sans-serif;">Insufficient balance</h1>
        </body>
        </html>`
                    res.send(dataOfSendingTwo);
                }
            }
        })



} catch (error) {
    res.send(error)
}

module.exports = router;