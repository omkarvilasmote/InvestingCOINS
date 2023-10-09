const mongodb = require('mongoose');


const SignUpSchema = new mongodb.Schema({
    ProductID: {
        type: Number
    },
    Name: {
        type: String
    },
    Days: {
        type: Number

    },
    Ernning: {
        type: Number
    },
    price: {
        type: Number
    }
})



module.exports = mongodb.model("products", SignUpSchema);