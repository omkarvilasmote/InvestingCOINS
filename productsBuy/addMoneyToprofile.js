const express = require("express")
const mongoose = require("mongoose")
const productShecma = require('../DB/schemas/Product');
const userpurchasedShema = require('../DB/schemas/userpurchasedShema')
const SignUpSchema = require('../DB/schemas/signupShema')
const { parseISO } = require('date-fns');

const cron = require('node-cron');


const router = express.Router();
router.use(express.urlencoded({ extended: false }))


async function main() {

        try {


                const allPhoneNumbers = await SignUpSchema.find({}, { phoneNumber: 1, _id: 0 });
                const phoneNumbersArray = allPhoneNumbers.map(doc => doc.phoneNumber);
                // console.log(phoneNumbersArray);


                // const startingDataShow = await userpurchasedShema.find({}, { phoneNumber: 1, _id: 0 });
                // const phoneNumbersArrayFor = startingDataShow.map(doc => doc.phoneNumber);
                // console.log(phoneNumbersArrayFor);



                userpurchasedShema.find({}, 'phoneNumber Ernning')
                        .exec()
                        .then(results => {
                                const dataArray = results.map(item => {
                                        return {
                                                phoneNumber: item.phoneNumber,
                                                Earning: item.Ernning
                                        };
                                });
                                // console.log('Retrieved data array:', dataArray);
                                cron.schedule('0 0 */24 * * *', async () => {
                                        dataArray.forEach(item => {
                                                SignUpSchema.findOneAndUpdate(
                                                        { phoneNumber: item.phoneNumber },
                                                        { $inc: { recharge: item.Earning } },
                                                        { new: true }
                                                )
                                                        .then(updatedDocument => {
                                                                console.log(`Updated Earning for`);
                                                        })
                                                        .catch(error => {
                                                                console.error(`Error updating Earning for`);
                                                        });
                                        });
                                })

                        })
                        .catch(err => {
                                console.error('Error retrieving data', err);
                        });




        } catch (error) {
                console.log(error)
        }
}
main()

module.exports = router;