document.addEventListener('DOMContentLoaded', function () {
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const profileInitials = document.getElementById('profileInitials');
    const registerForm = document.getElementById('registerForm');

    // Ad ve soyad değiştiğinde profil resmini güncelle
    firstNameInput.addEventListener('input', updateProfileInitials);
    lastNameInput.addEventListener('input', updateProfileInitials);

    function updateProfileInitials() {
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();

        let initials = '';
        if (firstName.length > 0) initials += firstName[0].toUpperCase();
        if (lastName.length > 0) initials += lastName[0].toUpperCase();

        profileInitials.textContent = initials || 'AB';
    }

    // Form gönderimini kontrol et
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Hata mesajlarını temizle
        document.querySelectorAll('.error').forEach(el => {
            el.style.display = 'none';
        });

        let isValid = true;

        // Ad kontrolü
        if (firstNameInput.value.trim().length < 2) {
            document.getElementById('firstNameError').style.display = 'block';
            isValid = false;
        }

        // Soyad kontrolü
        if (lastNameInput.value.trim().length < 2) {
            document.getElementById('lastNameError').style.display = 'block';
            isValid = false;
        }

        // Doğum tarihi kontrolü
        const birthDate = document.getElementById('birthDate').value;
        if (!birthDate) {
            document.getElementById('birthDateError').style.display = 'block';
            isValid = false;
        }

        // E-posta kontrolü
        const email = document.getElementById('email').value;
        if (!email.includes('@') || !email.includes('.')) {
            document.getElementById('emailError').style.display = 'block';
            isValid = false;
        }

        // Telefon kontrolü
        const phone = document.getElementById('phone').value;
        if (phone.length < 10) {
            document.getElementById('phoneError').style.display = 'block';
            isValid = false;
        }

        // Şifre kontrolü
        const password = document.getElementById('password').value;
        if (password.length < 6) {
            document.getElementById('passwordError').style.display = 'block';
            isValid = false;
        }

        // Şifre tekrar kontrolü
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (password !== confirmPassword) {
            document.getElementById('confirmPasswordError').style.display = 'block';
            isValid = false;
        }

        if (isValid) {
            alert('Kayıt başarılı! Hoş geldiniz ' + firstNameInput.value.trim());
            registerForm.reset();
            profileInitials.textContent = 'AB';
        }
    });
});



document.addEventListener("DOMContentLoaded", function () {
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
