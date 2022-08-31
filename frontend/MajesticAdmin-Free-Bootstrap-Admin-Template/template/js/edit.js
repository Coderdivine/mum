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
    if(names.value.length < 3){
        alert("Please enter a name that's more than 3 letters")
    }else if(description.value.length < 10){
        alert("Please enter a description that's more than 10 letters")
    }else{
        names = names.value;
        description = description.value;
        price = price.value;
        rate = rate.value;
        quantity = quantity.value;
        sizes = sizes.value;
        weight = weight.value;
        let data = {
            name:names,
            description,
            amount:price,
            rate,
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
               price.value = data.price;
                console.table(data)
         }
       }catch(er){
        alert(`Error: ${er.message}`);
       }
    }else{
        window.location = "/";
    }
}
await GetData();

