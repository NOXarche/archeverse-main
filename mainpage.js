// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize libraries and components with mobile-optimized settings
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        disable: window.innerWidth < 768 // Disable on mobile for better performance
    });

    // Initialize all components
    initThemeToggle();
    initTypingEffect();
    initNavbar();
    initParallaxEffect();
    initSkillsFilter();
    initBackToTop();
    initAnimatedBackground();
    init3DModel();
    initAIAssistant();
    initResponsiveOptimizations();
    initDesignFilter();
    
    // Firebase initialization
    initFirebase();
});

// Theme Toggle
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use the system preference
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    themeToggleBtn.addEventListener('click', function() {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        this.appendChild(ripple);
        
        // Remove ripple after animation completes
        setTimeout(() => {
            ripple.remove();
        }, 800);
        
        document.body.classList.toggle('dark-theme');
        
        // Save the preference
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
}

// Typing Effect with optimized performance
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;
    
    const phrases = [
        'Civil Engineer',
        'Data Scientist',
        'Robotics Builder',
        'AI Specialist',
        'Graphics Designer',
        'UI/UX Developer'
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

// Navbar functionality with mobile optimization
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (!navbar || !hamburger || !navLinks) return;
    
    // Throttle scroll event for better performance
    let lastScrollTop = 0;
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (scrollTop > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                // Hide navbar on scroll down, show on scroll up (mobile only)
                if (window.innerWidth < 768) {
                    if (scrollTop > lastScrollTop && scrollTop > 300) {
                        navbar.style.transform = 'translateY(-100%)';
                    } else {
                        navbar.style.transform = 'translateY(0)';
                    }
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
                
                lastScrollTop = scrollTop;
                ticking = false;
            });
            
            ticking = true;
        }
    });
    
    // Mobile menu toggle with improved touch response
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking on a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Parallax Effect optimized for mobile
function initParallaxEffect() {
    // Parallax for hero section - disable on mobile for performance
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    if (parallaxLayers.length > 0 && window.innerWidth > 768) {
        window.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            parallaxLayers.forEach(layer => {
                const speed = layer.getAttribute('data-depth') || layer.getAttribute('data-speed') || 0.1;
                const x = (window.innerWidth - mouseX * speed * 100);
                const y = (window.innerHeight - mouseY * speed * 100);
                
                // Use transform translate3d for GPU acceleration
                layer.style.transform = `translate3d(${x / 100}px, ${y / 100}px, 0)`;
            });
        });
    }
    
    // Parallax for other sections on scroll - use IntersectionObserver for better performance
    const parallaxElements = document.querySelectorAll('[data-speed]');
    
    if (parallaxElements.length > 0 && window.innerWidth > 768) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const scrollTop = window.pageYOffset;
                    const element = entry.target;
                    const speed = element.getAttribute('data-speed');
                    const yPos = -(scrollTop * speed);
                    
                    // Use transform translate3d for GPU acceleration
                    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
            });
        }, { threshold: 0.1 });
        
        parallaxElements.forEach(element => {
            if (!element.classList.contains('parallax-layer')) {
                observer.observe(element);
            }
        });
    }
}

// Skills filter with touch optimization
function initSkillsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    
    if (filterButtons.length === 0 || skillCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Use requestAnimationFrame for smoother animations
            requestAnimationFrame(() => {
                skillCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    });
}

// Back to top button with scroll throttling
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (!backToTopBtn) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (window.scrollY > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
                ticking = false;
            });
            
            ticking = true;
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        this.appendChild(ripple);
        
        // Remove ripple after animation completes
        setTimeout(() => {
            ripple.remove();
        }, 800);
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animated Background with reduced particles for mobile
function initAnimatedBackground() {
    const particlesContainer = document.querySelector('.particles-container');
    const starsContainer = document.querySelector('.stars-container');
    
    if (!particlesContainer || !starsContainer) return;
    
    // Reduce particle count on mobile for better performance
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 80;
    const starCount = isMobile ? 15 : 30;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        
        // Random size between 1 and 3px (smaller on mobile)
        const size = isMobile ? (Math.random() * 2 + 1) : (Math.random() * 3 + 1);
        
        // Style the particle
        particle.className = 'particle';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        particlesContainer.appendChild(particle);
        
        // Use CSS animations instead of JS for better performance
        particle.style.animation = `float ${Math.random() * 20 + 10}s infinite alternate`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
    }
    
    // Create falling stars with staggered animation
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `-10px`;
        
        // Random animation duration between 3 and 8 seconds
        const duration = Math.random() * 5 + 3;
        star.style.animation = `falling-star ${duration}s linear forwards`;
        
        // Stagger animations
        star.style.animationDelay = `${Math.random() * 15}s`;
        
        starsContainer.appendChild(star);
        
        // Recreate star after animation completes
        setTimeout(() => {
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 15}s`;
        }, duration * 1000 + (Math.random() * 15000));
    }
    
    // Add flow field animation
    initFlowField();
    
    // Make spheres interactive with mouse movement - only on desktop
    if (!isMobile) {
        document.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const spheres = document.querySelectorAll('.gradient-sphere');
            
            spheres.forEach((sphere, index) => {
                const offsetX = (mouseX - 0.5) * (index + 1) * 10;
                const offsetY = (mouseY - 0.5) * (index + 1) * 10;
                
                // Use transform translate3d for GPU acceleration
                sphere.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
            });
        });
    }
}

// Flow field animation for background
function initFlowField() {
    const canvas = document.getElementById('flow-field');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Reduce particle count on mobile
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 50 : 150;
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = 0;
            this.speedY = 0;
            this.color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
        }
        
        update() {
            // Get flow field angle
            const angle = (Math.sin(this.x * 0.01) + Math.cos(this.y * 0.01)) * Math.PI;
            
            // Update speed with flow field direction
            this.speedX = Math.cos(angle) * 0.3;
            this.speedY = Math.sin(angle) * 0.3;
            
            // Update position
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        // Clear canvas with slight transparency for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// 3D Model using Three.js with mobile optimization
function init3DModel() {
    const modelCanvas = document.getElementById('model-canvas');
    if (!modelCanvas) return;
    
    // Reduce complexity on mobile
    const isMobile = window.innerWidth < 768;
    const segmentCount = isMobile ? 4 : 6;
    
    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, modelCanvas.offsetWidth / modelCanvas.offsetHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: !isMobile, // Disable antialiasing on mobile for performance
        powerPreference: 'high-performance'
    });
    renderer.setSize(modelCanvas.offsetWidth, modelCanvas.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); // Limit pixel ratio for performance
    modelCanvas.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create a geometric shape (hexagonal prism to match logo)
    const geometry = new THREE.CylinderGeometry(1, 1, 2, segmentCount);
    
    // Create materials with different colors
    const materials = [
        new THREE.MeshPhongMaterial({ color: 0x2d46b9, flatShading: true }), // Primary color
        new THREE.MeshPhongMaterial({ color: 0x0496ff, flatShading: true }), // Secondary color
        new THREE.MeshPhongMaterial({ color: 0xff3a5e, flatShading: true })  // Accent color
    ];
    
    // Create nested hexagonal prisms
    let outerPrism = new THREE.Mesh(geometry, materials[0]);
    scene.add(outerPrism);
    
    let middlePrism = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.8, 2.2, segmentCount),
        materials[1]
    );
    scene.add(middlePrism);
    
    let innerPrism = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 2.5, segmentCount),
        materials[2]
    );
    scene.add(innerPrism);
    
    // Position camera
    camera.position.z = 5;
    
    // Variables for rotation
    let rotationSpeed = isMobile ? 0.005 : 0.01; // Slower on mobile
    let isRotating = true;
    let isZooming = false;
    let zoomLevel = 5;
    
    // Animation loop with frame limiting for mobile
    let lastTime = 0;
    const frameInterval = isMobile ? 1000/30 : 1000/60; // 30fps on mobile, 60fps on desktop
    
    function animate(timestamp) {
        requestAnimationFrame(animate);
        
        // Limit frame rate on mobile
        const deltaTime = timestamp - lastTime;
        if (deltaTime < frameInterval) return;
        lastTime = timestamp - (deltaTime % frameInterval);
        
        if (isRotating) {
            outerPrism.rotation.y += rotationSpeed;
            middlePrism.rotation.y -= rotationSpeed * 0.7;
            innerPrism.rotation.y += rotationSpeed * 0.5;
            
            outerPrism.rotation.x += rotationSpeed * 0.3;
            middlePrism.rotation.x -= rotationSpeed * 0.2;
            innerPrism.rotation.x += rotationSpeed * 0.1;
        }
        
        if (isZooming) {
            if (zoomLevel > 3) {
                zoomLevel -= 0.05;
                camera.position.z = zoomLevel;
            }
        } else {
            if (zoomLevel < 5) {
                zoomLevel += 0.05;
                camera.position.z = zoomLevel;
            }
        }
        
        renderer.render(scene, camera);
    }
    
    animate(0);
    
    // Control buttons
    const rotateBtn = document.getElementById('rotate-model');
    const zoomBtn = document.getElementById('zoom-model');
    const resetBtn = document.getElementById('reset-model');
    const changeModelBtn = document.getElementById('change-model');
    
    if (rotateBtn) {
        rotateBtn.addEventListener('click', function() {
            isRotating = !isRotating;
            this.innerHTML = isRotating ? '<i class="fas fa-pause"></i> Pause' : '<i class="fas fa-sync"></i> Rotate';
        });
    }
    
    if (zoomBtn) {
        zoomBtn.addEventListener('click', function() {
            isZooming = !isZooming;
            this.innerHTML = isZooming ? '<i class="fas fa-search-minus"></i> Zoom Out' : '<i class="fas fa-search-plus"></i> Zoom In';
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            outerPrism.rotation.x = 0;
            outerPrism.rotation.y = 0;
            middlePrism.rotation.x = 0;
            middlePrism.rotation.y = 0;
            innerPrism.rotation.x = 0;
            innerPrism.rotation.y = 0;
            
            zoomLevel = 5;
            camera.position.z = zoomLevel;
            isZooming = false;
            
            if (zoomBtn) {
                zoomBtn.innerHTML = '<i class="fas fa-search-plus"></i> Zoom In';
            }
        });
    }
    
    if (changeModelBtn) {
        let currentModel = 'hexagon';
        
        changeModelBtn.addEventListener('click', function() {
            // Clear current models
            scene.remove(outerPrism);
            scene.remove(middlePrism);
            scene.remove(innerPrism);
            
            if (currentModel === 'hexagon') {
                // Switch to sphere model
                const sphereGeometry = new THREE.SphereGeometry(1, isMobile ? 16 : 32, isMobile ? 16 : 32);
                const outerSphere = new THREE.Mesh(sphereGeometry, materials[0]);
                scene.add(outerSphere);
                
                const middleSphere = new THREE.Mesh(
                    new THREE.SphereGeometry(0.8, isMobile ? 16 : 32, isMobile ? 16 : 32),
                    materials[1]
                );
                scene.add(middleSphere);
                
                const innerSphere = new THREE.Mesh(
                    new THREE.SphereGeometry(0.5, isMobile ? 16 : 32, isMobile ? 16 : 32),
                    materials[2]
                );
                scene.add(innerSphere);
                
                // Update references
                outerPrism = outerSphere;
                middlePrism = middleSphere;
                innerPrism = innerSphere;
                
                currentModel = 'sphere';
            } else {
                // Switch back to hexagon model
                const hexGeometry = new THREE.CylinderGeometry(1, 1, 2, segmentCount);
                const outerHex = new THREE.Mesh(hexGeometry, materials[0]);
                scene.add(outerHex);
                
                const middleHex = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.8, 0.8, 2.2, segmentCount),
                    materials[1]
                );
                scene.add(middleHex);
                
                const innerHex = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.5, 0.5, 2.5, segmentCount),
                    materials[2]
                );
                scene.add(innerHex);
                
                // Update references
                outerPrism = outerHex;
                middlePrism = middleHex;
                innerPrism = innerHex;
                
                currentModel = 'hexagon';
            }
        });
    }
    
    // Resize handler with debouncing
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const width = modelCanvas.offsetWidth;
            const height = modelCanvas.offsetHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }, 250);
    });
}

// AI Assistant functionality
function initAIAssistant() {
    const aiToggleBtn = document.querySelector('.ai-toggle-btn');
    const aiChatWindow = document.querySelector('.ai-chat-window');
    const aiCloseBtn = document.querySelector('.ai-close-btn');
    const aiChatInput = document.querySelector('.ai-chat-input input');
    const aiSendBtn = document.querySelector('.ai-chat-input button');
    const aiMessages = document.querySelector('.ai-chat-messages');
    
    if (!aiToggleBtn || !aiChatWindow) return;
    
    // Toggle chat window
    aiToggleBtn.addEventListener('click', function() {
        aiChatWindow.classList.toggle('open');
        this.classList.toggle('expanded');
        
        if (aiChatWindow.classList.contains('open')) {
            aiChatInput.focus();
        }
    });
    
    // Close chat window
    if (aiCloseBtn) {
        aiCloseBtn.addEventListener('click', function() {
            aiChatWindow.classList.remove('open');
            aiToggleBtn.classList.remove('expanded');
        });
    }
    
    // Send message
    function sendMessage() {
        const message = aiChatInput.value.trim();
        if (!message) return;
        
        // Add user message
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'ai-message user-message';
        userMessageElement.innerHTML = `
            <div class="ai-message-content">
                <p>${message}</p>
            </div>
        `;
        aiMessages.appendChild(userMessageElement);
        
        // Clear input
        aiChatInput.value = '';
        
        // Scroll to bottom
        aiMessages.scrollTop = aiMessages.scrollHeight;
        
        // Simulate AI response (in real implementation, this would call an API)
        setTimeout(() => {
            const aiMessageElement = document.createElement('div');
            aiMessageElement.className = 'ai-message';
            aiMessageElement.innerHTML = `
                <div class="ai-avatar"><i class="fas fa-robot"></i></div>
                <div class="ai-message-content">
                    <p>Thanks for your message! This is a demo of the AI assistant. In the full implementation, I would provide helpful information about the projects and expertise.</p>
                </div>
            `;
            aiMessages.appendChild(aiMessageElement);
            
            // Scroll to bottom
            aiMessages.scrollTop = aiMessages.scrollHeight;
        }, 1000);
    }
    
    // Send button click
    if (aiSendBtn) {
        aiSendBtn.addEventListener('click', sendMessage);
    }
    
    // Enter key press
    if (aiChatInput) {
        aiChatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

// Mobile and tablet optimizations
function initResponsiveOptimizations() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    // Adjust layout based on device
    if (isMobile || isTablet) {
        // Reduce animation complexity
        document.body.classList.add('reduce-motion');
        
        // Optimize images
        optimizeImages();
        
        // Adjust grid layouts
        adjustGridLayouts();
    }
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            adjustGridLayouts();
        }, 300);
    });
    
    // Add touch-friendly interactions
    if ('ontouchstart' in window) {
        addTouchInteractions();
    }
}

function optimizeImages() {
    // Replace large images with smaller versions on mobile
    const images = document.querySelectorAll('img:not([data-no-optimize])');
    
    images.forEach(img => {
        // Add loading="lazy" for better performance
        img.setAttribute('loading', 'lazy');
        
        // Replace high-res images with lower-res versions
        if (img.src.includes('placeholder')) {
            const width = window.innerWidth < 768 ? 400 : 600;
            const height = window.innerWidth < 768 ? 300 : 400;
            img.src = img.src.replace(/\d+x\d+/, `${width}x${height}`);
        }
        
        // Add error handling
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
        };
    });
}

function adjustGridLayouts() {
    // Adjust grid layouts for better mobile display
    const grids = document.querySelectorAll('.projects-grid, .skills-grid, .blog-grid, .design-showcase-grid');
    
    grids.forEach(grid => {
        if (window.innerWidth < 768) {
            grid.style.gridTemplateColumns = '1fr';
        } else if (window.innerWidth < 1024) {
            grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else {
            grid.style.gridTemplateColumns = '';  // Reset to CSS default
        }
    });
    
    // Adjust contact container for mobile
    const contactContainer = document.querySelector('.contact-container');
    if (contactContainer) {
        if (window.innerWidth < 1024) {
            contactContainer.style.gridTemplateColumns = '1fr';
        } else {
            contactContainer.style.gridTemplateColumns = '';
        }
    }
}

function addTouchInteractions() {
    // Add active states for touch interactions
    const interactiveElements = document.querySelectorAll('button, .btn, .nav-link, .card, .project-card, .blog-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        }, { passive: true });
    });
    
    // Improve touch targets
    const smallButtons = document.querySelectorAll('.social-link, .github-link');
    smallButtons.forEach(button => {
        button.style.minHeight = '44px';
        button.style.minWidth = '44px';
    });
}

// Initialize design filter functionality
function initDesignFilter() {
    const filterButtons = document.querySelectorAll('.design-filter .filter-btn');
    const designCards = document.querySelectorAll('.design-card');
    
    if (filterButtons.length === 0 || designCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter design cards
            designCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Initialize design viewer modal
function initDesignViewer() {
    const modal = document.getElementById('design-modal');
    const modalImg = document.getElementById('design-modal-image');
    const modalTitle = document.getElementById('design-modal-title');
    const modalDesc = document.getElementById('design-modal-description');
    const modalTools = document.getElementById('design-modal-tools');
    const closeBtn = document.querySelector('.close-modal');
    
    if (!modal || !modalImg || !modalTitle || !modalDesc || !modalTools || !closeBtn) return;
    
    // Get all view buttons
    const viewButtons = document.querySelectorAll('.view-design-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const designId = this.getAttribute('data-id');
            const designCard = this.closest('.design-card');
            
            // Get design details
            const image = designCard.querySelector('.design-image').src;
            const title = designCard.querySelector('.design-title').textContent;
            const description = designCard.querySelector('.design-description').textContent;
            const toolsElements = designCard.querySelectorAll('.design-tool');
            
            // Set modal content
            modalImg.src = image;
            modalTitle.textContent = title;
            modalDesc.textContent = description;
            
            // Set tools
            modalTools.innerHTML = '';
            toolsElements.forEach(tool => {
                const toolElement = document.createElement('span');
                toolElement.className = 'design-tool';
                toolElement.textContent = tool.textContent;
                modalTools.appendChild(toolElement);
            });
            
            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Close modal with Escape key
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

// Firebase initialization with lazy loading
function initFirebase() {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDQ0LKF-yCoo5k1gl_ntt8r-9tR4QBZGyE",
        authDomain: "archeverse-7d502.firebaseapp.com",
        databaseURL: "https://archeverse-7d502-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "archeverse-7d502",
        storageBucket: "archeverse-7d502.firebasestorage.app",
        messagingSenderId: "489295358544",
        appId: "1:489295358544:web:2f3a2cb2a74c5343f17f55",
        measurementId: "G-G2QJ69V5DN"
    };
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Load dynamic content from Firebase using IntersectionObserver for lazy loading
    const observers = {};
    
    // Create observer for each section
    function createObserver(sectionId, loadFunction) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        observers[sectionId] = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadFunction();
                    observers[sectionId].disconnect();
                }
            });
        }, { threshold: 0.1 });
        
        observers[sectionId].observe(section);
    }
    
    // Create observers for each section
    createObserver('projects', loadProjects);
    createObserver('skills', loadSkills);
    createObserver('experience', loadExperience);
    createObserver('blog', loadBlogPosts);
    createObserver('linkedin', loadLinkedInPosts);
    createObserver('design-showcase', loadDesignShowcase);
    
    // Setup real-time listeners for critical elements immediately
    setupRealTimeListeners();
    
    // Contact form submission with validation and feedback
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Disable form during submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Save to Firebase
            const database = firebase.database();
            database.ref('messages').push({
                name: name,
                email: email,
                subject: subject,
                message: message,
                timestamp: Date.now()
            })
            .then(() => {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Message sent successfully!';
                contactForm.appendChild(successMessage);
                
                // Reset form
                contactForm.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
                
                // Re-enable button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            })
            .catch((error) => {
                console.error("Error saving message:", error);
                alert(`Failed to send message: ${error.message}`);
                
                // Re-enable button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
    
    // Newsletter signup with validation
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input');
            const email = emailInput.value;
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                emailInput.classList.add('error');
                return;
            }
            
            // Remove error class if present
            emailInput.classList.remove('error');
            
            // Disable form during submission
            const submitBtn = newsletterForm.querySelector('button');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Save to Firebase
            const database = firebase.database();
            database.ref('newsletter').push({
                email: email,
                timestamp: Date.now()
            })
            .then(() => {
                // Show success message
                emailInput.value = 'Subscribed!';
                emailInput.disabled = true;
                
                // Re-enable after 3 seconds
                setTimeout(() => {
                    emailInput.value = '';
                    emailInput.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, 3000);
            })
            .catch((error) => {
                console.error("Error subscribing to newsletter:", error);
                
                // Show error
                emailInput.value = 'Error, try again';
                
                // Re-enable after 3 seconds
                setTimeout(() => {
                    emailInput.value = email;
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }
}

// Load Projects from Firebase with optimized rendering
function loadProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    // Show loading spinner
    projectsGrid.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading projects...</p>
        </div>
    `;
    
    const database = firebase.database();
    const projectsRef = database.ref('projects');
    
    // Use get() for one-time data retrieval
    projectsRef.get().then((snapshot) => {
        const projects = snapshot.val() || {};
        
        // Clear loading spinner
        projectsGrid.innerHTML = '';
        
        if (Object.keys(projects).length === 0) {
            // Display demo projects if no data found
            displayDemoProjects();
        } else {
            // Display projects from Firebase
            displayProjects(Object.values(projects));
        }
        
        // Update project count
        updateProjectCount(Object.keys(projects).length);
    }).catch(error => {
        console.error("Error fetching projects:", error);
        projectsGrid.innerHTML = '<p>Error loading projects. Please try again later.</p>';
    });
    
    function displayDemoProjects() {
        const demoProjects = [
            {
                title: "Autonomous Drone Navigation",
                description: "AI-powered drone that navigates complex environments using computer vision and machine learning algorithms.",
                imageUrl: "https://via.placeholder.com/600x400",
                technologies: ["Python", "TensorFlow", "ROS"],
                detailsUrl: "#",
                githubUrl: "#",
                status: "live",
                lastUpdated: Date.now() - 7200000 // 2 hours ago
            },
            {
                title: "Structural Analysis Dashboard",
                description: "Interactive dashboard for civil engineers to analyze structural integrity in real-time with 3D visualizations.",
                imageUrl: "https://via.placeholder.com/600x400",
                technologies: ["React", "Three.js", "Firebase"],
                detailsUrl: "#",
                githubUrl: "#",
                status: "development",
                lastUpdated: Date.now() - 259200000 // 3 days ago
            },
            {
                title: "ML-Powered Traffic Analysis",
                description: "Machine learning system that predicts traffic patterns for urban planning with real-time data visualization.",
                imageUrl: "https://via.placeholder.com/600x400",
                technologies: ["Python", "Scikit-learn", "D3.js"],
                detailsUrl: "#",
                githubUrl: "#",
                status: "live",
                lastUpdated: Date.now() - 604800000 // 1 week ago
            }
        ];
        
        displayProjects(demoProjects);
        updateProjectCount(demoProjects.length);
    }
    
    function displayProjects(projects) {
        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        // Sort projects by last updated date (newest first)
        projects.sort((a, b) => b.lastUpdated - a.lastUpdated);
        
        projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-aos', 'fade-up');
            projectCard.setAttribute('data-aos-delay', Math.min((index + 1) * 50, 300)); // Reduced delay for better UX
            
            // Optimize image loading with lazy loading and responsive image
            const imageUrl = project.imageUrl || "https://via.placeholder.com/600x400";
            
            projectCard.innerHTML = `
                <div class="project-image-container">
                    <img src="${imageUrl}" alt="${project.title}" class="project-image" loading="lazy">
                    ${project.status === 'live' ? '<div class="live-badge"><span class="live-dot"></span>LIVE</div>' : ''}
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="tech-stack">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.detailsUrl}" class="project-btn">View Details</a>
                        <a href="${project.githubUrl}" class="github-link"><i class="fab fa-github"></i></a>
                    </div>
                    <div class="last-updated">
                        <small>Last updated: <span class="update-time">${formatTimeAgo(project.lastUpdated)}</span></small>
                    </div>
                </div>
            `;
            
            fragment.appendChild(projectCard);
        });
        
        projectsGrid.appendChild(fragment);
    }
    
    function updateProjectCount(count) {
        const projectsCountElement = document.getElementById('projects-count');
        if (projectsCountElement) {
            animateCounter(projectsCountElement, count);
        }
    }
}

// Load Skills from Firebase with optimized rendering
function loadSkills() {
    const skillsGrid = document.getElementById('skills-grid');
    if (!skillsGrid) return;
    
    // Show loading spinner
    skillsGrid.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading skills...</p>
        </div>
    `;
    
    const database = firebase.database();
    const skillsRef = database.ref('skills');
    
    skillsRef.get().then((snapshot) => {
        const skills = snapshot.val() || {};
        
        // Clear loading spinner
        skillsGrid.innerHTML = '';
        
        if (Object.keys(skills).length === 0) {
            displayDemoSkills();
        } else {
            displaySkills(Object.values(skills));
        }
    }).catch(error => {
        console.error("Error fetching skills:", error);
        skillsGrid.innerHTML = '<p>Error loading skills. Please try again later.</p>';
    });
    
    function displayDemoSkills() {
        const demoSkills = [
            {
                name: "Python",
                icon: "fab fa-python",
                rating: 5,
                description: "Built 10+ ML models and automation systems",
                experience: "5+ years",
                categories: ["engineering", "data-science"]
            },
            {
                name: "Structural Analysis",
                icon: "fas fa-building",
                rating: 4,
                description: "Designed 5 major building structures",
                experience: "4+ years",
                categories: ["engineering"]
            },
            {
                name: "Machine Learning",
                icon: "fas fa-brain",
                rating: 4,
                description: "Developed predictive models with 90%+ accuracy",
                experience: "3+ years",
                categories: ["data-science"]
            },
            {
                name: "ROS",
                icon: "fas fa-robot",
                rating: 3,
                description: "Built 3 autonomous robot prototypes",
                experience: "2+ years",
                categories: ["robotics"]
            },
            {
                name: "Graphic Design",
                icon: "fas fa-palette",
                rating: 4,
                description: "Created branding for 15+ companies",
                experience: "4+ years",
                categories: ["design"]
            },
            {
                name: "UI/UX Design",
                icon: "fas fa-desktop",
                rating: 4,
                description: "Designed user interfaces for web and mobile apps",
                experience: "3+ years",
                categories: ["design"]
            },
            {
                name: "AutoCAD",
                icon: "fas fa-drafting-compass",
                rating: 5,
                description: "Developed detailed technical drawings for construction",
                experience: "5+ years",
                categories: ["engineering", "design"]
            }
        ];
        
        displaySkills(demoSkills);
    }
    
    function displaySkills(skills) {
        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        skills.forEach((skill, index) => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            skillCard.setAttribute('data-category', skill.categories.join(' '));
            skillCard.setAttribute('data-aos', 'fade-up');
            skillCard.setAttribute('data-aos-delay', Math.min((index + 1) * 50, 300)); // Reduced delay for better UX
            
            // Create skill card HTML structure
            skillCard.innerHTML = `
                <div class="skill-icon">
                    <i class="${skill.icon}"></i>
                </div>
                <h3>${skill.name}</h3>
                <div class="skill-rating">
                    ${Array(5).fill().map((_, i) => 
                        `<i class="${i < skill.rating ? 'fas fa-star' : 'far fa-star'}"></i>`
                    ).join('')}
                </div>
                <p>${skill.description}</p>
                <div class="experience-years">${skill.experience}</div>
            `;
            
            fragment.appendChild(skillCard);
        });
        
        skillsGrid.appendChild(fragment);
    }
}

// Load Experience from Firebase with optimized rendering
function loadExperience() {
    const timeline = document.getElementById('experience-timeline');
    if (!timeline) return;
    
    // Show loading spinner
    timeline.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading experience...</p>
        </div>
    `;
    
    const database = firebase.database();
    const experienceRef = database.ref('experience');
    
    experienceRef.get().then((snapshot) => {
        const experiences = snapshot.val() || {};
        
        // Clear loading spinner
        timeline.innerHTML = '';
        
        if (Object.keys(experiences).length === 0) {
            displayDemoExperiences();
        } else {
            // Sort experiences by start date (newest first)
            const sortedExperiences = Object.values(experiences).sort((a, b) => {
                const yearA = parseInt(a.period.match(/\d{4}/)[0]);
                const yearB = parseInt(b.period.match(/\d{4}/)[0]);
                return yearB - yearA;
            });
            
            displayExperiences(sortedExperiences);
            createTimelineYears(sortedExperiences);
        }
    }).catch(error => {
        console.error("Error fetching experience:", error);
        timeline.innerHTML = '<p>Error loading experience data. Please try again later.</p>';
    });
    
    function displayDemoExperiences() {
        const demoExperiences = [
            {
                period: "2022 - Present",
                title: "Senior Data Scientist",
                company: "TechInnovate Inc.",
                description: "Leading a team of 5 data scientists in developing predictive models for urban infrastructure planning. Implemented ML solutions that improved efficiency by 35%.",
                tags: ["Machine Learning", "Team Leadership"],
                type: "job"
            },
            {
                period: "2020 - 2022",
                title: "Structural Engineer",
                company: "BuildWell Engineering",
                description: "Designed and analyzed structural components for commercial buildings. Developed automated tools that reduced design time by 25%.",
                tags: ["Structural Analysis", "AutoCAD"],
                type: "job"
            },
            {
                period: "2019 - 2020",
                title: "MSc in Data Science",
                company: "Tech University",
                description: "Graduated with distinction. Thesis on \"Machine Learning Applications in Structural Engineering\" received academic excellence award.",
                tags: ["Academic Research", "Data Analysis"],
                type: "education"
            },
            {
                period: "2015 - 2019",
                title: "BSc in Civil Engineering",
                company: "Engineering Institute",
                description: "Graduated summa cum laude. Led the university robotics team to national championship.",
                tags: ["Engineering Fundamentals", "Robotics Team"],
                type: "education"
            }
        ];
        
        displayExperiences(demoExperiences);
        createTimelineYears(demoExperiences);
    }
    
    function displayExperiences(experiences) {
        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        experiences.forEach((exp, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.setAttribute('data-aos', index % 2 === 0 ? 'fade-right' : 'fade-left');
            timelineItem.setAttribute('data-year', exp.period.match(/\d{4}/)[0]); // Extract year for navigation
            
            // Create timeline item HTML structure
            timelineItem.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-date">${exp.period}</div>
                    <h3>${exp.title}</h3>
                    <h4>${exp.company}</h4>
                    <p>${exp.description}</p>
                    <div class="timeline-tags">
                        ${exp.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            
            fragment.appendChild(timelineItem);
        });
        
        timeline.appendChild(fragment);
    }
    
    function createTimelineYears(experiences) {
        // Extract years from experiences
        const years = [...new Set(experiences.map(exp => {
            return exp.period.match(/\d{4}/)[0];
        }))].sort();
        
        // Create years navigation
        const timelineYears = document.createElement('div');
        timelineYears.className = 'timeline-years';
        
        years.forEach(year => {
            const yearMarker = document.createElement('div');
            yearMarker.className = 'year-marker';
            yearMarker.textContent = year;
            yearMarker.addEventListener('click', () => {
                // Find timeline item with this year
                const targetItem = document.querySelector(`.timeline-item[data-year="${year}"]`);
                if (targetItem) {
                    // Smooth scroll to item
                    targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Highlight item
                    targetItem.classList.add('highlight');
                    setTimeout(() => {
                        targetItem.classList.remove('highlight');
                    }, 2000);
                }
            });
            
            timelineYears.appendChild(yearMarker);
        });
        
        // Insert before timeline
        timeline.parentNode.insertBefore(timelineYears, timeline);
    }
}

// Load Blog Posts from Firebase with optimized rendering
function loadBlogPosts() {
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;
    
    // Show loading spinner
    blogGrid.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading blog posts...</p>
        </div>
    `;
    
    const database = firebase.database();
    const blogRef = database.ref('blogPosts');
    
    blogRef.get().then((snapshot) => {
        const posts = snapshot.val() || {};
        
        // Clear loading spinner
        blogGrid.innerHTML = '';
        
        if (Object.keys(posts).length === 0) {
            displayDemoBlogPosts();
        } else {
            displayBlogPosts(Object.values(posts));
        }
    }).catch(error => {
        console.error("Error fetching blog posts:", error);
        blogGrid.innerHTML = '<p>Error loading blog posts. Please try again later.</p>';
    });
    
    function displayDemoBlogPosts() {
        const currentDate = new Date();
        const demoPosts = [
            {
                title: "Building Autonomous Robots with ROS and TensorFlow",
                excerpt: "A comprehensive guide to integrating machine learning models with robotic operating systems.",
                imageUrl: "https://via.placeholder.com/600x400",
                category: "Robotics",
                date: new Date(2025, 4, 5).getTime(), // May 5, 2025
                url: "#",
                readTime: "8 min read"
            },
            {
                title: "Predictive Modeling for Urban Infrastructure",
                excerpt: "How data science is revolutionizing the way we design and maintain city infrastructure.",
                imageUrl: "https://via.placeholder.com/600x400",
                category: "Data Science",
                date: new Date(2025, 3, 22).getTime(), // April 22, 2025
                url: "#",
                readTime: "6 min read"
            },
            {
                title: "From Civil Engineer to Data Scientist: My Journey",
                excerpt: "Personal insights and lessons learned during my transition between fields.",
                imageUrl: "https://via.placeholder.com/600x400",
                category: "Engineering",
                date: new Date(2025, 3, 10).getTime(), // April 10, 2025
                url: "#",
                readTime: "5 min read"
            },
            {
                title: "UI/UX Design Principles for Engineering Applications",
                excerpt: "Creating intuitive interfaces for complex technical software.",
                imageUrl: "https://via.placeholder.com/600x400",
                category: "UI/UX Design",
                date: new Date(2025, 3, 1).getTime(), // April 1, 2025
                url: "#",
                readTime: "7 min read"
            }
        ];
        
        displayBlogPosts(demoPosts);
    }
    
    function displayBlogPosts(posts) {
        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        // Sort posts by date (newest first)
        posts.sort((a, b) => b.date - a.date);
        
        posts.forEach((post, index) => {
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card';
            blogCard.setAttribute('data-aos', 'fade-up');
            blogCard.setAttribute('data-aos-delay', Math.min((index + 1) * 50, 300)); // Reduced delay for better UX
            
            // Format date
            const postDate = new Date(post.date);
            const formattedDate = postDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
            });
            
            // Create blog card HTML structure
            blogCard.innerHTML = `
                <div class="blog-img">
                    <img src="${post.imageUrl}" alt="${post.title}" loading="lazy">
                    <div class="blog-category">${post.category}</div>
                </div>
                <div class="blog-content">
                    <div class="blog-date">
                        <i class="far fa-calendar-alt"></i> ${formattedDate}
                        ${post.readTime ? `<span class="read-time"><i class="far fa-clock"></i> ${post.readTime}</span>` : ''}
                    </div>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <a href="${post.url}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            `;
            
            fragment.appendChild(blogCard);
        });
        
        blogGrid.appendChild(fragment);
    }
}

// Load LinkedIn Posts from Firebase with optimized rendering
function loadLinkedInPosts() {
    const linkedinFeed = document.getElementById('linkedin-feed');
    if (!linkedinFeed) return;
    
    // Show loading spinner
    linkedinFeed.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading LinkedIn posts...</p>
        </div>
    `;
    
    const database = firebase.database();
    const linkedinRef = database.ref('linkedinPosts');
    
    linkedinRef.get().then((snapshot) => {
        const posts = snapshot.val() || {};
        
        // Clear loading spinner
        linkedinFeed.innerHTML = '';
        
        // If no LinkedIn posts found, show a message
        if (Object.keys(posts).length === 0) {
            linkedinFeed.innerHTML = `
                <div class="no-posts-message">
                    <i class="fab fa-linkedin" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 15px;"></i>
                    <p>LinkedIn posts will appear here once added through the admin interface.</p>
                </div>
            `;
        } else {
            // Create a container for the LinkedIn posts
            const postsContainer = document.createElement('div');
            postsContainer.className = 'linkedin-posts-container';
            
            Object.values(posts).forEach(post => {
                // Create a wrapper for each LinkedIn post
                const postWrapper = document.createElement('div');
                postWrapper.className = 'linkedin-post-wrapper';
                
                // Insert the embed code
                postWrapper.innerHTML = post.embedCode;
                
                postsContainer.appendChild(postWrapper);
            });
            
            linkedinFeed.appendChild(postsContainer);
            
            // Load LinkedIn SDK if needed
            loadLinkedInSDK();
        }
    }).catch(error => {
        console.error("Error fetching LinkedIn posts:", error);
        linkedinFeed.innerHTML = '<p>Error loading LinkedIn posts. Please try again later.</p>';
    });
    
    function loadLinkedInSDK() {
        if (!document.getElementById('linkedin-sdk')) {
            const script = document.createElement('script');
            script.id = 'linkedin-sdk';
            script.src = 'https://platform.linkedin.com/in.js';
            script.type = 'text/javascript';
            document.head.appendChild(script);
        }
    }
}

// Setup real-time listeners for dynamic content
function setupRealTimeListeners() {
    const database = firebase.database();
    
    // Listen for current project updates
    const currentProjectRef = database.ref('currentProject');
    const currentProjectElement = document.getElementById('current-project');
    
    if (currentProjectElement) {
        currentProjectRef.on('value', (snapshot) => {
            const projectName = snapshot.val() || 'AI-Powered Robotics Platform';
            currentProjectElement.textContent = projectName;
        });
    }
    
    // Listen for visitor count updates
    const visitorCountRef = database.ref('visitorCount');
    const visitorCountElement = document.getElementById('visitor-count');
    
    if (visitorCountElement) {
        // Increment visitor count
        visitorCountRef.transaction(function(currentCount) {
            return (currentCount || 0) + 1;
        });
        
        visitorCountRef.on('value', (snapshot) => {
            const count = snapshot.val() || 1024;
            animateCounter(visitorCountElement, count);
        });
    }
    
    // Listen for projects count updates
    const projectsCountRef = database.ref('projects');
    const projectsCountElement = document.getElementById('projects-count');
    
    if (projectsCountElement) {
        projectsCountRef.on('value', (snapshot) => {
            const projects = snapshot.val() || {};
            const count = Object.keys(projects).length || 12;
            animateCounter(projectsCountElement, count);
        });
    }
    
    // Listen for experience years updates
    const experienceYearsElement = document.getElementById('experience-years');
    
    if (experienceYearsElement) {
        // Calculate years based on current date
        const currentDate = new Date();
        const startYear = 2020; // Example start year
        const years = currentDate.getFullYear() - startYear;
        
        experienceYearsElement.textContent = `${years}+`;
    }
}

// Animate counter with optimized performance
function animateCounter(element, targetCount) {
    // Skip animation for small numbers or on mobile
    if (targetCount < 10 || window.innerWidth < 768) {
        element.textContent = targetCount.toLocaleString();
        return;
    }
    
    const duration = 1500; // 1.5 seconds
    const frameDuration = 1000 / 30; // 30fps for better performance
    const totalFrames = Math.round(duration / frameDuration);
    
    let frame = 0;
    const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const increment = (targetCount - startValue) / totalFrames;
    
    const counter = setInterval(() => {
        frame++;
        const currentCount = Math.floor(startValue + increment * frame);
        element.textContent = currentCount.toLocaleString();
        
        if (frame === totalFrames) {
            clearInterval(counter);
            element.textContent = targetCount.toLocaleString();
        }
    }, frameDuration);
}

// Format timestamp to "time ago" string
function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    
    if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (weeks > 0) {
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        return 'just now';
    }
}

// Mobile and tablet optimizations
function initResponsiveOptimizations() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    // Adjust layout based on device
    if (isMobile || isTablet) {
        // Reduce animation complexity
        document.body.classList.add('reduce-motion');
        
        // Optimize images
        optimizeImages();
        
        // Adjust grid layouts
        adjustGridLayouts();
    }
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            adjustGridLayouts();
        }, 300);
    });
    
    // Add touch-friendly interactions
    if ('ontouchstart' in window) {
        addTouchInteractions();
    }
}

function optimizeImages() {
    // Replace large images with smaller versions on mobile
    const images = document.querySelectorAll('img:not([data-no-optimize])');
    
    images.forEach(img => {
        // Add loading="lazy" for better performance
        img.setAttribute('loading', 'lazy');
        
        // Replace high-res images with lower-res versions
        if (img.src.includes('placeholder')) {
            const width = window.innerWidth < 768 ? 400 : 600;
            const height = window.innerWidth < 768 ? 300 : 400;
            img.src = img.src.replace(/\d+x\d+/, `${width}x${height}`);
        }
        
        // Add error handling
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
        };
    });
}

function adjustGridLayouts() {
    // Adjust grid layouts for better mobile display
    const grids = document.querySelectorAll('.projects-grid, .skills-grid, .blog-grid, .design-showcase-grid');
    
    grids.forEach(grid => {
        if (window.innerWidth < 768) {
            grid.style.gridTemplateColumns = '1fr';
        } else if (window.innerWidth < 1024) {
            grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else {
            grid.style.gridTemplateColumns = '';  // Reset to CSS default
        }
    });
    
    // Adjust contact container for mobile
    const contactContainer = document.querySelector('.contact-container');
    if (contactContainer) {
        if (window.innerWidth < 1024) {
            contactContainer.style.gridTemplateColumns = '1fr';
        } else {
            contactContainer.style.gridTemplateColumns = '';
        }
    }
}

function addTouchInteractions() {
    // Add active states for touch interactions
    const interactiveElements = document.querySelectorAll('button, .btn, .nav-link, .card, .project-card, .blog-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        }, { passive: true });
    });
    
    // Improve touch targets
    const smallButtons = document.querySelectorAll('.social-link, .github-link');
    smallButtons.forEach(button => {
        button.style.minHeight = '44px';
        button.style.minWidth = '44px';
    });
}

// Initialize design filter functionality
function initDesignFilter() {
    const filterButtons = document.querySelectorAll('.design-filter .filter-btn');
    const designCards = document.querySelectorAll('.design-card');
    
    if (filterButtons.length === 0 || designCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter design cards
            designCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Load Design Showcase from Firebase
function loadDesignShowcase() {
    const designGrid = document.getElementById('design-showcase-grid');
    if (!designGrid) return;
    
    designGrid.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading design projects...</p>
        </div>
    `;
    
    const database = firebase.database();
    const designRef = database.ref('designProjects');
    
    designRef.get().then((snapshot) => {
        const designs = snapshot.val() || {};
        
        designGrid.innerHTML = '';
        
        if (Object.keys(designs).length === 0) {
            displayDemoDesigns();
        } else {
            displayDesigns(Object.values(designs));
        }
    }).catch(error => {
        console.error("Error fetching designs:", error);
        designGrid.innerHTML = '<p>Error loading design projects. Please try again later.</p>';
    });
}

function displayDemoDesigns() {
    const demoDesigns = [
        {
            id: "design1",
            title: "Modern Corporate Identity",
            description: "Complete brand identity design including logo, business cards, and stationery.",
            imageUrl: "https://via.placeholder.com/600x400",
            category: "Graphic Design",
            tools: ["Illustrator", "Photoshop", "InDesign"],
            externalUrl: "#"
        },
        {
            id: "design2",
            title: "E-commerce Mobile App",
            description: "User-centered mobile shopping experience with intuitive navigation and checkout flow.",
            imageUrl: "https://via.placeholder.com/600x400",
            category: "UI/UX Design",
            tools: ["Figma", "Sketch", "Principle"],
            externalUrl: "#"
        },
        {
            id: "design3",
            title: "Residential Building Design",
            description: "3D architectural visualization and floor plans for a modern residential complex.",
            imageUrl: "https://via.placeholder.com/600x400",
            category: "AutoCAD",
            tools: ["AutoCAD", "Revit", "3ds Max"],
            externalUrl: "#"
        },
        {
            id: "design4",
            title: "Product Packaging Design",
            description: "Creative packaging solution for an organic food brand with sustainable materials.",
            imageUrl: "https://via.placeholder.com/600x400",
            category: "Graphic Design",
            tools: ["Illustrator", "Photoshop", "Dimension"],
            externalUrl: "#"
        }
    ];
    
    displayDesigns(demoDesigns);
}

function displayDesigns(designs) {
    const designGrid = document.getElementById('design-showcase-grid');
    const fragment = document.createDocumentFragment();
    
    designs.forEach((design, index) => {
        const designCard = document.createElement('div');
        designCard.className = 'design-card';
        designCard.setAttribute('data-category', design.category);
        designCard.setAttribute('data-aos', 'fade-up');
        designCard.setAttribute('data-aos-delay', Math.min((index + 1) * 50, 300));
        
        designCard.innerHTML = `
            <div class="design-image-container">
                <img src="${design.imageUrl}" alt="${design.title}" loading="lazy" class="design-image">
                <div class="design-overlay">
                    <div class="design-actions">
                        <button class="view-design-btn" data-id="${design.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <a href="${design.externalUrl || '#'}" class="external-link" ${design.externalUrl ? 'target="_blank"' : ''}>
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="design-content">
                <h3 class="design-title">${design.title}</h3>
                <div class="design-category">${design.category}</div>
                <p class="design-description">${design.description}</p>
                <div class="design-tools">
                    ${design.tools.map(tool => `<span class="design-tool">${tool}</span>`).join('')}
                </div>
            </div>
        `;
        
        fragment.appendChild(designCard);
    });
    
    designGrid.appendChild(fragment);
    
    // Initialize modal viewer for designs
    initDesignViewer();
}

// Initialize design viewer modal
function initDesignViewer() {
    const modal = document.getElementById('design-modal');
    const modalImg = document.getElementById('design-modal-image');
    const modalTitle = document.getElementById('design-modal-title');
    const modalDesc = document.getElementById('design-modal-description');
    const modalTools = document.getElementById('design-modal-tools');
    const closeBtn = document.querySelector('.close-modal');
    
    if (!modal || !modalImg || !modalTitle || !modalDesc || !modalTools || !closeBtn) return;
    
    // Get all view buttons
    const viewButtons = document.querySelectorAll('.view-design-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const designId = this.getAttribute('data-id');
            const designCard = this.closest('.design-card');
            
            // Get design details
            const image = designCard.querySelector('.design-image').src;
            const title = designCard.querySelector('.design-title').textContent;
            const description = designCard.querySelector('.design-description').textContent;
            const toolsElements = designCard.querySelectorAll('.design-tool');
            
            // Set modal content
            modalImg.src = image;
            modalTitle.textContent = title;
            modalDesc.textContent = description;
            
            // Set tools
            modalTools.innerHTML = '';
            toolsElements.forEach(tool => {
                const toolElement = document.createElement('span');
                toolElement.className = 'design-tool';
                toolElement.textContent = tool.textContent;
                modalTools.appendChild(toolElement);
            });
            
            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Close modal with Escape key
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

// Add responsive design best practices for mobile optimization
window.addEventListener('load', function() {
    // Initialize responsive optimizations
    initResponsiveOptimizations();
    
    // Add viewport-specific adjustments
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    if (isMobile) {
        // Optimize images for mobile
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src.includes('placeholder')) {
                // Replace placeholder with smaller image for mobile
                img.src = img.src.replace('600x400', '400x300');
            }
        });
    }
    
    // Add touch support for mobile devices
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Add active state for touch devices
        const buttons = document.querySelectorAll('button, .btn, .nav-link, .social-link');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.classList.add('active-touch');
            }, { passive: true });
            
            button.addEventListener('touchend', function() {
                this.classList.remove('active-touch');
            }, { passive: true });
        });
    }
});

