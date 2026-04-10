
let products = JSON.parse(localStorage.getItem("products"));

if (!products || products.length === 0) {
  products = [
    {
      id: 1,
      name: "iPhone 14 Pro",
      price: 1200000,
      image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500",
      category: "electronics"
    },
    {
      id: 2,
      name: "Nike Sneakers",
      price: 95000,
      image: "https://images.unsplash.com/photo-1528701800489-20be3c6b3e6b?w=500",
      category: "fashion"
    },
    {
      id: 3,
      name: "Modern Sofa",
      price: 450000,
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500",
      category: "home"
    },
    {
      id: 4,
      name: "Laptop Dell",
      price: 1500000,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
      category: "electronics"
    },
    {
      id: 5,
      name: "Luxury Watch",
      price: 60000,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      category: "fashion"
    }
  ];

  localStorage.setItem("products", JSON.stringify(products));

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [
  "electronics",
  "fashion",
  "home"
];

let idCounter = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;


const container = document.getElementById("products");
const cartItems = document.getElementById("cartItems");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const pName = document.getElementById("pName");
const pPrice = document.getElementById("pPrice");
const pImage = document.getElementById("pImage");
const pCategory = document.getElementById("pCategory");
const newCategory = document.getElementById("newCategory");


function updateCategories() {
  if (!pCategory || !filterCategory) return;

  pCategory.innerHTML = "";
  filterCategory.innerHTML = "<option value='all'>All</option>";

  categories.forEach(c => {
    pCategory.innerHTML += `<option>${c}</option>`;
    filterCategory.innerHTML += `<option>${c}</option>`;
  });
}
  
function addCategory() {
  let c = newCategory?.value?.toLowerCase();
  if (!c) return;
  if (categories.includes(c)) return;

  categories.push(c);
  localStorage.setItem("categories", JSON.stringify(categories));
  updateCategories();
}


function displayProducts() {
  if (!container) return;

  container.innerHTML = "";

  let search = searchInput?.value?.toLowerCase() || "";
  let filter = filterCategory?.value || "all";

  let filtered = products;

  if (search) {
    filtered = products.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.category.toLowerCase().includes(search)
    );
  } else if (filter !== "all") {
    filtered = products.filter(p => p.category === filter);
  }

  filtered.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p>${p.price.toLocaleString()} TZS</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
        <button onclick="deleteProduct(${p.id})">Delete</button>
      </div>
    `;
  });
}


function addProduct() {
  let p = {
    id: idCounter++,
    name: pName.value,
    price: Number(pPrice.value),
    image: pImage.value,
    category: pCategory.value
  };

  products.push(p);
  localStorage.setItem("products", JSON.stringify(products));
  displayProducts();
}


function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
  displayProducts();
}


function addToCart(id) {
  let item = cart.find(i => i.id === id);

  if (item) {
    item.qty++;
  } else {
    let p = products.find(p => p.id === id);
    if (!p) return;
    cart.push({ ...p, qty: 1 });
  }

  updateCart();
}

function updateCart() {
  if (!cartItems) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(i => {
    total += i.price * i.qty;

    cartItems.innerHTML += `
      <li>
        ${i.name} (${i.qty})
        <button onclick="changeQty(${i.id},-1)">-</button>
        <button onclick="changeQty(${i.id},1)">+</button>
      </li>
    `;
  });

  const totalEl = document.getElementById("total");
  if (totalEl) {
    totalEl.innerText = "Total: " + total.toLocaleString() + " TZS";
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}


function changeQty(id, c) {
  let i = cart.find(x => x.id === id);
  if (!i) return;

  i.qty += c;

  if (i.qty <= 0) {
    cart = cart.filter(x => x.id !== id);
  }

  updateCart();
}


filterCategory?.addEventListener("change", displayProducts);
searchInput?.addEventListener("input", displayProducts);


updateCategories();
displayProducts();
updateCart();
