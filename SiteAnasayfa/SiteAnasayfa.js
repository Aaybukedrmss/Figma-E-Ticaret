// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// API Functions
async function getAllProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/EcommerceDb1`);
        if (response.ok) {
            const products = await response.json();
            return products;
        } else {
            console.error('Ürünler yüklenirken hata oluştu');
            return [];
        }
    } catch (error) {
        console.error('API Hatası:', error);
        return [];
    }
}

async function getProductsByCategory(category) {
    try {
        const response = await fetch(`${API_BASE_URL}/EcommerceDb1/category/${category}`);
        if (response.ok) {
            const products = await response.json();
            return products;
        } else {
            console.error('Kategori ürünleri yüklenirken hata oluştu');
            return [];
        }
    } catch (error) {
        console.error('API Hatası:', error);
        return [];
    }
}

// Display Functions
function displayProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = '<p>Ürün bulunamadı</p>';
        return;
    }

    const productsHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.imageUrl || '../Images/default-product.jpg'}" alt="${product.name}">
                <div class="product-actions">
                    <button onclick="addToFavorites(${product.id})" class="favorite-btn">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                    <button onclick="addToCart(${product.id})" class="cart-btn">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description || 'Açıklama yok'}</p>
                <div class="product-price">
                    <span class="price">${product.price} TL</span>
                    <span class="stock">Stok: ${product.stock}</span>
                </div>
                <div class="product-category">
                    <span class="category-tag">${product.category || 'Genel'}</span>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = productsHTML;
}

// Event Handlers
async function loadFeaturedProducts() {
    const products = await getAllProducts();
    // İlk 8 ürünü göster
    const featuredProducts = products.slice(0, 8);
    displayProducts(featuredProducts, 'featured-products');
}

async function loadProductsByCategory(category) {
    const products = await getProductsByCategory(category);
    displayProducts(products, 'category-products');
}

// Cart and Favorites Functions
function addToCart(productId) {
    // Sepet işlemleri için localStorage kullan
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Ürün sepete eklendi!');
}

function addToFavorites(productId) {
    // Favoriler için localStorage kullan
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (!favorites.includes(productId)) {
        favorites.push(productId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Ürün favorilere eklendi!');
    } else {
        alert('Bu ürün zaten favorilerinizde!');
    }
}

// Search Function
async function searchProducts(searchTerm) {
    const products = await getAllProducts();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayProducts(filteredProducts, 'search-results');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load featured products
    loadFeaturedProducts();
    
    // Setup search functionality
    const searchInput = document.querySelector('.search input');
    const searchButton = document.querySelector('.search button');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                searchProducts(searchTerm);
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    searchProducts(searchTerm);
                }
            }
        });
    }
    
    // Setup category navigation
    const categoryLinks = document.querySelectorAll('.navbar ul li a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.textContent;
            loadProductsByCategory(category);
        });
    });
});

// Export functions for use in other files
window.ShopcoAPI = {
    getAllProducts,
    getProductsByCategory,
    addToCart,
    addToFavorites,
    searchProducts
};

