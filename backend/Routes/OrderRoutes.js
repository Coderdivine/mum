require("dotenv").config();
const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const axios = require("axios");
const request = require("request");
const {product_detailss,order_detailss, payment_detailss} = require("../Model/index");
//add a order, stiil need to calc del price.
//get order info,
const payment_cards = [{
 account_name:"",
 account_bank:"",
 account_number:"",
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
router.get("/order-info/:ide",async(req,res)=>{
    let { ide } = req.params;
    order_detailss.find({ide})
    .then(corn=>{
        if(corn.length){
            res.status(200).json({
                message:"Order found",
                data:corn,
                status:200
            })
        }else{
            res.status(400).json({
                message:"This order was not found",
                status:400
            })
        }
    }).catch(err=>{
        res.status(400).json({
            message:err.message,
            status:err.status
        })
    })
});
router.post("/order-update",(req,res)=>{
    let { ide } = req.body;
    order_detailss.find({ide}).then(async(cornt)=>{
        const data = cornt[0].product;
        IncrementProduct(data).then(corn=>{
            if(corn.bool){
                res.status(201).json({
                    message:corn.message,
                    status:201
                })
            }else{
                res.status(400).json({
                    message:corn.message
                })
            }
        })
        .catch(err=>{
            res.status(err.status).json({
                message:`Err: ${err.message}`,
            status:err.message
            })
        })
    }).catch(err=>{
        res.status(err.status).json({
            message:`Err: ${err.message}`,
        status:err.message
        })
    });
})
async function IncrementProduct(data){
    try{
    if(typeof data == "object"){
        return {
           bool:false,
           message:"data type if not defined" 
        }
    }else if(!data[0].name){
        return {
            bool:false,
            message:"data type if not defined" 
         }
    }else{
        let cc = 0;
        for(let i=0;data.length;i++){
            let ide = data[i].product_id;
            let sold = Number(data[i].quantity);
            const aa = await product_detailss.find({ide});
            if(aa.length){
                sold = Number(aa[0].sold) + sold;
            const result = await product_detailss.upadteOne({ide},{sold})
            if(result){
             cc++;
             if(cc == data.length){
                return {
                    bool:true,
                    message:"Done Updated"
                }
             }
            }
            }else{
                return {
                    bool:false,
                    message:"IDE nit defined"
                }
            }
        };
}
    }catch(err){
        return {
            bool:false,
            message:err.message
        }
    }

}
module.exports = router;