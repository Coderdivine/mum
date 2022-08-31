const { default: axios } = require("axios");

let order = document.getElementById("order");
let total_sales = document.getElementById("total-sales");
let rev = document.getElementById("rev");
let total_views = document.getElementById("total_views");
let urls = "https://ax-mum.herokuapp.com";


async function GetData(){
    urls = `${urls}/product/all-product`
   axios.get(urls).then(res=>{
    let data = res.data.data;
   }).catch(err=>{
    alert(`Error: ${err.message}`)
   })
}
GetData()
async function GetOrderData(){
 
}
GetOrderData()