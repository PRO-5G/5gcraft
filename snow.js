// СНЕГОПАД НА ФОНЕ[citation:2][citation:5][citation:8]
function startSnow() {
    const container = document.getElementById('snow-container');
    const snowflakesCount = 150; // Кол-во снежинок
    
    for (let i = 0; i < snowflakesCount; i++) {
        createSnowflake(container);
    }
    
    function createSnowflake(parent) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // Случайные параметры
        const size = Math.random() * 5 + 2; // От 2px до 7px
        const startX = Math.random() * 100; // Начальная позиция по X
        const opacity = Math.random() * 0.6 + 0.2; // Прозрачность
        const duration = Math.random() * 10 + 10; // Время падения
        const delay = Math.random() * -20; // Задержка начала
        
        // Применяем стили
        snowflake.style.cssText = `
            position: absolute;
            top: -20px;
            left: ${startX}vw;
            width: ${size}px;
            height: ${size}px;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            opacity: ${opacity};
            filter: blur(${size > 4 ? 1 : 0.5}px);
            z-index: 1;
        `;
        
        // Анимация падения с покачиванием[citation:8]
        const keyframes = [
            { transform: `translate(0, 0) rotate(0deg)` },
            { transform: `translate(${Math.random() * 30 - 15}px, 100vh) rotate(${Math.random() * 360}deg)` }
        ];
        
        const animation = snowflake.animate(keyframes, {
            duration: duration * 1000,
            delay: delay * 1000,
            easing: 'linear',
            iterations: Infinity
        });
        
        parent.appendChild(snowflake);
        
        // Периодическое обновление параметров для разнообразия
        setInterval(() => {
            animation.effect.setKeyframes([
                { transform: `translate(0, 0) rotate(0deg)` },
                { transform: `translate(${Math.random() * 30 - 15}px, 100vh) rotate(${Math.random() * 360}deg)` }
            ]);
        }, 15000);
    }
}
