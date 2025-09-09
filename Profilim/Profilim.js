        document.addEventListener('DOMContentLoaded', function() {
            // Tab geçiş işlevselliği
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Aktif tab'ı kaldır
                    document.querySelector('.tab.active').classList.remove('active');
                    document.querySelector('.tab-content.active').classList.remove('active');
                    
                    // Yeni tab'ı aktif yap
                    this.classList.add('active');
                    const tabId = this.getAttribute('data-tab');
                    document.getElementById(tabId).classList.add('active');
                });
            });

            // Şehir ve ilçe verileri
            const cityDistricts = {
                'istanbul': ['Kadıköy', 'Beşiktaş', 'Şişli', 'Beyoğlu', 'Üsküdar', 'Fatih', 'Bakırköy', 'Bağcılar'],
                'ankara': ['Çankaya', 'Keçiören', 'Yenimahalle', 'Altındağ', 'Mamak', 'Etimesgut', 'Sincan'],
                'izmir': ['Konak', 'Karşıyaka', 'Bornova', 'Buca', 'Bayraklı', 'Çiğli', 'Gaziemir']
            };

            // Şehir seçildiğinde ilçeleri yükle
            document.getElementById('addressCity').addEventListener('change', function() {
                const city = this.value;
                const districtSelect = document.getElementById('addressDistrict');
                
                districtSelect.innerHTML = '<option value="">Seçiniz</option>';
                
                if (city && cityDistricts[city]) {
                    cityDistricts[city].forEach(district => {
                        const option = document.createElement('option');
                        option.value = district;
                        option.textContent = district;
                        districtSelect.appendChild(option);
                    });
                }
            });

            // Modal açma/kapatma işlevleri
            function openModal(modalId) {
                document.getElementById(modalId).style.display = 'flex';
            }

            function closeModal(modalId) {
                document.getElementById(modalId).style.display = 'none';
            }

            // Adres modal işlemleri
            document.getElementById('addAddressBtn').addEventListener('click', function() {
                document.getElementById('addressModalTitle').textContent = 'Yeni Adres Ekle';
                document.getElementById('addressForm').reset();
                document.getElementById('addressId').value = '';
                openModal('addressModal');
            });

            document.getElementById('closeAddressModal').addEventListener('click', function() {
                closeModal('addressModal');
            });

            document.getElementById('cancelAddress').addEventListener('click', function() {
                closeModal('addressModal');
            });

            
            // LocalStorage'dan verileri yükle
            function loadUserData() {
                // Kişisel bilgiler
                const userData = JSON.parse(localStorage.getItem('userData')) || {
                    firstName: 'aybüke',
                    lastName: 'DURMUS',
                    email: 'aybukedurmus123@gmail.com',
                    phone: '',
                    marketingPermission: true
                };
                
                document.getElementById('firstName').value = userData.firstName;
                document.getElementById('lastName').value = userData.lastName;
                document.getElementById('email').value = userData.email;
                document.getElementById('phone').value = userData.phone;
                document.getElementById('marketingPermission').checked = userData.marketingPermission;
                document.getElementById('userFullName').textContent = `${userData.firstName} ${userData.lastName}`;
                
                // Adresler
                const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
                renderAddresses(addresses);
                
                // IBAN'lar
                const ibans = JSON.parse(localStorage.getItem('ibans')) || [];
                renderIbans(ibans);
            }

            // Adresleri render et
            function renderAddresses(addresses) {
                const addressList = document.getElementById('addressList');
                addressList.innerHTML = '';
                
                if (addresses.length === 0) {
                    addressList.innerHTML = '<p>Kayıtlı adres bulunmamaktadır.</p>';
                    return;
                }
                
                addresses.forEach((address, index) => {
                    const addressItem = document.createElement('div');
                    addressItem.className = 'address-item';
                    addressItem.innerHTML = `
                        <h4>${address.title} ${address.isDefault ? '(Varsayılan)' : ''}</h4>
                        <p>${address.firstName} ${address.lastName}</p>
                        <p>${address.phone}</p>
                        <p>${address.city}, ${address.district}, ${address.neighborhood}</p>
                        <p>${address.details}</p>
                        <div class="address-actions">
                            <button class="btn btn-secondary edit-address" data-id="${index}">Düzenle</button>
                            <button class="btn btn-danger delete-address" data-id="${index}">Sil</button>
                        </div>
                    `;
                    addressList.appendChild(addressItem);
                });
                
                // Düzenle ve sil butonlarına event listener ekle
                document.querySelectorAll('.edit-address').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        editAddress(id);
                    });
                });
                
                document.querySelectorAll('.delete-address').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        deleteAddress(id);
                    });
                });
            }

            // IBAN'ları render et
            function renderIbans(ibans) {
                const ibanList = document.getElementById('ibanList');
                ibanList.innerHTML = '';
                
                if (ibans.length === 0) {
                    ibanList.innerHTML = '<p>Kayıtlı IBAN bulunmamaktadır.</p>';
                    return;
                }
                
                ibans.forEach((iban, index) => {
                    const ibanItem = document.createElement('div');
                    ibanItem.className = 'iban-item';
                    ibanItem.innerHTML = `
                        <h4>${iban.title} ${iban.isDefault ? '(Varsayılan)' : ''}</h4>
                        <p>${iban.fullName}</p>
                        <p>${iban.bank}: ${iban.number}</p>
                        <div class="iban-actions">
                            <button class="btn btn-secondary edit-iban" data-id="${index}">Düzenle</button>
                            <button class="btn btn-danger delete-iban" data-id="${index}">Sil</button>
                        </div>
                    `;
                    ibanList.appendChild(ibanItem);
                });
                
                // Düzenle ve sil butonlarına event listener ekle
                document.querySelectorAll('.edit-iban').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        editIban(id);
                    });
                });
                
                document.querySelectorAll('.delete-iban').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        deleteIban(id);
                    });
                });
            }

            // Adres düzenle
            function editAddress(id) {
                const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
                const address = addresses[id];
                
                if (address) {
                    document.getElementById('addressModalTitle').textContent = 'Adresi Düzenle';
                    document.getElementById('addressId').value = id;
                    document.getElementById('addressTitle').value = address.title;
                    document.getElementById('addressFirstName').value = address.firstName;
                    document.getElementById('addressLastName').value = address.lastName;
                    document.getElementById('addressPhone').value = address.phone;
                    document.getElementById('addressCity').value = address.city;
                    
                    // İlçeleri yükle
                    const city = address.city;
                    const districtSelect = document.getElementById('addressDistrict');
                    districtSelect.innerHTML = '<option value="">Seçiniz</option>';
                    
                    if (city && cityDistricts[city]) {
                        cityDistricts[city].forEach(district => {
                            const option = document.createElement('option');
                            option.value = district;
                            option.textContent = district;
                            districtSelect.appendChild(option);
                        });
                        document.getElementById('addressDistrict').value = address.district;
                    }
                    
                    document.getElementById('addressNeighborhood').value = address.neighborhood;
                    document.getElementById('addressDetails').value = address.details;
                    document.getElementById('defaultAddress').checked = address.isDefault;
                    
                    openModal('addressModal');
                }
            }

            // Adres sil
            function deleteAddress(id) {
                if (confirm('Bu adresi silmek istediğinize emin misiniz?')) {
                    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
                    addresses.splice(id, 1);
                    localStorage.setItem('addresses', JSON.stringify(addresses));
                    renderAddresses(addresses);
                }
            }

            // IBAN düzenle
            function editIban(id) {
                const ibans = JSON.parse(localStorage.getItem('ibans')) || [];
                const iban = ibans[id];
                
                if (iban) {
                    document.getElementById('ibanModalTitle').textContent = 'IBAN Düzenle';
                    document.getElementById('ibanId').value = id;
                    document.getElementById('ibanTitle').value = iban.title;
                    document.getElementById('ibanFullName').value = iban.fullName;
                    document.getElementById('ibanNumber').value = iban.number;
                    document.getElementById('ibanBank').value = iban.bank;
                    document.getElementById('defaultIban').checked = iban.isDefault;
                    
                    openModal('ibanModal');
                }
            }

            // IBAN sil
            function deleteIban(id) {
                if (confirm('Bu IBAN\'ı silmek istediğinize emin misiniz?')) {
                    const ibans = JSON.parse(localStorage.getItem('ibans')) || [];
                    ibans.splice(id, 1);
                    localStorage.setItem('ibans', JSON.stringify(ibans));
                    renderIbans(ibans);
                }
            }

            // Form submit işlemleri
            document.getElementById('personalInfoForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const userData = {
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    marketingPermission: document.getElementById('marketingPermission').checked
                };
                
                localStorage.setItem('userData', JSON.stringify(userData));
                document.getElementById('userFullName').textContent = `${userData.firstName} ${userData.lastName}`;
                
                // Başarı mesajını göster
                const successMsg = document.getElementById('personalInfoSuccess');
                successMsg.style.display = 'block';
                setTimeout(() => successMsg.style.display = 'none', 3000);
            });

            document.getElementById('passwordChangeForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const currentPassword = document.getElementById('currentPassword').value;
                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                // Basit bir doğrulama
                if (newPassword !== confirmPassword) {
                    document.getElementById('passwordChangeError').textContent = 'Yeni şifreler eşleşmiyor!';
                    document.getElementById('passwordChangeError').style.display = 'block';
                    setTimeout(() => {
                        document.getElementById('passwordChangeError').style.display = 'none';
                    }, 3000);
                    return;
                }
                
                // Burada normalde sunucuya şifre değişikliği isteği gönderilir
                // Şimdilik localStorage'a kaydediyoruz
                localStorage.setItem('userPassword', newPassword);
                
                // Formu temizle
                this.reset();
                
                // Başarı mesajını göster
                const successMsg = document.getElementById('passwordChangeSuccess');
                successMsg.style.display = 'block';
                setTimeout(() => successMsg.style.display = 'none', 3000);
            });

            document.getElementById('addressForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
                const addressId = document.getElementById('addressId').value;
                const isDefault = document.getElementById('defaultAddress').checked;
                
                // Eğer bu adres varsayılan olarak işaretlenmişse, diğer adreslerin varsayılan durumunu kaldır
                if (isDefault) {
                    addresses.forEach(addr => {
                        addr.isDefault = false;
                    });
                }
                
                const newAddress = {
                    title: document.getElementById('addressTitle').value,
                    firstName: document.getElementById('addressFirstName').value,
                    lastName: document.getElementById('addressLastName').value,
                    phone: document.getElementById('addressPhone').value,
                    city: document.getElementById('addressCity').value,
                    district: document.getElementById('addressDistrict').value,
                    neighborhood: document.getElementById('addressNeighborhood').value,
                    details: document.getElementById('addressDetails').value,
                    isDefault: isDefault
                };
                
                if (addressId === '') {
                    // Yeni adres ekle
                    addresses.push(newAddress);
                } else {
                    // Adresi güncelle
                    addresses[addressId] = newAddress;
                }
                
                localStorage.setItem('addresses', JSON.stringify(addresses));
                renderAddresses(addresses);
                closeModal('addressModal');
                
                // Başarı mesajını göster
                const successMsg = document.getElementById('addressSuccess');
                successMsg.textContent = 'Adres başarıyla kaydedildi!';
                successMsg.style.display = 'block';
                setTimeout(() => successMsg.style.display = 'none', 3000);
            });

            document.getElementById('ibanForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const ibans = JSON.parse(localStorage.getItem('ibans')) || [];
                const ibanId = document.getElementById('ibanId').value;
                const isDefault = document.getElementById('defaultIban').checked;
                
                // Eğer bu IBAN varsayılan olarak işaretlenmişse, diğer IBAN'ların varsayılan durumunu kaldır
                if (isDefault) {
                    ibans.forEach(iban => {
                        iban.isDefault = false;
                    });
                }
                
                const newIban = {
                    title: document.getElementById('ibanTitle').value,
                    fullName: document.getElementById('ibanFullName').value,
                    number: document.getElementById('ibanNumber').value,
                    bank: document.getElementById('ibanBank').value,
                    isDefault: isDefault
                };
                
                if (ibanId === '') {
                    // Yeni IBAN ekle
                    ibans.push(newIban);
                } else {
                    // IBAN'ı güncelle
                    ibans[ibanId] = newIban;
                }
                
                localStorage.setItem('ibans', JSON.stringify(ibans));
                renderIbans(ibans);
                closeModal('ibanModal');
                
                // Başarı mesajını göster
                const successMsg = document.getElementById('ibanSuccess');
                successMsg.textContent = 'IBAN başarıyla kaydedildi!';
                successMsg.style.display = 'block';
                setTimeout(() => successMsg.style.display = 'none', 3000);
            });

            // Sayfa yüklendiğinde verileri yükle
            loadUserData();
        });