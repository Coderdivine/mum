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
let img_json = [];
img_btn.addEventListener("click",function(){
    if(image.files[0]){
        const form = new FormData();
        form.append("file",img);
        form.append("upload_preset","jawkxoys");
        axios({
            method:"POST",
            url:"https://api.cloudinary.com/v1_1/axgura/image/upload",
            data:form,
            header:{"Content-Type":"multipart/form-data"},
          })
          .then((response)=>{
            setImg(response.data.secure_url)
            console.log(response.data.secure_url)
            setCont(true);
            setMsg("Uploaded");
            getQueue()
          }).catch((err)=>{
            setMsg("Please select an image");
            playSound("cancel")
          })
    }else{
        alert("Please choose a image first")
    }
})