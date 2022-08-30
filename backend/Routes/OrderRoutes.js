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
 account_name:"Ezechukwu Uchechukwu",
 account_bank:"Sterling Bank PLC",
 account_number:"0073700400",
}];
router.post("/order-details",async(req,res)=>{
    let {firstname,lastname,country,address,city,phone_number
        ,email,type,company,product} = req.body;
    try{
        if(firstname == "" || lastname == "" || country == "" || address == "" || city == "" || type == "" || company == ""){
            res.status(400).json({
                message:"Please all details are required",
                status:400
            })
        }else if(address == "" || address.length < 10 ){
            //|| typeof address !== "stirng"
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
            let data = {
                payment_cards,
                firstname,
                lastname,
                country,
                email,
                message:"Thank you for your purchase. Please find your order summary below.",
                product
            }
            order_details.save().then(async (corn)=>{
               if(type == "pickup"){
                let message = "We sent your order id to your email address";
                await sendMail({email,message,data},res)
               }else if(type == "delivery"){
                let message = "Order packe";
                await sendMail({email,message,data},res);
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
router.get("/all-order-info",async(req,res)=>{
    let { ide } = req.params;
    order_detailss.find()
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
        console.log("data",data);
    if(typeof data !== "object"){
        console.log("data")
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
        console.log("entering loop")
        let cc = 0;
        for(let i=0;data.length;i++){
            console.log("cc",i)
            let ide = data[i].product_id;
            console.log("ide",ide)
            let sold = Number(data[i].quantity);
            const aa = await product_detailss.find({ide});
            if(aa.length){
                console.log("yes")
                sold = Number(aa[0].sold) + sold;
            const result = await product_detailss.updateOne({ide},{sold})
            console.log(result);
            if(result){
                console.log("yes_two")
             cc++;
             if(cc == data.length){
                console.log("yes_three")
                return {
                    bool:true,
                    message:"Done Updated"
                }
             }
            }else{return{bool:false,message:"resut was not defined"}}
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

};
async function sendMail({email,message,data},res){
    const products = data.product.map(x=>`
    <div>
    <tbody>
                      <tr>
                        <td style="vertical-align:top;padding:0px 25px;">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#34393E;" width="100%">
                            <tbody><tr>
                              <td align="left" class="receipt-table" style="font-size:0px;padding:30px;word-break:break-word;">
                                <table cellpadding="0" cellspacing="0" width="100%" border="0" style="color:#000000;font-family:Roboto, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:100%;border:none;">
                                  <tbody><tr>
                                    <th colspan="3" style="font-size: 20px; line-height: 30px; font-weight: 500; color: #fff; padding: 0px 0px 10px 0px; text-align: center; border-bottom: 1px solid #555;" align="center">Order summary </th>
                                  </tr>
                                  <tr>
                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; width: 60%; padding-top: 10px;" width="60%">${x.name}</td>
                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; text-align: right; width: 20%;" width="20%" align="right">id: ${x.product_id}</td>
                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; text-align: right; width: 20%;" width="20%" align="right">NGN${amount}</td>
                                  </tr>
                                  <tr>
                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal;">Product description</td>
                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; text-align: right; padding: 0 0 10px;" align="right">size: ${x.size}</td>
                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; text-align: right; padding: 0 0 10px;" align="right">color: ${x.color}</td>
                                  </tr>
                                  
                                </tbody></table>
                              </td>
                            </tr>
                          </tbody></table>
                        </td>
                      </tr>
                    </tbody>
    </div>`)
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