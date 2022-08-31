const { default: axios } = require("axios");

let order = document.getElementById("order");
let total_sales = document.getElementById("total-sales");
let rev = document.getElementById("rev");
let total_views = document.getElementById("total_views");
let urls = "https://ax-mum.herokuapp.com";

async function SumUp(data){
    let sum = 0;
    const val = await data && data.forEach(list => {
    sum+=Number(list.price);
    });
total_views.innerHTML = val;
}
async function GetData(){
    urls = `${urls}/product/all-product`;
   axios.get(urls).then(async(res)=>{
    let data = res.data.data;
     await SumUp();
     urls = `https://ax-mum.herokuapp.com/order/all-order-info`
     const show_ = await axios.get(urls);
     if(show_.data){
        data = show_.data;
        let sum = 0;
    const val =  await data && data.forEach(list => {
          sum+=Number(list.price);
     })
     total_sales.innerHTML = val;
     }else{
        alert("Show was not found");
     }
   }).catch(err=>{
    alert(`Error: ${err.message}`)
   })
}
GetData()
async function GetOrderData(){
    urls = "https://ax-mum.herokuapp.com";
    urls = `${urls}/product/all-product`;
    axios.get(urls).then(res=>{
     let data = res.data.data;
     let mapped = data.map(x=>`
     <td>${x.firstname} ${x.lastname}</td>
                            <td>${x.type}</td>
                            <td>${x.address}</td>
                            <td>NGN ${x.amount}</td>
                            <td>${x.phone_number}</td>
                            <td>${x.email}</td>
                            <td>7</td>
     `);
     order.innerHTML = mapped;
    }).catch(err=>{
     alert(`Error: ${err.message}`)
    })
}
GetOrderData()