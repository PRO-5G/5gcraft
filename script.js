// КОНФИГУРАЦИЯ ПРИВИЛЕГИЙ
const privileges = [
    { name: "VIP", price: 10, color: "#FF5555", class: "card-vip" },
    { name: "PREMIUM", price: 25, color: "#55FF55", class: "card-premium" },
    { name: "ELITE", price: 50, color: "#FFFF55", class: "card-elite" },
    { name: "MASTER", price: 100, color: "#FFAA00", class: "card-master" },
    { name: "OVERLORD", price: 200, color: "#AA00AA", class: "card-overlord" },
    { name: "OMEGA", price: 400, color: "#FF55FF", class: "card-omega" },
    { name: "APEX", price: 800, color: "#00AAAA", class: "card-apex" },
    { name: "BOSS", price: 1500, color: "#FFAA00", class: "card-boss", description: "АБСОЛЮТНАЯ ВЛАСТЬ" }
];

const services = [
    { name: "РАЗМУТ", price: 99, icon: "fas fa-volume-up", buttonText: "ВЕРНУТЬ ГОЛОС" },
    { name: "РАЗБАН", price: 199, icon: "fas fa-unlock", buttonText: "ВЕРНУТЬСЯ В БОЙ" }
];

// 1. ИНИЦИАЛИЗАЦИЯ 3D МИРА С БЛОКАМИ МАЙНКРАФТА[citation:1]
let scene, camera, renderer, blocks = [];
let mouseX = 0, mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function init3DWorld() {
    // Сцена
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050508, 10, 50);

    // Камера
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);

    // Рендерер
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('scene-container').appendChild(renderer.domElement);

    // Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 5);
    scene.add(directionalLight);

    // Загрузчик текстур
    const textureLoader = new THREE.TextureLoader();

    // МАТЕРИАЛЫ ДЛЯ РАЗНЫХ БЛОКОВ (используем базовые цвета, позже заменишь на свои текстуры)
    const blockMaterials = {
        'dirt': new THREE.MeshLambertMaterial({ color: 0x8B4513 }),      // Коричневый
        'grass': new THREE.MeshLambertMaterial({ color: 0x55FF55 }),     // Зелёный
        'stone': new THREE.MeshLambertMaterial({ color: 0x808080 }),     // Серый
        'diamond': new THREE.MeshLambertMaterial({ color: 0x4EE2EC }),   // Бирюзовый
        'gold': new THREE.MeshLambertMaterial({ color: 0xFFD700 })       // Золотой
    };

    // ГЕОМЕТРИЯ КУБА (стандартный блок Майнкрафта)
    const blockGeometry = new THREE.BoxGeometry(2, 2, 2);

    // СОЗДАЁМ 3D БЛОКИ В СЦЕНЕ
    const blockPositions = [
        { x: -8, y: 0, z: -5, type: 'dirt' },
        { x: -4, y: 0, z: -8, type: 'grass' },
        { x: 0, y: 0, z: -10, type: 'stone' },
        { x: 4, y: 0, z: -7, type: 'diamond' },
        { x: 8, y: 0, z: -5, type: 'gold' },
        { x: -6, y: 2, z: -12, type: 'dirt' },
        { x: 2, y: 2, z: -15, type: 'grass' },
        { x: 6, y: -1, z: -9, type: 'stone' }
    ];

    blockPositions.forEach(pos => {
        const material = blockMaterials[pos.type];
        const block = new THREE.Mesh(blockGeometry, material);
        block.position.set(pos.x, pos.y, pos.z);
        block.userData = {
            originalY: pos.y,
            floatSpeed: 0.5 + Math.random() * 1.5,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            }
        };
        scene.add(block);
        blocks.push(block);
    });

    // "ЗЕМЛЯ" ПОД БЛОКАМИ
    const groundGeometry = new THREE.PlaneGeometry(100, 100, 32);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x1a5c1a,
        side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -3;
    scene.add(ground);

    // АНИМАЦИЯ
    function animate() {
        requestAnimationFrame(animate);
        
        // ПЛАВНОЕ ВРАЩЕНИЕ И ПЛАВАНИЕ БЛОКОВ
        const time = Date.now() * 0.001;
        blocks.forEach(block => {
            block.rotation.x += block.userData.rotationSpeed.x;
            block.rotation.y += block.userData.rotationSpeed.y;
            // Плавное подпрыгивание
            block.position.y = block.userData.originalY + Math.sin(time * block.userData.floatSpeed) * 0.5;
        });

        // ПАРАЛЛАКС ЭФФЕКТ ОТ ДВИЖЕНИЯ МЫШИ
        camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    // ОБРАБОТЧИКИ СОБЫТИЙ
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
}

function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// 2. RIPPLE-ЭФФЕКТ ДЛЯ ВСЕХ КНОПОК[citation:3]
function setupRippleButtons() {
    document.querySelectorAll('.buy-button, .service-button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 800);
        });
    });
}

// 3. ГЕНЕРАЦИЯ КАРТОЧЕК ПРИВИЛЕГИЙ И УСЛУГ
function generateProductCards() {
    const grid = document.getElementById('privileges');
    const servicesGrid = document.querySelector('.services-grid');
    
    // Привилегии
    privileges.forEach((priv, index) => {
        const card = document.createElement('div');
        card.className = `product-card ${priv.class}`;
        card.style.setProperty('--i', index);
        card.innerHTML = `
            <div class="product-header">
                <h3 class="pixel-text product-name">${priv.name}</h3>
                <div class="product-price">${priv.price} ₽</div>
            </div>
            ${priv.description ? `<p class="product-desc">${priv.description}</p>` : ''}
            <a href="https://vk.com/club233574345" 
               class="buy-button ripple-btn" 
               target="_blank" 
               data-tier="${priv.name.toLowerCase()}">
                ${priv.name === 'BOSS' ? 'СТАТЬ БОССОМ' : 'КУПИТЬ'}
            </a>
        `;
        grid.appendChild(card);
    });
    
    // Услуги
    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <h3><i class="${service.icon}"></i> ${service.name}</h3>
            <div class="service-price">${service.price} ₽</div>
            <a href="https://vk.com/club233574345" 
               class="buy-button service-button" 
               target="_blank">
                ${service.buttonText}
            </a>
        `;
        servicesGrid.appendChild(card);
    });
}

// 4. КОПИРОВАНИЕ IP АДРЕСА
function setupCopyIP() {
    const copyBtn = document.getElementById('copyBtn');
    copyBtn.addEventListener('click', () => {
        const ip = 'Proxy5G.minerent.io';
        navigator.clipboard.writeText(ip).then(() => {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.style.background = 'linear-gradient(135deg, #00AA00, #007700)';
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.background = '';
            }, 2000);
        });
    });
}

// 5. АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ ПРИ ПРОКРУТКЕ
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.product-card, .service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// 6. ИНИЦИАЛИЗАЦИЯ ВСЕГО ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
document.addEventListener('DOMContentLoaded', () => {
    // Запускаем 3D мир
    if (document.getElementById('scene-container')) {
        init3DWorld();
    }
    
    // Генерируем контент
    generateProductCards();
    
    // Настраиваем интерактив
    setupRippleButtons();
    setupCopyIP();
    setupScrollAnimations();
    
    // Запускаем снег (скрипт snow.js)
    if (typeof startSnow === 'function') {
        startSnow();
    }
    
    // Плавная прокрутка для навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
