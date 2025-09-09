// API'den veya lokal JSON'dan ürün verisini yükle
let products = [];

function getApiBase() {
  const base = window.__API_BASE__ || "http://localhost:5090/api";
  return base.replace(/\/$/, "");
}

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 5000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function loadProductsFromApi(queryParams = {}) {
  const params = new URLSearchParams(queryParams);
  const url = `${getApiBase()}/products?${params.toString()}`;
  const res = await fetchWithTimeout(url, { timeout: 6000 });
  if (!res.ok) throw new Error("API hata: " + res.status);
  return await res.json();
}

async function loadProductsFromLocal() {
  const res = await fetch("../Public/products.json");
  if (!res.ok) throw new Error("Local products.json okunamadı");
  return await res.json();
}

async function loadProducts(initial = false) {
  try {
    // API'den çekmeyi dene (filtreler backend'e taşınabilir)
    const apiData = await loadProductsFromApi({});
    products = Array.isArray(apiData) ? apiData : (apiData.items || []);
  } catch (_) {
    // API çalışmazsa lokal dosyadan yükle
    const localData = await loadProductsFromLocal();
    products = Array.isArray(localData) ? localData : [];
  }
  if (initial) {
    filteredProducts = [...products];
  }
}

// Değişkenler
let filteredProducts = [...products];
let selectedColor = null;
let selectedSize = null;
let selectedCategory = null;
let selectedStyle = null;
let sortOption = "Popüler";
let currentPage = 1;
const itemsPerPage = 6;

// Yıldızlar için basit fonksiyon
function getStarHTML(rating) {
  const fullStars = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let stars = "★".repeat(fullStars);
  if (half) stars += "½";
  return stars;
}

function displayProducts(productList) {
  const container = document.querySelector(".product-grid");
  container.innerHTML = "";

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageItems = productList.slice(startIndex, endIndex);

  pageItems.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";

    // Ürün kartını <a> etiketi içine al, href ile detay sayfasına id gönder
    card.innerHTML = `
      <a href="../UrunDetay/UrunDetay.html?id=${p.id}" class="product-link" style="text-decoration:none; color:inherit;">
        <img src="${p.image}" alt="${p.title}">
        <h4>${p.title}</h4>
        <div class="rating">${getStarHTML(p.rating)} (${p.rating.toFixed(1)})</div>
        <div class="price-info">
          <span class="price">$${p.price}</span>
          ${p.oldPrice ? `<span class="old-price">$${p.oldPrice}</span>` : ""}
          ${p.discount ? `<span class="discount">-${p.discount}</span>` : ""}
        </div>
      </a>
    `;

    container.appendChild(card);
  });

  updatePagination(productList.length);
}


// Sayfa numarası ve butonları güncelleme
function updatePagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = document.getElementById("page-numbers");

  pageNumbers.textContent = `Sayfa ${currentPage} / ${totalPages}`;

  document.getElementById("prev-btn").disabled = currentPage === 1;
  document.getElementById("next-btn").disabled = currentPage === totalPages || totalPages === 0;
}

// Sıralama fonksiyonu
function sortProducts(productsArr) {
  let sorted = [...productsArr];
  if (sortOption === "Ücret: Azalan>Artan") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortOption === "Ücret: Artan>Azalan") {
    sorted.sort((a, b) => b.price - a.price);
  } else {
    // Popüler varsayılanı: rating'e göre azalan
    sorted.sort((a, b) => b.rating - a.rating);
  }
  return sorted;
}

// Filtreleme fonksiyonu
function filterProducts() {
  const min = parseInt(document.getElementById("min-price").value);
  const max = parseInt(document.getElementById("max-price").value);

  filteredProducts = products.filter(p => p.price >= min && p.price <= max);

  if (selectedColor) {
    filteredProducts = filteredProducts.filter(p => p.color === selectedColor);
  }

  if (selectedSize) {
    filteredProducts = filteredProducts.filter(p => Array.isArray(p.sizes) && p.sizes.includes(selectedSize));
  }

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }

  if (selectedStyle) {
    filteredProducts = filteredProducts.filter(p => p.style === selectedStyle);
  }

  // Sıralama uygula
  filteredProducts = sortProducts(filteredProducts);

  currentPage = 1;
  displayProducts(filteredProducts);
}

// Event listenerlar

// Renk seçimi
document.querySelectorAll(".color").forEach((colorEl) => {
  colorEl.addEventListener("click", () => {
    selectedColor = colorEl.dataset.color;
    document.querySelectorAll(".color").forEach(el => el.classList.remove("selected"));
    colorEl.classList.add("selected");
    filterProducts();
  });
});

// Beden seçimi
document.querySelectorAll(".sizes button").forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedSize = btn.textContent;
    document.querySelectorAll(".sizes button").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    filterProducts();
  });
});

// Kategori seçimi
document.querySelectorAll("[data-category]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    selectedCategory = el.dataset.category;
    filterProducts();
  });
});

// Stil seçimi
const styleTitle = document.getElementById("style-title");

document.querySelectorAll("[data-style]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    selectedStyle = el.dataset.style;
    filterProducts();

    // Başlığı seçilen stile göre güncelle
    styleTitle.textContent = selectedStyle || "Casual";
  });
});


// Fiyat filtreleme için buton
document.querySelector(".apply-filter").addEventListener("click", () => {
  filterProducts();
});

// Sıralama seçimi
const sortSelect = document.getElementById("sort-select");
sortSelect.addEventListener("change", () => {
  sortOption = sortSelect.value;
  currentPage = 1;
  filterProducts();
});

// Sayfa butonları
document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayProducts(filteredProducts);
  }
});

document.getElementById("next-btn").addEventListener("click", () => {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayProducts(filteredProducts);
  }
});

// Sayfa yüklendiğinde ilk gösterim
document.addEventListener("DOMContentLoaded", async () => {
  await loadProducts(true);
  filterProducts();
});


document.querySelectorAll('.child_topselling').forEach(item => {
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => {
    const name = item.querySelector('p').innerText;
    const price = item.querySelector('.currentpricetopselling').innerText;
    const oldPrice = item.querySelector('.oldpricetopselling').innerText;
    const discount = item.querySelector('.discounttopselling').innerText;
    const imgSrc = item.querySelector('img').src;

    // URL encode ederek query parametre oluştur
    const params = new URLSearchParams({
      name, price, oldPrice, discount, imgSrc
    });

    window.location.href = 'productdetailindex.html?' + params.toString();
  });
});
