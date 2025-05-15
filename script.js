// Custom Cursor
const cursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Portal Animation with Three.js
const initPortal = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('portalCanvas').appendChild(renderer.domElement);
    
    // Create portal rings
    const rings = [];
    const ringGeometry = new THREE.TorusGeometry(5, 0.3, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xFF6B00, transparent: true, opacity: 0.7 });
    
    for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.z = -i * 2;
        ring.scale.set(1 - i * 0.2, 1 - i * 0.2, 1);
        scene.add(ring);
        rings.push(ring);
    }
    
    // Add particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Position
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 3;
        positions[i] = Math.cos(angle) * radius;
        positions[i + 1] = Math.sin(angle) * radius;
        positions[i + 2] = (Math.random() - 0.5) * 5;
        
        // Color
        colors[i] = 1.0;  // R
        colors[i + 1] = 0.4 + Math.random() * 0.3;  // G
        colors[i + 2] = 0.0;  // B
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    camera.position.z = 10;
    
    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        
        rings.forEach((ring, i) => {
            ring.rotation.z += 0.01 - (i * 0.002);
            ring.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
            ring.rotation.y = Math.cos(Date.now() * 0.001) * 0.2;
        });
        
        particles.rotation.z += 0.002;
        
        renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// Initialize the portal
initPortal();

// Spell-casting text animation
const nameReveal = document.querySelector('.name-reveal');
const nameText = nameReveal.textContent;
nameReveal.textContent = '';

for (let i = 0; i < nameText.length; i++) {
    const span = document.createElement('span');
    span.textContent = nameText[i];
    span.style.opacity = '0';
    span.style.animation = `letterReveal 0.5s ${1 + (i * 0.1)}s forwards`;
    nameReveal.appendChild(span);
}

// Portal entrance effect
const ctaButton = document.querySelector('.cta-button');
ctaButton.addEventListener('click', () => {
    // Play portal sound
    const portalSound = new Howl({
        src: ['portal-sound.mp3'],
        volume: 0.7
    });
    portalSound.play();
    
    // Portal transition animation
    document.body.style.transition = 'transform 1.5s, filter 1.5s';
    document.body.style.transform = 'scale(1.1)';
    document.body.style.filter = 'brightness(3) hue-rotate(60deg)';
    
    setTimeout(() => {
        document.body.style.transform = 'scale(1)';
        document.body.style.filter = 'brightness(1) hue-rotate(0deg)';
        
        // Scroll to next section
        document.querySelector('.book-section').scrollIntoView({ behavior: 'smooth' });
    }, 1500);
});

// Visitor counter animation
let visitorCount = 0;
const visitorCountElement = document.querySelector('.visitor-count');

const updateVisitorCount = () => {
    visitorCount++;
    visitorCountElement.textContent = visitorCount;
    
    // Add pulse effect
    const pulse = document.createElement('div');
    pulse.classList.add('visitor-pulse');
    pulse.style.position = 'absolute';
    pulse.style.width = '100%';
    pulse.style.height = '100%';
    pulse.style.borderRadius = '50%';
    pulse.style.backgroundColor = '#1ED760';
    pulse.style.opacity = '0.7';
    pulse.style.animation = 'portalPulse 1s forwards';
    
    document.querySelector('.eye-of-agamotto').appendChild(pulse);
    
    setTimeout(() => {
        pulse.remove();
    }, 1000);
};

// Simulate visitor count update
setTimeout(updateVisitorCount, 2000);
setInterval(updateVisitorCount, 30000);

// Time Stone Easter Egg
let keySequence = [];
const timeStoneCode = ['t', 'i', 'm', 'e'];

document.addEventListener('keydown', (e) => {
    keySequence.push(e.key.toLowerCase());
    
    if (keySequence.length > timeStoneCode.length) {
        keySequence.shift();
    }
    
    if (keySequence.join('') === timeStoneCode.join('')) {
        // Time rewind effect
        const timeRewindSound = new Howl({
            src: ['time-rewind.mp3'],
            volume: 0.5
        });
        timeRewindSound.play();
        
        document.body.style.transition = 'filter 2s';
        document.body.style.filter = 'hue-rotate(120deg) saturate(2)';
        
        gsap.to(window, {
            duration: 2,
            scrollTo: { y: 0, autoKill: false },
            ease: "power2.inOut"
        });
        
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 2000);
    }
});
