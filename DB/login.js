const mongoose = require('mongoose');
const SignUpSchema = require('../DB/schemas/signupShema')
const express = require('express');
require('dotenv').config();
const router = express.Router();
const twilio = require('twilio');
const bodyParser = require('body-parser');
const {restrictToLoggedinUserOnly} = require('../midleware/midleware')

router.use(express.json())
router.use(express.urlencoded({ extended: false }))


// router.get("/", async (req,res)=>{
//     res.send("login page")
// })


const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = twilio(accountSid, authToken);

// Simulated OTP storage (for demonstration purposes)
const otpStorage = new Map();

router.post('/send-otp',restrictToLoggedinUserOnly, async (req, res) => {

    const phoneNumber = req.body.phoneNumber;

    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStorage.set(phoneNumber, otp.toString());

    try {
        await client.messages.create({
            body: `Your OTP: ${otp}`,
            to: phoneNumber,
            from: process.env.PHONENUMBER
        });
        res.send('OTP sent successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to send OTP');
    }

});

router.post('/verify-otp',restrictToLoggedinUserOnly, async(req, res) => {
    const phoneNumber = req.body.phoneNumber;
    const enteredOtp = req.body.otp;
    const result = await SignUpSchema.findOne({ phoneNumber: phoneNumber });
    if (result) {
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
            </style>
        </head>
        <body>
            <div class="centerOne">
        <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h1 style="text-align: center;font-family: 'Poppins', sans-serif;">Alredy exist person</h1>
        </body>
        </html>`
        res.send(dataOfSending)
    } else {

        // console.log('Phone Number:', phoneNumber); // Debugging line

        const storedOtp = otpStorage.get(phoneNumber);
        // console.log('Stored OTP:', storedOtp); // Debugging line

        if (enteredOtp === storedOtp) {
            otpStorage.delete(phoneNumber);
            let data = new SignUpSchema(req.body);
            // console.log(data)

            data.save().then(() => {
                return res.redirect('/login')
            }).catch((err) => {
                console.log(err)
                return res.send("please check your feialds")
            })
        } else {
            res.status(400).send('Invalid OTP');
        }
    }
});


module.exports = router;