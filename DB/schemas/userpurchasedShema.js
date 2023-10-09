const mongodb = require('mongoose');


const SignUpSchema = new mongodb.Schema({
    phoneNumber:{
        type:Number,
        required:true
    },
    StartingDate:{
        type:Date,
        default: 0
    },
    EndingDate:{
        type:Date,
        default: 0
    },
    Ernning:{
        type:Number,
        default: 0
    },
    ProduccID:{
        type:Number,
        default:0
    }
})



module.exports = mongodb.model("UserSubscription",SignUpSchema);