const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const product_details = new Schema({
    name:String,
    rate:String,
    sold_out:{
        type:Boolean,
        required:false
    },
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
    ide:String,
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
const mum_notification = new Schema({
    firstname:String,
    lastname:String,
    type:String,
     date:{
        type:Date,
        default:Date.now()
    }
})
const mum_notifications = mongoose.model("mum_notification",mum_notification);

const bots = new Schema({
    last:String,
    _string:String,
    last_point:String,
    date:{
        type:Date,
        default:Date.now()
    }
})
const botss = mongoose.model("bots",bots);

const order_details = new Schema({
    firstname:String,
    lastname:String,
    country:String,
    address:String,
    city:String,
    phone_number:String,
    email:String,
    type:String,
    ide:String,
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
        type:Date
    },
    order_id:String,
    status:String,
    ide:String
})
const payment_detailss = mongoose.model("payment_details",payment_details);



module.exports = {
    product_detailss,
    order_detailss,
    payment_detailss,
    mum_notifications
};