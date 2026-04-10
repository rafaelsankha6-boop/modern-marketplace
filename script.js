// LOAD DATA (with default products)
let products = JSON.parse(localStorage.getItem("products")) || [
  {
    id: 1,
    name: "Smartphone",
    price: 500000,
    image: "https://via.placeholder.com/150",
    category: "electronics"
  },
  {
    id: 2,
    name: "Sneakers",
    price: 80000,
    image: "https://via.placeholder.com/150",
    category: "fashion"
  },
  {
    id: 3,
    name: "Sofa",
    price: 300000,
    image: "https://via.placeholder.com/150",
    category: "home"
  }
];

// SAVE DEFAULT IF EMPTY
if (!localStorage.getItem("products")) {
  localStorage.setItem("products", JSON.stringify(products));
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || ["electronics","fashion","home"];

let idCounter = products.length ? Math.max(...products.map(p=>p.id))+1 : 1;

const pName = document.getElementById("pName");
const pPrice = document.getElementById("pPrice");
const pImage = document.getElementById("pImage");
const pCategory = document.getElementById("pCategory");
const newCategory = document.getElementById("newCategory");
const filterCategory = document.getElementById("filterCategory");
const searchInput = document.getElementById("searchInput");
const cartItems = document.getElementById("cartItems");


function updateCategories(){
  if(!pCategory || !filterCategory) return;

  pCategory.innerHTML="";
  filterCategory.innerHTML="<option value='all'>All</option>";

  categories.forEach(c=>{
    pCategory.innerHTML+=`<option>${c}</option>`;
    filterCategory.innerHTML+=`<option>${c}</option>`;
  });
}


function addCategory(){
  let c=newCategory.value.toLowerCase();
  if(!c) return;
  if(categories.includes(c)) return;

  categories.push(c);
  localStorage.setItem("categories",JSON.stringify(categories));
  updateCategories();
  
function displayProducts(){
  const container=document.getElementById("products");
  if(!container) return;

  container.innerHTML="";

  let search = searchInput ? searchInput.value.toLowerCase() : "";
  let filter = filterCategory ? filterCategory.value : "all";

  let filtered;

  if(search){
    filtered = products.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search)
    );
  } else if(filter!=="all"){
    filtered = products.filter(p=>p.category===filter);
  } else {
    filtered = products;
  }

  filtered.forEach(p=>{
    container.innerHTML+=`
      <div class="card">
        <img src="${p.image}">
        <h4>${p.name}</h4>
        <p>${p.price} TZS</p>
        <button onclick="addToCart(${p.id})">Add</button>
        <button onclick="deleteProduct(${p.id})">Delete</button>
      </div>
    `;
  });
}


function addProduct(){
  let p={
    id:idCounter++,
    name:pName.value,
    price:Number(pPrice.value),
    image:pImage.value,
    category:pCategory.value
  };

  products.push(p);
  localStorage.setItem("products",JSON.stringify(products));
  displayProducts();
}

function deleteProduct(id){
  products=products.filter(p=>p.id!==id);
  localStorage.setItem("products",JSON.stringify(products));
  displayProducts();
}


function addToCart(id){
  let item=cart.find(i=>i.id===id);

  if(item) item.qty++;
  else{
    let p=products.find(p=>p.id===id);
    cart.push({...p,qty:1});
  }

  updateCart();
}


function updateCart(){
  if(!cartItems) return;

  cartItems.innerHTML="";
  let total=0;

  cart.forEach(i=>{
    total+=i.price*i.qty;

    cartItems.innerHTML+=`
      <li>
        ${i.name} (${i.qty})
        <button onclick="changeQty(${i.id},-1)">-</button>
        <button onclick="changeQty(${i.id},1)">+</button>
      </li>
    `;
  });

  const totalEl = document.getElementById("total");
  if(totalEl){
    totalEl.innerText="Total: "+total+" TZS";
  }

  localStorage.setItem("cart",JSON.stringify(cart));
}


function changeQty(id,c){
  let i=cart.find(x=>x.id===id);
  i.qty+=c;

  if(i.qty<=0){
    cart=cart.filter(x=>x.id!==id);
  }

  updateCart();
}


function checkout(){
  alert("Order placed!");
  cart=[];
  updateCart();
}


function clearCart(){
  cart=[];
  updateCart();
}


function startNewShopping(){
  cart=[];
  updateCart();
}
if(filterCategory){
  filterCategory.addEventListener("change",displayProducts);
}
  
updateCategories();
displayProducts();
updateCart();
