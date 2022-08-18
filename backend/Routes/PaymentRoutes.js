require("dotenv").config();
const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const axios = require("axios");
const request = require("request");
const { product_detailss, order_detailss, payment_detailss } = require("../Model/index");
//send payment info 
//then make payment
//update status
const contact_service = [{
    number: "09161911394",
    email: "chimdi4332@gmail.com",
    address: "SHOP GA 11 Lagos island",
}];
router.post("/", async (req, res) => {
    let { account_name, account_number, bank_name, amount, order_id } = req.body;
    let ide = uuid.v4();
    amount = Number(amount);
    const data = {
        contact_service,
        account_name,
        account_number,
        bank_name,
        amount,
        order_id,
        ref:ide
    };
    
    try {
        if(account_name == "" && account_number == "" && bank_name == "" && amount == "" && order_id == ""){
            res.status(400).json({
                message:"Please all details are needed",
                status:400
            })
        }else if(account_name.length < 5){
            res.status(400).json({
                message:"Please account name invalid",
                status:400
            })
        }else if(bank_name.length < 4){
            res.status(400).json({
                message:"Bank name too short",
                status:400
            })
        }else if(typeof amount !== "number"){
            res.status(400).json({
                message:"",
                status:400
            })
        }else{
            const payment_details = new payment_detailss({
                account_name,
                account_number,
                bank_name,
                amount,
                timer: Date.now() + (1000 * 60 * 15),
                order_id,
                status: "pending",
                ide
            })
            payment_details.save().then(corn => {
                res.status(201).json({
                    message:"Payment account init",
                    data,
                    status:201
                })
            }).catch(err=>{
                res.json({
                    message:`Err: ${err.message}`,
                    status:501
                })
            })
        }
    } catch (err) {

    }
})