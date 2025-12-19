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

// Корзина
let cartCount = 0;

document.querySelectorAll('.btn-add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-product');
        cartCount++;
        
        // Обновляем счетчик в корзине
        document.querySelector('.cart-count').textContent = cartCount;
        
        // Анимация кнопки
        this.textContent = 'Добавлено!';
        this.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            this.textContent = 'В корзину';
            this.style.backgroundColor = '';
        }, 2000);
        
        console.log(`Товар ${productId} добавлен в корзину`);
    });
});

// Отправка формы
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    // Имитация отправки
    setTimeout(() => {
        alert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Seoul Code - готов к работе!');
});