// offer packages: product/gift lists, encoded package parsing, cost calculation

function show_offer_package(fullpackage){
  package_window=document.querySelector("#OfferPackageModal");
  var offer_package=fullpackage.split('-')[0];
  offer_package=offer_package.split(',');
  console.log(fullpackage);
  var ProductSelection="";

  for( let product of MyProducts){
    ProductSelection+=`<option value=${product.id}>${product.product_name}</option>`;
  }

  var package_cost;
  // use !fullpackage to check for null
  if(fullpackage && fullpackage!=="-"){
    package_cost=PackageCostCalculator(fullpackage);
  }
  else package_cost=0;
  
  var anHTML=`<div class="modal-content">
  <span class="close close2">&times;</span>
  <h3>ΠΑΚΕΤΟ</h3>
  <input name="change_package" id="change_package" type="button" value="Αλλαγή">
  <h4>Συνολικό Κόστος: ${package_cost}</h4>

  <ul id="package_list" style="list-style-type: none;">`;

  var length=0;
  if(offer_package!==""){
    length=offer_package.length;
  }

  let j=0;// traversing the package string
  for(let i=0;i<length/2;i++){
    anHTML+=`<li>
      <h4>Προϊόν ${i+1}</h4>
      <div class="product-container">
        <label for="product_name${i}">Κωδικός</label>
        <select name="product_name${i}" style="width:min-content; background-color:white;">${ProductSelection}</select>
        <label for="product_quantity${i}">Ποσότητα</label>
        <input type="number" name="product_quantity${i}" style="width:min-content" value=${offer_package[j]} >
      </div>
      </li>`;
    j+=2;
  }

  anHTML+=`</ul>
          <input name="add_product" id="add_product" type="button" value="Προσθήκη" style="width:80%; background-color:grey">
          <input name="remove_product" id="remove_product" type="button" value="Αφαίρεση" style="width:18%; background-color:#FF5733 ">
         `;
        
  var gifts='';
  
  if(fullpackage.split('-')[1]){
    gifts=fullpackage.split('-')[1];
    gifts=gifts.split(',');
  }
  //console.log(gifts);
   anHTML+=`
  <h3>ΔΩΡΟ</h3>
  <ul id="gift_list" style="list-style-type: none;">`;

  length=0;
  if(gifts!==""){
    length=gifts.length;
  }

  j=0;// traversing the gifts string
  for(let i=0;i<length/2;i++){
    anHTML+=`<li>
      <h4>Προϊόν ${i+1}</h4>
      <div class="product-container">
        <label for="gift_name${i}">Κωδικός</label>
        <select name="gift_name${i}" style="width:min-content; background-color:white;">${ProductSelection}</select>
        <label for="gift_quantity${i}">Ποσότητα</label>
        <input type="number" name="gift_quantity${i}" style="width:min-content" value=${gifts[j]} >
      </div>
      </li>`;
    j+=2;
  }

  anHTML+=`</ul>
          <input name="add_gift" id="add_gift" type="button" value="Προσθήκη" style="width:80%; background-color:grey">
          <input name="remove_gift" id="remove_gift" type="button" value="Αφαίρεση" style="width:18%; background-color:#FF5733 ">
        </div> `;
        
  package_window.innerHTML=anHTML;

  length=offer_package.length;
  let products_select=[];
  for(let i=0;i<length/2;i++){
    let text=`#OfferPackageModal .modal-content #package_list li [name='product_name${i}']`;
    var product=document.querySelector(text);
    products_select.push(product);
    
  }
  //console.log(products_select);

  if(products_select[0]!==null){
    let j=1;// traversing package on object id
    for(let i=0;i<products_select.length;i++){
      products_select[i].value=offer_package[j]
      j+=2;
    }
  }
  length=gifts.length;

  products_select=[];
  for(let i=0;i<length/2;i++){
    let text=`#OfferPackageModal .modal-content #gift_list li [name='gift_name${i}']`;
    var product=document.querySelector(text);
    products_select.push(product);
  }

  //console.log(products_select);
  if(products_select[0]!=null){
    let j=1;// traversing package on object id
    for(let i=0;i<products_select.length;i++){
      products_select[i].value=gifts[j];
      j+=2;
    }
  }


  package_window.style.display = "block";
  var span = document.getElementsByClassName("close2")[0];
  span.onclick = function () {
    package_window.innerHTML = "";
    package_window.style.display = "none";
  };
  document.querySelector("#change_package").addEventListener("click",()=>{
    var data=getPackageFormData();
    document.querySelector(".offer_form [name='package']").value=data;
  });

  document.querySelector("#add_product").addEventListener("click",function (){
    addItemToProductList();
  });
  document.querySelector("#remove_product").addEventListener("click",function (){
    let list=document.querySelector("#OfferPackageModal .modal-content #package_list");
    list.removeChild(list.lastElementChild);
    console.log("removed");
  });

  document.querySelector("#add_gift").addEventListener("click",function (){
    addItemToGiftList();
  });
  document.querySelector("#remove_gift").addEventListener("click",function (){
    let list=document.querySelector("#OfferPackageModal .modal-content #gift_list");
    list.removeChild(list.lastElementChild);
    console.log("removed");
  });
}


function addItemToProductList(){
  var Selection="";
  for(product of MyProducts){
    Selection+=`<option value=${product.id}>${product.product_name}</option>`;
  }

  let length=document.querySelectorAll("#OfferPackageModal .modal-content #package_list li").length;
  anHTML=`
  <li>
      <h4>Προϊόν ${length+1}</h4>
      <div class="product-container">
        <label for="product_name${length}">Κωδικός</label>
        <select name="product_name${length}" style="width:min-content; background-color:white;">${Selection}</select>
        <label for="product_quantity${length}">Ποσότητα</label>
        <input type="number" name="product_quantity${length}" style="width:min-content">
      </div>
      </li>
  `;
  let list=document.querySelector("#OfferPackageModal .modal-content #package_list");
  if(length>0){ 
    list.insertAdjacentHTML("beforeend",anHTML);
  }
  else{
    list.innerHTML=anHTML;
  }
}

function addItemToGiftList(){
  var Selection="";
  for(product of MyProducts){
    Selection+=`<option value=${product.id}>${product.product_name}</option>`;
  }

  let length=document.querySelectorAll("#OfferPackageModal .modal-content #gift_list li").length;
  anHTML=`
  <li>
      <h4>Προϊόν ${length+1}</h4>
      <div class="product-container">
        <label for="gift_name${length}">Κωδικός</label>
        <select name="gift_name${length}" style="width:min-content; background-color:white;">${Selection}</select>
        <label for="gift_quantity${length}">Ποσότητα</label>
        <input type="number" name="gift_quantity${length}" style="width:min-content">
      </div>
      </li>
  `;
  let list=document.querySelector("#OfferPackageModal .modal-content #gift_list");
  if(length>0){ 
    list.insertAdjacentHTML("beforeend",anHTML);
  }
  else{
    list.innerHTML=anHTML;
  }
}

function getPackageFormData(){
  let data="";
  let length=document.querySelectorAll("#OfferPackageModal .modal-content #package_list li").length;

  for(let i=0;i<length;i++){
    let text=`#OfferPackageModal .modal-content #package_list li [name='product_name${i}']`;
    var product_name=document.querySelector(text);
    text=`#OfferPackageModal .modal-content #package_list li [name='product_quantity${i}']`;
    var product_quantity=document.querySelector(text);

    if(i!=0){data+=","}
    data+=product_quantity.value;
    data+=",";
    data+=product_name.value;
  }
  data+='-';

  length=document.querySelectorAll("#OfferPackageModal .modal-content #gift_list li").length;

  for(let i=0;i<length;i++){
    let text=`#OfferPackageModal .modal-content #gift_list li [name='gift_name${i}']`;
    var gift_name=document.querySelector(text);
    text=`#OfferPackageModal .modal-content #gift_list li [name='gift_quantity${i}']`;
    var gift_quantity=document.querySelector(text);

    if(i!=0){data+=","}
    data+=gift_quantity.value;
    data+=",";
    data+=gift_name.value;
  }
  console.log(data);
  return data;
}
function PackageItemList(package){
  let product_list=[];
  let gift_list=[];
  if (package===null){
    return 0;
  }
  else{
    
    let gifts=package.split('-')[1];
    let products=package.split('-')[0];
    
    if (products.length!=0){
      products=products.split(',');
      for(let i=0;i<products.length;i+=2){
        const product_id=products[i+1];
        let product=MyProducts.find(product => product.id==product_id);
        let item={
          quantity:products[i],
          name:product.product_name
        }
        product_list.push(item);
      }
    }
    if (gifts.length!=0){
      gifts=gifts.split(',');
      for(let i=0;i<gifts.length;i+=2){
        const gift_id=gifts[i+1];
        let gift=MyProducts.find(gift => gift.id==gift_id);
        let item={
          quantity:gifts[i],
          name:gift.product_name
        }
        gift_list.push(item);
      }
    }
    
  }
  return [product_list,gift_list];
}
function PackageCostCalculator(package){
  
  if(package){
    let product_list=[];
    let gifts=package.split('-')[1];
    if (gifts.length==0){ //check if gift list has items
      package=package.split('-')[0];
    }
    else{
      package=package.replace('-',','); // combine gifts and products lists
    }
    package=package.split(',');
    //console.log(package);
    for(let i=0;i<package.length;i+=2){
      const product_id=package[i+1];
      let product=MyProducts.find(product => product.id==product_id);
      console.log(product.price);
      let item={
        quantity:package[i],
        id:package[i+1],
        cost: package[i]*product.price
      }
      product_list.push(item);
    }
    var package_cost=0;
    for(let product of product_list){
      package_cost+=product.cost;
    }
    //console.log(product_list);
    //console.log(package_cost);
    return package_cost;
  } 
  else{
     return 0; 
  }
}


