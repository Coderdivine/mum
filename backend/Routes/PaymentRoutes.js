require("dotenv").config();
const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const axios = require("axios");
const request = require("request");
const {product_detailss,order_detailss, payment_detailss} = require("../Model/index");
//send payment info 
//then make payment
//update status
const contact_service = [{
    number:"09161911394",
    email:"chimdi4332@gmail.com",
    address:"SHOP GA 11 Lagos island",
}]
router.post("/",async(req,res)=>{
    let {account_name,account_number,bank_name,amount,order_id} = req.body;
    let ide = uuid.v4();
    const payment_details = new payment_detailss({
        account_name,
        account_number,
        bank_name,
        amount,
        timer:Date.now() + (1000*15),
        order_id,
        status:"pending",
        ide
    })
    payment_details.save().then(corn=>{
        
    })
    try{

    }catch(err){

    }
})