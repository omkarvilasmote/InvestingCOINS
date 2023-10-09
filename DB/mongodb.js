const mongoose = require("mongoose");
require('dotenv').config();

const database = mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to DB");
}).catch((error) => {
    console.error("Error connecting to DB:", error);
});

module.exports = database;
