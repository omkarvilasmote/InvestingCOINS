const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const rechargShema = require('../DB/schemas/rechargeShema')
const SignUpSchema = require('../DB/schemas/signupShema');
const WithdrawalSchema = require('../DB/schemas/withdrwalSchema')
const {secret} = require("../config/auth")

const cookieParser = require('cookie-parser');
router.use(express.urlencoded({ extended: false }))
router.use(cookieParser());
const { restrictToLoggedinUserOnly } = require('../midleware/midleware')

router.route("/Withdrwal", restrictToLoggedinUserOnly)
    .get(async (req, res) => {
        // res.render('recharge')
        // res.send("done")
        try {

            const token = req.cookies;
            // console.log(token)
            const decodedToken = jwt.verify(token.uid, secret);
            const userId = decodedToken._id;
            const userRechargeData = await SignUpSchema.findOne({ _id: userId });
            const userPhoneNumber = userRechargeData.phoneNumber;

            res.render("Withdrwal", { userPhoneNumber });


        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ message: "An error occurred" });
        }
    })
    .post(async (req, res) => {
        const token = req.cookies;
        const decodedToken = jwt.verify(token.uid, secret);
        const userId = decodedToken._id;
        const userRechargeData = await SignUpSchema.findOne({ _id: userId });
        const userPhoneNumber = userRechargeData.phoneNumber;


        const { phoneNumber, upiId, amount } = req.body;
        // console.log(req.body)
        let minimumWithdrawal = userRechargeData.recharge;
        // console.log(minimumWithdrawal)
        // if (amount < minimumWithdrawal) {
        //     return res.send("Withdrawal amount is below the minimum.");
        // }
        const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
        <title>Insufficient Funds</title>
        <link rel="stylesheet" href="styles.css">
        <style>
        /* Reset some default styles */
body, h1, p {
    margin: 0;
    padding: 0;
}

body {
    background-color: rgb(255, 195, 241);
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
}

.message-container {
    text-align: center;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin: 20px;
}

.icon-container {
    text-align: center;
    margin: 20px;
}

.icon-container img {
    max-width: 100%;
    height: auto;
}

.button-container {
    margin-top: 20px;
}

.home-button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    text-decoration: none;
}

.home-button:hover {
    background-color: #0056b3;
}

/* Media queries for responsiveness */
@media screen and (max-width: 768px) {
    .message-container {
        margin: 10px;
    }
}
</style>
    </head>
    <body>
    <div class="message-container">
        <h1>Insufficient Funds</h1>
        <p>Your account does not have sufficient funds for this transaction.</p>
    </div>
    <div class="icon-container">
        <i class="fas fa-exclamation-triangle"></i> <!-- Font Awesome icon -->
    </div>
    <div class="button-container">
        <a class="home-button" href="/profile">Go to Home</a>
    </div>
</body>


    </html>
    `;
        const cursor = await rechargShema.find({phoneNumber:userPhoneNumber});
        // console.log(cursor)


        if (cursor.length > 0) {

            if (minimumWithdrawal < amount) {
                return res.send(htmlContent);



            } else {

                const updatedUser = await SignUpSchema.findOneAndUpdate(
                    { phoneNumber },
                    { $inc: { recharge: -amount } }, // Deduct the withdrawal amount from the balance
                    { new: true } // Return the updated user object
                );
                const withdrawalRecord = new WithdrawalSchema({
                    phoneNumber,
                    upiId,
                    amount
                });
                await withdrawalRecord.save();
                const dataToShow = `<!DOCTYPE html>
        <html>
        <head>
            <title>Processing Withdrawal</title>
            <style>
                body {
                    background-color: rgb(255, 195, 241);
                    font-family: Arial, sans-serif;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                }
        
                .message-container {
                    text-align: center;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
        
                .button-container {
                    margin-top: 20px;
                }
        
                .home-button {
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                }
        
                .home-button:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="message-container">
                <h1>Processing Your Withdrawal</h1>
                <p>Your withdrawal request is being processed.</p>
            </div>
            <div class="button-container">
                <a class="home-button" href="/home">Go to Home</a>
            </div>
        </body>
        </html>
        `
                res.send(dataToShow)

                // console.log(minimumWithdrawal)
            }
        } else {
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
            <h1 style="text-align: center;font-family: 'Poppins', sans-serif;">buy paid subscription</h1>

                        <a class="home-button" href="/home"style="text-align: center;font-family: 'Poppins', sans-serif;">Go to Home</a>

        </body>
        </html>`
            res.send(dataOfSending);
        }

    })







module.exports = router;