document.querySelectorAll(".degistir").forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = this.dataset.target;
        const yeniAdres = prompt("Yeni adresi girin:");
        if (yeniAdres) {
            document.getElementById(target + "-adres").textContent = yeniAdres;

            // Eğer teslimat ve fatura adresi aynı seçiliyse, diğerini de güncelle
            if (document.getElementById("sameAddress").checked && target === "teslimat") {
                document.getElementById("fatura-adres").textContent = yeniAdres;
            }
            if (document.getElementById("sameAddress").checked && target === "fatura") {
                document.getElementById("teslimat-adres").textContent = yeniAdres;
            }
        }
    });
});

// Devam Et butonu yönlendirme
document.getElementById("devamBtn").addEventListener("click", function() {
    window.location.href = "../10.KartBilgileriEnter/ödeme.html";
});


document.getElementById("profileIcon").addEventListener("click", function() {
    const menu = document.getElementById("menuList");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
});