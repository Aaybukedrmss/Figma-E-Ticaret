document.addEventListener("DOMContentLoaded", function () {
    // Frontend -> Backend API kök adresi (geliştirme)
    window.__API_BASE__ = window.__API_BASE__ || "http://localhost:5090/api";
    const menuToggle = document.getElementById("menuToggle");
    const dropdownMenu = document.getElementById("dropdownMenu");

    menuToggle.addEventListener("click", function () {
        dropdownMenu.classList.toggle("active");
    });

    // Menü dışında tıklanınca kapat
    document.addEventListener("click", function (event) {
        if (!menuToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("active");
        }
    });
});
