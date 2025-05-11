// Initialize Firebase
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Check authentication
    checkAuth();
    
    // Initialize components after auth check
    function initializeAdmin() {
        // Hide auth overlay
        document.getElementById('auth-check').style.display = 'none';
        
        // Initialize UI components
        initThemeToggle();
        initNavigation();
        initDashboard();
        initProjectsSection();
        initSkillsSection();
        initBlogSection();
        initExperienceSection();
        initDesignSection();
        initUsersSection();
        initUploadModal();
        
        // Set up logout functionality
        document.getElementById('logout-btn').addEventListener('click', function(e) {
            e.preventDefault();
            firebase.auth().signOut().then(() => {
                window.location.href = 'index.html';
            });
        });
    }
    
    // Authentication check
    function checkAuth() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in, check if admin
                checkAdminRole(user);
            } else {
                // No user is signed in, redirect to login
                window.location.href = 'auth.html';
            }
        });
    }
    
    // Check if user has admin role
    function checkAdminRole(user) {
        const db = firebase.firestore();
        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists && doc.data().isAdmin === true) {
                    // User is admin, update UI with user info
                    updateUserInfo(user, doc.data());
                    initializeAdmin();
                } else {
                    // Not an admin, redirect to main page
                    alert('You do not have admin privileges.');
                    window.location.href = 'index.html';
                }
            })
            .catch((error) => {
                console.error("Error checking admin role:", error);
                alert('Authentication error. Please try again.');
                window.location.href = 'index.html';
            });
    }
    
    // Update user info in the UI
    function updateUserInfo(user, userData) {
        const adminName = document.getElementById('admin-name');
        const adminAvatar = document.getElementById('admin-avatar');
        
        adminName.textContent = userData.name || user.email;
        
        if (userData.photoURL) {
            adminAvatar.src = userData.photoURL;
        } else if (user.photoURL) {
            adminAvatar.src = user.photoURL;
        }
    }
    
    // Theme toggle functionality
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Check for saved theme preference or use system preference
        const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
        
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            // Save the preference
            const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });
    }
    
    // Navigation functionality
    function initNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all menu items
                menuItems.forEach(menuItem => {
                    menuItem.classList.remove('active');
                });
                
                // Add active class to clicked menu item
                this.classList.add('active');
                
                // Get section to show
                const sectionId = this.getAttribute('data-section');
                
                // Hide all sections
                const sections = document.querySelectorAll('.content-section');
                sections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show selected section
                document.getElementById(`${sectionId}-section`).classList.add('active');
            });
        });
    }
    
    // Dashboard initialization
    function initDashboard() {
        // Fetch counts for dashboard stats
        fetchProjectCount();
        fetchBlogCount();
        fetchUserCount();
        fetchVisitorCount();
        
        // Fetch recent activity
        fetchRecentActivity();
    }
    
    // Fetch project count
    function fetchProjectCount() {
        const db = firebase.database();
        db.ref('projects').once('value')
            .then((snapshot) => {
                const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
                document.getElementById('project-count').textContent = count;
            })
            .catch((error) => {
                console.error("Error fetching project count:", error);
                document.getElementById('project-count').textContent = 'Error';
            });
    }
    
    // Fetch blog count
    function fetchBlogCount() {
        const db = firebase.database();
        db.ref('blog').once('value')
            .then((snapshot) => {
                const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
                document.getElementById('blog-count').textContent = count;
            })
            .catch((error) => {
                console.error("Error fetching blog count:", error);
                document.getElementById('blog-count').textContent = 'Error';
            });
    }
    
    // Fetch user count
    function fetchUserCount() {
        const db = firebase.firestore();
        db.collection('users').get()
            .then((snapshot) => {
                document.getElementById('user-count').textContent = snapshot.size;
            })
            .catch((error) => {
                console.error("Error fetching user count:", error);
                document.getElementById('user-count').textContent = 'Error';
            });
    }
    
    // Fetch visitor count
    function fetchVisitorCount() {
        const db = firebase.database();
        db.ref('visitors/count').once('value')
            .then((snapshot) => {
                const count = snapshot.exists() ? snapshot.val() : 0;
                document.getElementById('visitor-count').textContent = count.toLocaleString();
            })
            .catch((error) => {
                console.error("Error fetching visitor count:", error);
                document.getElementById('visitor-count').textContent = 'Error';
            });
    }
    
    // Fetch recent activity
    function fetchRecentActivity() {
        const activityList = document.getElementById('activity-list');
        const db = firebase.database();
        
        db.ref('activity').orderByChild('timestamp').limitToLast(5).once('value')
            .then((snapshot) => {
                // Clear loading spinner
                activityList.innerHTML = '';
                
                if (snapshot.exists()) {
                    // Convert to array and reverse for newest first
                    const activities = [];
                    snapshot.forEach((childSnapshot) => {
                        activities.push({
                            id: childSnapshot.key,
                            ...childSnapshot.val()
                        });
                    });
                    
                    // Display activities in reverse order (newest first)
                    activities.reverse().forEach((activity) => {
                        const activityItem = createActivityItem(activity);
                        activityList.appendChild(activityItem);
                    });
                } else {
                    activityList.innerHTML = '<p>No recent activity found.</p>';
                }
            })
            .catch((error) => {
                console.error("Error fetching activity:", error);
                activityList.innerHTML = '<p>Error loading activity. Please try again.</p>';
            });
    }
    
    // Create activity item element
    function createActivityItem(activity) {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        // Format timestamp
        const date = new Date(activity.timestamp);
        const timeAgo = getTimeAgo(date);
        
        // Determine icon class based on activity type
        let iconClass = 'update';
        if (activity.type === 'create') iconClass = 'create';
        if (activity.type === 'delete') iconClass = 'delete';
        
        activityItem.innerHTML = `
            <div class="activity-icon ${iconClass}">
                <i class="fas fa-${activity.type === 'create' ? 'plus' : activity.type === 'delete' ? 'trash' : 'edit'}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
            </div>
            <div class="activity-time">${timeAgo}</div>
        `;
        
        return activityItem;
    }
    
    // Get time ago string from date
    function getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) return interval + ' years ago';
        if (interval === 1) return '1 year ago';
        
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return interval + ' months ago';
        if (interval === 1) return '1 month ago';
        
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return interval + ' days ago';
        if (interval === 1) return '1 day ago';
        
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return interval + ' hours ago';
        if (interval === 1) return '1 hour ago';
        
        interval = Math.floor(seconds / 60);
        if (interval > 1) return interval + ' minutes ago';
        if (interval === 1) return '1 minute ago';
        
        return 'Just now';
    }
    
    // Projects section initialization
    function initProjectsSection() {
        // Add project button click handler
        document.getElementById('add-project-btn').addEventListener('click', function() {
            openModal('upload');
        });
        
        // Load projects
        loadProjects();
    }
    
    // Skills section initialization
    function initSkillsSection() {
        // Add skill button click handler
        document.getElementById('add-skill-btn').addEventListener('click', function() {
            openModal('skills');
        });
        
        // Initialize range slider value display
        const skillProficiency = document.getElementById('skill-proficiency');
        const proficiencyValue = document.getElementById('proficiency-value');
        
        if (skillProficiency && proficiencyValue) {
            skillProficiency.addEventListener('input', function() {
                proficiencyValue.textContent = this.value;
            });
        }
        
        // Load skills
        loadSkills();
        
        // Form submission handler
        const skillsForm = document.getElementById('skills-form');
        if (skillsForm) {
            skillsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const name = document.getElementById('skill-name').value;
                const category = document.getElementById('skill-category').value;
                const proficiency = document.getElementById('skill-proficiency').value;
                const description = document.getElementById('skill-description').value;
                const years = document.getElementById('skill-years').value;
                const icon = document.getElementById('skill-icon').value;
                
                // Disable submit button and show loading
                const submitBtn = skillsForm.querySelector('.submit-btn');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                submitBtn.disabled = true;
                
                // Save skill data
                saveSkillData(name, category, proficiency, description, years, icon, submitBtn, originalBtnText);
            });
        }
    }
    
    // Blog section initialization
    function initBlogSection() {
        // Add blog button click handler
        document.getElementById('add-blog-btn').addEventListener('click', function() {
            openModal('blog');
        });
        
        // Load blog posts
        loadBlogPosts();
        
        // Initialize blog form file upload
        initBlogFileUpload();
        
        // Form submission handler
        const blogForm = document.getElementById('blog-form');
        if (blogForm) {
            blogForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const title = document.getElementById('blog-title').value;
                const category = document.getElementById('blog-category').value;
                const summary = document.getElementById('blog-summary').value;
                const content = document.getElementById('blog-content').value;
                const readTime = document.getElementById('blog-read-time').value;
                
                // Disable submit button and show loading
                const submitBtn = blogForm.querySelector('.submit-btn');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                submitBtn.disabled = true;
                
                // Get image source (file or URL)
                const activeTab = document.querySelector('#blog-modal .upload-tab.active').getAttribute('data-tab');
                
                if (activeTab === 'file' && document.getElementById('blog-file-input').files.length) {
                    // Upload file to Firebase Storage
                    uploadBlogImageFile(document.getElementById('blog-file-input').files[0], title, category, summary, content, readTime, submitBtn, originalBtnText);
                } else if (activeTab === 'url' && document.getElementById('blog-image-url').value.trim()) {
                    // Upload from URL to Firebase Storage
                    uploadBlogImageFromUrl(document.getElementById('blog-image-url').value.trim(), title, category, summary, content, readTime, submitBtn, originalBtnText);
                } else {
                    alert('Please select an image file or enter an image URL');
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
            });
        }
    }
    
    // Experience section initialization
    function initExperienceSection() {
        // Add experience button click handler
        document.getElementById('add-experience-btn').addEventListener('click', function() {
            openModal('experience');
        });
        
        // Load experience entries
        loadExperience();
        
        // Form submission handler
        const experienceForm = document.getElementById('experience-form');
        if (experienceForm) {
            experienceForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const title = document.getElementById('experience-title').value;
                const organization = document.getElementById('experience-organization').value;
                const type = document.getElementById('experience-type').value;
                const startDate = document.getElementById('experience-start-date').value;
                const endDate = document.getElementById('experience-end-date').value;
                const description = document.getElementById('experience-description').value;
                const tags = document.getElementById('experience-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
                
                // Disable submit button and show loading
                const submitBtn = experienceForm.querySelector('.submit-btn');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                submitBtn.disabled = true;
                
                // Save experience data
                saveExperienceData(title, organization, type, startDate, endDate, description, tags, submitBtn, originalBtnText);
            });
        }
    }
    
    // Design section initialization
    function initDesignSection() {
        // Add design button click handler
        document.getElementById('add-design-btn').addEventListener('click', function() {
            openModal('design');
        });
        
        // Load design projects
        loadDesignProjects();
        
        // Initialize design form file upload
        initDesignFileUpload();
        
        // Form submission handler
        const designForm = document.getElementById('design-form');
        if (designForm) {
            designForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const title = document.getElementById('design-title').value;
                const category = document.getElementById('design-category').value;
                const description = document.getElementById('design-description').value;
                const tools = document.getElementById('design-tools').value.split(',').map(tool => tool.trim()).filter(tool => tool);
                
                // Disable submit button and show loading
                const submitBtn = designForm.querySelector('.submit-btn');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                submitBtn.disabled = true;
                
                // Get image source (file or URL)
                const activeTab = document.querySelector('#design-modal .upload-tab.active').getAttribute('data-tab');
                
                if (activeTab === 'file' && document.getElementById('design-file-input').files.length) {
                    // Upload file to Firebase Storage
                    uploadDesignImageFile(document.getElementById('design-file-input').files[0], title, category, description, tools, submitBtn, originalBtnText);
                } else if (activeTab === 'url' && document.getElementById('design-image-url').value.trim()) {
                    // Upload from URL to Firebase Storage
                    uploadDesignImageFromUrl(document.getElementById('design-image-url').value.trim(), title, category, description, tools, submitBtn, originalBtnText);
                } else {
                    alert('Please select an image file or enter an image URL');
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
            });
        }
    }
    
    // Users section initialization
    function initUsersSection() {
        // Add user button click handler
        document.getElementById('add-user-btn').addEventListener('click', function() {
            openModal('user');
        });
        
        // Load users
        loadUsers();
        
        // Form submission handler
        const userForm = document.getElementById('user-form');
        if (userForm) {
            userForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const name = document.getElementById('user-name').value;
                const email = document.getElementById('user-email').value;
                const password = document.getElementById('user-password').value;
                const isAdmin = document.getElementById('user-role').value === 'true';
                
                // Disable submit button and show loading
                const submitBtn = userForm.querySelector('.submit-btn');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                submitBtn.disabled = true;
                
                // Save user data
                saveUserData(name, email, password, isAdmin, submitBtn, originalBtnText);
            });
        }
    }
    
    // Load projects
    function loadProjects() {
        const projectsTableBody = document.getElementById('projects-table-body');
        if (!projectsTableBody) return;
        
        const db = firebase.database();
        
        db.ref('projects').once('value')
            .then((snapshot) => {
                // Clear loading spinner
                projectsTableBody.innerHTML = '';
                
                if (snapshot.exists()) {
                    // Convert to array
                    const projects = [];
                    snapshot.forEach((childSnapshot) => {
                        projects.push({
                            id: childSnapshot.key,
                            ...childSnapshot.val()
                        });
                    });
                    
                    // Sort by last updated (newest first)
                    projects.sort((a, b) => b.lastUpdated - a.lastUpdated);
                    
                    // Display projects
                    projects.forEach((project) => {
                        const row = createProjectRow(project);
                        projectsTableBody.appendChild(row);
                    });
                } else {
                    projectsTableBody.innerHTML = '<tr><td colspan="4">No projects found. Add your first project!</td></tr>';
                }
            })
            .catch((error) => {
                console.error("Error fetching projects:", error);
                projectsTableBody.innerHTML = '<tr><td colspan="4">Error loading projects. Please try again.</td></tr>';
            });
    }
    
    // Create project table row
    function createProjectRow(project) {
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(project.lastUpdated);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        row.innerHTML = `
            <td>
                <div class="project-title-cell">
                    <img src="${project.imageUrl}" alt="${project.title}" width="50" height="50" style="object-fit: cover; border-radius: 6px; margin-right: 10px;">
                    ${project.title}
                </div>
            </td>
            <td><span class="status-badge status-${project.status}">${project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span></td>
            <td>${formattedDate}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit-btn" data-id="${project.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${project.id}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        
        // Add event listeners for edit and delete buttons
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', function() {
            editProject(project);
        });
        
        deleteBtn.addEventListener('click', function() {
            deleteProject(project.id, project.imageUrl);
        });
        
        return row;
    }
    
    // Edit project
    function editProject(project) {
        openModal('upload', project);
    }
    
    // Delete project
    function deleteProject(projectId, imageUrl) {
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            const db = firebase.database();
            const storage = firebase.storage();
            
            // Delete project data from database
            db.ref(`projects/${projectId}`).remove()
                .then(() => {
                    // Try to delete the image from storage if it's from our storage
                    if (imageUrl && imageUrl.includes('firebasestorage')) {
                        // Extract the path from the URL
                        const imageRef = storage.refFromURL(imageUrl);
                        
                        // Delete the file
                        return imageRef.delete();
                    }
                    return Promise.resolve();
                })
                .then(() => {
                    // Log activity
                    logActivity('delete', 'Project Deleted', 'A project was deleted from the database.');
                    
                    // Reload projects
                    loadProjects();
                    
                    // Update project count
                    fetchProjectCount();
                    
                    alert('Project deleted successfully!');
                })
                .catch((error) => {
                    console.error("Error deleting project:", error);
                    alert('Error deleting project. Please try again.');
                });
        }
    }
    
    // Load skills
    function loadSkills() {
        const skillsTableBody = document.getElementById('skills-table-body');
        if (!skillsTableBody) return;
        
        const db = firebase.database();
        
        db.ref('skills').once('value')
            .then((snapshot) => {
                // Clear loading spinner
                skillsTableBody.innerHTML = '';
                
                if (snapshot.exists()) {
                    // Convert to array
                    const skills = [];
                    snapshot.forEach((childSnapshot) => {
                        skills.push({
                            id: childSnapshot.key,
                            ...childSnapshot.val()
                        });
                    });
                    
                    // Sort by name
                    skills.sort((a, b) => a.name.localeCompare(b.name));
                    
                    // Display skills
                    skills.forEach((skill) => {
                        const row = createSkillRow(skill);
                        skillsTableBody.appendChild(row);
                    });
                } else {
                    skillsTableBody.innerHTML = '<tr><td colspan="4">No skills found. Add your first skill!</td></tr>';
                }
            })
            .catch((error) => {
                console.error("Error fetching skills:", error);
                skillsTableBody.innerHTML = '<tr><td colspan="4">Error loading skills. Please try again.</td></tr>';
            });
    }
    
    // Create skill table row
    function createSkillRow(skill) {
        const row = document.createElement('tr');
        
        // Create proficiency stars
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= skill.proficiency) {
                stars += '<i class="fas fa-star" style="color: gold;"></i>';
            } else {
                stars += '<i class="far fa-star" style="color: #ccc;"></i>';
            }
        }
        
        row.innerHTML = `
            <td>
                <div class="skill-title-cell">
                    <i class="${skill.icon}" style="margin-right: 10px; color: var(--primary-color);"></i>
                    ${skill.name}
                </div>
            </td>
            <td>${skill.category.charAt(0).toUpperCase() + skill.category.slice(1)}</td>
            <td>${stars}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit-btn" data-id="${skill.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${skill.id}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        
        // Add event listeners for edit and delete buttons
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', function() {
            editSkill(skill);
        });
        
        deleteBtn.addEventListener('click', function() {
            deleteSkill(skill.id);
        });
        
        return row;
    }
    
    // Edit skill
    function editSkill(skill) {
        openModal('skills', skill);
    }
    
    // Delete skill
    function deleteSkill(skillId) {
        if (confirm('Are you sure you want to delete this skill? This action cannot be undone.')) {
            const db = firebase.database();
            
            db.ref(`skills/${skillId}`).remove()
                .then(() => {
                    // Log activity
                    logActivity('delete', 'Skill Deleted', 'A skill was deleted from the database.');
                    
                    // Reload skills
                    loadSkills();
                    
                    // Update skill count
                    fetchSkillCount();
                    
                    alert('Skill deleted successfully!');
                })
                .catch((error) => {
                    console.error("Error deleting skill:", error);
                    alert('Error deleting skill. Please try again.');
                });
        }
    }
    
    // Save skill data to Firebase
    function saveSkillData(name, category, proficiency, description, years, icon, submitBtn, originalBtnText) {
        const db = firebase.database();
        const form = document.getElementById('skills-form');
        const skillId = form.getAttribute('data-id');
        
        const skillData = {
            name: name,
            category: category,
            proficiency: parseInt(proficiency),
            description: description,
            years: parseFloat(years),
            icon: icon || 'fas fa-code',
            lastUpdated: Date.now()
        };
        
        let savePromise;
        
        if (skillId) {
            // Update existing skill
            savePromise = db.ref(`skills/${skillId}`).update(skillData);
        } else {
            // Add new skill
            savePromise = db.ref('skills').push(skillData);
        }
        
        savePromise
            .then(() => {
                // Log activity
                const activityType = skillId ? 'update' : 'create';
                const activityTitle = skillId ? 'Skill Updated' : 'New Skill Added';
                const activityDescription = `${name} was ${skillId ? 'updated' : 'added'} to the skills.`;
                
                logActivity(activityType, activityTitle, activityDescription);
                
                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
                
                // Reset form and close modal after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    closeModal('skills');
                    
                    // Reload skills
                    loadSkills();
                    
                    // Update skill count
                    fetchSkillCount();
                }, 1500);
            })
            .catch((error) => {
                console.error("Error saving skill:", error);
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                alert(`Error saving skill: ${error.message}`);
            });
    }
    
    // Fetch skill count
    function fetchSkillCount() {
        const db = firebase.database();
        db.ref('skills').once('value')
            .then((snapshot) => {
                const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
                // Update count in dashboard if element exists
                const countElement = document.getElementById('skills-count');
                if (countElement) {
                    countElement.textContent = count;
                }
            })
            .catch((error) => {
                console.error("Error fetching skill count:", error);
            });
    }
    
    // Initialize blog file upload
    function initBlogFileUpload() {
        const fileInput = document.getElementById('blog-file-input');
        const dropzone = document.getElementById('blog-image-dropzone');
        const imagePreview = document.getElementById('blog-image-preview');
        const fetchUrlBtn = document.getElementById('blog-fetch-url-btn');
        const imageUrl = document.getElementById('blog-image-url');
        
        if (!fileInput || !dropzone || !imagePreview) return;
        
        // Dropzone functionality
        dropzone.addEventListener('click', function() {
            fileInput.click();
        });
        
        dropzone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        dropzone.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });
        
        dropzone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleBlogFileSelect(e.dataTransfer.files[0]);
            }
        });
        
        fileInput.addEventListener('change', function() {
            if (this.files.length) {
                handleBlogFileSelect(this.files[0]);
            }
        });
        
        // URL fetch button
        if (fetchUrlBtn && imageUrl) {
            fetchUrlBtn.addEventListener('click', function() {
                const url = imageUrl.value.trim();
                if (url) {
                    // Show preview of the image
                    imagePreview.src = url;
                    imagePreview.style.display = 'block';
                } else {
                    alert('Please enter a valid URL');
                }
            });
        }
        
        // Handle file selection
        function handleBlogFileSelect(file) {
            // Check if file is an image
            if (!file.type.match('image.*')) {
                alert('Please select an image file');
                return;
            }
            
            // Show preview
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Initialize design file upload
    function initDesignFileUpload() {
        const fileInput = document.getElementById('design-file-input');
        const dropzone = document.getElementById('design-image-dropzone');
        const imagePreview = document.getElementById('design-image-preview');
        const fetchUrlBtn = document.getElementById('design-fetch-url-btn');
        const imageUrl = document.getElementById('design-image-url');
        
        if (!fileInput || !dropzone || !imagePreview) return;
        
        // Dropzone functionality
        dropzone.addEventListener('click', function() {
            fileInput.click();
        });
        
        dropzone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        dropzone.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });
        
        dropzone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleDesignFileSelect(e.dataTransfer.files[0]);
            }
        });
        
        fileInput.addEventListener('change', function() {
            if (this.files.length) {
                handleDesignFileSelect(this.files[0]);
            }
        });
        
        // URL fetch button
        if (fetchUrlBtn && imageUrl) {
            fetchUrlBtn.addEventListener('click', function() {
                const url = imageUrl.value.trim();
                if (url) {
                    // Show preview of the image
                    imagePreview.src = url;
                    imagePreview.style.display = 'block';
                } else {
                    alert('Please enter a valid URL');
                }
            });
        }
        
        // Handle file selection
        function handleDesignFileSelect(file) {
            // Check if file is an image
            if (!file.type.match('image.*')) {
                alert('Please select an image file');
                return;
            }
            
            // Show preview
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Upload blog image file to Firebase Storage
    function uploadBlogImageFile(file, title, category, summary, content, readTime, submitBtn, originalBtnText) {
        // Create a storage reference
        const storage = firebase.storage();
        const storageRef = storage.ref();
        
        // Create file metadata including the content type
        const metadata = {
            contentType: file.type
        };
        
        // Create a unique filename with timestamp to prevent overwriting
        const timestamp = new Date().getTime();
        const fileName = `blog/${timestamp}_${file.name.replace(/\s+/g, '_')}`;
        const uploadTask = storageRef.child(fileName).put(file, metadata);
        
        // Listen for state changes, errors, and completion
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            // Progress monitoring
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Uploading... ${Math.round(progress)}%`;
            },
            // Error handling
            (error) => {
                console.error("Upload failed:", error);
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                alert(`Upload failed: ${error.message}`);
            },
            // Upload completed successfully
            () => {
                // Get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    // Save blog data to Firebase Database
                    saveBlogData(downloadURL, title, category, summary, content, readTime, submitBtn, originalBtnText);
                });
            }
        );
    }
    
    // Upload blog image from URL to Firebase Storage
    function uploadBlogImageFromUrl(url, title, category, summary, content, readTime, submitBtn, originalBtnText) {
        // Create a reference to the file in Firebase Storage
        const storage = firebase.storage();
        const storageRef = storage.ref();
        
        // Fetch the image from the URL
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                // Create file metadata including the content type
                const metadata = {
                    contentType: blob.type
                };
                
                // Create a unique filename with timestamp
                const timestamp = new Date().getTime();
                const fileName = `blog/${timestamp}_image_from_url.${blob.type.split('/')[1] || 'jpg'}`;
                
                // Upload the blob to Firebase Storage
                const uploadTask = storageRef.child(fileName).put(blob, metadata);
                
                // Listen for state changes, errors, and completion
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                    // Progress monitoring
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Uploading... ${Math.round(progress)}%`;
                    },
                    // Error handling
                    (error) => {
                        console.error("Upload failed:", error);
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                        alert(`Upload failed: ${error.message}`);
                    },
                    // Upload completed successfully
                    () => {
                        // Get the download URL
                        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            // Save blog data to Firebase Database
                            saveBlogData(downloadURL, title, category, summary, content, readTime, submitBtn, originalBtnText);
                        });
                    }
                );
            })
            .catch(error => {
                console.error("Error fetching image from URL:", error);
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                alert(`Error fetching image from URL: ${error.message}`);
            });
    }
    
    // Save blog data to Firebase Database
    function saveBlogData(imageUrl, title, category, summary, content, readTime, submitBtn, originalBtnText) {
        const db = firebase.database();
        const form = document.getElementById('blog-form');
        const blogId = form.getAttribute('data-id');
        
        const blogData = {
            title: title,
            category: category,
            summary: summary,
            content: content,
            readTime: parseInt(readTime),
            imageUrl: imageUrl,
            publishDate: Date.now(),
            lastUpdated: Date.now()
        };
        
        let savePromise;
        
        if (blogId) {
            // Update existing blog post
            savePromise = db.ref(`blog/${blogId}`).update(blogData);
        } else {
            // Add new blog post
            savePromise = db.ref('blog').push(blogData);
        }
        
        savePromise
            .then(() => {
                // Log activity
                const activityType = blogId ? 'update' : 'create';
                const activityTitle = blogId ? 'Blog Post Updated' : 'New Blog Post Added';
                const activityDescription = `${title} was ${blogId ? 'updated' : 'added'} to the blog.`;
                
                logActivity(activityType, activityTitle, activityDescription);
                
                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
                
                // Reset form and close modal after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    closeModal('blog');
                    
                    // Reload blog posts
                    loadBlogPosts();
                    
                    // Update blog count
                    fetchBlogCount();
                }, 1500);
            })
            .catch((error) => {
                console.error("Error saving blog post:", error);
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                alert(`Error saving blog post: ${error.message}`);
            });
    }
    
    // Load blog posts
    function loadBlogPosts() {
        const blogTableBody = document.getElementById('blog-table-body');
        if (!blogTableBody) return;
        
        const db = firebase.database();
        
        db.ref('blog').once('value')
            .then((snapshot) => {
                // Clear loading spinner
                blogTableBody.innerHTML = '';
                
                if (snapshot.exists()) {
                    // Convert to array
                    const posts = [];
                    snapshot.forEach((childSnapshot) => {
                        posts.push({
                            id: childSnapshot.key,
                            ...childSnapshot.val()
                        });
                    });
                    
                    // Sort by publish date (newest first)
                    posts.sort((a, b) => b.publishDate - a.publishDate);
                    
                    // Display blog posts
                    posts.forEach((post) => {
                        const row = createBlogRow(post);
                        blogTableBody.appendChild(row);
                    });
                } else {
                    blogTableBody.innerHTML = '<tr><td colspan="4">No blog posts found. Add your first post!</td></tr>';
                }
            })
            .catch((error) => {
                console.error("Error fetching blog posts:", error);
                blogTableBody.innerHTML = '<tr><td colspan="4">Error loading blog posts. Please try again.</td></tr>';
            });
    }
    
    // Create blog table row
    function createBlogRow(post) {
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(post.publishDate);
        const formattedDate = date.toLocaleDateString();
        
        row.innerHTML = `
            <td>
                <div class="blog-title-cell">
                    <img src="${post.imageUrl}" alt="${post.title}" width="50" height="50" style="object-fit: cover; border-radius: 6px; margin-right: 10px;">
                    ${post.title}
                </div>
            </td>
            <td>${post.category}</td>
            <td>${formattedDate}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit-btn" data-id="${post.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${post.id}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        
        // Add event listeners for edit and delete buttons
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', function() {
            editBlogPost(post);
        });
        
        deleteBtn.addEventListener('click', function() {
            deleteBlogPost(post.id, post.imageUrl);
        });
        
        return row;
    }
    
    // Edit blog post
    function editBlogPost(post) {
        openModal('blog', post);
    }
    
    // Delete blog post
    function deleteBlogPost(postId, imageUrl) {
        if (confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
            const db = firebase.database();
            const storage = firebase.storage();
            
            // Delete blog post data from database
            db.ref(`blog/${postId}`).remove()
                .then(() => {
                    // Try to delete the image from storage if it's from our storage
                    if (imageUrl && imageUrl.includes('firebasestorage')) {
                        // Extract the path from the URL
                        const imageRef = storage.refFromURL(imageUrl);
                        
                        // Delete the file
                        return imageRef.delete();
                    }
                    return Promise.resolve();
                })
                .then(() => {
                    // Log activity
                    logActivity('delete', 'Blog Post Deleted', 'A blog post was deleted from the database.');
                    
                    // Reload blog posts
                    loadBlogPosts();
                    
                    // Update blog count
                    fetchBlogCount();
                    
                    alert('Blog post deleted successfully!');
                })
                .catch((error) => {
                    console.error("Error deleting blog post:", error);
                    alert('Error deleting blog post. Please try again.');
                });
        }
    }
    
    // Upload design image file to Firebase Storage
    function uploadDesignImageFile(file, title, category, description, tools, submitBtn, originalBtnText) {
        // Create a storage reference
        const storage = firebase.storage();
        const storageRef = storage.ref();
        
        // Create file metadata including the content type
        const metadata = {
            contentType: file.type
        };
        
        // Create a unique filename with timestamp to prevent overwriting
        const timestamp = new Date().getTime();
        const fileName = `design/${timestamp}_${file.name.replace(/\s+/g, '_')}`;
        const uploadTask = storageRef.child(fileName).put(file, metadata);
        
        // Listen for state changes, errors, and completion
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            // Progress monitoring
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Uploading... ${Math.round(progress)}%`;
            },
            // Error handling
            (error) => {
                console.error("Upload failed:", error);
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                alert(`Upload failed: ${error.message}`);
            },
            // Upload completed successfully
            () => {
                // Get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    // Save design data to Firebase Database
                    saveDesignData(downloadURL, title, category, description, tools, submitBtn, originalBtnText);
                });
            }
        );
    }
    
    // Upload design image from URL to Firebase Storage
    function uploadDesignImageFromUrl(url, title, category, description, tools, submitBtn, originalBtnText) {
        // Create a reference to the file in Firebase Storage
        const storage = firebase.storage();
        const storageRef = storage.ref();
        
        // Fetch the image from the URL
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                // Create file metadata including the content type
                const metadata = {
                    contentType: blob.type
                };
                
                // Create a unique filename with timestamp
                const timestamp = new Date().getTime();
                const fileName = `design/${timestamp}_image_from_url.${blob.type.split('/')[1] || 'jpg'}`;
                
                // Upload the blob to Firebase Storage
                const uploadTask = storageRef.child(fileName).put(blob, metadata);
                
                // Listen for state changes, errors, and completion
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                    // Progress monitoring
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Uploading... ${Math.round(progress)}%`;
                    },
                    // Error handling
                    (error) => {
                        console.error("Upload failed:", error);
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                        alert(`Upload failed: ${error.message}`);
                    },
                    // Upload completed successfully
                    () => {
                        // Get the download URL
                        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            // Save design data to Firebase Database
                            saveDesignData(downloadURL, title, category, description, tools, submitBtn, originalBtnText);
                        });
                    }
                );
            })
            .catch(error => {
                console.error("Error fetching image from URL:", error);
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                alert(`Error fetching image from URL: ${error.message}`);
            });
    }
    
    // Save design data to Firebase Database
    function saveDesignData(imageUrl, title, category, description, tools, submitBtn, originalBtnText) {
        const db = firebase.database();
        const form = document.getElementById('design-form');
        const designId = form.getAttribute('data-id');
        
        const designData = {
            title: title,
            category: category,
            description: description,
            tools: tools,
            imageUrl: imageUrl,
            createdDate: designId ? undefined : Date.now(),
            lastUpdated: Date.now()
        };
        
        let savePromise;
        
        if (designId) {
            // Update existing design
            savePromise = db.ref(`design/${designId}`).update(designData);
        } else {
            // Add new design
            savePromise = db.ref('design').push(designData);
        }
        
        savePromise
            .then(() => {
                // Log activity
                const activityType = designId ? 'update' : 'create';
                const activityTitle = designId ? 'Design Updated' : 'New Design Added';
                const activityDescription = `${title} was ${designId ? 'updated' : 'added'} to the design portfolio.`;
                
                logActivity(activityType, activityTitle, activityDescription);
                
                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
                
                // Reset form and close modal after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    closeModal('design');
                    
                    // Reload design projects
                    loadDesignProjects();
                    
                    // Update design count
                    fetchDesignCount();
                }, 1500);
            })
            .catch((error) => {
                console.error("Error saving design:", error);
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                alert(`Error saving design: ${error.message}`);
            });
    }
    
    // Load design projects
    function loadDesignProjects() {
        const designTableBody = document.getElementById('design-table-body');
        if (!designTableBody) return;
        
        const db = firebase.database();
        
        db.ref('design').once('value')
            .then((snapshot) => {
                // Clear loading spinner
                designTableBody.innerHTML = '';
                
                if (snapshot.exists()) {
                    // Convert to array
                    const designs = [];
                    snapshot.forEach((childSnapshot) => {
                        designs.push({
                            id: childSnapshot.key,
                            ...childSnapshot.val()
                        });
                    });
                    
                    // Sort by created date (newest first)
                    designs.sort((a, b) => b.createdDate - a.createdDate);
                    
                    // Display design projects
                    designs.forEach((design) => {
                        const row = createDesignRow(design);
                        designTableBody.appendChild(row);
                    });
                } else {
                    designTableBody.innerHTML = '<tr><td colspan="4">No design projects found. Add your first design!</td></tr>';
                }
            })
            .catch((error) => {
                console.error("Error fetching design projects:", error);
                designTableBody.innerHTML = '<tr><td colspan="4">Error loading design projects. Please try again.</td></tr>';
            });
    }
    
    // Create design table row
    function createDesignRow(design) {
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(design.createdDate);
        const formattedDate = date.toLocaleDateString();
        
        row.innerHTML = `
            <td>
                <div class="design-title-cell">
                    <img src="${design.imageUrl}" alt="${design.title}" width="50" height="50" style="object-fit: cover; border-radius: 6px; margin-right: 10px;">
                    ${design.title}
                </div>
            </td>
            <td>${design.category}</td>
            <td>${formattedDate}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit-btn" data-id="${design.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${design.id}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        
        // Add event listeners for edit and delete buttons
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', function() {
            editDesign(design);
        });
        
        deleteBtn.addEventListener('click', function() {
            deleteDesign(design.id, design.imageUrl);
        });
        
        return row;
    }
    
    // Edit design
    function editDesign(design) {
        openModal('design', design);
    }
    
    // Delete design
    function deleteDesign(designId, imageUrl) {
        if (confirm('Are you sure you want to delete this design? This action cannot be undone.')) {
            const db = firebase.database();
            const storage = firebase.storage();
            
            // Delete design data from database
            db.ref(`design/${designId}`).remove()
                .then(() => {
                    // Try to delete the image from storage if it's from our storage
                    if (imageUrl && imageUrl.includes('firebasestorage')) {
                        // Extract the path from the URL
                        const imageRef = storage.refFromURL(imageUrl);
                        
                        // Delete the file
                        return imageRef.delete();
                    }
                    return Promise.resolve();
                })
                .then(() => {
                    // Log activity
                    logActivity('delete', 'Design Deleted', 'A design was deleted from the portfolio.');
                    
                    // Reload design projects
                    loadDesignProjects();
                    
                    // Update design count
                    fetchDesignCount();
                    
                    alert('Design deleted successfully!');
                })
                .catch((error) => {
                    console.error("Error deleting design:", error);
                    alert('Error deleting design. Please try again.');
                });
        }
    }
    
    // Fetch design count
    function fetchDesignCount() {
        const db = firebase.database();
        db.ref('design').once('value')
            .then((snapshot) => {
                const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
                // Update count in dashboard if element exists
                const countElement = document.getElementById('design-count');
                if (countElement) {
                    countElement.textContent = count;
                }
            })
            .catch((error) => {
                console.error("Error fetching design count:", error);
            });
    }
    
    // Save experience data to Firebase
    function saveExperienceData(title, organization, type, startDate, endDate, description, tags, submitBtn, originalBtnText) {
        const db = firebase.database();
        const form = document.getElementById('experience-form');
        const experienceId = form.getAttribute('data-id');
        
        // Convert dates to timestamps
        const startTimestamp = new Date(startDate).getTime();
        const endTimestamp = endDate ? new Date(endDate).getTime() : null;
        
        const experienceData = {
            title: title,
            organization: organization,
            type: type,
            startDate: startTimestamp,
            endDate: endTimestamp,
            description: description,
            tags: tags,
            lastUpdated: Date.now()
        };
        
        let savePromise;
        
        if (experienceId) {
            // Update existing experience
            savePromise = db.ref(`experience/${experienceId}`).update(experienceData);
        } else {
            // Add new experience
            savePromise = db.ref('experience').push(experienceData);
        }
        
        savePromise
            .then(() => {
                // Log activity
                const activityType = experienceId ? 'update' : 'create';
                const activityTitle = experienceId ? 'Experience Updated' : 'New Experience Added';
                const activityDescription = `${title} at ${organization} was ${experienceId ? 'updated' : 'added'} to the experience section.`;
                
                logActivity(activityType, activityTitle, activityDescription);
                
                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
                
                // Reset form and close modal after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    closeModal('experience');
                    
                    // Reload experience entries
                    loadExperience();
                    
                    // Update experience count
                    fetchExperienceCount();
                }, 1500);
            })
            .catch((error) => {
                console.error("Error saving experience:", error);
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                alert(`Error saving experience: ${error.message}`);
            });
    }
    
    // Load experience entries
    function loadExperience() {
        const experienceTableBody = document.getElementById('experience-table-body');
        if (!experienceTableBody) return;
        
        const db = firebase.database();
        
        db.ref('experience').once('value')
            .then((snapshot) => {
                // Clear loading spinner
                experienceTableBody.innerHTML = '';
                
                if (snapshot.exists()) {
                    // Convert to array
                    const experiences = [];
                    snapshot.forEach((childSnapshot) => {
                        experiences.push({
                            id: childSnapshot.key,
                            ...childSnapshot.val()
                        });
                    });
                    
                    // Sort by start date (newest first)
                    experiences.sort((a, b) => b.startDate - a.startDate);
                    
                    // Display experience entries
                    experiences.forEach((experience) => {
                        const row = createExperienceRow(experience);
                        experienceTableBody.appendChild(row);
                    });
                } else {
                    experienceTableBody.innerHTML = '<tr><td colspan="5">No experience entries found. Add your first experience!</td></tr>';
                }
            })
            .catch((error) => {
                console.error("Error fetching experience entries:", error);
                experienceTableBody.innerHTML = '<tr><td colspan="5">Error loading experience entries. Please try again.</td></tr>';
            });
    }
    
    // Create experience table row
    function createExperienceRow(experience) {
        const row = document.createElement('tr');
        
        // Format dates
        const startDate = new Date(experience.startDate);
        const endDate = experience.endDate ? new Date(experience.endDate) : null;
        
        const formatDate = (date) => {
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        };
        
        const period = endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : `${formatDate(startDate)} - Present`;
        
        row.innerHTML = `
            <td>${experience.title}</td>
            <td>${experience.organization}</td>
            <td>${period}</td>
            <td>${experience.type.charAt(0).toUpperCase() + experience.type.slice(1)}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit-btn" data-id="${experience.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${experience.id}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        
     // Add event listeners for edit and delete buttons
const editBtn = row.querySelector('.edit-btn');
const deleteBtn = row.querySelector('.delete-btn');

editBtn.addEventListener('click', function() {
    editExperience(experience);
});

deleteBtn.addEventListener('click', function() {
    deleteExperience(experience.id);
});

// Edit experience function
function editExperience(experience) {
    openModal('experience', experience);
    
    // Format dates for the date inputs
    if (experience.startDate) {
        const startDate = new Date(experience.startDate);
        document.getElementById('experience-start-date').value = startDate.toISOString().split('T')[0];
    }
    
    if (experience.endDate) {
        const endDate = new Date(experience.endDate);
        document.getElementById('experience-end-date').value = endDate.toISOString().split('T')[0];
    }
    
    // Handle tags array
    if (experience.tags && Array.isArray(experience.tags)) {
        document.getElementById('experience-tags').value = experience.tags.join(', ');
    }
}

// Delete experience function
function deleteExperience(experienceId) {
    if (confirm('Are you sure you want to delete this experience? This action cannot be undone.')) {
        const db = firebase.database();
        
        db.ref(`experience/${experienceId}`).remove()
            .then(() => {
                // Log activity
                logActivity('delete', 'Experience Deleted', 'An experience entry was deleted from the database.');
                
                // Reload experience entries
                loadExperience();
                
                // Update experience count if needed
                fetchExperienceCount();
                
                alert('Experience deleted successfully!');
            })
            .catch((error) => {
                console.error("Error deleting experience:", error);
                alert('Error deleting experience. Please try again.');
            });
    }
}

