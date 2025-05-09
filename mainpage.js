// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Initialize other functions
    initThemeToggle();
    initTypingEffect();
    initNavbar();
    initSkillsFilter();
    initSkillCards();
    initBackToTop();
    initLoginModal();
    initParticles();
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

// Skill cards flip effect
function initSkillCards() {
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
        loginModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
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

// Particles background
function initParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = `${Math.random() * 5 + 2}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        
        particlesContainer.appendChild(particle);
        
        // Animate each particle
        animateParticle(particle);
    }
    
    function animateParticle(particle) {
        const duration = Math.random() * 15 + 5;
        const xMove = Math.random() * 50 - 25;
        const yMove = Math.random() * 50 - 25;
        
        particle.animate([
            { transform: 'translate(0, 0)', opacity: 0.2 },
            { transform: `translate(${xMove}px, ${yMove}px)`, opacity: 0.8, offset: 0.5 },
            { transform: 'translate(0, 0)', opacity: 0.2 }
        ], {
            duration: duration * 1000,
            iterations: Infinity,
            easing: 'ease-in-out'
        });
    }
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
            visitorCountElement.textContent = count.toLocaleString();
        });
    } else {
        // Fallback if Firebase is not available
        const randomCount = Math.floor(Math.random() * 5000) + 1000;
        visitorCountElement.textContent = randomCount.toLocaleString();
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
        easterEgg.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
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
            <p style="margin-bottom: 30px;">You found the secret easter egg!</p>
            <div class="game-character" style="font-size: 5rem;">🚀</div>
            <button id="close-easter-egg" style="margin-top: 30px; padding: 10px 20px; background: #ff3d71; border: none; color: white; cursor: pointer; border-radius: 5px;">Close</button>
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
    // Replace with your Firebase config
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
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
