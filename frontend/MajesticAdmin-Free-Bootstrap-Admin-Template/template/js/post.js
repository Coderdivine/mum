let name = document.getElementById("name");
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
img_btn.addEventListener("click",async function(){
    if(image.files[0]){
        const form = new FormData();
        form.append("file",image.files[0]);
        form.append("upload_preset","jawkxoys");
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
    }else if(){

    }else if(){

    }

})

