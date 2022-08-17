require("dotenv").config();
const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const axios = require("axios");
const {product_detailss,order_detailss, payment_detailss} = require("../Model/index");
//add a product,
//edit a product,
//delete a product,
//get all product
//get product info
//
router.post("/product-details",(req,res)=>{
    
})