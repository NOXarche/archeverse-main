document.addEventListener('DOMContentLoaded', function() {
    // Initialize visitor counter
    let visitorCount = localStorage.getItem('visitorCount') || 0;
    visitorCount = parseInt(visitorCount) + 1;
    localStorage.setItem('visitorCount', visitorCount);
    
    // Display visitor count with animation
    const counterElement = document.getElementById('visitor-count');
    let currentCount = 0;
    const interval = setInterval(() => {
        if (currentCount < visitorCount) {
            currentCount++;
            counterElement.textContent = currentCount;
            // Optional: Add bone cracking sound effect here
        } else {
            clearInterval(interval);
        }
    }, 100);
    
    // CTA button effect
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', () => {
        // Add your navigation logic here
        console.log('Joining the expedition...');
        // Example: window.location.href = 'main.html';
        
        // Wall Maria Gate Transition animation could go here
        document.body.classList.add('gate-opening');
        setTimeout(() => {
            // Navigate after animation completes
            // window.location.href = 'main.html';
        }, 2000);
    });
    
    // Titan eye glow on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const heroHeight = document.querySelector('.hero-section').offsetHeight;
        
        if (scrollPosition > heroHeight * 0.7) {
            // Create titan eyes if they don't exist
            if (!document.querySelector('.titan-eyes')) {
                const titanEyes = document.createElement('div');
                titanEyes.classList.add('titan-eyes');
                
                const leftEye = document.createElement('div');
                leftEye.classList.add('titan-eye', 'left-eye');
                
                const rightEye = document.createElement('div');
                rightEye.classList.add('titan-eye', 'right-eye');
                
                titanEyes.appendChild(leftEye);
                titanEyes.appendChild(rightEye);
                
                document.querySelector('.hero-section').appendChild(titanEyes);
                
                // Optional: Add Titan roar sound effect here
                setTimeout(() => {
                    titanEyes.classList.add('active');
                }, 100);
            }
        }
    });
    
    // Scout Regiment Logo Easter Egg
    let logoClickCount = 0;
    const scoutLogo = document.querySelector('.scout-logo');
    
    scoutLogo.addEventListener('click', () => {
        logoClickCount++;
        
        if (logoClickCount === 3) {
            // Play "Sasageyo!" or display a message
            alert('SASAGEYO! SHINZOU WO SASAGEYO!');
            logoClickCount = 0;
        }
    });
    
    // Add ODM gear zipping sound on button hovers
    const buttons = document.querySelectorAll('button, .nav-item, .social-link');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            // Optional: Play ODM gear zipping sound
            playZipSound();
        });
    });
    
    // Function to simulate ODM gear zipping sound
    function playZipSound() {
        // This is just a placeholder. In a real implementation,
        // you would use the Web Audio API or a library like Howler.js
        console.log('Zip sound played');
    }
    
    // Mobile navigation toggle
    const navLogo = document.querySelector('.nav-logo');
    const navItems = document.querySelector('.nav-items');
    
    navLogo.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navItems.style.display = navItems.style.display === 'flex' ? 'none' : 'flex';
        }
    });
    
    // Resize handler for navigation
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navItems.style.display = 'flex';
        } else {
            navItems.style.display = 'none';
        }
    });
    
    // Add CSS for Titan eyes (dynamically added on scroll)
    const style = document.createElement('style');
    style.textContent = `
        .titan-eyes {
            position: absolute;
            bottom: 10%;
            right: 10%;
            display: flex;
            gap: 20px;
            opacity: 0;
            transition: opacity 1s ease;
        }
        
        .titan-eyes.active {
            opacity: 1;
        }
        
        .titan-eye {
            width: 30px;
            height: 15px;
            background: radial-gradient(
                ellipse at center,
                rgba(163, 22, 33, 1) 0%,
                rgba(163, 22, 33, 0.7) 40%,
                rgba(163, 22, 33, 0) 70%
            );
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(163, 22, 33, 0.8);
        }
        
        .gate-opening {
            animation: gateOpen 2s forwards;
        }
        
        @keyframes gateOpen {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
