// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initFirebase();
    initThemeToggle();
    initTabs();
    initPasswordToggle();
    initForms();
    initAnimatedBackground();
    
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
});

// Firebase Configuration
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
    
    // Setup authentication state observer
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            console.log("User is signed in:", user.email);
            
            // Check if user has admin role (custom claims)
            user.getIdTokenResult().then((idTokenResult) => {
                if (idTokenResult.claims.admin) {
                    console.log("User has admin role");
                }
            });
            
            // If on auth page, redirect to main page
            if (window.location.pathname.includes('auth.html')) {
                showSuccessModal('Successfully Signed In', 'Redirecting you to the main page...', function() {
                    window.location.href = 'mainpage.html';
                });
            }
        } else {
            // User is signed out
            console.log("User is signed out");
        }
    });
}

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

// Tab Switching
function initTabs() {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authContents = document.querySelectorAll('.auth-content');
    const switchTabLinks = document.querySelectorAll('.switch-tab');
    const forgotPasswordLink = document.getElementById('forgot-password');
    
    // Tab button click
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchToTab(tabId);
        });
    });
    
    // Switch tab links
    switchTabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            switchToTab(tabId);
        });
    });
    
    // Forgot password link
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            switchToTab('reset');
        });
    }
    
    // Function to switch tabs
    function switchToTab(tabId) {
        // Update active tab
        authTabs.forEach(tab => {
            if (tab.getAttribute('data-tab') === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Show corresponding content
        authContents.forEach(content => {
            if (content.id === `${tabId}-content`) {
                fadeIn(content);
            } else {
                content.style.display = 'none';
            }
        });
    }
    
    // Helper function for fade in animation
    function fadeIn(element) {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        let opacity = 0;
        const timer = setInterval(function() {
            if (opacity >= 1) {
                clearInterval(timer);
            }
            element.style.opacity = opacity;
            opacity += 0.1;
        }, 20);
    }
}

// Password Toggle
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
            
            // Add focus back to input
            input.focus();
        });
    });
}

// Form Handling
function initForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const resetForm = document.getElementById('reset-form');
    const googleBtn = document.querySelector('.google-btn');
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorElement = document.getElementById('login-error');
            
            // Clear previous errors
            errorElement.textContent = '';
            
            // Validate inputs
            if (!email || !password) {
                errorElement.textContent = 'Please enter both email and password';
                shakeElement(loginForm);
                return;
            }
            
            // Show loading state
            const submitBtn = loginForm.querySelector('.auth-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
            submitBtn.disabled = true;
            
            // Sign in with Firebase
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in
                    console.log("User signed in successfully");
                    // Redirect will happen via auth state observer
                })
                .catch((error) => {
                    console.error("Login error:", error);
                    errorElement.textContent = error.message;
                    shakeElement(loginForm);
                    
                    // Reset button
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
    
    // Registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm').value;
            const errorElement = document.getElementById('register-error');
            
            // Clear previous errors
            errorElement.textContent = '';
            
            // Validate inputs
            if (!name || !email || !password || !confirmPassword) {
                errorElement.textContent = 'Please fill in all fields';
                shakeElement(registerForm);
                return;
            }
            
            if (password !== confirmPassword) {
                errorElement.textContent = 'Passwords do not match';
                shakeElement(registerForm);
                return;
            }
            
            // Check if email is from gmail.com domain
            if (!email.endsWith('@gmail.com')) {
                errorElement.textContent = 'Only @gmail.com email addresses are allowed';
                shakeElement(registerForm);
                return;
            }
            
            // Show loading state
            const submitBtn = registerForm.querySelector('.auth-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            submitBtn.disabled = true;
            
            // Create user with Firebase
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Update profile with name
                    return userCredential.user.updateProfile({
                        displayName: name
                    });
                })
                .then(() => {
                    // Save user data to Firestore
                    const user = firebase.auth().currentUser;
                    return firebase.firestore().collection('users').doc(user.uid).set({
                        name: name,
                        email: email,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        isAdmin: false // Default role is not admin
                    });
                })
                .then(() => {
                    console.log("User registered successfully");
                    showSuccessModal('Account Created', 'Your account has been created successfully. You will be redirected to the main page.', function() {
                        window.location.href = 'mainpage.html';
                    });
                })
                .catch((error) => {
                    console.error("Registration error:", error);
                    errorElement.textContent = error.message;
                    shakeElement(registerForm);
                    
                    // Reset button
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
    
    // Password reset form submission
    if (resetForm) {
        resetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('reset-email').value;
            const errorElement = document.getElementById('reset-error');
            
            // Clear previous errors
            errorElement.textContent = '';
            
            // Validate input
            if (!email) {
                errorElement.textContent = 'Please enter your email address';
                shakeElement(resetForm);
                return;
            }
            
            // Show loading state
            const submitBtn = resetForm.querySelector('.auth-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Send password reset email
            firebase.auth().sendPasswordResetEmail(email)
                .then(() => {
                    console.log("Password reset email sent");
                    showSuccessModal('Email Sent', 'Password reset instructions have been sent to your email address. Please check your inbox.', function() {
                        // Switch back to login tab
                        document.querySelector('.auth-tab[data-tab="login"]').click();
                    });
                })
                .catch((error) => {
                    console.error("Password reset error:", error);
                    errorElement.textContent = error.message;
                    shakeElement(resetForm);
                    
                    // Reset button
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
    
    // Google sign-in
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            const provider = new firebase.auth.GoogleAuthProvider();
            
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    // Check if email is from gmail.com domain
                    const email = result.user.email;
                    if (!email.endsWith('@gmail.com')) {
                        // Sign out the user
                        firebase.auth().signOut();
                        throw new Error('Only @gmail.com email addresses are allowed');
                    }
                    
                    // Check if this is a new user
                    const isNewUser = result.additionalUserInfo.isNewUser;
                    
                    if (isNewUser) {
                        // Save user data to Firestore
                        return firebase.firestore().collection('users').doc(result.user.uid).set({
                            name: result.user.displayName,
                            email: result.user.email,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            isAdmin: false // Default role is not admin
                        });
                    }
                })
                .then(() => {
                    console.log("Google sign-in successful");
                    // Redirect will happen via auth state observer
                })
                .catch((error) => {
                    console.error("Google sign-in error:", error);
                    
                    // Show error in the appropriate form
                    let errorElement;
                    if (document.getElementById('login-content').style.display !== 'none') {
                        errorElement = document.getElementById('login-error');
                    } else {
                        errorElement = document.getElementById('register-error');
                    }
                    
                    errorElement.textContent = error.message;
                });
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

// Show success modal
function showSuccessModal(title, message, callback) {
    const modal = document.getElementById('success-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalClose = document.getElementById('modal-close');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    modal.style.display = 'flex';
    
    modalClose.addEventListener('click', function() {
        modal.style.display = 'none';
        if (typeof callback === 'function') {
            callback();
        }
    });
}

// Shake element for error feedback
function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}

// Input validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
}
