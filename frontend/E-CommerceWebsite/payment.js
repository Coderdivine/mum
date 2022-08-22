console.clear();
let account_name = document.getElementById("acc_name");
let account_number = document.getElementById("acc_number");
let bank_name = document.getElementById("bank_name");
let amount;
let order_id;
let btn = document.getElementById("btn");
let btn_two = document.getElementById("btn_two");
let urls = "http://localhost:9099";
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
    }else if(typeof amount !== "number"){
        alert("Please amount is undefined")
    }else if(typeof order_id !== "string"){
        alert("Order identity not found")
    }
    else{
        const data = {
            account_name,
            account_number,
            amount,
            order_id
        };
        
        urls = `${urls}/payment/send-payment`;
        axios.post(urls,data).then(res=>{
            alert(res.data.message);
            console.log(res.data);
                }).catch(err=>{
                    alert("Please try again something went wrong");
                    console.log(err)
                })
    }

})
btn_two.addEventListener("click",function(){
    //check id first btn is disabled
})

