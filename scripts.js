// Плавная прокрутка для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Добавление/удаление класса при прокрутке
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==================== КОРЗИНА ====================

let cart = [];

// Функция добавления в корзину
function addToCart(productId, productName, productPrice, productImage) {
    // Проверяем, есть ли товар уже в корзине
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification('Товар добавлен в корзину!');
}

// Функция обновления интерфейса корзины
function updateCartUI() {
    // Обновляем счетчик
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
    
    // Обновляем содержимое корзины (если модальное окно открыто)
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.querySelector('.cart-total');
    const cartFooter = document.querySelector('.cart-footer');
    
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart text-center py-5">
                    <i class="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                    <p>Ваша корзина пуста</p>
                </div>
            `;
            if (cartTotal) cartTotal.classList.add('d-none');
            if (cartFooter) cartFooter.classList.add('d-none');
            return;
        }
        
        // Отображаем товары в корзине
        let html = '';
        let totalPrice = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            html += `
                <div class="cart-item mb-3">
                    <div class="row align-items-center">
                        <div class="col-3">
                            <img src="${item.image}" alt="${item.name}" class="img-fluid rounded" style="max-height: 80px;">
                        </div>
                        <div class="col-5">
                            <h6 class="mb-1">${item.name}</h6>
                            <p class="text-muted mb-0">${item.price} ₽ × ${item.quantity}</p>
                        </div>
                        <div class="col-4 text-end">
                            <div class="d-flex align-items-center justify-content-end">
                                <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span class="mx-2">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary ms-2" onclick="updateQuantity(${item.id}, 1)">+</button>
                            </div>
                            <div class="mt-2">
                                <button class="btn btn-sm btn-link text-danger p-0" onclick="removeFromCart(${item.id})">
                                    <i class="fas fa-trash"></i> Удалить
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-12 text-end">
                            <strong>${itemTotal} ₽</strong>
                        </div>
                    </div>
                    <hr>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = html;
        if (document.getElementById('cartTotalPrice')) {
            document.getElementById('cartTotalPrice').textContent = `${totalPrice} ₽`;
        }
        if (cartTotal) cartTotal.classList.remove('d-none');
        if (cartFooter) cartFooter.classList.remove('d-none');
    }
}

// Функция обновления количества
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id == productId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// Функция удаления из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    updateCartUI();
    showNotification('Товар удален из корзины');
}

// Уведомления
function showNotification(message) {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle me-2"></i>
            ${message}
        </div>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Инициализация корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Назначаем обработчики для кнопок добавления в корзину
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title')?.textContent || 'Товар';
            
            // Извлекаем цену (убираем " ₽" и пробелы)
            const priceText = productCard.querySelector('.product-price')?.textContent || '0';
            const productPrice = parseInt(priceText.replace(/\s|₽/g, '')) || 0;
            
            const productImage = productCard.querySelector('.product-image img')?.src || 'assets/img/products/default.jpg';
            
            addToCart(productId, productName, productPrice, productImage);
        });
    });
    
    // Открытие корзины при клике на иконку
    document.querySelector('.cart-link')?.addEventListener('click', function(e) {
        e.preventDefault();
        const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
        cartModal.show();
    });
    
    // Оформление заказа
    document.getElementById('checkoutBtn')?.addEventListener('click', function() {
        if (cart.length === 0) return;
        
        // Обновляем список товаров в форме заказа
        const orderItemsList = document.getElementById('orderItemsList');
        let orderHtml = '';
        let totalPrice = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            orderHtml += `
                <div class="d-flex justify-content-between">
                    <span>${item.name} × ${item.quantity}</span>
                    <span>${itemTotal} ₽</span>
                </div>
            `;
        });
        
        if (orderItemsList) {
            orderItemsList.innerHTML = orderHtml;
        }
        if (document.getElementById('orderTotalPrice')) {
            document.getElementById('orderTotalPrice').textContent = `${totalPrice} ₽`;
        }
        
        // Сохраняем детали заказа в скрытое поле
        const orderDetails = cart.map(item => 
            `${item.name} - ${item.quantity} шт. - ${item.price * item.quantity} ₽`
        ).join('; ');
        if (document.getElementById('orderDetails')) {
            document.getElementById('orderDetails').value = orderDetails;
        }
        
        // Показываем модальное окно заказа
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        if (cartModal) cartModal.hide();
        
        const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
        orderModal.show();
    });
    
    // Обработка формы заказа
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            // Имитация отправки (замените на реальную отправку через Formspree)
            setTimeout(() => {
                showNotification('Заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.');
                cart = [];
                updateCartUI();
                
                // Закрываем модальные окна
                const orderModal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
                if (orderModal) orderModal.hide();
                
                this.reset();
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
});

// Добавляем CSS анимации
if (!document.querySelector('#cart-animations')) {
    const style = document.createElement('style');
    style.id = 'cart-animations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .cart-item {
            transition: all 0.3s ease;
        }
        
        .cart-item:hover {
            background-color: rgba(232, 196, 196, 0.05);
        }
        
        .notification-content i {
            color: white;
        }
    `;
    document.head.appendChild(style);
}
// ==================== КОНЕЦ КОРЗИНЫ ====================

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Seoul Code - готов к работе!');
});
