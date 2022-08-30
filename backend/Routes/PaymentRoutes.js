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
            let message = 'Payment account init';
             payment_details.save().then(async(corn)=> {
                await sendMail({email,message},res);
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
async function sendMail({email,message},res){
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
                    `<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
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
                    <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;"> Preview - Notification from Coded Mails </div>
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
                                                          <img height="auto" src="https://codedmails.com/images/logo-white.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="150" />
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
                                                  <!--[if mso | IE]>
                      
                          </td></tr></table>
                        
                      <![endif]-->
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
                                                    <p style="margin: 0;">Order Number:234234234 | Order Date: 03-13-2020 </p>
                                                  </div>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                  <p style="border-top: solid 1px #999999; font-size: 1px; margin: 0px auto; width: 100%;">
                                                  </p>
                                                  <!--[if mso | IE]>
                          <table
                             align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 1px #999999;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px"
                          >
                            <tr>
                              <td style="height:0;line-height:0;">
                                &nbsp;
                              </td>
                            </tr>
                          </table>
                        <![endif]-->
                                                </td>
                                              </tr>
                                              <tr>
                                                <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                  <div style="font-family:Roboto, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;line-height:20px;text-align:left;color:#ffffff;">
                                                    <p style="margin: 0;">Hi John Doe,<br /> Thank you for your purchase. Please find your order summary below. </p>
                                                  </div>
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
                        
                                </td>
                              </tr>
                            
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
                                        <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                          <!--[if mso | IE]>
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                  
                          <tr>
                        
                              <td
                                 class="" style="vertical-align:top;width:600px;"
                              >
                            <![endif]-->
                                          <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
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
                                                              <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; width: 60%; padding-top: 10px;" width="60%"> Product with a longer name </td>
                                                              <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; text-align: right; width: 20%;" width="20%" align="right">2</td>
                                                              <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; text-align: right; width: 20%;" width="20%" align="right">€19.00</td>
                                                            </tr>
                                                            <tr>
                                                              <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal;"> The Second Product </td>
                                                              <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; text-align: right; padding: 0 0 10px;" align="right">1</td>
                                                              <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; text-align: right; padding: 0 0 10px;" align="right">€10.02</td>
                                                            </tr>
                                                            <tr>
                                                              <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; border-bottom-width: 1px; border-bottom-color: #555; border-bottom-style: solid; padding-top: 10px;"></td>
                                                              <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; border-bottom-width: 1px; border-bottom-color: #555; border-bottom-style: solid; padding-top: 10px;"></td>
                                                              <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; border-bottom-width: 1px; border-bottom-color: #555; border-bottom-style: solid; padding-top: 10px;"></td>
                                                            </tr>
                                                            <tr>
                                                              <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; padding: 10px 0; text-align: left;" colspan="2" align="left">VAT</td>
                                                              <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; padding: 10px 0; text-align: right;" align="right">€0</td>
                                                            </tr>
                                                            <tr>
                                                              <td style="word-break: normal; color: #fff; font-size: 20px; line-height: 30px; border-top: 1px solid #555; font-weight: 500; padding: 10px 0px 0px 0px; text-align: left;" colspan="2" align="left">Total</td>
                                                              <td style="word-break: normal; color: #fff; font-size: 20px; line-height: 30px; border-top: 1px solid #555; font-weight: 500; text-align: right; padding: 10px 0px 0px 0px;" align="right">€29.02</td>
                                                            </tr>
                                                          </tbody></table>
                                                        </td>
                                                      </tr>
                                                    </tbody></table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
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
                        
                                </td>
                              </tr>
                            
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
                                 class="" style="width:600px;"
                              >
                            <![endif]-->
                                          <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr;">
                                            <!--[if mso | IE]>
                          <table
                             border="0" cellpadding="0" cellspacing="0" role="presentation"
                          >
                            <tr>
                          
                                <td
                                   style="vertical-align:top;width:300px;"
                                >
                                <![endif]-->
                                            <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:50%;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                                <tbody><tr>
                                                  <td align="left" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                                      <tbody><tr>
                                                        <td align="center" bgcolor="#2e58ff" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#2e58ff;" valign="middle">
                                                          <a href="https://google.com" style="word-break: normal; display: inline-block; background: #2e58ff; color: white; font-family: Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; line-height: 20px; margin: 0; text-decoration: none; text-transform: none; padding: 10px 25px; mso-padding-alt: 0px; border-radius: 3px;" target="_blank"> Download Receipt </a>
                                                        </td>
                                                      </tr>
                                                    </tbody></table>
                                                  </td>
                                                </tr>
                                              </tbody></table>
                                            </div>
                                            <!--[if mso | IE]>
                                </td>
                                
                                <td
                                   style="vertical-align:top;width:300px;"
                                >
                                <![endif]-->
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
                                            <!--[if mso | IE]>
                                </td>
                                
                                <td
                                   style="vertical-align:top;width:600px;"
                                >
                                <![endif]-->
                                            <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                                <tbody><tr>
                                                  <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                    <div style="font-family:Roboto, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;line-height:20px;text-align:left;color:#ffffff;">
                                                      <p style="margin: 0;">You're receiving this email because you made a purchase at Coded Mails. If you have any questions, contact us at <a href="#" style="color: #009BF9; text-decoration: none; word-break: normal;">help@codedmails.com</a></p>
                                                    </div>
                                                  </td>
                                                </tr>
                                              </tbody></table>
                                            </div>
                                            <!--[if mso | IE]>
                                </td>
                                
                            </tr>
                            </table>
                          <![endif]-->
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
                      <div style="background:#ffffff;background-color:#ffffff;margin:0px auto;border-radius:0 0 4px 4px;max-width:600px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;border-radius:0 0 4px 4px;">
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
                                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                        <div style="font-family:Roboto, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;line-height:20px;text-align:center;color:#93999f;">© 2020 [Coded Mails] GmbH, All rights reserved <br /> Email: <a class="footer-link" href="#" style="color: #009BF9; text-decoration: none; word-break: normal;">support@codedmails.com</a> <br /> Web: <a class="footer-link" href="#" style="color: #009BF9; text-decoration: none; word-break: normal;">www.codedmails.com</a></div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                        <!--[if mso | IE]>
                        <table
                           align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                        >
                          <tr>
                        
                                <td>
                              <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                                          <tbody><tr>
                                            <td style="padding:4px;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:24px;">
                                                <tbody><tr>
                                                  <td style="font-size:0;height:24px;vertical-align:middle;width:24px;">
                                                    <a href="#" target="_blank" style="color: #009BF9; text-decoration: none; word-break: normal;">
                                                      <img alt="twitter-logo" height="24" src="https://codedmails.com/images/social/color/twitter-logo-transparent.png" style="border-radius:3px;display:block;" width="24" />
                                                    </a>
                                                  </td>
                                                </tr>
                                              </tbody></table>
                                            </td>
                                          </tr>
                                        </tbody></table>
                                        <!--[if mso | IE]>
                                </td>
                              
                                <td>
                              <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                                          <tbody><tr>
                                            <td style="padding:4px;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:24px;">
                                                <tbody><tr>
                                                  <td style="font-size:0;height:24px;vertical-align:middle;width:24px;">
                                                    <a href="#" target="_blank" style="color: #009BF9; text-decoration: none; word-break: normal;">
                                                      <img alt="facebook-logo" height="24" src="https://codedmails.com/images/social/color/facebook-logo-transparent.png" style="border-radius:3px;display:block;" width="24" />
                                                    </a>
                                                  </td>
                                                </tr>
                                              </tbody></table>
                                            </td>
                                          </tr>
                                        </tbody></table>
                                        <!--[if mso | IE]>
                                </td>
                              
                                <td>
                              <![endif]-->
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
                                        <!--[if mso | IE]>
                                </td>
                              
                                <td>
                              <![endif]-->
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
                                          <tbody><tr>
                                            <td style="padding:4px;">
                                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:24px;">
                                                <tbody><tr>
                                                  <td style="font-size:0;height:24px;vertical-align:middle;width:24px;">
                                                    <a href="#" target="_blank" style="color: #009BF9; text-decoration: none; word-break: normal;">
                                                      <img alt="youtube-logo" height="24" src="https://codedmails.com/images/social/color/youtube-logo-transparent.png" style="border-radius:3px;display:block;" width="24" />
                                                    </a>
                                                  </td>
                                                </tr>
                                              </tbody></table>
                                            </td>
                                          </tr>
                                        </tbody></table>
                                        <!--[if mso | IE]>
                                </td>
                              
                            </tr>
                          </table>
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
                      
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td height="1" style="vertical-align:top;height:1px;">
                        
                      <![endif]-->
                                        <div style="height:1px;">   </div>
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
                        <![endif]-->
                    </div>
                    
                    
                    </body></html>`}]
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
