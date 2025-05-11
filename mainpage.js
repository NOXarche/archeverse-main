// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize libraries and components
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
    initFlipCards();
    initBackToTop();
    initAnimatedBackground();
    init3DModel();
    
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
            if (!element.classList.contains('parallax-layer')) {
                const speed = element.getAttribute('data-speed');
                const yPos = -(scrollTop * speed);
                
                element.style.transform = `translateY(${yPos}px)`;
            }
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

// Animated Background with Particles
function initAnimatedBackground() {
    const particlesContainer = document.querySelector('.particles-container');
    
    // Reduce particle count on mobile for better performance
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    
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
    const rotateBtn = document.getElementById('rotate-model');
    const zoomBtn = document.getElementById('zoom-model');
    const resetBtn = document.getElementById('reset-model');
    
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
    
    // Resize handler
    window.addEventListener('resize', function() {
        const width = document.getElementById('model-canvas').offsetWidth;
        const height = document.getElementById('model-canvas').offsetHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}

// Firebase initialization
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
    
    // Initialize Analytics
    firebase.analytics();
    
    // Load dynamic content from Firebase
    loadProjects();
    loadSkills();
    loadExperience();
    loadBlogPosts();
    loadLinkedInPosts();
    setupRealTimeListeners();
    
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
}

// Load Projects from Firebase
function loadProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    const database = firebase.database();
    const projectsRef = database.ref('projects');
    
    projectsRef.on('value', (snapshot) => {
        const projects = snapshot.val() || {};
        projectsGrid.innerHTML = ''; // Clear existing projects
        
        // If no projects found, create demo projects
        if (Object.keys(projects).length === 0) {
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
            
            // Display demo projects
            displayProjects(demoProjects);
        } else {
            // Display projects from Firebase
            displayProjects(Object.values(projects));
        }
    });
    
    function displayProjects(projects) {
        projects.forEach((project, index) => {
            const isLive = project.status === 'live';
            
            const projectCard = document.createElement('div');
            projectCard.className = 'flip-card';
            projectCard.setAttribute('data-aos', 'fade-up');
            projectCard.setAttribute('data-aos-delay', (index + 1) * 100);
            
            // Create project card HTML structure
            projectCard.innerHTML = `
                <div class="flip-card-inner">
                    <div class="flip-card-front">
                        <img src="${project.imageUrl}" alt="${project.title}">
                        ${isLive ? '<div class="live-badge"><span class="live-dot"></span>LIVE</div>' : ''}
                        <div class="flip-card-title">
                            <h3>${project.title}</h3>
                            <p class="flip-hint">Click to flip</p>
                        </div>
                    </div>
                    <div class="flip-card-back">
                        <div class="flip-card-content">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            <div class="tech-stack">
                                ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                            </div>
                            <div class="project-links">
                                <a href="${project.detailsUrl}" class="project-btn">View Details</a>
                                <a href="${project.githubUrl}" class="github-link"><i class="fab fa-github"></i></a>
                            </div>
                            <div class="last-updated">
                                <small>Last updated: <span class="update-time">${formatTimeAgo(project.lastUpdated)}</span></small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            projectsGrid.appendChild(projectCard);
        });
        
        // Reinitialize flip cards
        initFlipCards();
    }
}

// Load Skills from Firebase
function loadSkills() {
    const skillsGrid = document.getElementById('skills-grid');
    if (!skillsGrid) return;
    
    const database = firebase.database();
    const skillsRef = database.ref('skills');
    
    skillsRef.on('value', (snapshot) => {
        const skills = snapshot.val() || {};
        skillsGrid.innerHTML = ''; // Clear existing skills
        
        // If no skills found, create demo skills
        if (Object.keys(skills).length === 0) {
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
                }
            ];
            
            // Display demo skills
            displaySkills(demoSkills);
        } else {
            // Display skills from Firebase
            displaySkills(Object.values(skills));
        }
    });
    
    function displaySkills(skills) {
        skills.forEach((skill, index) => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            skillCard.setAttribute('data-category', skill.categories.join(' '));
            skillCard.setAttribute('data-aos', 'fade-up');
            skillCard.setAttribute('data-aos-delay', (index + 1) * 100);
            
            // Create skill card HTML structure
            skillCard.innerHTML = `
                <div class="skill-card-inner">
                    <div class="skill-card-front">
                        <div class="skill-icon">
                            <i class="${skill.icon}"></i>
                        </div>
                        <h3>${skill.name}</h3>
                    </div>
                    <div class="skill-card-back">
                        <div class="skill-rating">
                            ${Array(5).fill().map((_, i) => 
                                `<i class="${i < skill.rating ? 'fas fa-star' : 'far fa-star'}"></i>`
                            ).join('')}
                        </div>
                        <p>${skill.description}</p>
                        <div class="experience-years">${skill.experience}</div>
                    </div>
                </div>
            `;
            
            skillsGrid.appendChild(skillCard);
        });
        
        // Reinitialize skill cards
        initFlipCards();
    }
}

// Load Experience from Firebase
function loadExperience() {
    const timeline = document.getElementById('experience-timeline');
    if (!timeline) return;
    
    const database = firebase.database();
    const experienceRef = database.ref('experience');
    
    experienceRef.on('value', (snapshot) => {
        const experiences = snapshot.val() || {};
        timeline.innerHTML = ''; // Clear existing experiences
        
        // If no experiences found, create demo experiences
        if (Object.keys(experiences).length === 0) {
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
            
            // Display demo experiences
            displayExperiences(demoExperiences);
        } else {
            // Display experiences from Firebase
            displayExperiences(Object.values(experiences));
        }
    });
    
    function displayExperiences(experiences) {
        experiences.forEach((exp, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.setAttribute('data-aos', index % 2 === 0 ? 'fade-right' : 'fade-left');
            
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
            
            timeline.appendChild(timelineItem);
        });
    }
}

// Load Blog Posts from Firebase
function loadBlogPosts() {
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;
    
    const database = firebase.database();
    const blogRef = database.ref('blogPosts');
    
    blogRef.on('value', (snapshot) => {
        const posts = snapshot.val() || {};
        blogGrid.innerHTML = ''; // Clear existing posts
        
        // If no posts found, create demo posts
        if (Object.keys(posts).length === 0) {
            const currentDate = new Date();
            const demoPosts = [
                {
                    title: "Building Autonomous Robots with ROS and TensorFlow",
                    excerpt: "A comprehensive guide to integrating machine learning models with robotic operating systems.",
                    imageUrl: "https://via.placeholder.com/600x400",
                    category: "Robotics",
                    date: new Date(2025, 4, 5).getTime(), // May 5, 2025
                    url: "#"
                },
                {
                    title: "Predictive Modeling for Urban Infrastructure",
                    excerpt: "How data science is revolutionizing the way we design and maintain city infrastructure.",
                    imageUrl: "https://via.placeholder.com/600x400",
                    category: "Data Science",
                    date: new Date(2025, 3, 22).getTime(), // April 22, 2025
                    url: "#"
                },
                {
                    title: "From Civil Engineer to Data Scientist: My Journey",
                    excerpt: "Personal insights and lessons learned during my transition between fields.",
                    imageUrl: "https://via.placeholder.com/600x400",
                    category: "Engineering",
                    date: new Date(2025, 3, 10).getTime(), // April 10, 2025
                    url: "#"
                }
            ];
            
            // Display demo posts
            displayBlogPosts(demoPosts);
        } else {
            // Display posts from Firebase
            displayBlogPosts(Object.values(posts));
        }
    });
    
    function displayBlogPosts(posts) {
        posts.forEach((post, index) => {
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card';
            blogCard.setAttribute('data-aos', 'fade-up');
            blogCard.setAttribute('data-aos-delay', (index + 1) * 100);
            
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
                    <img src="${post.imageUrl}" alt="${post.title}">
                    <div class="blog-category">${post.category}</div>
                </div>
                <div class="blog-content">
                    <div class="blog-date">${formattedDate}</div>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                    <a href="${post.url}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            `;
            
            blogGrid.appendChild(blogCard);
        });
    }
}

// Load LinkedIn Posts from Firebase
function loadLinkedInPosts() {
    const linkedinFeed = document.getElementById('linkedin-feed');
    if (!linkedinFeed) return;
    
    const database = firebase.database();
    const linkedinRef = database.ref('linkedinPosts');
    
    linkedinRef.on('value', (snapshot) => {
        const posts = snapshot.val() || {};
        linkedinFeed.innerHTML = ''; // Clear existing posts
        
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
