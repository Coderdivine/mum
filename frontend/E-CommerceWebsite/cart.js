console.clear();
let urls = "https://ax-mum.herokuapp.com";
let product;
if(document.cookie.indexOf(',counter=')>=0)
{
    let counter = document.cookie.split(',')[1].split('=')[1]
    document.getElementById("badge").innerHTML = counter
}
//https://www.linkedin.com/in/chimdi-divine-48661a228
let btn = document.getElementById("buy_now");
let firstname = document.getElementById("firstname");
let lastname = document.getElementById("lastname");
let country = document.getElementById("country");
let address = document.getElementById("address");
let city = document.getElementById("city");
let phone_number = document.getElementById("phone");
let email = document.getElementById("email");
let type = document.getElementById("type");
let card = document.getElementById("card");
let ship_fee = document.getElementById("ship_fee");
let prices = document.getElementById("prices");
let pickup = document.getElementById("pickup");
let delivery = document.getElementById("delivery");
let totals = document.getElementById("totals");
let cartContainer = document.getElementById('cartContainer')
firstname.addEventListener("change",function(){card.innerHTML = `${firstname.value} <br/> ${address.value}`});
address.addEventListener("change",function(){card.innerHTML = `${firstname.value} <br/> ${address.value}`});
let boxContainerDiv = document.createElement('div')
boxContainerDiv.id = 'boxContainer';
async function Order(){
    firstname = firstname.value;
    lastname = lastname.value;
    country = country.value;
    address = address.value;
    city = city.value;
    phone_number = phone_number.value;
    email = email.value;
    type = type;
    let company = "Nigeria";
    console.log(pickup.checked);
    if(pickup.checked == true){
        type = true;
    }else{
        type = false;
    }
    if(firstname.length < 1){
        alert("Firstname needed");
    }else if(firstname.length < 4 || lastname.length < 4){
        alert("Please firstname and lastname must ber greater than 4")
    }else if(country.length < 4 || address.length < 5){
        alert("Please enter a valid address");
    }else if(phone_number.length < 5 || email.length < 10){
        alert("Phone number and email are required")
    // }else if(product !== "object"){
    //     console.log(product)
    //     alert("Seems you don't have any product")
    // }
}
    else{
        console.log(product);
        if(type){
            type = "pickup";
        }else{
            type = "delivery";
        }
        console.log("type",type)
        data = {
            firstname,
            lastname,
            country,
            address,
            city,
            phone_number,
            email,
            type,
            company,
            product
        };
        urls = `${urls}/order/order-details`;
        console.log(urls);
        console.log(data);
        axios.post(urls,data).then(res=>{
           if(type == "pickup"){
            alert(`${res.data.message}`)
            window.location = '/orderPlaced.html?';
           }else{
            console.log(res.data.data.ide);
            alert("Order Successfully placed")
           window.location =  `/payment.html?${res.data.data.ide}`;
           }
        }).catch(err=>{
            console.log(err);
            alert("Something went wrong");
        })
    }
}
btn.addEventListener("click",async function(){
    console.log("clicked")
 await Order();
})
async function shipFee(product,a){
    ship_fee.innerHTML = product.length  * 1500;
    totals.innerHTML = a + (product.length * 1500)
  
}

// DYNAMIC CODE TO SHOW THE SELECTED ITEMS IN YOUR CART
function dynamicCartSection(ob,itemCounter)
{
    let boxDiv = document.createElement('div')
    boxDiv.id = 'box'
    boxContainerDiv.appendChild(boxDiv)
    if(ob.image[0] !== "h"){
        let use = JSON.parse(ob.image);
       // console.log(use[0].substring(4,(use[0].length-4)))
        //imgTag.src = use[0].toString()
        console.log("use => 0",use[1])
        let boxImg = document.createElement('img')
        boxImg.src = use[0];
        boxDiv.appendChild(boxImg)

      }else{
        console.log(ob.image)
        let boxImg = document.createElement('img')
        boxImg.src = ob.image
        boxDiv.appendChild(boxImg)

      }
    
    let boxh3 = document.createElement('h3')
    let h3Text = document.createTextNode(ob.name + ' ?? ' + itemCounter)
    // let h3Text = document.createTextNode(ob.name)
    boxh3.appendChild(h3Text)
    boxDiv.appendChild(boxh3)

    let boxh4 = document.createElement('h4')
    let h4Text = document.createTextNode('Amount: NGN' + ob.price)
    boxh4.appendChild(h4Text)
    boxDiv.appendChild(boxh4)

    // console.log(boxContainerDiv);

    // buttonLink.appendChild(buttonText)
    cartContainer.appendChild(boxContainerDiv)
    cartContainer.appendChild(totalContainerDiv)
    // let cartMain = document.createElement('div')
    // cartmain.id = 'cartMainContainer'
    // cartMain.appendChild(totalContainerDiv)

    return cartContainer
}

let totalContainerDiv = document.createElement('div')
totalContainerDiv.id = 'totalContainer'

let totalDiv = document.createElement('div')
totalDiv.id = 'total'
totalContainerDiv.appendChild(totalDiv)

let totalh2 = document.createElement('h2')
let h2Text = document.createTextNode('Total Amount')
totalh2.appendChild(h2Text)
totalDiv.appendChild(totalh2)
// TO UPDATE THE TOTAL AMOUNT
function amountUpdate(amount)
{
    sessionStorage.setItem("amount",amount);
    totals.innerHTML= `NGN ${amount} `;
    let totalh4 = document.createElement('h4')
    // let totalh4Text = document.createTextNode(amount)
    let totalh4Text = document.createTextNode('Amount: NGN ' + amount)
    totalh4Text.id = 'toth4'
    totalh4.appendChild(totalh4Text)
    totalDiv.appendChild(totalh4)
    totalDiv.appendChild(buttonDiv)
    console.log(totalh4);
    

}


let buttonDiv = document.createElement('div')
buttonDiv.id = 'button'
totalDiv.appendChild(buttonDiv)

let buttonTag = document.createElement('button')
buttonDiv.appendChild(buttonTag)

let buttonLink = document.createElement('a')
// buttonLink.href = '/orderPlaced.html?'
// buttonTag.appendChild(buttonLink)

// buttonText = document.createTextNode('Place Order')
buttonTag.onclick = function()
{
    console.log("clicked");
   // buttonTag.a.click()
}  
// dynamicCartSection()
// console.log(dynamicCartSection());

// BACKEND CALL
let httpRequest = new XMLHttpRequest()
let totalAmount = 0
httpRequest.onreadystatechange = function()
{
    if(this.readyState === 4)
    {
        if(this.status == 200)
        {
            // console.log('call successful');
            contentTitle = JSON.parse(this.responseText);
            console.log(contentTitle.message)
            contentTitle = contentTitle.data;

            let counter = Number(document.cookie.split(',')[1].split('=')[1])
            document.getElementById("totalItem").innerHTML = ('Total Items: ' + counter)

            let item = document.cookie.split(',')[0].split('=')[1].split(" ")
            console.log(counter)
            console.log(item)

            let i;
            let totalAmount = 0
            product = [];
            for(i=0; i<counter; i++)
            {
                let itemCounter = 1
                for(let j = i+1; j<counter; j++)
                {   
                    if(item[j] == item[i])
                    {
                        itemCounter +=1;
                    }
                }
                //contentTitle[item[i]-1].price
                let show = contentTitle.filter(x=> x.ide == (item[i]))
                console.log("item",(item[i]))
                let amount = Number(show[0].price) * Number(itemCounter);
                let corn = {
                    name:show[0].name,
                    size:show[0].sizes,
                    color:show[0].color,
                    amount,
                    product_id:show[0].ide,
                    quantity:itemCounter
                }
                product.push(corn)
                console.log("corn: ",corn)
                console.log("product: ",product)
                
               // console.log("item",(item[i-1].ide))
                if(show){
                    show //= show[0]
                    console.log("show",show);
                    totalAmount += Number(show[0].price) * itemCounter
                    dynamicCartSection(show[0],itemCounter)
                    i += (itemCounter-1)
                }
                
            }
            shipFee(product,totalAmount);
            amountUpdate(totalAmount);
            let ff_ = totalAmount + (product.length * 1500);
            sessionStorage.setItem("amount",ff_);
            sessionStorage.setItem("amount",ff_);
            console.log(ff_);
        }
    }
        else
        {
            console.log('call failed!');
        }
}

httpRequest.open('GET', 'https://ax-mum.herokuapp.com/product/all-product', true)
httpRequest.send()
//'https://5d76bf96515d1a0014085cf9.mockapi.io/product'



