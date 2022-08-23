console.clear();
let id = location.search.split('?')[1]
console.log(id);
let account_name = document.getElementById("acc_name");
let account_number = document.getElementById("acc_number");
let bank_name = document.getElementById("bank_name");
let amount;
let order_id = id;
let btn = document.getElementById("btn");
let btn_two = document.getElementById("btn_two");
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
    }else if(typeof amount !== "number"){
        alert("Please amount is undefined")
    }else if(typeof order_id !== "string"){
        alert("Order identity not found")
    }else if(sessionStorage.getItem("amount")){
        
        //window.location = "/";
        amount = sessionStorage.getItem("amount");
        const data = {
            account_name,
            account_number,
            amount,
            order_id
        };
        console.log(data)
        
        urls = `${urls}/payment/send-payment`;
        console.log(urls);
        axios.post(urls,data).then(res=>{
            alert(res.data.message);
            console.log(res.data);
            sessionStorage.setItem("order",true);
            btn.disabled = true;
            btn_two.style = "display:grid;"
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
        if(true == is_){
            let ide = id;
            urls = `https://ax-mum.herokuapp.com/payment/update-payment`;
            axios.get(urls,{ide}).then(res=>{
                alert(response.data.message);
                console.log("res",res.data);
            }).catch(err=>{
                alert("Something went wrong")
            })

        }else{
            alert("Please Order expire");
            }
    }else{
        alert("Please fil out the form again");
        console.log(btn.is_disabled);
    };
});

