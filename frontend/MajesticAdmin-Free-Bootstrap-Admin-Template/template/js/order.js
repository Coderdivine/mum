let id = location.search.split('?')[1];
console.log(id)
    let post,card,sub_card;
    let sum =0;
    card = document.getElementById("card");
    sub_card = document.getElementById("sub_card")
    async function convert(x){
       var cont =  x.product && x.product.forEach(list => {
              sum += Number(list.amount);
      })
      return cont;
    }
    async function xData() {
        axios.get(`https://ax-mum.herokuapp.com/order/order-info/${id}`)
        .then(async(res)=>{
            let data = res.data.data;
            console.log(data);
            let celo = data[0].product;
            await GetData(celo);
            let mapped = data.map(x=>`
            <table class="min-w-max w-full table-auto">
                    <thead>
                        <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th class="py-3 px-6 text-left">Name</th>
                            <th class="py-3 px-6 text-left">Type</th>
                            <th class="py-3 px-6 text-center">Product</th>
                            <th class="py-3 px-6 text-center">Number</th>
                            <th class="py-3 px-6 text-center">Amount</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 text-sm font-light">
                        <tr class="border-b border-gray-200 hover:bg-gray-100">
                            <td class="py-3 px-6 text-left whitespace-nowrap">
                                <div class="flex items-center">
                                   
                                    <span class="font-medium">${x.firstname} ${x.lastname}</span>
                                </div>
                            </td>
                            <td class="py-3 px-6 text-left">
                                <div class="flex items-center">
                                   
                                    <span>${x.type}</span>
                                </div>
                            </td>
                            <td class="py-3 px-6 text-center">
                                <div class="flex items-center justify-center">
                                ${x.product.map(e=>`<span>${e.product_id}</span>`)}
                                </div>
                            </td>
                            <td class="py-3 px-6 text-center">
                                <span class="bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs">${x.phone_number}</span>
                            </td>
                            <td class="py-3 px-6 text-center">
                                <div class="flex item-center justify-center">
                                   NGN ${convert(x)}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                ${x.product.map(el=>`
                    <table class="min-w-max w-full table-auto">
                    <thead>
                        <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th class="py-3 px-6 text-left">Product Name</th>
                            <th class="py-3 px-6 text-left">Quantity</th>
                            <th class="py-3 px-6 text-center">Sizes</th>
                            <th class="py-3 px-6 text-center">color</th>
                            <th class="py-3 px-6 text-center">Amount</th>
                            <th class="py-3 px-6 text-center">ID</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-600 text-sm font-light">
                        <tr class="border-b border-gray-200 hover:bg-gray-100">
                            <td class="py-3 px-6 text-left whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="mr-2">
                                        
                                    </div>
                                    <span class="font-medium">${el.name}</span>
                                </div>
                            </td>
                            <td class="py-3 px-6 text-left">
                                <div class="flex items-center">
                                    
                                    <span>x${el.quantity}</span>
                                </div>
                            </td>
                            <td class="py-3 px-6 text-center">
                                <div class="flex items-center justify-center">
                                 ${el.size}
                                    </div>
                            </td>
                            <td class="py-3 px-6 text-center">
                                <span class="bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs">${el.color}</span>
                            </td>
                            <td class="py-3 px-6 text-center">
                                <div class="flex item-center justify-center">
                                    ${el.amount}
                                </div>
                            </td>
                            <td class="py-3 px-6 text-center">
                                <div class="flex item-center justify-center">
                                    ${el.product_id}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
              `)}
              `)
         card.innerHTML = mapped;
               
            }).catch(err=>{
            alert(`Error: ${err.message}`);
        });
        

    }
async function GetData(cell){
   let post = [];
 for(let i=0;i<cell.length;i++){
    console.log(`ID ${i} =>`,cell[i].product_id)
 axios.get(`https://ax-mum.herokuapp.com/product/product-info/${cell[i].product_id}`)
 .then(res=>{
    let data = res.data.data;
    post.push(data[0]);
    post.push(data[0]);
    console.log(data[0]);
 }).catch(console.log)
 }
 console.table(post);
if(post.length){
    sub_card.innerHTML = post.map(x=>`
    <div>
                   <div
                   class="my-8 rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1">
                   <!-- Clickable Area -->
                   <a  class="cursor-pointer">
                       <figure>
                           <!-- Image -->
                           <img
                               src=${x.image}
                               class="rounded-t h-72 w-full object-cover" />
   
                           <figcaption class="p-4">
                               <!-- Title -->
                               <p
                                   class="text-lg mb-4 font-bold leading-relaxed text-gray-800 dark:text-gray-300"
                                   >
                                   <!-- Post Title -->
                                   ${x.name}
                               </p>
   
                               <!-- Description -->
                               <small
                                   class="leading-5 text-gray-500 dark:text-gray-400"
                               >
                                ${x.description}
                                   <!-- Post Description -->
                               </small>
                               <small
                                   class="leading-5 text-gray-500 dark:text-gray-400"
                               >
                                ${x.price}
                                   <!-- Post Description -->
                               </small>
                           </figcaption>
                          </figure>
                   </a>
               </div>
      </div>`)
}
}
    xData()