// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize libraries and components
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Initialize Firebase
    initFirebase();
    
    // Initialize UI components
    initThemeToggle();
    initTabs();
    initAnimatedBackground();
    initFormRepeaters();
    initStatCounters();
    initRichTextEditor();
    initIconSelector();
    initLogout();
    checkAdminStatus();
});

// Firebase initialization
function initFirebase() {
    // Firebase configuration from your provided config
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
    
    // Initialize Analytics if available
    if (firebase.analytics) {
        firebase.analytics();
    }
}

// Check if user is admin
function checkAdminStatus() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            document.getElementById('admin-name').textContent = user.displayName || user.email;
            
            // Get the user's ID token to check admin status
            user.getIdTokenResult()
                .then((idTokenResult) => {
                    // Check if the user is an admin
                    if (idTokenResult.claims.admin) {
                        // User is an admin, load admin data
                        loadAdminData();
                    } else {
                        // User is not an admin, redirect to main page
                        window.location.href = 'mainpage.html';
                    }
                })
                .catch((error) => {
                    console.error("Error getting token:", error);
                    showToast("Error verifying admin status. Please try again.");
                    setTimeout(() => {
                        window.location.href = 'auth.html';
                    }, 3000);
                });
        } else {
            // No user is signed in, redirect to auth page
            window.location.href = 'auth.html';
        }
    });
}

// Load admin data from Firebase
function loadAdminData() {
    const db = firebase.firestore();
    
    // Load user stats
    db.collection('users').get()
        .then((snapshot) => {
            document.getElementById('total-users').textContent = snapshot.size;
        })
        .catch((error) => {
            console.error("Error getting users:", error);
        });
    
    // Load page views
    db.collection('analytics').doc('pageViews')
        .get()
        .then((doc) => {
            if (doc.exists) {
                document.getElementById('page-views').textContent = doc.data().count.toLocaleString();
            } else {
                document.getElementById('page-views').textContent = "0";
            }
        })
        .catch((error) => {
            console.error("Error getting page views:", error);
        });
    
    // Load message count
    db.collection('messages').get()
        .then((snapshot) => {
            document.getElementById('message-count').textContent = snapshot.size;
        })
        .catch((error) => {
            console.error("Error getting messages:", error);
        });
    
    // Load project count
    db.collection('projects').get()
        .then((snapshot) => {
            document.getElementById('project-count').textContent = snapshot.size;
        })
        .catch((error) => {
            console.error("Error getting projects:", error);
        });
    
    // Load home page content
    db.collection('content').doc('homepage')
        .get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                document.getElementById('hero-title').value = data.heroTitle || 'Archeverse';
                document.getElementById('current-project').value = data.currentProject || 'AI-Powered Robotics Platform';
                document.getElementById('page-title').value = data.pageTitle || 'Archeverse | Digital Innovation Hub';
                document.getElementById('meta-description').value = data.metaDescription || 'Archeverse is a digital innovation hub specializing in civil engineering, data science, and robotics solutions.';
                document.getElementById('meta-keywords').value = data.metaKeywords || 'civil engineering, data science, robotics, AI, machine learning';
                
                // Load typing phrases
                if (data.typingPhrases && data.typingPhrases.length > 0) {
                    const phrasesContainer = document.getElementById('typing-phrases');
                    // Clear existing phrases except the add button
                    const addButton = phrasesContainer.querySelector('.add-item-btn');
                    phrasesContainer.innerHTML = '';
                    phrasesContainer.appendChild(addButton);
                    
                    // Add phrases from database
                    data.typingPhrases.forEach(phrase => {
                        addRepeaterItem('typing-phrases', phrase);
                    });
                }
            }
        })
        .catch((error) => {
            console.error("Error getting homepage content:", error);
        });
    
    // Load projects
    loadProjects();
    
    // Load skills
    loadSkills();
    
    // Load timeline
    loadTimeline();
    
    // Load blog posts
    loadBlogPosts();
}

// Load projects from Firebase
function loadProjects() {
    const db = firebase.firestore();
    const projectsList = document.querySelector('.projects-list');
    const addButton = projectsList.querySelector('.add-project-btn');
    
    // Clear existing projects except the add button
    projectsList.innerHTML = '';
    projectsList.appendChild(addButton);
    
    db.collection('projects').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const project = doc.data();
                const projectItem = document.createElement('div');
                projectItem.className = 'project-item';
                projectItem.setAttribute('data-id', doc.id);
                
                projectItem.innerHTML = `
                    <div class="project-preview">
                        <img src="${project.imageUrl || 'https://via.placeholder.com/100x60'}" alt="${project.title}">
                    </div>
                    <div class="project-info">
                        <h4>${project.title}</h4>
                        <p class="project-status ${project.isLive ? 'live' : ''}">${project.isLive ? 'LIVE' : 'Draft'}</p>
                    </div>
                    <div class="project-actions">
                        <button class="edit-btn"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                
                projectsList.insertBefore(projectItem, addButton);
                
                // Add event listeners
                const editBtn = projectItem.querySelector('.edit-btn');
                editBtn.addEventListener('click', () => {
                    loadProjectDetails(doc.id);
                });
                
                const deleteBtn = projectItem.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => {
                    showConfirmModal(`Are you sure you want to delete "${project.title}"?`, () => {
                        deleteProject(doc.id);
                    });
                });
            });
            
            // Select first project by default if exists
            const firstProject = projectsList.querySelector('.project-item');
            if (firstProject) {
                firstProject.classList.add('active');
                loadProjectDetails(firstProject.getAttribute('data-id'));
            }
        })
        .catch((error) => {
            console.error("Error getting projects:", error);
        });
    
    // Add project button event listener
    addButton.addEventListener('click', () => {
        // Clear form for new project
        document.getElementById('project-title').value = '';
        document.getElementById('project-desc').value = '';
        document.getElementById('project-image-preview').src = 'https://via.placeholder.com/600x400';
        document.getElementById('project-github').value = '';
        document.getElementById('project-live').value = '';
        document.getElementById('project-featured').checked = false;
        document.getElementById('project-live-status').checked = false;
        
        // Clear technologies
        const techContainer = document.getElementById('project-technologies');
        const addTechButton = techContainer.querySelector('.add-item-btn');
        techContainer.innerHTML = '';
        techContainer.appendChild(addTechButton);
        
        // Set active state to none
        const projectItems = projectsList.querySelectorAll('.project-item');
        projectItems.forEach(item => item.classList.remove('active'));
    });
}

// Load project details
function loadProjectDetails(projectId) {
    const db = firebase.firestore();
    
    db.collection('projects').doc(projectId).get()
        .then((doc) => {
            if (doc.exists) {
                const project = doc.data();
                
                // Set form values
                document.getElementById('project-title').value = project.title || '';
                document.getElementById('project-desc').value = project.description || '';
                document.getElementById('project-image-preview').src = project.imageUrl || 'https://via.placeholder.com/600x400';
                document.getElementById('project-github').value = project.githubUrl || '';
                document.getElementById('project-live').value = project.liveUrl || '';
                document.getElementById('project-featured').checked = project.isFeatured || false;
                document.getElementById('project-live-status').checked = project.isLive || false;
                
                // Set technologies
                const techContainer = document.getElementById('project-technologies');
                const addTechButton = techContainer.querySelector('.add-item-btn');
                techContainer.innerHTML = '';
                techContainer.appendChild(addTechButton);
                
                if (project.technologies && project.technologies.length > 0) {
                    project.technologies.forEach(tech => {
                        addRepeaterItem('project-technologies', tech);
                    });
                }
                
                // Set active state
                const projectItems = document.querySelectorAll('.project-item');
                projectItems.forEach(item => {
                    if (item.getAttribute('data-id') === projectId) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
                
                // Add save event listener
                document.getElementById('save-projects').onclick = function() {
                    saveProject(projectId);
                };
            }
        })
        .catch((error) => {
            console.error("Error getting project details:", error);
        });
}

// Save project
function saveProject(projectId) {
    const db = firebase.firestore();
    
    // Get form values
    const title = document.getElementById('project-title').value;
    const description = document.getElementById('project-desc').value;
    const imageUrl = document.getElementById('project-image-preview').src;
    const githubUrl = document.getElementById('project-github').value;
    const liveUrl = document.getElementById('project-live').value;
    const isFeatured = document.getElementById('project-featured').checked;
    const isLive = document.getElementById('project-live-status').checked;
    
    // Get technologies
    const techItems = document.querySelectorAll('#project-technologies .repeater-item input');
    const technologies = Array.from(techItems).map(item => item.value);
    
    // Create project object
    const projectData = {
        title,
        description,
        imageUrl,
        githubUrl,
        liveUrl,
        isFeatured,
        isLive,
        technologies,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // If new project, add createdAt
    if (!projectId) {
        projectData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        
        // Add new project
        db.collection('projects').add(projectData)
            .then((docRef) => {
                showToast("Project created successfully!");
                loadProjects();
            })
            .catch((error) => {
                console.error("Error adding project:", error);
                showToast("Error creating project. Please try again.");
            });
    } else {
        // Update existing project
        db.collection('projects').doc(projectId).update(projectData)
            .then(() => {
                showToast("Project updated successfully!");
                loadProjects();
            })
            .catch((error) => {
                console.error("Error updating project:", error);
                showToast("Error updating project. Please try again.");
            });
    }
}

// Delete project
function deleteProject(projectId) {
    const db = firebase.firestore();
    
    db.collection('projects').doc(projectId).delete()
        .then(() => {
            showToast("Project deleted successfully!");
            loadProjects();
        })
        .catch((error) => {
            console.error("Error deleting project:", error);
            showToast("Error deleting project. Please try again.");
        });
}

// Load skills
function loadSkills() {
    // Similar implementation as loadProjects
    const db = firebase.firestore();
    const skillsList = document.querySelector('.skills-list');
    const addButton = skillsList.querySelector('.add-skill-btn');
    
    // Clear existing skills except the add button
    skillsList.innerHTML = '';
    skillsList.appendChild(addButton);
    
    db.collection('skills').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const skill = doc.data();
                const skillItem = document.createElement('div');
                skillItem.className = 'skill-item';
                skillItem.setAttribute('data-id', doc.id);
                
                skillItem.innerHTML = `
                    <div class="skill-icon">
                        <i class="${skill.icon || 'fas fa-code'}"></i>
                    </div>
                    <div class="skill-info">
                        <h4>${skill.name}</h4>
                        <div class="skill-rating">
                            ${generateStarRating(skill.rating || 0)}
                        </div>
                    </div>
                    <div class="skill-actions">
                        <button class="edit-btn"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                
                skillsList.insertBefore(skillItem, addButton);
                
                // Add event listeners
                const editBtn = skillItem.querySelector('.edit-btn');
                editBtn.addEventListener('click', () => {
                    loadSkillDetails(doc.id);
                });
                
                const deleteBtn = skillItem.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => {
                    showConfirmModal(`Are you sure you want to delete "${skill.name}"?`, () => {
                        deleteSkill(doc.id);
                    });
                });
            });
            
            // Select first skill by default if exists
            const firstSkill = skillsList.querySelector('.skill-item');
            if (firstSkill) {
                firstSkill.classList.add('active');
                loadSkillDetails(firstSkill.getAttribute('data-id'));
            }
        })
        .catch((error) => {
            console.error("Error getting skills:", error);
        });
}

// Generate star rating HTML
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Load timeline entries
function loadTimeline() {
    // Similar implementation as loadProjects
    const db = firebase.firestore();
    const timelineList = document.querySelector('.timeline-list');
    const addButton = timelineList.querySelector('.add-timeline-btn');
    
    // Clear existing timeline entries except the add button
    timelineList.innerHTML = '';
    timelineList.appendChild(addButton);
    
    db.collection('timeline')
        .orderBy('order', 'asc')
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const entry = doc.data();
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';
                timelineItem.setAttribute('data-id', doc.id);
                
                timelineItem.innerHTML = `
                    <div class="timeline-date">${entry.startDate} - ${entry.endDate}</div>
                    <div class="timeline-info">
                        <h4>${entry.title}</h4>
                        <p>${entry.organization}</p>
                    </div>
                    <div class="timeline-actions">
                        <button class="edit-btn"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                        <button class="move-btn"><i class="fas fa-arrows-alt"></i></button>
                    </div>
                `;
                
                timelineList.insertBefore(timelineItem, addButton);
                
                // Add event listeners
                const editBtn = timelineItem.querySelector('.edit-btn');
                editBtn.addEventListener('click', () => {
                    loadTimelineDetails(doc.id);
                });
                
                const deleteBtn = timelineItem.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => {
                    showConfirmModal(`Are you sure you want to delete "${entry.title}"?`, () => {
                        deleteTimelineEntry(doc.id);
                    });
                });
            });
            
            // Select first timeline entry by default if exists
            const firstEntry = timelineList.querySelector('.timeline-item');
            if (firstEntry) {
                firstEntry.classList.add('active');
                loadTimelineDetails(firstEntry.getAttribute('data-id'));
            }
        })
        .catch((error) => {
            console.error("Error getting timeline entries:", error);
        });
}

// Load blog posts
function loadBlogPosts() {
    // Similar implementation as loadProjects
    const db = firebase.firestore();
    const blogList = document.querySelector('.blog-list');
    const addButton = blogList.querySelector('.add-blog-btn');
    
    // Clear existing blog posts except the add button
    blogList.innerHTML = '';
    blogList.appendChild(addButton);
    
    db.collection('blog')
        .orderBy('publishDate', 'desc')
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                const post = doc.data();
                const blogItem = document.createElement('div');
                blogItem.className = 'blog-item';
                blogItem.setAttribute('data-id', doc.id);
                
                // Format date
                const date = post.publishDate ? new Date(post.publishDate.toDate()) : new Date();
                const formattedDate = date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                
                blogItem.innerHTML = `
                    <div class="blog-preview">
                        <img src="${post.imageUrl || 'https://via.placeholder.com/100x60'}" alt="${post.title}">
                    </div>
                    <div class="blog-info">
                        <h4>${post.title}</h4>
                        <p class="blog-date">${formattedDate}</p>
                    </div>
                    <div class="blog-actions">
                        <button class="edit-btn"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                
                blogList.insertBefore(blogItem, addButton);
                
                // Add event listeners
                const editBtn = blogItem.querySelector('.edit-btn');
                editBtn.addEventListener('click', () => {
                    loadBlogDetails(doc.id);
                });
                
                const deleteBtn = blogItem.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => {
                    showConfirmModal(`Are you sure you want to delete "${post.title}"?`, () => {
                        deleteBlogPost(doc.id);
                    });
                });
            });
            
            // Select first blog post by default if exists
            const firstPost = blogList.querySelector('.blog-item');
            if (firstPost) {
                firstPost.classList.add('active');
                loadBlogDetails(firstPost.getAttribute('data-id'));
            }
        })
        .catch((error) => {
            console.error("Error getting blog posts:", error);
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
    // Main navigation tabs
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
    
    // Content management tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
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

// Form Repeaters
function initFormRepeaters() {
    // Add phrase button
    const addPhraseBtn = document.getElementById('add-phrase');
    if (addPhraseBtn) {
        addPhraseBtn.addEventListener('click', function() {
            addRepeaterItem('typing-phrases', '');
        });
    }
    
    // Add technology button
    const addTechBtn = document.getElementById('add-technology');
    if (addTechBtn) {
        addTechBtn.addEventListener('click', function() {
            addRepeaterItem('project-technologies', '');
        });
    }
    
    // Add tag button for timeline
    const addTagBtn = document.getElementById('add-tag');
    if (addTagBtn) {
        addTagBtn.addEventListener('click', function() {
            addRepeaterItem('timeline-tags', '');
        });
    }
    
    // Add tag button for blog
    const addBlogTagBtn = document.getElementById('add-blog-tag');
    if (addBlogTagBtn) {
        addBlogTagBtn.addEventListener('click', function() {
            addRepeaterItem('blog-tags', '');
        });
    }
}

// Add repeater item
function addRepeaterItem(containerId, value) {
    const container = document.getElementById(containerId);
    const addButton = container.querySelector('.add-item-btn');
    
    const repeaterItem = document.createElement('div');
    repeaterItem.className = 'repeater-item';
    
    repeaterItem.innerHTML = `
        <input type="text" value="${value}">
        <button class="remove-btn"><i class="fas fa-times"></i></button>
    `;
    
    container.insertBefore(repeaterItem, addButton);
    
    // Add event listener to remove button
    const removeBtn = repeaterItem.querySelector('.remove-btn');
    removeBtn.addEventListener('click', function() {
        container.removeChild(repeaterItem);
    });
}

// Stat Counters Animation
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        animateCounter(stat, finalValue);
    });
    
    function animateCounter(element, finalValue) {
        let startValue = 0;
        let duration = 2000;
        let startTime = null;
        
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const value = Math.floor(progress * (finalValue - startValue) + startValue);
            element.textContent = value.toLocaleString();
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }
        
        window.requestAnimationFrame(step);
    }
}

// Rich Text Editor
function initRichTextEditor() {
    const editorToolbar = document.querySelector('.editor-toolbar');
    if (!editorToolbar) return;
    
    const buttons = editorToolbar.querySelectorAll('button');
    const editorContent = document.querySelector('.editor-content');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const command = this.getAttribute('data-command');
            const value = this.getAttribute('data-value') || '';
            
            if (command === 'createLink') {
                const url = prompt('Enter the link URL:');
                if (url) document.execCommand(command, false, url);
            } else if (command === 'insertImage') {
                const url = prompt('Enter the image URL:');
                if (url) document.execCommand(command, false, url);
            } else if (command === 'code') {
                // Insert code block
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const codeBlock = document.createElement('pre');
                const code = document.createElement('code');
                
                code.textContent = range.toString() || 'Your code here';
                codeBlock.appendChild(code);
                
                range.deleteContents();
                range.insertNode(codeBlock);
            } else {
                document.execCommand(command, false, value);
            }
            
            // Focus back on editor
            editorContent.focus();
        });
    });
}

// Icon Selector
function initIconSelector() {
    const iconSelectorBtn = document.getElementById('icon-selector-btn');
    const iconModal = document.getElementById('icon-modal');
    const closeModal = iconModal.querySelector('.close-modal');
    const iconSearch = document.getElementById('icon-search');
    const iconGrid = document.querySelector('.icon-grid');
    const selectedIcon = document.querySelector('.selected-icon i');
    
    // Font Awesome icons (sample)
    const icons = [
        'fab fa-python', 'fas fa-building', 'fas fa-brain', 'fas fa-robot',
        'fas fa-code', 'fas fa-database', 'fas fa-server', 'fas fa-laptop-code',
        'fas fa-mobile-alt', 'fas fa-cloud', 'fas fa-cogs', 'fas fa-microchip',
        'fas fa-network-wired', 'fab fa-react', 'fab fa-angular', 'fab fa-vuejs',
        'fab fa-node-js', 'fab fa-js', 'fab fa-html5', 'fab fa-css3-alt',
        'fab fa-php', 'fab fa-java', 'fab fa-docker', 'fab fa-aws'
    ];
    
    // Populate icon grid
    icons.forEach(icon => {
        const iconItem = document.createElement('div');
        iconItem.className = 'icon-item';
        iconItem.innerHTML = `<i class="${icon}"></i>`;
        
        iconItem.addEventListener('click', function() {
            selectedIcon.className = icon;
            iconModal.style.display = 'none';
        });
        
        iconGrid.appendChild(iconItem);
    });
    
    // Open modal
    iconSelectorBtn.addEventListener('click', function() {
        iconModal.style.display = 'flex';
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        iconModal.style.display = 'none';
    });
    
    // Close when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === iconModal) {
            iconModal.style.display = 'none';
        }
    });
    
    // Search icons
    iconSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const iconItems = iconGrid.querySelectorAll('.icon-item');
        
        iconItems.forEach(item => {
            const iconClass = item.querySelector('i').className.toLowerCase();
            if (iconClass.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Show confirmation modal
function showConfirmModal(message, callback) {
    const modal = document.getElementById('confirm-modal');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmCancel = document.getElementById('confirm-cancel');
    const confirmProceed = document.getElementById('confirm-proceed');
    
    confirmMessage.textContent = message;
    modal.style.display = 'flex';
    
    // Cancel button
    confirmCancel.onclick = function() {
        modal.style.display = 'none';
    };
    
    // Proceed button
    confirmProceed.onclick = function() {
        modal.style.display = 'none';
        callback();
    };
    
    // Close when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Show toast message
function showToast(message) {
    const toast = document.getElementById('success-toast');
    const toastMessage = document.getElementById('toast-message');
    const closeToast = document.querySelector('.close-toast');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
    
    // Close button
    closeToast.onclick = function() {
        toast.classList.remove('show');
    };
}

// Logout function
function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    logoutBtn.addEventListener('click', function() {
        showConfirmModal('Are you sure you want to logout?', () => {
            firebase.auth().signOut()
                .then(() => {
                    window.location.href = 'auth.html';
                })
                .catch((error) => {
                    console.error("Error signing out:", error);
                    showToast("Error signing out. Please try again.");
                });
        });
    });
}
