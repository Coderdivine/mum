let order = document.getElementById("order");
let total_sales = document.getElementById("total-sales");
let rev = document.getElementById("rev");
let total_views = document.getElementById("total_views");
let urls = "https://ax-mum.herokuapp.com";

async function SumUp(data) {
    let sum = 0;
    const val = await data && data.forEach(list => {
        sum += Number(list.price);
        console.log("total_views",Number(list.price))
    });
    total_views.innerHTML = val;
}
async function GetData() {
    urls = `${urls}/product/all-product`;
    axios.get(urls).then(async (res) => {
        let data = res.data.data;
        await SumUp(data);
        urls = `https://ax-mum.herokuapp.com/order/all-order-info`
        const show_ = await axios.get(urls);
        if (show_.data) {
            data = show_.data.data;
            let sum = 0;
            if (data[0].product) {
                const val = await data && data.forEach(list => {
                    list.product.forEach(el=>{
                        sum += Number(el.amount);
                       console.log("Total_sales",Number(el.amount))
                    })
                })
                total_sales.innerHTML = val;
            }
        } else {
            alert("Show was not found");
        }
    }).catch(err => {
        alert(`Error: ${err.message}`)
    })
}
GetData()
async function GetOrderData() {
    urls = "https://ax-mum.herokuapp.com";
    urls = `${urls}/order/all-order-info`;
    axios.get(urls).then(res => {
        let data = res.data.data;
        let mapped = data.map(x => `
     <tr>
     <td><a href="pages/product.html">${x.firstname} ${x.lastname}</a></td>
                            <td>${x.type}</td>
                            <td>${x.address}</td>
                            
                            <td>${x.phone_number}</td>
                            <td>${x.email}</td></tr>
     `).reverse();
        order.innerHTML = mapped;
    }).catch(err => {
        alert(`Error: ${err.message}`)
    })
}
GetOrderData();
let new_order = document.getElementById("new_order")
async function New_Order(){
    axios.get("http:localhost:9099/order/get-notification")
    .then(res=>{
        let datas = res.data.data;
       let cook = datas.map(x=>`
        <a class="dropdown-item">
                <div class="item-thumbnail">
                  <div class="item-icon bg-info">
                    <i class="mdi mdi-account-box mx-0"></i>
                  </div>
                </div>
                <div class="item-content">
                  <h6 class="font-weight-normal">New user registration</h6>
                  <p class="font-weight-light small-text mb-0 text-muted">
                    2 days ago
                  </p>
                </div>
              </a>`);
             new_order.innerHTML =  cook;
    }).catch(err=>{
        console.log(`${err.message}`)
    })
}
