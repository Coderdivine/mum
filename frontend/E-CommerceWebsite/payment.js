console.clear();
let id = location.search.split('?')[1]
console.log(id);
let account_name = document.getElementById("acc_name");
let account_number = document.getElementById("acc_number");
let bank_name = document.getElementById("bank_name");
let amount =1000;
let order_id = id;
let btn = document.getElementById("btn");
let btn_two = document.getElementById("btn_two");
let main_change = document.getElementById("main_change")
let urls = "https://ax-mum.herokuapp.com";
btn.addEventListener("click",function(){
    account_name = account_name.value;
    account_number = account_number.value;
    bank_name = bank_name.value;
    if(account_name.length < 4){
        alert("Account name needed")
    }else if(account_number.length < 4){
        alert("Invaild account number")
    }else if(bank_name.length < 2){
        alert("Bank name is invalid")
    }else if(sessionStorage.getItem("amount")){
        
        //window.location = "/";
        amount = sessionStorage.getItem("amount");
        const data = {
            account_name,
            account_number,
            bank_name,
            amount,
            order_id
        };
        console.log(data)
        
        urls = `${urls}/payment/send-payment`;
        console.log(urls);
        axios.post(urls,data).then(res=>{
            id = res.data.data.ref;
            alert(res.data.message);
            console.log(res.data);
            sessionStorage.setItem("order",true);
            btn.disabled = true;
            btn.style = "display:none;";
            btn_two.style = "display:grid;";
            const ans = res.data.data;
            console.log(ans)
            //please pay ${amount} to this account
            //after 15:00 this order will expire.
            main_change.innerHTML = ` <div id="main_change" class="main_change">
            <h2>Please make payment to</h2>
            <small>Please make payment under 15 mins</small>
           <p style="font-size:15px;">Account Name</p>
           <p class="inputbox" style="font-weight:400px;font-size:12px;">${ans.payment_cards[0].account_name}</p>
           <p style="font-size:15px;">Account Number</p>
           <p class="inputbox" style="font-weight:400px;font-size:12px;">${ans.payment_cards[0].account_number}</p>
           <p style="font-size:15px;">Bank Name</p>
           <p class="inputbox" style="font-weight:400px;font-size:12px;">${ans.payment_cards[0].account_bank}</p>         
           <p>Amount : NGN${ans.amount}</p>
           <p style="font-size:13px;">Reference Number:  <small style="margin:2px 4px;font-size:11px;">${ans.ref}</small><br/></p>
           <small style="margin:2px 4px;font-size:11px;">You have 15 minutes left</small>
          
           </div>
          `




                }).catch(err=>{
                    alert("Please try again something went wrong");
                    console.log(err)
                })
    }

});
btn_two.addEventListener("click",function(){
    //check id first btn is disabled;
    if(btn.disabled == true){
        let is_ = sessionStorage.getItem("order");
        if(is_){
            let ide = id;
            urls = `https://ax-mum.herokuapp.com/payment/update-payment`;
            axios.post(urls,{ide}).then(res=>{
                alert(response.data.message);
                console.log("res",res.data);
            }).catch(err=>{
                alert("Something went wrong")
                console.log(err)
            })

        }else{
            alert("Please Order is not valid");
            }
    }else{
        alert("Please fil out the form again");
        console.log(btn.is_disabled);
    };
});

