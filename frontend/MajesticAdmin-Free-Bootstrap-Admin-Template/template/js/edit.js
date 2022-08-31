console.clear()
let id = location.search.split('?')[1]
let data,urls;
urls = "https://ax-mum.herokuapp.com/";
console.log(id)
let names = document.getElementById("name");
let description = document.getElementById("description");
let price = document.getElementById("price");
let btn = document.getElementById("btn");
btn.addEventListener("click",function(){
    if(brand.value.length < 3){
        alert("Please enter a brand name that's more than 3 letters")
    }else if(names.value.length < 3){
        alert("Please enter a  name that's more than 3 letters")
    }else if(description.value.length < 10){
        alert("Please enter a description that's more than 10 letters")
    }else if(img_json.length == 0){
        alert("Please upload a image before making request")
    }else{
        names = names.value;
        description = description.value;
        brand = brand.value;
        category = category.value;
        price = price.value;
        rate = rate.value;
        quantity = quantity.value;
        sizes = sizes.value;
        weight = weight.value;
        let data = {
            name:names,
            description,
            brand,category,price,rate,
            quantity,sizes,weight,
            image:JSON.stringify(img_json)
        };
        console.table(data);
        axios.post("https://ax-mum.herokuapp.com/product/product-details",data)
        .then(res=>{
            alert(res.data.message);
            localStorage.setItem("img_json",[]);
        }).catch(err=>{
            alert(`Something went wrong: ${err.message}`)
        });
    }

});
async function GetData(){
    if(id){
       try{
        urls = `${urls}/product/product-info/${id}`;
        const res = await axios.get(urls);
        if(res.data){
            data = res.data[0];
               names.value = data.name;   
               description.value = data.description; 
               brand.value = data.brand; 
               category.value = data.category; 
               price.value = data.price;
               rate.value = data.rate; 

         }
       }catch(er){
        alert(`Error: ${er.message}`);
       }
    }else{
        window.location = "/";
    }
}
await GetData();

