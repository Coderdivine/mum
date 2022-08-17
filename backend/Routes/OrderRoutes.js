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
router.post("/order-details",async(req,res)=>{
    let {firstname,lastname,country,address,city,phone_number,email,type,company,product} = req.body;
    try{
        if(firstname == "" || lastname == "" || country == "" || address = ""){
            res.status().json({
                message:"Please all details are required",
                status:400
            })
        }else if(){

        }
    }catch(err){
        res.status(err.status).json({
            message:`Err: ${err.message}`,
            status:err.status
        })
    }
})