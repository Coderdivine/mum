console.clear();
let account_name = document.getElementById("acc_name");
let account_number = document.getElementById("acc_number");
let bank_name = document.getElementById("bank_name");
let amount;
let order_id;
let btn = document.getElementById("btn");

btn.addEventListener("click",function(){
    account_name = account_name.value;
    account_number = account_number.value;
    bank_name = bank_name.value;
    if(account_name.length < 4){

    }else if(account_number.length < 4){

    }else if(bank_name.length < 4){

    }else{
        
    }

})
