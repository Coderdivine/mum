const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const product_details = new Schema({
    name:String,
    rate:String,
    sold_out:Boolean,
    quantity:String,
    sold:String,
    brand:{
        type:String,
        required:false
    },
    category:{
        type:String,
        required:true
    },
    id:String,
    price:Number,
    description:{
        type:String,
        required:true
    },
    sizes:String,
    color:String,
    image:String,
    weight:String,
    date:{
        type:Date,
        default:Date.now()
    }
})
const product_detailss = mongoose.model("product_details",product_details);

const order_details = new Schema({
    firstname:String,
    lastname:String,
    country:String,
    address:String,
    city:String,
    phone_number:String,
    email:String,
    type:String,
    company:{
        type:String,
        required:false
    },
    product:[
        {
            name:String,
            size:String,
            color:String,
            amount:String,
            product_id:String,
            quantity:String
        }
    ],
    date:{
        type:Date,
        default:Date.now()
    }
})
const order_detailss = mongoose.model("order_details",order_details);

const payment_details = new Schema({
    account_name:String,
    account_number:String,
    bank_name:String,
    amount:String,
    timer:{
        type:Date.now()
    },
    status:String 
})
const payment_detailss = mongoose.model("payment_details",payment_details);



module.exports = {
    product_detailss,
    order_detailss,
    payment_detailss
};