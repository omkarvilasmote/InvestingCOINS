const mongoose = require('mongoose');


const userpurchasedShema = require('../DB/schemas/userpurchasedShema')
const express = require("express")

const router = express.Router();



async function deleteExpiredRecords() {
    const currentDate = new Date();
    // console.log(currentDate)
    try {
      await userpurchasedShema.deleteMany({ EndingDate: { $lte: currentDate } });
      console.log('Expired records deleted successfully.');
    } catch (error) {
      console.error('Error deleting expired records:', error);
    }
  }
  setInterval(deleteExpiredRecords, 24 * 60 * 60 * 1000);



  module.exports=router;