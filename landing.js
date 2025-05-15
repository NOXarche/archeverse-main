document.addEventListener('DOMContentLoaded', function() {
    // Typewriter effect for title
    const title = document.querySelector('.title');
    title.style.width = '0';
    
    // Animate ODM wires on mouse move
    const heroSection = document.querySelector('.hero-section');
    const leftWire = document.querySelector('.left-wire');
    const rightWire = document.querySelector('.right-wire');
    
    heroSection.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        leftWire.style.transform = `rotate(${-40 + x * 20}deg) scaleY(${0.9 + y * 0.2})`;
        rightWire.style.transform = `rotate(${40 - x * 20}deg) scaleY(${0.9 + y * 0.2})`;
    });
    
    // CTA button effect
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', () => {
        // Add your navigation logic here
        console.log('Entering the walls...');
        // Example: window.location.href = 'main.html';
    });
    
    // Animate stat bars when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statFills = document.querySelectorAll('.stat-fill');
                statFills.forEach(fill => {
                    const width = fill.style.width;
                    fill.style.width = '0';
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 200);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const dossierStats = document.querySelector('.dossier-stats');
    if (dossierStats) {
        observer.observe(dossierStats);
    }
    
    // Add dynamic wall texture to hero section
    function createWallTexture() {
        const heroSection = document.querySelector('.hero-section');
        const texture = document.createElement('div');
        texture.classList.add('wall-texture');
        
        // Create a grid of small divs to simulate wall stones
        for (let i = 0; i < 100; i++) {
            const stone = document.createElement('div');
            stone.classList.add('wall-stone');
            stone.style.left = `${Math.random() * 100}%`;
            stone.style.top = `${Math.random() * 100}%`;
            stone.style.width = `${Math.random() * 30 + 10}px`;
            stone.style.height = `${Math.random() * 20 + 5}px`;
            stone.style.backgroundColor = `rgba(${30 + Math.random() * 20}, ${30 + Math.random() * 20}, ${30 + Math.random() * 20}, 0.5)`;
            texture.appendChild(stone);
        }
        
        heroSection.appendChild(texture);
    }
    
    // Uncomment the line below if you want to add dynamic wall texture
    // createWallTexture();
});
