// Управление портфолио
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioFilters();
    initPortfolioModal();
    initImageLazyLoading();
});

function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;

            // Обновление активной кнопки
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Фильтрация элементов
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function initPortfolioModal() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const modal = document.getElementById('portfolioModal');
            if (modal) {
                const title = this.querySelector('.portfolio-title').textContent;
                const description = this.querySelector('.portfolio-description').textContent;
                const image = this.querySelector('.portfolio-image').style.backgroundImage;
                const technologies = Array.from(this.querySelectorAll('.tech-tag')).map(tag => tag.textContent);

                modal.querySelector('.modal-title').textContent = title;
                modal.querySelector('.modal-body p').textContent = description;
                modal.querySelector('.modal-image').style.backgroundImage = image;

                const techContainer = modal.querySelector('.modal-technologies');
                techContainer.innerHTML = '';
                technologies.forEach(tech => {
                    const tag = document.createElement('span');
                    tag.className = 'tech-tag';
                    tag.textContent = tech;
                    techContainer.appendChild(tag);
                });

                // Показать модальное окно
                const bootstrapModal = new bootstrap.Modal(modal);
                bootstrapModal.show();
            }
        });
    });
}

function initImageLazyLoading() {
    const images = document.querySelectorAll('.portfolio-image[data-bg]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const bgImage = img.dataset.bg;
                img.style.backgroundImage = `url(${bgImage})`;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Анимации для портфолио
function animatePortfolioItems() {
    const items = document.querySelectorAll('.portfolio-item');

    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';

        setTimeout(() => {
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Поиск в портфолио
function initPortfolioSearch() {
    const searchInput = document.getElementById('portfolioSearch');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();

            portfolioItems.forEach(item => {
                const title = item.querySelector('.portfolio-title').textContent.toLowerCase();
                const description = item.querySelector('.portfolio-description').textContent.toLowerCase();
                const technologies = Array.from(item.querySelectorAll('.tech-tag')).map(tag => tag.textContent.toLowerCase());

                const matches = title.includes(searchTerm) || 
                               description.includes(searchTerm) || 
                               technologies.some(tech => tech.includes(searchTerm));

                if (matches) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    }
}

// Экспорт функций для использования в других файлах
window.portfolioFunctions = {
    animatePortfolioItems,
    initPortfolioSearch
};