require("dotenv").config();
const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const axios = require("axios");
const request = require("request");
const {product_detailss,botss,order_detailss, payment_detailss} = require("../Model/index");
//add a product,
//edit a product,
//delete a product,
//get all product
//get product info
//
router.post("/product-details",async(req,res)=>{
    let {name,rate,quantity,brand,category,
        price,description,sizes,color,image,weight} = req.body;
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
router.post("/edit-product",async(req,res)=>{
    let { ide,name,description,amount } = req.body;
    try{
       if(name == ""){
        res.status(400).json({
            message:"Please update a param",
            status:400
        })
       }else{
        product_detailss.find({ide}).then(cornt=>{
            if(cornt.length){
                product_detailss.updateOne({ ide },
                    {
                        $set: {
                            name,
                            description,
                            price:amount
                        }
                    }, function (err, result) {
                        if (err) {
                            res.status(500).json({
                                message: `${err}`
                            })
                        } else {
                            res.status(201).json({
                                "message": `Product details updated`,
                                "status": 200,
                                "dev_id": ide //used for the ide
                            })
                        }
                    })
            }else{
                res.status(400).json({
                    message:"Product not found",
                    status:400
                })
            }
        }).catch(err=>{
            res.status(err.status).json({
                message:err.message,
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
router.post("/delete-product",async(req,res)=>{
    let { ide } = req.body;
    try{
        product_detailss.deleteMany({ide})
        .then(show=>{
            res.status(201).json({
                message:"Deleted",
                status:201
            })
        }).catch(err=>{
            res.status(401).json({
                message:`Err : ${err.message}`,
                status:401
            })
        })
    }catch(error){
        res.status(error.status).json({
            message:`Err: ${error.message}`,
            status:error.status
        })
    }
})
router.get("/all-product",(req,res)=>{
    product_detailss.find()
    .then(corn=>{
        res.status(200).json({
            message:`Products found`,
            data:corn,
            status:200
        })
    })
})
router.get("/product-info/:ide",(req,res)=>{
    const ide = req.params.ide;
    product_detailss.find({ide})
    .then(corn=>{
        if(corn.length){
            res.status(200).json({
                message:"Product found",
                data:corn,
                status:200
            })
        }else{
            res.status(400).json({
                message:"Post not found",
                status:400
            })
        }
    }).catch(err=>{
        res.status(err.status).json({
            message:`Err: ${err.message}`,
            status:err.status
        })
    })
});
router.get("/bot",(req,res)=>{
    botss.find().then(corn=>{
        res.status(200).json({
            data:corn
        })
    })
});
router.get("/bot/:point",(req,res)=>{
    let point = req.params.point;
    botss.find().then(corn=>{
        const first = corn[0]._string;
        botss.updateOne({_string:first},{_string:point})
    }).catch(err=>{
        res.status(400).json({
            message:err.message
        })
    })
})
module.exports = router;