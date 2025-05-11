// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        disable: window.innerWidth < 768
    });

    // Initialize components
    initThemeToggle();
    initNavbar();
    initBackToTop();
    initAnimatedBackground();
    initTabSwitching();
    initModals();
    
    // Firebase initialization and admin check
    initFirebaseAndCheckAdmin();
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

// Navbar functionality
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
    
    // Mobile menu toggle
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

// Back to top button
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

// Animated Background
function initAnimatedBackground() {
    const particlesContainer = document.querySelector('.particles-container');
    const starsContainer = document.querySelector('.stars-container');
    
    if (!particlesContainer || !starsContainer) return;
    
    // Reduce particle count for better performance
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
}

// Tab Switching
function initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length === 0 || tabContents.length === 0) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Show selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).style.display = 'block';
        });
    });
}

// Modal functionality
function initModals() {
    const modals = document.querySelectorAll('.admin-modal');
    const modalTriggers = {
        'add-project-btn': 'add-project-modal',
        'add-admin-btn': 'add-admin-modal',
        'add-skill-btn': 'add-skill-modal',
        'add-blog-btn': 'add-blog-modal',
        'add-design-btn': 'add-design-modal'
    };
    
    // Setup modal triggers
    Object.keys(modalTriggers).forEach(triggerId => {
        const trigger = document.getElementById(triggerId);
        const modalId = modalTriggers[triggerId];
        
        if (trigger && document.getElementById(modalId)) {
            trigger.addEventListener('click', function() {
                document.getElementById(modalId).style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        }
    });
    
    // Setup close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.admin-modal');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close modal with Escape key
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }
    });
    
    // Initialize form submissions
    initFormSubmissions();
}

// Form submissions
function initFormSubmissions() {
    // Add project form
    const addProjectForm = document.getElementById('add-project-form');
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const title = document.getElementById('project-title').value;
            const description = document.getElementById('project-description').value;
            const imageUrl = document.getElementById('project-image').value;
            const technologies = document.getElementById('project-technologies').value.split(',').map(tech => tech.trim());
            const githubUrl = document.getElementById('project-github').value;
            const status = document.getElementById('project-status').value;
            
            // Save to Firebase
            const database = firebase.database();
            database.ref('projects').push({
                title: title,
                description: description,
                imageUrl: imageUrl,
                technologies: technologies,
                githubUrl: githubUrl,
                status: status,
                lastUpdated: Date.now()
            })
            .then(() => {
                // Close modal and reset form
                document.getElementById('add-project-modal').style.display = 'none';
                document.body.style.overflow = '';
                addProjectForm.reset();
                
                // Refresh projects list
                loadProjects();
            })
            .catch(error => {
                console.error("Error adding project:", error);
                alert(`Failed to add project: ${error.message}`);
            });
        });
    }
    
    // Add admin form
    const addAdminForm = document.getElementById('add-admin-form');
    if (addAdminForm) {
        addAdminForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('admin-email').value;
            
            // Call the Cloud Function to set admin privileges
            const functions = firebase.functions();
            const addAdminRole = functions.httpsCallable('addAdminRole');
            
            addAdminRole({ email: email })
                .then(result => {
                    console.log(result);
                    alert(`Success! ${email} has been made an admin.`);
                    
                    // Close modal and reset form
                    document.getElementById('add-admin-modal').style.display = 'none';
                    document.body.style.overflow = '';
                    addAdminForm.reset();
                    
                    // Refresh users list
                    loadUsers();
                })
                .catch(error => {
                    console.error("Error adding admin:", error);
                    alert(`Failed to add admin: ${error.message}`);
                });
        });
    }
}

// Firebase initialization and admin check
function initFirebaseAndCheckAdmin() {
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
    
    // Check if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        const authCheckDiv = document.getElementById('admin-auth-check');
        const adminDashboard = document.getElementById('admin-dashboard');
        const contentManagement = document.getElementById('content-management');
        const userManagement = document.getElementById('user-management');
        const accessDenied = document.getElementById('access-denied');
        
        if (user) {
            // User is signed in, now check if they're an admin using token claims
            user.getIdTokenResult()
                .then(idTokenResult => {
                    // Check if the user has admin claim
                    const isAdmin = idTokenResult.claims.admin === true;
                    
                    // Hide auth check div
                    authCheckDiv.style.display = 'none';
                    
                    if (isAdmin) {
                        // Show admin sections
                        adminDashboard.style.display = 'block';
                        contentManagement.style.display = 'block';
                        userManagement.style.display = 'block';
                        
                        // Load admin data
                        loadAdminData();
                    } else {
                        // If no admin claim, check the database as a fallback
                        checkAdminInDatabase(user.uid, user.email)
                            .then(isDbAdmin => {
                                if (isDbAdmin) {
                                    // Show admin sections
                                    adminDashboard.style.display = 'block';
                                    contentManagement.style.display = 'block';
                                    userManagement.style.display = 'block';
                                    
                                    // Load admin data
                                    loadAdminData();
                                } else {
                                    // Show access denied
                                    accessDenied.style.display = 'block';
                                }
                            })
                            .catch(error => {
                                console.error("Error checking admin in database:", error);
                                accessDenied.style.display = 'block';
                            });
                    }
                })
                .catch(error => {
                    console.error("Error checking admin status:", error);
                    authCheckDiv.innerHTML = `<p>Error: ${error.message}</p>`;
                    accessDenied.style.display = 'block';
                });
            
            // Setup logout button
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    firebase.auth().signOut()
                        .then(() => {
                            window.location.href = 'index.html';
                        })
                        .catch(error => {
                            console.error("Error signing out:", error);
                        });
                });
            }
        } else {
            // User is not signed in, redirect to login page
            window.location.href = 'auth.html';
        }
    });
}

// Check if user is an admin in the database (fallback method)
function checkAdminInDatabase(uid, email) {
    return new Promise((resolve, reject) => {
        // Check in the admins collection by user ID
        firebase.database().ref('admins').orderByChild('uid').equalTo(uid).once('value')
            .then(snapshot => {
                if (snapshot.exists()) {
                    resolve(true);
                    return;
                }
                
                // If not found by UID, check by email
                return firebase.database().ref('admins').orderByChild('email').equalTo(email).once('value');
            })
            .then(snapshot => {
                if (snapshot && snapshot.exists()) {
                    // Update the admin record with the UID for future checks
                    const adminKey = Object.keys(snapshot.val())[0];
                    firebase.database().ref(`admins/${adminKey}/uid`).set(uid);
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}

// Load admin dashboard data
function loadAdminData() {
    loadStats();
    loadProjects();
    loadUsers();
    loadSkills();
    loadBlogPosts();
    loadDesigns();
}

// Load stats for admin dashboard
function loadStats() {
    const database = firebase.database();
    
    // Load users count
    database.ref('users').once('value')
        .then(snapshot => {
            const usersCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
            document.getElementById('users-count').textContent = usersCount;
        });
    
    // Load projects count
    database.ref('projects').once('value')
        .then(snapshot => {
            const projectsCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
            document.getElementById('projects-count').textContent = projectsCount;
        });
    
    // Load messages count
    database.ref('messages').once('value')
        .then(snapshot => {
            const messagesCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
            document.getElementById('messages-count').textContent = messagesCount;
        });
    
    // Load visitors count (assuming you have a visitors counter in your database)
    database.ref('visitors').once('value')
        .then(snapshot => {
            const visitorsCount = snapshot.exists() ? snapshot.val().count : 0;
            document.getElementById('visitors-count').textContent = visitorsCount.toLocaleString();
        });
}

// Load projects for content management
function loadProjects() {
    const projectsList = document.getElementById('projects-list');
    if (!projectsList) return;
    
    // Show loading spinner
    projectsList.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading projects...</p>
        </div>
    `;
    
    const database = firebase.database();
    database.ref('projects').once('value')
        .then(snapshot => {
            // Clear loading spinner
            projectsList.innerHTML = '';
            
            if (!snapshot.exists()) {
                projectsList.innerHTML = '<p>No projects found. Add your first project!</p>';
                return;
            }
            
            // Display projects
            const projects = snapshot.val();
            Object.keys(projects).forEach(key => {
                const project = projects[key];
                const projectItem = document.createElement('div');
                projectItem.className = 'content-item';
                projectItem.innerHTML = `
                    <div class="content-item-details">
                        <div class="content-item-title">${project.title}</div>
                        <div class="content-item-meta">
                            Status: <span class="status-badge ${project.status}">${project.status}</span> • 
                            Last Updated: ${formatDate(project.lastUpdated)}
                        </div>
                    </div>
                    <div class="content-item-actions">
                        <button class="action-btn edit-btn" data-id="${key}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" data-id="${key}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                projectsList.appendChild(projectItem);
                
                // Add event listeners for edit and delete buttons
                const editBtn = projectItem.querySelector('.edit-btn');
                const deleteBtn = projectItem.querySelector('.delete-btn');
                
                editBtn.addEventListener('click', function() {
                    editProject(key, project);
                });
                
                deleteBtn.addEventListener('click', function() {
                    if (confirm('Are you sure you want to delete this project?')) {
                        deleteProject(key);
                    }
                });
            });
        })
        .catch(error => {
            console.error("Error loading projects:", error);
            projectsList.innerHTML = `<p>Error loading projects: ${error.message}</p>`;
        });
}

// Load skills for content management
function loadSkills() {
    const skillsList = document.getElementById('skills-list');
    if (!skillsList) return;
    
    // Show loading spinner
    skillsList.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading skills...</p>
        </div>
    `;
    
    const database = firebase.database();
    database.ref('skills').once('value')
        .then(snapshot => {
            // Clear loading spinner
            skillsList.innerHTML = '';
            
            if (!snapshot.exists()) {
                skillsList.innerHTML = '<p>No skills found. Add your first skill!</p>';
                return;
            }
            
            // Display skills
            const skills = snapshot.val();
            Object.keys(skills).forEach(key => {
                const skill = skills[key];
                const skillItem = document.createElement('div');
                skillItem.className = 'content-item';
                skillItem.innerHTML = `
                    <div class="content-item-details">
                        <div class="content-item-title">${skill.name}</div>
                        <div class="content-item-meta">
                            Category: ${skill.category} • 
                            Experience: ${skill.experience} years
                        </div>
                    </div>
                    <div class="content-item-actions">
                        <button class="action-btn edit-btn" data-id="${key}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" data-id="${key}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                skillsList.appendChild(skillItem);
                
                // Add event listeners for buttons
                const editBtn = skillItem.querySelector('.edit-btn');
                const deleteBtn = skillItem.querySelector('.delete-btn');
                
                editBtn.addEventListener('click', function() {
                    // Implement skill editing
                });
                
                deleteBtn.addEventListener('click', function() {
                    if (confirm('Are you sure you want to delete this skill?')) {
                        // Implement skill deletion
                    }
                });
            });
        })
        .catch(error => {
            console.error("Error loading skills:", error);
            skillsList.innerHTML = `<p>Error loading skills: ${error.message}</p>`;
        });
}

// Load blog posts for content management
function loadBlogPosts() {
    const blogList = document.getElementById('blog-list');
    if (!blogList) return;
    
    // Show loading spinner
    blogList.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading blog posts...</p>
        </div>
    `;
    
    const database = firebase.database();
    database.ref('blog').once('value')
        .then(snapshot => {
            // Clear loading spinner
            blogList.innerHTML = '';
            
            if (!snapshot.exists()) {
                blogList.innerHTML = '<p>No blog posts found. Add your first post!</p>';
                return;
            }
            
            // Display blog posts
            const posts = snapshot.val();
            Object.keys(posts).forEach(key => {
                const post = posts[key];
                const postItem = document.createElement('div');
                postItem.className = 'content-item';
                postItem.innerHTML = `
                    <div class="content-item-details">
                        <div class="content-item-title">${post.title}</div>
                        <div class="content-item-meta">
                            Category: ${post.category} • 
                            Published: ${formatDate(post.publishDate)}
                        </div>
                    </div>
                    <div class="content-item-actions">
                        <button class="action-btn edit-btn" data-id="${key}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" data-id="${key}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                blogList.appendChild(postItem);
                
                // Add event listeners for buttons
                const editBtn = postItem.querySelector('.edit-btn');
                const deleteBtn = postItem.querySelector('.delete-btn');
                
                editBtn.addEventListener('click', function() {
                    // Implement blog post editing
                });
                
                deleteBtn.addEventListener('click', function() {
                    if (confirm('Are you sure you want to delete this blog post?')) {
                        // Implement blog post deletion
                    }
                });
            });
        })
        .catch(error => {
            console.error("Error loading blog posts:", error);
            blogList.innerHTML = `<p>Error loading blog posts: ${error.message}</p>`;
        });
}

// Load designs for content management
function loadDesigns() {
    const designList = document.getElementById('design-list');
    if (!designList) return;
    
    // Show loading spinner
    designList.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading designs...</p>
        </div>
    `;
    
    const database = firebase.database();
    database.ref('designs').once('value')
        .then(snapshot => {
            // Clear loading spinner
            designList.innerHTML = '';
            
            if (!snapshot.exists()) {
                designList.innerHTML = '<p>No designs found. Add your first design!</p>';
                return;
            }
            
            // Display designs
            const designs = snapshot.val();
            Object.keys(designs).forEach(key => {
                const design = designs[key];
                const designItem = document.createElement('div');
                designItem.className = 'content-item';
                designItem.innerHTML = `
                    <div class="content-item-details">
                        <div class="content-item-title">${design.title}</div>
                        <div class="content-item-meta">
                            Category: ${design.category} • 
                            Created: ${formatDate(design.createdAt)}
                        </div>
                    </div>
                    <div class="content-item-actions">
                        <button class="action-btn edit-btn" data-id="${key}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" data-id="${key}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                designList.appendChild(designItem);
                
                // Add event listeners for buttons
                const editBtn = designItem.querySelector('.edit-btn');
                const deleteBtn = designItem.querySelector('.delete-btn');
                
                editBtn.addEventListener('click', function() {
                    // Implement design editing
                });
                
                deleteBtn.addEventListener('click', function() {
                    if (confirm('Are you sure you want to delete this design?')) {
                        // Implement design deletion
                    }
                });
            });
        })
        .catch(error => {
            console.error("Error loading designs:", error);
            designList.innerHTML = `<p>Error loading designs: ${error.message}</p>`;
        });
}

// Load users for user management
function loadUsers() {
    const usersTableBody = document.getElementById('users-table-body');
    if (!usersTableBody) return;
    
    // Show loading spinner
    usersTableBody.innerHTML = `
        <tr>
            <td colspan="5" class="loading-cell">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading users...</p>
                </div>
            </td>
        </tr>
    `;
    
    // Get users from Firebase Authentication (requires Admin SDK on server)
    // For this client-side implementation, we'll use the users collection in the database
    const database = firebase.database();
    database.ref('users').once('value')
        .then(snapshot => {
            // Clear loading spinner
            usersTableBody.innerHTML = '';
            
            if (!snapshot.exists()) {
                usersTableBody.innerHTML = `
                    <tr>
                        <td colspan="5">No users found.</td>
                    </tr>
                `;
                return;
            }
            
            // Get admin users to check roles
            return database.ref('admins').once('value')
                .then(adminsSnapshot => {
                    const admins = adminsSnapshot.val() || {};
                    
                    // Display users
                    const users = snapshot.val();
                    Object.keys(users).forEach(key => {
                        const user = users[key];
                        
                        // Check if user is admin
                        const isAdmin = Object.values(admins).some(admin => 
                            admin.uid === key || admin.email === user.email
                        );
                        
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${key.substring(0, 8)}...</td>
                            <td>${user.email}</td>
                            <td>${isAdmin ? '<span class="admin-badge">Admin</span>' : 'User'}</td>
                            <td>${user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</td>
                            <td>
                                ${isAdmin ? 
                                    `<button class="action-btn delete-btn" data-id="${key}"><i class="fas fa-user-minus"></i></button>` :
                                    `<button class="action-btn edit-btn" data-id="${key}"><i class="fas fa-user-shield"></i></button>`
                                }
                            </td>
                        `;
                        usersTableBody.appendChild(row);
                        
                        // Add event listeners for buttons
                        if (isAdmin) {
                            const removeAdminBtn = row.querySelector('.delete-btn');
                            removeAdminBtn.addEventListener('click', function() {
                                if (confirm('Are you sure you want to remove admin privileges?')) {
                                    removeAdmin(key, user.email);
                                }
                            });
                        } else {
                            const makeAdminBtn = row.querySelector('.edit-btn');
                            makeAdminBtn.addEventListener('click', function() {
                                if (confirm('Are you sure you want to grant admin privileges?')) {
                                    makeAdmin(key, user.email);
                                }
                            });
                        }
                    });
                });
        })
        .catch(error => {
            console.error("Error loading users:", error);
            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="5">Error loading users: ${error.message}</td>
                </tr>
            `;
        });
}

// Helper functions
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function editProject(projectId, projectData) {
    // Implement project editing functionality
    console.log("Edit project:", projectId, projectData);
    // This would typically open a modal with the project data pre-filled
}

function deleteProject(projectId) {
    const database = firebase.database();
    database.ref(`projects/${projectId}`).remove()
        .then(() => {
            console.log("Project deleted successfully");
            loadProjects(); // Refresh the projects list
        })
        .catch(error => {
            console.error("Error deleting project:", error);
            alert(`Failed to delete project: ${error.message}`);
        });
}

function makeAdmin(userId, email) {
    // Call the Cloud Function to set admin privileges
    const functions = firebase.functions();
    const addAdminRole = functions.httpsCallable('addAdminRole');
    
    addAdminRole({ email: email })
        .then(result => {
            console.log(result);
            alert(`Success! ${email} has been made an admin.`);
            
            // Also update the local database for backward compatibility
            const database = firebase.database();
            database.ref('admins').push({
                uid: userId,
                email: email,
                addedAt: Date.now()
            });
            
            // Refresh users list
            loadUsers();
        })
        .catch(error => {
            console.error("Error granting admin privileges:", error);
            alert(`Failed to grant admin privileges: ${error.message}`);
        });
}

function removeAdmin(userId, email) {
    // Call the Cloud Function to remove admin privileges
    const functions = firebase.functions();
    const removeAdminRole = functions.httpsCallable('removeAdminRole');
    
    removeAdminRole({ email: email })
        .then(result => {
            console.log(result);
            alert(`Success! Admin privileges removed from ${email}.`);
            
            // Also update the local database for backward compatibility
            const database = firebase.database();
            
            // Find the admin entry to remove
            database.ref('admins').orderByChild('uid').equalTo(userId).once('value')
                .then(snapshot => {
                    if (snapshot.exists()) {
                        // Remove by user ID
                        const adminKey = Object.keys(snapshot.val())[0];
                        return database.ref(`admins/${adminKey}`).remove();
                    } else {
                        // Try to find by email
                        return database.ref('admins').orderByChild('email').equalTo(email).once('value')
                            .then(emailSnapshot => {
                                if (emailSnapshot.exists()) {
                                    const adminKey = Object.keys(emailSnapshot.val())[0];
                                    return database.ref(`admins/${adminKey}`).remove();
                                }
                            });
                    }
                });
            
            // Refresh users list
            loadUsers();
        })
        .catch(error => {
            console.error("Error removing admin privileges:", error);
            alert(`Failed to remove admin privileges: ${error.message}`);
        });
}
