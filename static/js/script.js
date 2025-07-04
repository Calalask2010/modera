// Предварительная загрузка видео
function preloadVideo() {
    return new Promise((resolve) => {
        const videoSrc = getComputedStyle(document.documentElement).getPropertyValue('--background-video').trim().replace(/['"]/g, '');
        if (!videoSrc) {
            resolve();
            return;
        }

        const tempVideo = document.createElement('video');
        tempVideo.preload = 'metadata';
        tempVideo.src = videoSrc;

        tempVideo.addEventListener('loadeddata', () => {
            resolve();
        });

        tempVideo.addEventListener('error', () => {
            resolve();
        });

        // Таймаут на случай долгой загрузки
        setTimeout(resolve, 3000);

        tempVideo.load();
    });
}

// Инициализация сайта
document.addEventListener('DOMContentLoaded', async function() {
    const loadingScreen = document.getElementById('loadingScreen');

    // Скрываем экран загрузки всегда
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }

    // Предварительно загружаем видео для главной страницы
    const isMainPage = window.location.pathname === '/';
    if (isMainPage) {
        await preloadVideo();
    }

    // Проверяем, находимся ли мы на странице "Обо мне"
    const isAboutPage = window.location.pathname === '/about';

    if (isAboutPage) {
        // На странице "Обо мне" инициализируем хакерский фон
        initHackerBackground();
        // Скрываем контролы видео
        const videoControls = document.querySelector('.video-controls');
        if (videoControls) {
            videoControls.style.display = 'none';
        }
        return;
    }

    // Установка фона только для главной страницы
    const background = document.querySelector('.background');
    if (background) {
        const bgType = getComputedStyle(document.documentElement).getPropertyValue('--background-type').trim().replace(/['"]/g, '');

        if (bgType === 'image') {
            background.classList.add('image');
        } else if (bgType === 'gradient') {
            background.classList.add('gradient');
        } else if (bgType === 'video') {
            background.classList.add('video');

            // Создаем видео с полной загрузкой
            const video = document.createElement('video');
            const videoSrc = getComputedStyle(document.documentElement).getPropertyValue('--background-video').trim().replace(/['"]/g, '');

            video.preload = 'metadata'; // Загружаем метаданные сразу
            video.autoplay = true;
            video.loop = true;
            video.muted = false;
            video.volume = 0.5;
            video.id = 'backgroundVideo';
            video.playsInline = true; // Для мобильных устройств

            // Добавляем обработчики для гарантированной загрузки
            video.addEventListener('loadeddata', function() {
                this.setAttribute('data-loaded', 'true');
                
                // Проверяем, активировал ли пользователь звук ранее
                const hasActivatedAudio = localStorage.getItem('audioActivated');
                if (!hasActivatedAudio) {
                    // Не запускаем автоматически, показываем уведомление
                    showAudioNotification();
                } else {
                    // Пользователь уже активировал звук, запускаем видео
                    this.muted = false;
                    this.volume = 0.5;
                    this.play().catch(e => {});
                }
            });

            video.addEventListener('canplaythrough', function() {
            });

            video.addEventListener('error', function(e) {
                setTimeout(() => {
                    this.load();
                }, 1000);
            });

            // Устанавливаем источник и загружаем
            video.src = videoSrc;
            video.load(); // Принудительная загрузка

            background.appendChild(video);

            // Показываем контролы громкости
            initVideoControls(video);
        }
    }

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Инициализация предварительной загрузки изображений
    preloadImages();

    // Инициализация интерактивных плиток
    initTileInteractions();

    // Инициализация динамических снежинок
    initDynamicSnowflakes();
});

// Функция для создания хакерского фона
function initHackerBackground() {
    const background = document.querySelector('.background');
    if (!background) return;

    // Очищаем предыдущий контент
    background.innerHTML = '';
    background.className = 'background hacker-bg';

    // Создаем canvas для хакерского эффекта
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    background.appendChild(canvas);

    // Настройка canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Символы для матрицы
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>?/|\\`~+=';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(0);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#a855f7';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            ctx.fillText(text, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 50);
}

// Анимации при скролле
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

document.querySelectorAll('.card, .portfolio-item, .blog-post').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Уведомления
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Обработка форм
document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.classList.contains('ajax-form')) {
        e.preventDefault();

        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Отправка...';

        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(data.message, 'success');
                form.reset();
            } else {
                showNotification(data.message, 'danger');
            }
        })
        .catch(error => {
            showNotification('Произошла ошибка при отправке формы', 'danger');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
    }
});

// Предварительная загрузка изображений
function preloadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('loading');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
    });
}

// Интерактивные плитки с магнитным эффектом
function initTileInteractions() {
    const tiles = document.querySelectorAll('.nav-tile');

    tiles.forEach(tile => {
        tile.addEventListener('mouseenter', function() {
            this.style.setProperty('--mouse-x', '50%');
            this.style.setProperty('--mouse-y', '50%');

            // Добавляем эффект пульсации
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.animation = 'pulse 0.6s ease-in-out';
            }
        });

        tile.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.animation = '';
            }

            // Возвращаем плитку в исходное положение
            this.style.transform = 'translateY(-15px) scale(1.05)';
        });

        tile.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            this.style.setProperty('--mouse-x', x + '%');
            this.style.setProperty('--mouse-y', y + '%');

            // Магнитный эффект - плитка тянется к курсору
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            // Ограничиваем смещение для плавного эффекта
            const maxDistance = 15;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const factor = Math.min(distance / 120, 1);

            const offsetX = (deltaX / distance) * maxDistance * factor || 0;
            const offsetY = (deltaY / distance) * maxDistance * factor || 0;

            this.style.transform = `translate(${offsetX}px, ${offsetY}px) translateY(-15px) scale(1.05)`;
        });

        tile.addEventListener('click', function() {
            const text = this.getAttribute('data-text');
            showNotification(`Вы нажали на "${text}"`, 'info');
        });
    });
}

// Динамические снежинки
function initDynamicSnowflakes() {
    const container = document.querySelector('.snowflakes-container');

    if (!container) return; // Проверяем существование контейнера

    // Добавляем новые снежинки периодически
    setInterval(() => {
        if (container.children.length < 30) {
            createSnowflake();
        }
    }, 3000);

    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = '❄';

        // Случайные параметры
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 6 + 6; // 6-12 секунд
        const animationDelay = Math.random() * 2;
        const fontSize = Math.random() * 8 + 8; // 8-16px

        snowflake.style.left = left + '%';
        snowflake.style.animationDuration = animationDuration + 's';
        snowflake.style.animationDelay = animationDelay + 's';
        snowflake.style.fontSize = fontSize + 'px';

        container.appendChild(snowflake);

        // Удаляем снежинку после анимации
        setTimeout(() => {
            if (snowflake.parentNode) {
                snowflake.parentNode.removeChild(snowflake);
            }
        }, (animationDuration + animationDelay) * 1000);
    }
}

// Функции для уведомления о звуке
function showAudioNotification() {
    // Не паузим видео, просто показываем уведомление

    const notification = document.createElement('div');
    notification.id = 'audioNotification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(45deg, #000, #111, #222, #000);
            background-size: 400% 400%;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            animation: hackerGradientShift 4s ease-in-out infinite, fadeInFullscreen 0.5s ease;
            cursor: pointer;
            user-select: none;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow: hidden;
        ">
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: 
                    radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.05) 0%, transparent 50%);
                animation: auraShift 6s ease-in-out infinite;
            "></div>

            <div style="
                text-align: center;
                color: white;
                animation: zoomInBounce 0.8s ease;
                text-shadow: 0 0 30px rgba(192, 132, 252, 0.8);
                    position: relative;
                    z-index: 2;
                ">
                <div style="
                    font-size: 14rem;
                    margin: 0;
                    font-weight: 900;
                    letter-spacing: 15px;
                    animation: milimesticPulse 2s infinite;
                    text-transform: uppercase;
                    background: linear-gradient(45deg, #c084fc, #e879f9, #a78bfa, #f3e8ff);
                    background-size: 400% 400%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    filter: drop-shadow(0 0 25px rgba(192, 132, 252, 0.8));
                    line-height: 0.9;
                ">Жми! Жми!</div>
            </div>

            <div style="
                position: absolute;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 1.2rem;
                color: #666;
                animation: fadeInOut 3s ease-in-out infinite;
                text-shadow: 0 0 5px rgba(102, 102, 102, 0.5);
            ">альфа ищет свою омегу...</div>
        </div>
    `;

    // Добавляем CSS анимации
    if (!document.getElementById('audioNotificationStyle')) {
        const style = document.createElement('style');
        style.id = 'audioNotificationStyle';
        style.textContent = `
            @keyframes fadeInFullscreen {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes zoomInBounce {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); }
                70% { transform: scale(0.95); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes milimesticPulse {
                0%, 100% { 
                    transform: scale(1);
                    filter: drop-shadow(0 0 25px rgba(168, 85, 247, 0.8));
                }
                50% { 
                    transform: scale(1.05);
                    filter: drop-shadow(0 0 40px rgba(168, 85, 247, 1));
                }
            }
            @keyframes hackerGradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes auraShift {
                0% { opacity: 0.3; transform: rotate(0deg); }
                50% { opacity: 0.6; transform: rotate(180deg); }
                100% { opacity: 0.3; transform: rotate(360deg); }
            }
            @keyframes hackerBounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-15px); }
                60% { transform: translateY(-8px); }
            }
            @keyframes hackerGlow {
                0%, 100% { 
                    text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
                    color: #cccccc;
                }
                50% { 
                    text-shadow: 0 0 25px rgba(168, 85, 247, 0.8);
                    color: #a855f7;
                }
            }
            @keyframes fadeInOut {
                0%, 100% { opacity: 0.4; }
                50% { opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Закрытие при клике в любое место
    notification.addEventListener('click', function() {
        hideAudioNotification();
    });

    // Блокируем прокрутку
    document.body.style.overflow = 'hidden';
}

function hideAudioNotification() {
    const notification = document.getElementById('audioNotification');
    if (notification) {
        notification.style.animation = 'fadeInFullscreen 0.5s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }

    // Сохраняем в localStorage, что пользователь активировал звук
    localStorage.setItem('audioActivated', 'true');

    // Перезапускаем видео с начала
    const video = document.getElementById('backgroundVideo');
    if (video) {
        video.currentTime = 0; // Сбрасываем к началу
        video.muted = false;
        video.volume = 0.5;
        video.play().catch(e => {});
    }

    // Восстанавливаем прокрутку
    document.body.style.overflow = '';
}

// Инициализация контролов видео
function initVideoControls(video) {
    const videoControls = document.getElementById('videoControls');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeIcon = document.getElementById('volumeIcon');
    const volumePercentage = document.getElementById('volumePercentage');

    if (!videoControls || !volumeSlider || !volumeIcon || !volumePercentage) return;

    // Показываем контролы
    videoControls.style.display = 'flex';

    // Обработчик изменения громкости
    volumeSlider.addEventListener('input', function() {
        const volume = this.value / 100;
        video.volume = volume;
        video.muted = volume === 0;
        volumePercentage.textContent = this.value + '%';

        // Скрываем уведомление при первом изменении громкости (только закрываем окно)
        const notification = document.getElementById('audioNotification');
        if (notification) {
            // Сохраняем в localStorage, что пользователь активировал звук
            localStorage.setItem('audioActivated', 'true');
            
            notification.style.animation = 'fadeInFullscreen 0.5s ease reverse';
            setTimeout(() => {
                notification.remove();
            }, 500);
            // Восстанавливаем прокрутку
            document.body.style.overflow = '';
        }

        // Изменяем иконку в зависимости от уровня громкости
        if (volume === 0 || video.muted) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (volume < 0.5) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    });

    // Клик по иконке для мгновенного мьюта/анмьюта
    volumeIcon.addEventListener('click', function() {
        if (video.muted || video.volume === 0) {
            video.muted = false;
            video.volume = 0.5;
            volumeSlider.value = 50;
            volumePercentage.textContent = '50%';
            this.className = 'fas fa-volume-up';
            
            // Скрываем уведомление при первом изменении громкости (только закрываем окно)
            const notification = document.getElementById('audioNotification');
            if (notification) {
                // Сохраняем в localStorage, что пользователь активировал звук
                localStorage.setItem('audioActivated', 'true');
                
                notification.style.animation = 'fadeInFullscreen 0.5s ease reverse';
                setTimeout(() => {
                    notification.remove();
                }, 500);
                // Восстанавливаем прокрутку
                document.body.style.overflow = '';
            }
        } else {
            video.muted = true;
            volumeSlider.value = 0;
            volumePercentage.textContent = '0%';
            this.className = 'fas fa-volume-mute';
        }
    });

    // Плавное появление контролов
    setTimeout(() => {
        videoControls.style.opacity = '0';
        videoControls.style.transform = 'translateY(20px)';
        videoControls.style.transition = 'all 0.6s ease';
        setTimeout(() => {
            videoControls.style.opacity = '1';
            videoControls.style.transform = 'translateY(0)';
        }, 100);
    }, 1000);
}