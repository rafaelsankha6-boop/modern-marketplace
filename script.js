// ===== SAFE INIT =====
let products = JSON.parse(localStorage.getItem("products"));

if (!products || products.length === 0) {
  products = [
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
  localStorage.setItem("products", JSON.stringify(products));
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || ["electronics", "fashion", "home"];

let idCounter = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;

// ===== ELEMENTS (SAFE CHECK) =====
const pName = document.getElementById("pName");
const pPrice = document.getElementById("pPrice");
const pImage = document.getElementById("pImage");
const pCategory = document.getElementById("pCategory");
const newCategory = document.getElementById("newCategory");
const filterCategory = document.getElementById("filterCategory");
const searchInput = document.getElementById("searchInput");
const cartItems = document.getElementById("cartItems");
const container = document.getElementById("products");

// ===== CATEGORIES =====
function updateCategories() {
  if (!pCategory || !filterCategory) return;

  pCategory.innerHTML = "";
  filterCategory.innerHTML = "<option value='all'>All</option>";

  categories.forEach(c => {
    pCategory.innerHTML += `<option>${c}</option>`;
    filterCategory.innerHTML += `<option>${c}</option>`;
  });
}

// ===== ADD CATEGORY =====
function addCategory() {
  let c = newCategory?.value?.toLowerCase();
  if (!c) return;
  if (categories.includes(c)) return;

  categories.push(c);
  localStorage.setItem("categories", JSON.stringify(categories));
  updateCategories();
}

// ===== DISPLAY PRODUCTS =====
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
        <img src="${p.image}" width="150">
        <h4>${p.name}</h4>
        <p>${p.price} TZS</p>
        <button onclick="addToCart(${p.id})">Add</button>
        <button onclick="deleteProduct(${p.id})">Delete</button>
      </div>
    `;
  });
}

// ===== ADD PRODUCT =====
function addProduct() {
  if (!pName || !pPrice || !pImage || !pCategory) return;

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

// ===== DELETE PRODUCT =====
function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  localStorage.setItem("products", JSON.stringify(products));
  displayProducts();
}

// ===== CART =====
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
    totalEl.innerText = "Total: " + total + " TZS";
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===== CHANGE QTY =====
function changeQty(id, c) {
  let i = cart.find(x => x.id === id);
  if (!i) return;

  i.qty += c;

  if (i.qty <= 0) {
    cart = cart.filter(x => x.id !== id);
  }

  updateCart();
}

// ===== EVENTS =====
filterCategory?.addEventListener("change", displayProducts);
searchInput?.addEventListener("input", displayProducts);

// ===== INIT =====
updateCategories();
displayProducts();
updateCart();
