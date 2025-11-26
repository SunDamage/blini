//  Корзины
        class Cart {
            constructor() {
                this.items = [];
                this.loadCart();
                this.setupEventListeners();
            }
            
            loadCart() {
                const savedCart = localStorage.getItem('blinCart');
                if (savedCart) {
                    this.items = JSON.parse(savedCart);
                }
                this.updateCartButton();
            }
            
            saveCart() {
                localStorage.setItem('blinCart', JSON.stringify(this.items));
                this.updateCartButton();
            }
            
            addItem(productId, productName, price) {
                const existingItem = this.items.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    this.items.push({
                        id: productId,
                        name: productName,
                        price: price,
                        quantity: 1
                    });
                }
                
                this.saveCart();
                this.showAddNotification(productName);
            }
            
            removeItem(productId) {
                this.items = this.items.filter(item => item.id !== productId);
                this.saveCart();
                if (document.getElementById('cartModal').classList.contains('show')) {
                    this.renderCart();
                }
            }
            
            updateQuantity(productId, change) {
                const item = this.items.find(item => item.id === productId);
                
                if (item) {
                    item.quantity += change;
                    
                    if (item.quantity <= 0) {
                        this.removeItem(productId);
                    } else {
                        this.saveCart();
                        this.renderCart();
                    }
                }
            }
            
            clearCart() {
                this.items = [];
                this.saveCart();
                this.renderCart();
            }
            
            getTotal() {
                return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
            }
            
            getTotalItems() {
                return this.items.reduce((total, item) => total + item.quantity, 0);
            }
            
            updateCartButton() {
                const cartButton = document.querySelector('.cart-button');
                const totalItems = this.getTotalItems();
                
                if (totalItems > 0) {
                    cartButton.innerHTML = `
                        <svg class="cart-icon" viewBox="0 0 24 24">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                        Корзина (${totalItems})
                    `;
                } else {
                    cartButton.innerHTML = `
                        <svg class="cart-icon" viewBox="0 0 24 24">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                        Корзина
                    `;
                }
            }
            
            renderCart() {
                const cartItems = document.querySelector('.cart-items');
                const totalPrice = document.querySelector('.total-price');
                
                cartItems.innerHTML = '';
                
                if (this.items.length === 0) {
                    cartItems.innerHTML = '<p class="text-center text-muted">Корзина пуста</p>';
                    totalPrice.textContent = '0';
                    return;
                }
                
                this.items.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item d-flex justify-content-between align-items-center border-bottom pb-3 mb-3';
                    cartItem.innerHTML = `
                        <div>
                            <h6 class="mb-1">${item.name}</h6>
                            <p class="mb-0 text-muted">${item.price} руб. × ${item.quantity}</p>
                        </div>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary quantity-btn me-2" data-id="${item.id}" data-change="-1">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary quantity-btn me-3" data-id="${item.id}" data-change="1">+</button>
                            <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${item.id}">×</button>
                        </div>
                    `;
                    cartItems.appendChild(cartItem);
                });
                
                totalPrice.textContent = this.getTotal();
                this.setupCartItemListeners();
            }
            
            setupEventListeners() {
                // Кнопки "Добавить в корзину"
                document.addEventListener('click', (e) => {
                    if (e.target.classList.contains('add-to-cart')) {
                        const productId = e.target.dataset.id;
                        const productName = e.target.dataset.name;
                        const price = parseInt(e.target.dataset.price);
                        
                        this.addItem(productId, productName, price);
                    }
                });
                
                // Кнопка "Очистить корзину"
                document.querySelector('.clear-cart')?.addEventListener('click', () => {
                    this.clearCart();
                });
                
                // При открытии модального окна корзины
                document.getElementById('cartModal')?.addEventListener('show.bs.modal', () => {
                    this.renderCart();
                });
            }
            
            setupCartItemListeners() {
                // Кнопки изменения количества
                document.querySelectorAll('.quantity-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.dataset.id;
                        const change = parseInt(e.target.dataset.change);
                        this.updateQuantity(productId, change);
                    });
                });
                
                // Кнопки удаления
                document.querySelectorAll('.remove-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.dataset.id;
                        this.removeItem(productId);
                    });
                });
            }
            
            showAddNotification(productName) {
                // Создаем уведомление о добавлении
                const notification = document.createElement('div');
                notification.className = 'alert alert-warning position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.style.zIndex = '1060';
                notification.innerHTML = `
                    ${productName} добавлен в корзину!
                `;
                document.body.appendChild(notification);
                
                // Удаляем уведомление через 2 секунды
                setTimeout(() => {
                    notification.remove();
                }, 2000);
            }
        }

        // Инициализация корзины при загрузке страницы
        document.addEventListener('DOMContentLoaded', () => {
            const cart = new Cart();
            
// Обработчик для кнопки "Позвонить"
            document.getElementById('confirmCall')?.addEventListener('click', function() {
                // Здесь можно добавить логику для звонка
                // Например, используя tel: ссылку
                window.location.href = 'tel:+79991234567';
                
                // Закрываем модальное окно
                const callModal = bootstrap.Modal.getInstance(document.getElementById('callModal'));
                callModal.hide();
            });
        });            

// Cookie функционал ТОЛЬКО для главной страницы
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Главная страница загружена. Проверяем cookie...');
            
            const cookieBanner = document.getElementById('cookieConsent');
            const acceptButton = document.getElementById('cookieAccept');
            
            // Улучшенная функция проверки cookie
            function getCookie(name) {
                try {
                    const value = `; ${document.cookie}`;
                    const parts = value.split(`; ${name}=`);
                    if (parts.length === 2) {
                        return parts.pop().split(';').shift();
                    }
                    return null;
                } catch (e) {
                    console.error('Ошибка при чтении cookie:', e);
                    return null;
                }
            }
            
            // Улучшенная функция установки cookie
            function setCookie(name, value, days) {
                try {
                    let expires = "";
                    if (days) {
                        const date = new Date();
                        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                        expires = "; expires=" + date.toUTCString();
                    }
                    // Устанавливаем cookie с путем для всего сайта
                    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
                    console.log('Cookie установлен:', name + '=' + value);
                    return true;
                } catch (e) {
                    console.error('Ошибка при установке cookie:', e);
                    return false;
                }
            }
            
            // Проверяем, принял ли пользователь cookie
            const isCookieAccepted = getCookie('blin_cookie_consent') === 'accepted';
            
            console.log('Статус cookie принятия:', isCookieAccepted);
            console.log('Все cookies:', document.cookie);
            
            // Показываем баннер только если cookie еще не приняты
            if (!isCookieAccepted) {
                console.log('Cookie не приняты, показываем баннер');
                setTimeout(() => {
                    cookieBanner.style.display = 'block';
                }, 1500);
            } else {
                console.log('Cookie уже приняты, скрываем баннер');
                cookieBanner.style.display = 'none';
            }
            
            // Обработчик кнопки принятия
            acceptButton.addEventListener('click', function() {
                console.log('Пользователь принял cookie');
                if (setCookie('blin_cookie_consent', 'accepted', 90)) {
                    cookieBanner.style.display = 'none';
                    console.log('Баннер скрыт, cookie сохранены');
                } else {
                    console.error('Не удалось сохранить cookie');
                }
            });
            
            // Закрытие при клике вне баннера
            document.addEventListener('click', function(e) {
                if (cookieBanner.style.display === 'block' && 
                    !cookieBanner.contains(e.target) && 
                    e.target !== acceptButton) {
                    cookieBanner.style.display = 'none';
                    console.log('Баннер закрыт кликом вне');
                }
            });
        });

        // Функция для тестирования (в консоли: resetCookie())
        function resetCookie() {
            document.cookie = "blin_cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            console.log('Cookie сброшены');
            alert('Cookie сброшены! Обновите страницу для теста.');
        }

        console.log('Файл script.js загружен!');


document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        let scrollTimeout;
        
        // Функция проверки прокрутки
        function checkScrollPosition() {
            // Альтернативные способы получения позиции прокрутки
            const scrollTop = Math.max(
                window.pageYOffset,
                document.documentElement.scrollTop,
                document.body.scrollTop
            );
            
            if (scrollTop > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
        
        // Проверяем прокрутку периодически
        function startScrollCheck() {
            checkScrollPosition();
            scrollTimeout = setTimeout(startScrollCheck, 100); // Проверяем каждые 100ms
        }
        
        // Запускаем проверку
        startScrollCheck();
        
        // Также проверяем при событиях, которые могут вызвать прокрутку
        ['mousewheel', 'keydown', 'resize', 'orientationchange'].forEach(event => {
            window.addEventListener(event, checkScrollPosition, { passive: true });
        });

        // Прокрутка наверх - ИСПРАВЛЕННАЯ ВЕРСИЯ
        backToTopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Просто мгновенная прокрутка для теста
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0; // Для Safari
});
        
        // Очистка при разгрузке страницы
        window.addEventListener('beforeunload', () => {
            clearTimeout(scrollTimeout);
        });
    }
});


// Обработчик для формы горячей линии - ИСПРАВЛЕННАЯ ВЕРСИЯ
document.addEventListener('DOMContentLoaded', function() {
    const hotlineForm = document.getElementById('hotlineForm');
    
    if (hotlineForm) {
        hotlineForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Проверяем, что все обязательные поля заполнены
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            // Проверяем чекбокс
            const privacyCheckbox = document.getElementById('privacyAgreement');
            if (!privacyCheckbox.checked) {
                isValid = false;
                privacyCheckbox.classList.add('is-invalid');
            } else {
                privacyCheckbox.classList.remove('is-invalid');
            }
            
            if (!isValid) {
                // Показываем уведомление об ошибке
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }
            
            // Здесь можно добавить логику отправки формы на сервер
            console.log('Данные формы:', {
                topic: document.getElementById('messageTopic').value,
                name: document.getElementById('userName').value,
                contact: document.getElementById('userContact').value,
                message: document.getElementById('userMessage').value
            });
            
            // Показываем уведомление об успешной отправке
            showNotification('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
            
            // Закрываем модальное окно
            const hotlineModal = bootstrap.Modal.getInstance(document.getElementById('hotlineModal'));
            if (hotlineModal) {
                hotlineModal.hide();
            }
            
            // Очищаем форму
            this.reset();
        });
        
        // Сбрасываем ошибки при изменении полей
        hotlineForm.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('is-invalid');
            });
        });
        
        // Для чекбокса отдельно
        const privacyCheckbox = document.getElementById('privacyAgreement');
        if (privacyCheckbox) {
            privacyCheckbox.addEventListener('change', function() {
                this.classList.remove('is-invalid');
            });
        }
    }
});

// Функция для показа уведомлений
function showNotification(message, type = 'success') {
    // Удаляем предыдущие уведомления
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `custom-notification position-fixed top-0 start-50 translate-middle-x mt-3 alert ${
        type === 'success' ? 'alert-success-custom' : 'alert-danger'
    }`;
    notification.style.zIndex = '1060';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="me-2">
                ${type === 'success' ? 
                    '<path d="M20 6L9 17l-5-5"/>' : 
                    '<path d="M18 6L6 18M6 6l12 12"/>'
                }
            </svg>
            ${message}
            <button type="button" class="btn-close ms-3" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Автоматическое удаление через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Добавляем стили для ошибок валидации в CSS
const style = document.createElement('style');
style.textContent = `
    .is-invalid {
        border-color: #dc3545 !important;
    }
    
    .is-invalid:focus {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
    
    .form-check-input.is-invalid {
        border-color: #dc3545;
    }
    
    .alert-success-custom {
        background-color: #ffcc31 !important;
        border-color: #ffc400 !important;
        color: #333 !important;
        font-weight: bold;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(255, 204, 49, 0.3);
        border: 2px solid #ffc400;
    }
    
    .alert-danger {
        background-color: #f8d7da !important;
        border-color: #f5c6cb !important;
        color: #721c24 !important;
        font-weight: bold;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        border: 2px solid #f5c6cb;
    }
    
    .custom-notification {
        animation: slideDown 0.3s ease;
    }
`;
document.head.appendChild(style);
