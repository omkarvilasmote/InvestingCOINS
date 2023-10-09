const express = require('express');
const app = express();
const ejs = require('ejs')
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;


const milka = require('./routes/index')
const database = require('./DB/mongodb')
const postdata = require('./DB/login')
const loginwithidpass = require('./DB/loginwithidpass');
const balanceCheck = require('./balance/balanceCheck')
const recharge = require('./balance/recharge')
const BuyandSaveDB = require('./productsBuy/BuyandSaveDB');
const showInPuchased = require('./productsBuy/showInPurchased')
const addMoneyToprofile = require('./productsBuy/addMoneyToprofile')
const timeToDeletedata = require('./productsBuy/timeToDeleteData')
const logOut = require("./Profile/logout")
const Withdrwal = require('./balance/withdrwal')
const cookieParser = require('cookie-parser');


app.use(cookieParser())
app.set('view engine', 'ejs');
app.use(express.static('public'));

require('dotenv').config();


app.use(milka);
app.use(postdata);
app.use(loginwithidpass);
app.use(balanceCheck);
app.use(recharge);
app.use(BuyandSaveDB);
app.use(showInPuchased);
app.use(addMoneyToprofile);
app.use(timeToDeletedata)
app.use(logOut)
app.use(Withdrwal)


app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
  });
  