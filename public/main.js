document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('tulips-container');
    if (!container) return;

    // Colores específicos solicitados: rojo, azul, amarillo, violeta
    // Colores específicos con sombras para el estilo "cartoon/dibujo"
    const colors = [
        { name: 'rojo', main: '#e84e36', dark: '#be2e1b' },
        { name: 'azul', main: '#3b82f6', dark: '#1d4ed8' },
        { name: 'amarillo', main: '#fbbf24', dark: '#d97706' },
        { name: 'violeta', main: '#a855f7', dark: '#7e22ce' }
    ];

    // Colores deseados: violeta (base), rojo, azul, amarillo
    const colorHues = [
        0,    // rojo (original de la imagen)
        -120, // azul
        60,   // amarillo
        90    // violeta/rosa
    ];

    const numTulips = 18; // Cantidad de tulipanes estáticos

    for (let i = 0; i < numTulips; i++) {
        const tulip = document.createElement('div');
        tulip.className = 'tulip';
        
        // Random properties para posición estática en TODA la página
        const hueRotate = colorHues[Math.floor(Math.random() * colorHues.length)];
        const left = Math.random() * 92; // 0% a 92% (ancho)
        const top = Math.random() * 95;  // 0% a 95% (largo total del scroll)
        const rotation = -30 + Math.random() * 60; // -30deg a 30deg
        const scale = 0.5 + Math.random() * 0.8;
        const zIndex = Math.floor(Math.random() * 10) - 5; // Algunos atrás, algunos adelante
        const brightness = 0.9 + Math.random() * 0.3; 
        
        // IMPORTANTE: aquí usamos la imagen real
        tulip.innerHTML = `<img src="/public/tulip.png" alt="tulip" style="width:100%; height:auto; filter: hue-rotate(${hueRotate}deg) brightness(${brightness});">`;
        
        tulip.style.left = `${left}%`; // Cambiado a porcentaje
        tulip.style.top = `${top}%`;   // Cambiado a porcentaje
        tulip.style.width = '100px'; // Tamaño base ajustable
        tulip.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
        tulip.style.zIndex = zIndex;
        
        container.appendChild(tulip);
    }
    
    // Lógica para el modal (popup de la imagen)
    const modal = document.getElementById('image-modal');
    const triggers = document.querySelectorAll('.gordas-trigger'); // Seleccionamos TODAS las palabras
    const closeBtn = document.querySelector('.close-modal');
    
    if (triggers.length > 0 && modal && closeBtn) {
        // Abrir el modal en CADA palabra
        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                modal.classList.add('show');
            });
        });
        
        // Cerrar al tocar la X
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
        
        // Cerrar al tocar cualquier parte fuera de la imagen
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
});
