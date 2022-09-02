require("dotenv").config();
const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const axios = require("axios");
const request = require("request");
const {product_detailss,order_detailss, payment_detailss,mum_notifications} = require("../Model/index");
//add a order, stiil need to calc del price.
//get order info,
const payment_cards = [{
 account_name:"Ezechukwu Uchechukwu",
 account_bank:"Sterling Bank PLC",
 account_number:"0073700400",
}];
router.post("/order-details",async(req,res)=>{
    try{
        let {firstname,lastname,country,address,city,phone_number
            ,email,type,company,product} = req.body;
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
        }else if(email == "" || email.length < 8){
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
                product,
                ide
            }
            order_details.save().then(async (corn)=>{
               if(type == "pickup"){
                let message = "We sent your order id to your email address";
                let mum_notification = new mum_notifications({
                  firstname,
                  lastname,
                  type
                })
                mum_notification.save().then(async()=>{
                  await sendMail({email,message,data},res)
                })
               }else if(type == "delivery"){
                let message = "Order packed";
                let mum_notification = new mum_notifications({
                  firstname,
                  lastname,
                  type
                })
                mum_notification.save().then(async()=>{
                  await sendMail({email,message,data},res);
                })
               }else{
                 res.status(400).json({
                    message:"Product type can't be read",
                    status:400
                 })
               } 
            }).catch(err=>{
                res.status(400).json({
                    message:`Er: ${err.message}`,
                    status:401
                })
            })
        }
    }catch(err){
        res.status(400).json({
            message:`Err: ${err.message}`,
            status:400
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
            status:400
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
            status:400
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
            res.status(400).json({
                message:`Err: ${err.message}`,
            status:err.message
            })
        })
    }).catch(err=>{
        res.status(400).json({
            message:`Err: ${err.message}`,
        status:err.message
        })
    });
})
router.get("/get-notification",(req,res)=>{
  try{
    mum_notifications.find()
    .then(put=>{

    }).catch(err=>{
      res.status(400).json({
        message:"Notification",
        data:put
      })
    })

  }catch(err){

  }
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
    try{
        const products = await data.product.map(x=>`
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
                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; text-align: right; width: 20%;" width="20%" align="right">NGN${x.amount}</td>
                                  </tr>
                                  <tr>
                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal;">Product description</td>
                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; text-align: right; padding: 0 0 10px;" align="right">size: ${x.size}</td>
                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; text-align: right; padding: 0 0 10px;" align="right">Quantity: ${x.quantity}</td>
                                  </tr>
                              
                                </tbody></table>
                              </td>
                            </tr>
                          </tbody></table>
                        </td>
                      </tr>
                    </tbody>
    </div>`);
    console.log(products)
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
                personalizations: [{ to: [{ email: email }],
                 subject: `${message.length > 15 ? message.substring(0, 15) + "..." : message}` }
                ],
                from: { email: process.env.AUTH_PASS_EMAIL },
                content: [{
                    type: 'text/html',
                     value:
                    `
                    <!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
                    <title> Notificatin [Coded Mails] </title>
                    <!--[if !mso]><!-- -->
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <!--<![endif]-->
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <style type="text/css">
                      #outlook a {
                        padding: 0;
                      }
                    
                      body {
                        margin: 0;
                        padding: 0;
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                      }
                    
                      table,
                      td {
                        border-collapse: collapse;
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                      }
                    
                      img {
                        border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                        -ms-interpolation-mode: bicubic;
                      }
                    
                      p {
                        display: block;
                        margin: 13px 0;
                      }
                    </style>
                    <!--[if mso]>
                          <xml>
                          <o:OfficeDocumentSettings>
                            <o:AllowPNG/>
                            <o:PixelsPerInch>96</o:PixelsPerInch>
                          </o:OfficeDocumentSettings>
                          </xml>
                          <![endif]-->
                    <!--[if lte mso 11]>
                          <style type="text/css">
                            .mj-outlook-group-fix { width:100% !important; }
                          </style>
                          <![endif]-->
                    <!--[if !mso]><!-->
                    <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700" rel="stylesheet" type="text/css" />
                    <style type="text/css">
                      @import url(https://fonts.googleapis.com/css?family=Roboto:400,500,700);
                    </style>
                    <!--<![endif]-->
                    <style type="text/css">
                      @media only screen and (min-width:480px) {
                        .mj-column-per-100 {
                          width: 100% !important;
                          max-width: 100%;
                        }
                    
                        .mj-column-per-50 {
                          width: 50% !important;
                          max-width: 50%;
                        }
                      }
                    </style>
                    <style type="text/css">
                      @media only screen and (max-width:480px) {
                        table.mj-full-width-mobile {
                          width: 100% !important;
                        }
                    
                        td.mj-full-width-mobile {
                          width: auto !important;
                        }
                      }
                    </style>
                    <style type="text/css">
                      a,
                      span,
                      td,
                      th {
                        -webkit-font-smoothing: antialiased !important;
                        -moz-osx-font-smoothing: grayscale !important;
                      }
                    </style>
                    </head>
                    
                    <body style="background-color:#f3f3f5;">
                    <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">Notification from D&D</div>
                    <div style="background-color:#f3f3f5;">
                      <!--[if mso | IE]>
                        <table
                           align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
                        >
                          <tr>
                            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                        <![endif]-->
                      <div style="margin:0px auto;max-width:600px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                          <tbody>
                            <tr>
                              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                <!--[if mso | IE]>
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                  
                          <tr>
                        
                              <td
                                 class="" style="vertical-align:top;width:600px;"
                              >
                            <![endif]-->
                                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                    <tbody><tr>
                                      <td style="font-size:0px;word-break:break-word;">
                                        <!--[if mso | IE]>
                      
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td height="20" style="vertical-align:top;height:20px;">
                        
                      <![endif]-->
                                        <div style="height:20px;">   </div>
                                        <!--[if mso | IE]>
                      
                          </td></tr></table>
                        
                      <![endif]-->
                                      </td>
                                    </tr>
                                  </tbody></table>
                                </div>
                                <!--[if mso | IE]>
                              </td>
                            
                          </tr>
                        
                                    </table>
                                  <![endif]-->
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <!--[if mso | IE]>
                            </td>
                          </tr>
                        </table>
                        
                        <table
                           align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
                        >
                          <tr>
                            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                        <![endif]-->
                      <div style="background:#54595f;background-color:#54595f;margin:0px auto;border-radius:4px 4px 0 0;max-width:600px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#54595f;background-color:#54595f;width:100%;border-radius:4px 4px 0 0;">
                          <tbody>
                            <tr>
                              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                <!--[if mso | IE]>
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                  
                              <tr>
                                <td
                                   class="" width="600px"
                                >
                            
                        <table
                           align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
                        >
                          <tr>
                            <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
                        <![endif]-->
                                <div style="margin:0px auto;max-width:600px;">
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                                    <tbody>
                                      <tr>
                                        <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
                                          <!--[if mso | IE]>
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                  
                          <tr>
                        
                              <td
                                 class="" style="vertical-align:top;width:600px;"
                              >
                            <![endif]-->
                                          <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                              <tbody><tr>
                                                <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                    <tbody>
                                                      <tr>
                                                        <td style="width:150px;">
                                                          <!-- <img height="auto" src="https://codedmails.com/images/logo-white.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="150" /> -->
                                                          <h1 style="font-weight:bold">D&D</h1>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td style="font-size:0px;word-break:break-word;">
                                                  <!--[if mso | IE]>
                      
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td height="20" style="vertical-align:top;height:20px;">
                        
                      <![endif]-->
                                                  <div style="height:20px;">   </div>
                      
                                                </td>
                                              </tr>
                                              <tr>
                                                <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:0px;word-break:break-word;">
                                                  <div style="font-family:Roboto, Helvetica, Arial, sans-serif;font-size:24px;font-weight:400;line-height:30px;text-align:center;color:#ffffff;">
                                                    <h1 style="margin: 0; font-size: 24px; line-height: normal; font-weight: 400;">Thank you for your order</h1>
                                                  </div>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td align="center" style="font-size:0px;padding:10px 25px;padding-top:0;word-break:break-word;">
                                                  <div style="font-family:Roboto, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;line-height:20px;text-align:center;color:#aaaaaa;">
                                                    <p style="margin: 0;">Order Number:${data.ide} | Order Date: ${new Date().getUTCDay()}</p>
                                                  </div>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                  <p style="border-top: solid 1px #999999; font-size: 1px; margin: 0px auto; width: 100%;">
                                                  </p>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                  <div style="font-family:Roboto, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;line-height:20px;text-align:left;color:#ffffff;">
                                                    <p style="margin: 0;">Hi ${data.firstname} ${data.lastname},<br /> Thank you for your purchase. Please find your order summary below. </p>
                                                  </div>
                                                </td>
                                              </tr>
                                            </tbody></table>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              <div style="margin:0px auto;max-width:600px;">
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                                    <tbody>
                                      <tr>
                                        <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                         
                                          <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                              ${products}
                                            </table>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <div style="margin:0px auto;max-width:600px;">
                                  <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                                    <tbody>
                                      <tr>
                                        <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
                                         
                                          <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr;">
                                          
                                            <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:50%;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                                <tbody><tr>
                                                  <!-- <td align="left" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                                      <tbody><tr>
                                                        <td align="center" bgcolor="#2e58ff" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#2e58ff;" valign="middle">
                                                          <a href="https://google.com" style="word-break: normal; display: inline-block; background: #2e58ff; color: white; font-family: Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; line-height: 20px; margin: 0; text-decoration: none; text-transform: none; padding: 10px 25px; mso-padding-alt: 0px; border-radius: 3px;" target="_blank"></a>
                                                        </td>
                                                      </tr>
                                                    </tbody></table>
                                                  </td> -->
                                                </tr>
                                              </tbody></table>
                                            </div>
                                            <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:50%;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                                <tbody><tr>
                                                  <td align="right" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                                      <tbody><tr>
                                                        <td align="center" bgcolor="#72787E" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#72787E;" valign="middle">
                                                          <a href="https://google.com" style="word-break: normal; display: inline-block; background: #72787E; color: white; font-family: Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; line-height: 20px; margin: 0; text-decoration: none; text-transform: none; padding: 10px 25px; mso-padding-alt: 0px; border-radius: 3px;" target="_blank"> Track your order </a>
                                                        </td>
                                                      </tr>
                                                    </tbody></table>
                                                  </td>
                                                </tr>
                                              </tbody></table>
                                            </div>
                                            <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                                <tbody><tr>
                                                  <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <div style="font-family:Roboto, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;line-height:20px;text-align:left;color:#ffffff;">
                                                      <p style="margin: 0;">You're receiving this email because you made a purchase at D&D. If you have any questions, contact us at <a href="#" style="color: #009BF9; text-decoration: none; word-break: normal;">08038383680</a></p>
                                                    </div>
                                                  </td>
                                                </tr>
                                              </tbody></table>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;border-radius:0 0 4px 4px;max-width:600px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;border-radius:0 0 4px 4px;">
                          <tbody>
                            <tr>
                              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                
                                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                    <tbody><tr>
                                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                        <div style="font-family:Roboto, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;line-height:20px;text-align:center;color:#93999f;">© ${new Date().getFullYear()} D&D, All rights reserved <br /> Number: <a class="footer-link" href="#" style="color: #009BF9; text-decoration: none; word-break: normal;">08038383680</a> <br /> Web: <a class="footer-link" href="https://danddy.axgura.com" style="color: #009BF9; text-decoration: none; word-break: normal;">danddy.axgura.com</a></div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                      
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                                          <tbody><tr>
                                            <td style="padding:4px;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:24px;">
                                                <tbody><tr>
                                                  <td style="font-size:0;height:24px;vertical-align:middle;width:24px;">
                                                    <a href="#" target="_blank" style="color: #009BF9; text-decoration: none; word-break: normal;">
                                                      <img alt="instagram-logo" height="24" src="https://codedmails.com/images/social/color/insta-logo-transparent.png" style="border-radius:3px;display:block;" width="24" />
                                                    </a>
                                                  </td>
                                                </tr>
                                              </tbody></table>
                                            </td>
                                          </tr>
                                        </tbody></table>
                                      </td>
                                    </tr>
                                  </tbody></table>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div style="margin:0px auto;max-width:600px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                          <tbody>
                            <tr>
                              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                             
                                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                    <tbody><tr>
                                      <td style="font-size:0px;word-break:break-word;">
                                    
                                        <div style="height:1px;">   </div>
                                      </td>
                                    </tr>
                                  </tbody></table>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    
                    </body></html>
                    `}]
            },
            json: true
        };
        if(products){
            request(options, function (error, response, body) {
                if (error) {
                    res.status(500).json({
                        message: `${error.message}`
                    })
                } else {
                   res.status(200).json({
                    message,
                    status:200,
                    data
                   })
                }
            });
        }
    }catch(error){
        res.status(401)
        .json({
            message:`Err: ${error.message}`,
            status:401
        })
    }
}
module.exports = router;