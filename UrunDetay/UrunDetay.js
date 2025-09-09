document.addEventListener('DOMContentLoaded', function() {
  const favoriButton = document.querySelector('.favoriButton');
  const favMessage = document.getElementById('favMessage');
  const cartMessage = document.getElementById('cartMessage');
  const addToCartButton = document.getElementById('addToCartButton');

  // API tabanı (isteğe bağlı). Örn: window.__API_BASE__ = 'http://localhost:5199/api'
  function getApiBase() {
    const base = window.__API_BASE__ || "http://localhost:5090/api";
    return base.replace(/\/$/, "");
  }

  function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const idStr = params.get('id');
    return idStr ? parseInt(idStr, 10) : null;
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

  async function loadProductFromApi(productId) {
    const url = `${getApiBase()}/products/${productId}`;
    const res = await fetchWithTimeout(url, { timeout: 6000 });
    if (!res.ok) throw new Error('API hata: ' + res.status);
    return await res.json();
  }

  async function loadProductFromLocal(productId) {
    const res = await fetch('../Public/products.json');
    if (!res.ok) throw new Error('Local products.json okunamadı');
    const data = await res.json();
    return Array.isArray(data) ? data.find(p => p.id === productId) : null;
  }

  function setText(el, text) {
    if (el) el.textContent = text;
  }

  function setImage(el, src, alt) {
    if (el) {
      el.src = src;
      if (alt) el.alt = alt;
    }
  }

  function renderProduct(product) {
    if (!product) return;
    // Başlık
    const titleEl = document.querySelector('.product_header h2');
    setText(titleEl, product.title || 'Ürün');

    // Fiyat
    const priceEl = document.querySelector('.original_price');
    if (priceEl && product.price != null) {
      setText(priceEl, `${product.price} TL`);
    }

    // Açıklama
    const descEl = document.querySelector('.product_rateprice h6');
    if (descEl && product.description) {
      setText(descEl, product.description);
    }

    // Görseller
    const bigImgEl = document.querySelector('.bigphoto img');
    if (bigImgEl && product.image) {
      setImage(bigImgEl, product.image, product.title);
    }
    const firstThumb = document.querySelector('.smallphotos img');
    if (firstThumb && product.image) {
      setImage(firstThumb, product.image, product.title);
    }

    // Bedenler (opsiyonel)
    const sizesContainer = document.querySelector('.sizes');
    const sizeOptions = document.querySelector('.size_options');
    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
      if (sizeOptions) {
        sizeOptions.innerHTML = '';
        product.sizes.forEach(sz => {
          const div = document.createElement('div');
          div.textContent = sz;
          sizeOptions.appendChild(div);
        });
      }
      if (sizesContainer) sizesContainer.style.display = '';
    } else {
      if (sizesContainer) sizesContainer.style.display = 'none';
    }
  }

  async function init() {
    const productId = getProductIdFromUrl();
    if (!productId) {
      // id yoksa beden kısmını gizle
      const sizesContainer = document.querySelector('.sizes');
      if (sizesContainer) sizesContainer.style.display = 'none';
      return;
    }
    try {
      let product = null;
      try {
        product = await loadProductFromApi(productId);
      } catch (_) {
        product = await loadProductFromLocal(productId);
      }
      renderProduct(product);
    } catch (e) {
      // Yükleme hatası durumunda beden kısmını gizle
      const sizesContainer = document.querySelector('.sizes');
      if (sizesContainer) sizesContainer.style.display = 'none';
    }
  }

  // Favori butonu
  if (favoriButton) {
    favoriButton.addEventListener('click', function() {
      if (favMessage) {
        favMessage.style.display = 'block';
        setTimeout(function() {
          favMessage.style.display = 'none';
        }, 3000);
      }
      this.innerHTML = '<i class="fa-solid fa-heart" style="color:red"></i>';
    });
  }

  // Sepete ekle butonu
  if (addToCartButton) {
    addToCartButton.addEventListener('click', function() {
      if (cartMessage) {
        cartMessage.style.display = 'block';
        setTimeout(function() {
          cartMessage.style.display = 'none';
        }, 2000);
      }
    });
  }

  // Başlat
  init();
});