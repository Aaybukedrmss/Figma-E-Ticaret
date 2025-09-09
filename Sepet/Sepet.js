document.addEventListener('DOMContentLoaded', function() {
  // Kupon veritabanı
  const validCoupons = {
    'WELCOME10': { discount: 10, type: 'percentage' },
    'SAVE20': { discount: 20, type: 'fixed' },
    'SUMMER25': { discount: 25, type: 'percentage' }
  };

  // Miktar değişiklikleri için event delegation
  document.addEventListener('click', function(e) {
    const product = e.target.closest('.product');
    
    // Artırma butonu (+)
    if(e.target.classList.contains('quantitybtn') && e.target.textContent === '+') {
      const input = product.querySelector('.quantityinput');
      input.value = parseInt(input.value) + 1;
      updateCart();
    }
    
    // Azaltma butonu (-)
    if(e.target.classList.contains('quantitybtn') && e.target.textContent === '-') {
      const input = product.querySelector('.quantityinput');
      if(parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        updateCart();
      }
    }
  });

  // Kupon uygulama butonu
  document.querySelector('.applycoupon').addEventListener('click', applyCoupon);
  
  // Enter tuşu ile de uygulanabilir
  document.getElementById('couponcode').addEventListener('keypress', function(e) {
    if(e.key === 'Enter') {
      applyCoupon();
    }
  });

  function applyCoupon() {
    const couponCode = document.getElementById('couponcode').value.trim().toUpperCase();
    const couponInfo = validCoupons[couponCode];
    
    if(!couponCode) {
      alert('Lütfen bir kupon kodu giriniz!');
      return;
    }

    if(couponInfo) {
      // Kupon geçerliyse indirimi uygula
      updateCart(couponInfo);
      alert(`Kupon uygulandı! ${couponInfo.discount}${couponInfo.type === 'percentage' ? '%' : '$'} indirim kazandınız.`);
    } else {
      // Geçersiz kupon
      alert('Geçersiz kupon kodu! Lütfen doğru bir kod giriniz.');
      updateCart(); // Orijinal toplamı geri yükle
    }
  }

  // Sepet toplamını güncelleyen fonksiyon (kupon bilgisi opsiyonel)
  function updateCart(couponInfo = null) {
    let subtotal = 0;
    
    // Tüm ürünleri dolaş ve fiyatları topla
    document.querySelectorAll('.product').forEach(product => {
      const priceText = product.querySelector('.productprice').textContent;
      const price = parseFloat(priceText.replace('$', '').trim());
      const quantity = parseInt(product.querySelector('.quantityinput').value);
      subtotal += price * quantity;
    });
    
    // Subtotal'i güncelle
    document.querySelector('.subtotalprice').textContent = '$' + subtotal.toFixed(2);
    
    // İndirim hesapla
    let discountAmount = 0;
    if(couponInfo) {
      if(couponInfo.type === 'percentage') {
        discountAmount = subtotal * couponInfo.discount / 100;
      } else {
        discountAmount = couponInfo.discount;
      }
    }
    
    // Discount değerini güncelle
    document.querySelector('.discountprice').textContent = '-$' + discountAmount.toFixed(2);
    
    // Total'i hesapla ve güncelle
    const total = subtotal - discountAmount;
    document.querySelector('.totalprice').textContent = '$' + total.toFixed(2);
  }

  // Sayfa yüklendiğinde ilk sepet hesaplamasını yap
  updateCart();
});