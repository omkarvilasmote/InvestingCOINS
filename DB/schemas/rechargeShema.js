const mongodb = require('mongoose');



const rechargeSchema = new mongodb.Schema({
    phoneNumber:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    ORDERID:{
        type:String,
        required:true
    }
})



module.exports = mongodb.model("Recharge",rechargeSchema);