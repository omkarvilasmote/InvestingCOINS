const mongodb = require('mongoose');


const SignUpSchema = new mongodb.Schema({
    fullName:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,Number,
        required:true
    },
    recharge:{
        type:Number,
        default: 0
    }
})



module.exports = mongodb.model("login",SignUpSchema);