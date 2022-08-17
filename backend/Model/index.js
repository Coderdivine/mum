const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const product_details = new Schema({})
const product_detailss = mongoose.model("product_details",product_details);

const order_details = new Schema({})
const order_detailss = mongoose.model("order_details",order_details);

const payment_details = new Schema({})
const payment_detailss = mongoose.model("payment_details",payment_details);



module.exports = {
    product_detailss,
    order_detailss,
    payment_detailss
};