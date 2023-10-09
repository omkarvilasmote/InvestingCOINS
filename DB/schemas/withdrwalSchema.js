const mongodb = require('mongoose');


const WithdrawalSchema = new mongodb.Schema({
    phoneNumber:{
        type:Number,
        required:true
    },
    upiId:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    }
})



module.exports = mongodb.model("Withdrawal",WithdrawalSchema);