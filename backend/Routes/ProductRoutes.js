require("dotenv").config();
const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const axios = require("axios");
const request = require("request");
const {product_detailss,order_detailss, payment_detailss} = require("../Model/index");
//add a product,
//edit a product,
//delete a product,
//get all product
//get product info
//
router.post("/product-details",async(req,res)=>{
    let {name,rate,quantity,brand,category,price,description,sizes,color,image,weight} = req.body;
    price = Number(price);
    try{
       if(name == "" || rate == "" || quantity == "" || brand == "" || category == ""){
        res.status(400).json({
            message:"Product details are needed",
            status:400
        })
       }else if(typeof price  !== "number"){
        res.status(400).json({
            message:"Amount must be a number",
            status:400
        })
       }else if(description == "" || description.length < 6 ){
        res.status(400).json({
            message:"Description must be greater than six letters",
            status:400
        })
       }else if(sizes == "" || color == "" || image == "" || weight == ""){
        res.status(400).json({
            message:"Product property is needed",
            status:400
        })
       }else{
        let ide = uuid.v4();
        const product_details = new product_detailss({
            name,
            rate,
            sold_out:false,
            quantity,
            sold:"0",
            brand,
            category,
            ide,
            price,
            description,
            sizes,
            color,
            image,
            weight
        });
        product_details.save().then(corn=>{
            res.status(201).json({
                message:"New Product Added",
                status:201
            })
        }).catch(err=>{
            res.status(401).json({
                message:`Product err: ${err.message}`,
                status:err.status
            })
        })
       }

    }catch(err){
        res.status(err.status).json({
            message:err.message,
            status:err.status
        })
    }
    
})
router.path("/edit-product",async(req,res)=>{
    let { ide } = req.body;
    try{
        product_detailss.find({ide}).then(cornt=>{
            if(cornt.length){

            }else{

            }
        }).catch(err=>{
            res.status(err.status).json({
                message:err.message,
                status:err.status
            })
        })
    }catch(err){
        res.status(err.status).json({
            message:`Err: ${err.message}`,
            status:err.status
        })
    }
})