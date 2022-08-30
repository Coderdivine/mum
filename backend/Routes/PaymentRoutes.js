require("dotenv").config();
const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const axios = require("axios");
const request = require("request");
const AxiosCont = require("./AxiosCont");
const { product_detailss, order_detailss, payment_detailss } = require("../Model/index");
//send payment info 
//then make payment
//update status
//view payment
const contact_service = [{
    number: "09161911394",
    email: "chimdi4332@gmail.com",
    address: "SHOP GA 11 Lagos island",
}];
const payment_cards = [{
 account_name:"",
 account_bank:"",
 account_number:"",
}]
router.post("/send-payment", async (req, res) => {
    let { account_name, account_number, bank_name, 
        amount, order_id } = req.body;
    let ide = uuid.v4();
    amount = Number(amount);
    const data = {
        contact_service,
        payment_cards,
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
                message:"Amount not defined",
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
            let email = 'chimdi4332@gmail.com';
            let message = "Payment in process. \n Please make payment within 15min";
             payment_details.save().then(async(corn)=> {
                res.status(200).json({
                    message,
                    data,
                    status
                })
            }).catch(err=>{
                res.json({
                    message:`Err: ${err.message}`,
                    status:501
                })
            })
        }
    } catch (err) {
        res.status(err.status).json({
            message:`Err: ${err.message}`,
            status:err.status
        })
    }
});
router.post("/update-payment",async(req,res)=>{
    let {ide} = req.body;
    try{
       if(ide == ""){
        res.status(400).json({
            message:"No ide",
            status:400
        })
       }else if(typeof ide == "undefined"){
        res.status(400).json({
            message:"IDE undefined",
            status:400
        })
       }else{
        payment_detailss.find({ide})
        .then(show=>{
            if(show.length){
                let data = show[0];
                if(Date.now() < data.timer){
                    payment_detailss.updateOne({ide},{status:"done"})  
                    .then(corn=>{
                        ide = data.order_id;
                        AxiosCont.post("/order/order-update",{ide})
                        .then(uu=>{
                            res.status(201).json({
                                message:`Payment Updated`,
                                data:uu.data,
                                status:201
                            })
                        }).catch(err=>{
                            res.status(400).json({
                                message:err.message,
                            status:400
                            })
                        })

                    }).catch(err=>{
                        res.status(400).json({
                            message:`Err: ${err.message}`,
                            status:400
                        })
                    });
                }else{
                    payment_detailss.updateOne({ide},{status:"hold"})  
                    .then(corn=>{
                        res.status(201).json({
                            message:`Time expired`,
                            data:contact_service,
                            status:201
                        })
                    }).catch(err=>{
                        res.status(err.status).json({
                            message:`Err: ${err.message}`,
                            status:err.status
                        })
                    });
                }
            }else{
                res.status(400).json({
                    message:"IDE not found",
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
    }catch(error){
        res.status(error.message).json({
            message:`Err: ${error.message}`,
            status:error.message
        });
    }
});
router.get("/check-payment/:ide",(req,res)=>{
    let { ide } = req.params;
    payment_detailss.find({ide})
    .then(corn=>{
        if(corn.length){
            res.status(200).json({
                message:"Message found",
                data:corn,
                status:200
            })
        }else{
            res.status(400).json({
                message:"Details not found",
                status:400
            })
        }
    }).catch(err=>{
        res.status(err.status).json({
            message:`Err: ${err.message}`,
        status:err.message
        })
    })
})
async function sendMail({email,message,data},res){
    try{
        const options = {
            method: 'POST',
            url: 'https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Host': 'rapidprod-sendgrid-v1.p.rapidapi.com',
                'X-RapidAPI-Key': process.env.AUTH_KEY,
                useQueryString: true
            },
            body: {
                personalizations: [{ to: [{ email: email }], subject: `${message.length > 15 ? message.substring(0, 15) + "..." : message}` }],
                from: { email: process.env.AUTH_PASS_EMAIL },
                content: [{
                    type: 'text/html', value:
                    ``}]
            },
            json: true
        };
        request(options, function (error, response, body) {
            if (error) {
                res.status(500).json({
                    message: `${error.message}`
                })
            } else {
               res.status(200).json({
                message,
                status:200
               })
            }
        });
    }catch(error){
        res.status(error.status)
        .json({
            message:`Err: ${err.message}`,
            status:error.status
        })
    }
}
module.exports = router;
