console.clear()
let id = location.search.split('?')[1]
let data;
async function GetData(){
    if(id){
        let response = await fetch(`https://api.github.com/users/${id}`)
        data = await response.json()

    }
}

console.log(id)
let names = document.getElementById("name");
let description = document.getElementById("description");
let brand = document.getElementById("brand");
let category = document.getElementById("category");
let price = document.getElementById("price");
let rate = document.getElementById("rate");
let quantity = document.getElementById("quantity");
let sizes = document.getElementById("sizes");
let image = document.getElementById("image");
let weight = document.getElementById("weight");
let btn = document.getElementById("btn");
let img_btn = document.getElementById("img_btn");
let img_json = localStorage.getItem("img_json")?JSON.parse(localStorage.getItem("img_json")):[];
image.addEventListener("change",async function(){
    if(image.files[0]){
        const form = new FormData();
        form.append("file",image.files[0]);
        form.append("upload_preset","jawkxoys");
        console.log(form)
        axios({
            method:"POST",
            url:"https://api.cloudinary.com/v1_1/axgura/image/upload",
            data:form,
            header:{"Content-Type":"multipart/form-data"},
          })
          .then((response)=>{
            img_json.push(response.data.secure_url)
            console.log(response.data.secure_url)
            console.log(img_json);
            localStorage.setItem("img_json",JSON.stringify(img_json));
          }).catch((err)=>{
            alert(`Please select an image: ${err.message}`)
          })
    }else{
        alert("Please choose a image first")
    }
});
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
