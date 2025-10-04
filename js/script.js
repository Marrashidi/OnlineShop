const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "user@example.com" && password === "1234") {
      sessionStorage.setItem("loggedIn", "true");
      sessionStorage.setItem("username", email);
      window.location.href = "index.html";
    } else {
      document.getElementById("error").textContent =
        "Invalid login. Use user@example.com / 1234";
    }
  });
}

if (
  !window.location.pathname.includes("login.html") &&
  !window.location.pathname.includes("thankyou.html")
) {
  if (sessionStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
  }
}

function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}


async function loadProducts(category) {
  try {
    const response = await fetch("data/products.json");
    const products = await response.json();

    const productList = document.getElementById("product-list");
    if (!productList) return;

    const filtered = products.filter((p) => p.category === category);

    filtered.forEach((product) => {
  const div = document.createElement("div");
  div.classList.add("col-md-14", "mb-4"); 

  div.innerHTML = `
    <div class="card h-100 shadow-sm">
      <img src="${product.image}" class="card-img-top" alt="${product.name}">
      <div class="card-body text-center">
        <h5 class="card-title">${product.name}</h5>
        <p class="card-text">$${product.price.toFixed(2)}</p>
        
        <button class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#productModal"
          data-id="${product.id}"
          data-name="${product.name}"
          data-price="${product.price.toFixed(2)}"
          data-image="${product.image}"
          data-description="${product.description}">
          View Details
        </button>
        
      <button class="btn btn-success mt-2"
          onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">
          Add to Cart
      </button>
      </div>
    </div>
  `;

  productList.appendChild(div);
});
  } catch (error) {
    console.error("Error loading products:", error);
  }
}


function getCart() {
  return JSON.parse(sessionStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  sessionStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id, name, price, image) {
  let cart = getCart();
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }

  saveCart(cart);
  alert(`${name} added to cart!`);
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (!cartItems || !cartTotal) return;

  let cart = getCart();
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span><img src="${item.image}" alt="${item.name}" width="50"> ${item.name}</span>
      <span>$${item.price.toFixed(2)} x ${item.quantity}</span>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;

    cartItems.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);
}

function removeFromCart(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}


const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const card = document.getElementById("card")?.value.trim();

    let errors = [];

    if (!name || name.length < 3) {
      errors.push("Name must be at least 3 characters long.");
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/i;
    if (!emailPattern.test(email)) {
      errors.push("Enter a valid email address.");
    }

    if (!address || address.length < 3) {
      errors.push("Address is too short.");
    }

    if (!/^\d{10}$/.test(card)) {
      errors.push("Card number must be 10 digits.");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    sessionStorage.removeItem("cart");
    window.location.href = "thankyou.html";
  });
}


document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("skincare.html")) {
    loadProducts("skincare");
  }
  if (window.location.pathname.includes("makeup.html")) {
    loadProducts("makeup");
  }
  if (window.location.pathname.includes("electronics.html")) {
    loadProducts("electronics");
  }
  if (window.location.pathname.includes("cart.html")) {
    renderCart();
  }
});

const productModal = document.getElementById('productModal');

if (productModal) {
  productModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;

    const id = button.getAttribute('data-id');       
    const name = button.getAttribute('data-name');
    const price = button.getAttribute('data-price');
    const image = button.getAttribute('data-image');
    const description = button.getAttribute('data-description');

    productModal.querySelector('#modalName').textContent = name;
    productModal.querySelector('#modalPrice').textContent = `$${price}`;
    productModal.querySelector('#modalImage').src = image;
    productModal.querySelector('#modalImage').alt = name;
    productModal.querySelector('#modalDescription').textContent = description;

    const addToCartBtn = productModal.querySelector('#modalAddToCart');
    addToCartBtn.onclick = () => addToCart(parseInt(id), name, parseFloat(price), image);
  });
}
