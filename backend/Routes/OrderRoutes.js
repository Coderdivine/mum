require("dotenv").config();
const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const axios = require("axios");
const request = require("request");
const {product_detailss,order_detailss, payment_detailss} = require("../Model/index");
//add a order,
//update a order,
//get order info,
const payment_cards = [{

}]
router.post("/order-details",async(req,res)=>{
    let {firstname,lastname,country,address,city,phone_number,email,type,company,product} = req.body;
    try{
        if(firstname == "" || lastname == "" || country == "" || address == "" || city == "" || type == "" || company == "" || typeof product !== "object"){
            res.status(400).json({
                message:"Please all details are required",
                status:400
            })
        }else if(address == "" || address.length < 10 || typeof address !== "stirng"){
            res.status(400).json({
                message:"Please input a valid address",
                status:400
            })
        }else if(phone_number.length < 8){
            res.status(400).json({
                message:"Please input a vaild phone number",
                status:400
            })
        }else if(email = "" || email.length < 8){
            res.status(400).json({
                message:"Please input a valid email address",
                status:400
            })
        }else {
            let ide = uuid.v4();
            const order_details = new order_detailss({
                firstname,
                lastname,
                country,
                address,
                city,
                phone_number,
                email,
                type,
                ide,
                company,
                product,
                date:Date.now()
            });
            order_details.save().then(corn=>{
               if(type == "pickup"){
                res.status(201).json({
                    message:"We sent your order id to your email address",
                    status:201
                })
               }else if(type == "delivery"){
                res.status(201).json({
                    message:"Order packed",
                    data:payment_cards,
                    ide
                })
               }else{
                 res.status(400).json({
                    message:"Product type can't be read",
                    status:400
                 })
               } 
            }).catch(err=>{
                res.status(err.status).json({
                    message:`Er: ${err.message}`,
                    status:err.status
                })
            })
        }
    }catch(err){
        res.status(err.status).json({
            message:`Err: ${err.message}`,
            status:err.status
        })
    }
})