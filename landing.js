document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initAnimatedBackground();
    initTypingEffect();
    animateStatNumbers();
});

// Animated Background with Particles
function initAnimatedBackground() {
    const particlesContainer = document.querySelector('.particles-container');
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        
        // Random size between 1 and 4px
        const size = Math.random() * 3 + 1;
        
        // Style the particle
        particle.style.position = 'absolute';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        particlesContainer.appendChild(particle);
        
        // Animate the particle
        animateParticle(particle);
    }
    
    function animateParticle(particle) {
        // Random duration between 10 and 30 seconds
        const duration = Math.random() * 20 + 10;
        
        // Random movement distance
        const xMove = Math.random() * 100 - 50;
        const yMove = Math.random() * 100 - 50;
        
        // Create animation
        const animation = particle.animate([
            { transform: 'translate(0, 0)', opacity: 0.1 },
            { transform: `translate(${xMove}px, ${yMove}px)`, opacity: 0.5, offset: 0.5 },
            { transform: 'translate(0, 0)', opacity: 0.1 }
        ], {
            duration: duration * 1000,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
        
        // Make sure animation plays even when tab is not active
        animation.playbackRate = 0.5;
    }
    
    // Make spheres interactive with mouse movement
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const spheres = document.querySelectorAll('.gradient-sphere');
        
        spheres.forEach((sphere, index) => {
            const offsetX = (mouseX - 0.5) * (index + 1) * 10;
            const offsetY = (mouseY - 0.5) * (index + 1) * 10;
            sphere.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
    });
}

// Typing Effect
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    const phrases = [
        'Software Engineer',
        'Data Scientist',
        'Web Developer',
        'Problem Solver'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }
        
        // If word is complete
        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at the end
            isDeleting = true;
            typingSpeed = 1500;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing effect
    setTimeout(type, 1000);
}

// Animate stat numbers
function animateStatNumbers() {
    // Wait for animations to complete
    setTimeout(() => {
        animateValue('projects-count', 0, 15, 2000, '+');
        animateValue('experience-count', 0, 5, 2000, '+');
        animateValue('clients-count', 0, 20, 2000, '+');
    }, 3500);
    
    function animateValue(id, start, end, duration, suffix = '') {
        const obj = document.getElementById(id);
        const range = end - start;
        const minTimer = 50;
        let stepTime = Math.abs(Math.floor(duration / range));
        
        // Ensure the step time is not too small
        stepTime = Math.max(stepTime, minTimer);
        
        let startTime = new Date().getTime();
        let endTime = startTime + duration;
        let timer;
        
        function run() {
            let now = new Date().getTime();
            let remaining = Math.max((endTime - now) / duration, 0);
            let value = Math.round(end - (remaining * range));
            obj.innerHTML = value + suffix;
            
            if (value == end) {
                clearInterval(timer);
            }
        }
        
        timer = setInterval(run, stepTime);
        run();
    }
}
