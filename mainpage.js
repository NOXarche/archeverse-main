// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize libraries and components
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Initialize all components
    initThemeToggle();
    initTypingEffect();
    initNavbar();
    initParallaxEffect();
    initSkillsFilter();
    initFlipCards();
    initBackToTop();
    initLoginModal();
    initAnimatedBackground();
    init3DModel();
    initVisitorCounter();
    initKonamiCode();
    
    // Firebase initialization (if available)
    try {
        initFirebase();
    } catch (error) {
        console.error("Firebase initialization error:", error);
    }
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
        document.body.classList.toggle('dark-theme');
        
        // Save the preference
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
}

// Typing Effect
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    const phrases = [
        'Civil Engineer',
        'Data Scientist',
        'Robotics Builder'
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

// Navbar functionality
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// Parallax Effect
function initParallaxEffect() {
    // Parallax for hero section
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    
    window.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        parallaxLayers.forEach(layer => {
            const speed = layer.getAttribute('data-speed');
            const x = (window.innerWidth - mouseX * speed * 100);
            const y = (window.innerHeight - mouseY * speed * 100);
            
            layer.style.transform = `translate(${x / 100}px, ${y / 100}px)`;
        });
    });
    
    // Parallax for other sections on scroll
    const parallaxElements = document.querySelectorAll('[data-speed]');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed');
            const yPos = -(scrollTop * speed);
            
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Skills filter
function initSkillsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
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
}

// Flip Cards Interaction
function initFlipCards() {
    // Project flip cards
    const flipCards = document.querySelectorAll('.flip-card');
    
    flipCards.forEach(card => {
        card.addEventListener('click', function() {
            this.querySelector('.flip-card-inner').style.transform = 
                this.querySelector('.flip-card-inner').style.transform === 'rotateY(180deg)' 
                    ? 'rotateY(0deg)' 
                    : 'rotateY(180deg)';
        });
    });
    
    // Skill flip cards
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('click', function() {
            this.querySelector('.skill-card-inner').style.transform = 
                this.querySelector('.skill-card-inner').style.transform === 'rotateY(180deg)' 
                    ? 'rotateY(0deg)' 
                    : 'rotateY(180deg)';
        });
    });
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Login modal
function initLoginModal() {
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.querySelector('.close-modal');
    
    loginBtn.addEventListener('click', function() {
        window.location.href = 'auth.html';
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === loginModal) {
                loginModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

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

// 3D Model using Three.js
function init3DModel() {
    if (!document.getElementById('model-canvas')) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, document.getElementById('model-canvas').offsetWidth / document.getElementById('model-canvas').offsetHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(document.getElementById('model-canvas').offsetWidth, document.getElementById('model-canvas').offsetHeight);
    document.getElementById('model-canvas').appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create a geometric shape (hexagonal prism to match logo)
    const geometry = new THREE.CylinderGeometry(1, 1, 2, 6);
    
    // Create materials with different colors
    const materials = [
        new THREE.MeshPhongMaterial({ color: 0x2a2a72, flatShading: true }), // Primary color
        new THREE.MeshPhongMaterial({ color: 0x009ffd, flatShading: true }), // Secondary color
        new THREE.MeshPhongMaterial({ color: 0xff3d71, flatShading: true })  // Accent color
    ];
    
    // Create nested hexagonal prisms
    const outerPrism = new THREE.Mesh(geometry, materials[0]);
    scene.add(outerPrism);
    
    const middlePrism = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.8, 2.2, 6),
        materials[1]
    );
    scene.add(middlePrism);
    
    const innerPrism = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 2.5, 6),
        materials[2]
    );
    scene.add(innerPrism);
    
    // Position camera
    camera.position.z = 5;
    
    // Variables for rotation
    let rotationSpeed = 0.01;
    let isRotating = true;
    let isZooming = false;
    let zoomLevel = 5;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
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
    
    animate();
    
    // Control buttons
    document.getElementById('rotate-model').addEventListener('click', function() {
        isRotating = !isRotating;
        this.innerHTML = isRotating ? '<i class="fas fa-pause"></i> Pause' : '<i class="fas fa-sync"></i> Rotate';
    });
    
    document.getElementById('zoom-model').addEventListener('click', function() {
        isZooming = !isZooming;
        this.innerHTML = isZooming ? '<i class="fas fa-search-minus"></i> Zoom Out' : '<i class="fas fa-search-plus"></i> Zoom In';
    });
    
    document.getElementById('reset-model').addEventListener('click', function() {
        outerPrism.rotation.x = 0;
        outerPrism.rotation.y = 0;
        middlePrism.rotation.x = 0;
        middlePrism.rotation.y = 0;
        innerPrism.rotation.x = 0;
        innerPrism.rotation.y = 0;
        
        zoomLevel = 5;
        camera.position.z = zoomLevel;
        isZooming = false;
        document.getElementById('zoom-model').innerHTML = '<i class="fas fa-search-plus"></i> Zoom In';
    });
    
    // Resize handler
    window.addEventListener('resize', function() {
        const width = document.getElementById('model-canvas').offsetWidth;
        const height = document.getElementById('model-canvas').offsetHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}

// Visitor counter with Firebase
function initVisitorCounter() {
    const visitorCountElement = document.getElementById('visitor-count');
    
    // If Firebase is available, increment and fetch visitor count
    if (typeof firebase !== 'undefined' && firebase.database) {
        const database = firebase.database();
        const visitorCountRef = database.ref('visitorCount');
        
        // Increment visitor count
        visitorCountRef.transaction(function(currentCount) {
            return (currentCount || 0) + 1;
        });
        
        // Listen for count updates
        visitorCountRef.on('value', function(snapshot) {
            const count = snapshot.val() || 0;
            animateCounter(visitorCountElement, count);
        });
    } else {
        // Fallback if Firebase is not available
        const randomCount = Math.floor(Math.random() * 5000) + 1000;
        animateCounter(visitorCountElement, randomCount);
    }
    
    // Animate counter
    function animateCounter(element, targetCount) {
        const duration = 2000; // 2 seconds
        const frameDuration = 1000 / 60; // 60fps
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
}

// Konami Code Easter Egg
function initKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiCodePosition = 0;
    
    document.addEventListener('keydown', function(e) {
        // Get the key pressed
        const key = e.key;
        
        // Check if the key matches the next key in the Konami code
        if (key === konamiCode[konamiCodePosition]) {
            konamiCodePosition++;
            
            // If the entire code is entered correctly
            if (konamiCodePosition === konamiCode.length) {
                activateEasterEgg();
                konamiCodePosition = 0;
            }
        } else {
            konamiCodePosition = 0;
        }
    });
    
    function activateEasterEgg() {
        // Create a fun animation or effect
        const body = document.body;
        const easterEgg = document.createElement('div');
        
        easterEgg.style.position = 'fixed';
        easterEgg.style.top = '0';
        easterEgg.style.left = '0';
        easterEgg.style.width = '100%';
        easterEgg.style.height = '100%';
        easterEgg.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        easterEgg.style.zIndex = '9999';
        easterEgg.style.display = 'flex';
        easterEgg.style.justifyContent = 'center';
        easterEgg.style.alignItems = 'center';
        easterEgg.style.flexDirection = 'column';
        easterEgg.style.color = 'white';
        easterEgg.style.fontFamily = "'Press Start 2P', cursive";
        easterEgg.style.textAlign = 'center';
        
        easterEgg.innerHTML = `
            <h1 style="margin-bottom: 20px; font-size: 2rem;">KONAMI CODE ACTIVATED!</h1>
            <p style="margin-bottom: 30px;">Welcome to the Archeverse secret zone!</p>
            <div class="game-character" style="font-size: 5rem;">🚀</div>
            <button id="close-easter-egg" style="margin-top: 30px; padding: 10px 20px; background: var(--accent-color); border: none; color: white; cursor: pointer; border-radius: 5px;">Close</button>
        `;
        
        body.appendChild(easterEgg);
        
        // Animate the character
        const character = easterEgg.querySelector('.game-character');
        let position = -50;
        
        const animation = setInterval(() => {
            position += 5;
            character.style.transform = `translateX(${position}px)`;
            
            if (position > 50) {
                clearInterval(animation);
                
                // Reverse animation
                const reverseAnimation = setInterval(() => {
                    position -= 5;
                    character.style.transform = `translateX(${position}px)`;
                    
                    if (position < -50) {
                        clearInterval(reverseAnimation);
                        
                        // Repeat the animation
                        const repeatAnimation = setInterval(() => {
                            position += 5;
                            character.style.transform = `translateX(${position}px)`;
                            
                            if (position > 0) {
                                clearInterval(repeatAnimation);
                            }
                        }, 50);
                    }
                }, 50);
            }
        }, 50);
        
        // Close the easter egg
        document.getElementById('close-easter-egg').addEventListener('click', function() {
            body.removeChild(easterEgg);
        });
    }
}

// Firebase initialization
function initFirebase() {
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDQ0LKF-yCoo5k1gl_ntt8r-9tR4QBZGyE",
        authDomain: "archeverse-7d502.firebaseapp.com",
        projectId: "archeverse-7d502",
        storageBucket: "archeverse-7d502.firebasestorage.app",
        messagingSenderId: "489295358544",
        appId: "1:489295358544:web:2f3a2cb2a74c5343f17f55",
        measurementId: "G-G2QJ69V5DN"
    };
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Setup authentication listeners
    const auth = firebase.auth();
    
    // Login form submission
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    console.log("User signed in:", user);
                    
                    // Close the modal
                    document.getElementById('login-modal').style.display = 'none';
                    document.body.style.overflow = 'auto';
                    
                    // Show success message
                    alert('Successfully signed in!');
                })
                .catch((error) => {
                    console.error("Login error:", error);
                    alert(`Login failed: ${error.message}`);
                });
        });
    }
    
    // Google sign-in
    const googleLoginBtn = document.querySelector('.google-login');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function() {
            const provider = new firebase.auth.GoogleAuthProvider();
            
            auth.signInWithPopup(provider)
                .then((result) => {
                    // Close the modal
                    document.getElementById('login-modal').style.display = 'none';
                    document.body.style.overflow = 'auto';
                    
                    // Show success message
                    alert('Successfully signed in with Google!');
                })
                .catch((error) => {
                    console.error("Google login error:", error);
                    alert(`Google login failed: ${error.message}`);
                });
        });
    }
    
    // GitHub sign-in
    const githubLoginBtn = document.querySelector('.github-login');
    if (githubLoginBtn) {
        githubLoginBtn.addEventListener('click', function() {
            const provider = new firebase.auth.GithubAuthProvider();
            
            auth.signInWithPopup(provider)
                .then((result) => {
                    // Close the modal
                    document.getElementById('login-modal').style.display = 'none';
                    document.body.style.overflow = 'auto';
                    
                    // Show success message
                    alert('Successfully signed in with GitHub!');
                })
                .catch((error) => {
                    console.error("GitHub login error:", error);
                    alert(`GitHub login failed: ${error.message}`);
                });
        });
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
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
                alert('Message sent successfully!');
                contactForm.reset();
            })
            .catch((error) => {
                console.error("Error saving message:", error);
                alert(`Failed to send message: ${error.message}`);
            });
        });
    }
    
    // Newsletter signup
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input').value;
            
            // Save to Firebase
            const database = firebase.database();
            database.ref('newsletter').push({
                email: email,
                timestamp: Date.now()
            })
            .then(() => {
                alert('Successfully subscribed to the newsletter!');
                newsletterForm.reset();
            })
            .catch((error) => {
                console.error("Error subscribing to newsletter:", error);
                alert(`Failed to subscribe: ${error.message}`);
            });
        });
    }
    
    // Update project timestamps
    const updateTimeElements = document.querySelectorAll('.update-time');
    
    if (updateTimeElements.length > 0) {
        const database = firebase.database();
        const projectUpdatesRef = database.ref('projectUpdates');
        
        projectUpdatesRef.once('value')
            .then((snapshot) => {
                const updates = snapshot.val() || {};
                
                updateTimeElements.forEach((element, index) => {
                    const projectId = `project${index + 1}`;
                    const lastUpdate = updates[projectId] || Date.now() - (Math.random() * 1000000000);
                    
                    element.textContent = formatTimeAgo(lastUpdate);
                });
            })
            .catch((error) => {
                console.error("Error fetching project updates:", error);
                
                // Fallback to random times
                updateTimeElements.forEach((element) => {
                    const randomTime = getRandomTimeAgo();
                    element.textContent = randomTime;
                });
            });
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
        
        if (weeks > 0) {
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
    
    // Generate random "time ago" string for fallback
    function getRandomTimeAgo() {
        const options = [
            'just now',
            '5 minutes ago',
            '1 hour ago',
            '3 hours ago',
            'yesterday',
            '2 days ago',
            '1 week ago',
            '2 weeks ago'
        ];
        
        return options[Math.floor(Math.random() * options.length)];
    }
}
