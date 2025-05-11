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
            openUploadModal('project');
        });
        
        // Load projects
        loadProjects();
    }
    
    // Load projects
    function loadProjects() {
        const projectsTableBody = document.getElementById('projects-table-body');
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
        openUploadModal('project', project);
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
                    // Add activity log
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
    
    // Upload modal initialization
    function initUploadModal() {
        const modal = document.getElementById('upload-modal');
        const closeBtn = modal.querySelector('.close-modal');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const form = document.getElementById('upload-form');
        const uploadTabs = document.querySelectorAll('.upload-tab');
        const dropzone = document.getElementById('image-dropzone');
        const fileInput = document.getElementById('file-input');
        const imageUrl = document.getElementById('image-url');
        const fetchUrlBtn = document.getElementById('fetch-url-btn');
        const imagePreview = document.getElementById('image-preview');
        
        // Close modal handlers
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Tab switching
        uploadTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                uploadTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding content
                const tabId = this.getAttribute('data-tab');
                document.querySelectorAll('.upload-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${tabId}-upload`).classList.add('active');
            });
        });
        
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
                handleFileSelect(e.dataTransfer.files[0]);
            }
        });
        
        fileInput.addEventListener('change', function() {
            if (this.files.length) {
                handleFileSelect(this.files[0]);
            }
        });
        
        // URL fetch button
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
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const title = document.getElementById('project-title').value;
            const description = document.getElementById('project-description').value;
            const status = document.getElementById('project-status').value;
            const technologies = document.getElementById('project-technologies').value.split(',').map(tech => tech.trim()).filter(tech => tech);
            const githubUrl = document.getElementById('project-github').value;
            const detailsUrl = document.getElementById('project-details').value;
            
            // Get image source (file or URL)
            const activeTab = document.querySelector('.upload-tab.active').getAttribute('data-tab');
            
            // Disable submit button and show loading
            const submitBtn = form.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            submitBtn.disabled = true;
            
            if (activeTab === 'file' && fileInput.files.length) {
                // Upload file to Firebase Storage
                uploadImageFile(fileInput.files[0], title, description, status, technologies, githubUrl, detailsUrl, submitBtn, originalBtnText);
            } else if (activeTab === 'url' && imageUrl.value.trim()) {
                // Upload from URL to Firebase Storage
                uploadImageFromUrl(imageUrl.value.trim(), title, description, status, technologies, githubUrl, detailsUrl, submitBtn, originalBtnText);
            } else {
                alert('Please select an image file or enter an image URL');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
        
        // Handle file selection
        function handleFileSelect(file) {
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
    
    // Open upload modal
    function openUploadModal(type, data = null) {
        const modal = document.getElementById('upload-modal');
        const form = document.getElementById('upload-form');
        const modalTitle = document.getElementById('modal-title');
        const imagePreview = document.getElementById('image-preview');
        
        // Reset form
        form.reset();
        imagePreview.style.display = 'none';
        
        // Set modal title based on type
        if (type === 'project') {
            modalTitle.textContent = data ? 'Edit Project' : 'Add New Project';
        }
        
        // If editing, populate form with data
        if (data) {
            document.getElementById('project-title').value = data.title;
            document.getElementById('project-description').value = data.description;
            document.getElementById('project-status').value = data.status;
            document.getElementById('project-technologies').value = data.technologies.join(', ');
            document.getElementById('project-github').value = data.githubUrl || '';
            document.getElementById('project-details').value = data.detailsUrl || '';
            
            // Show image preview
            imagePreview.src = data.imageUrl;
            imagePreview.style.display = 'block';
            
            // Set image URL if available
            document.getElementById('image-url').value = data.imageUrl;
            
            // Store project ID for update
            form.setAttribute('data-id', data.id);
        } else {
            // Clear project ID for new project
            form.removeAttribute('data-id');
        }
        
        // Show modal
        modal.style.display = 'block';
    }
    
    // Close modal
    function closeModal() {
        document.getElementById('upload-modal').style.display = 'none';
    }
    
    // Upload image file to Firebase Storage
    function uploadImageFile(file, title, description, status, technologies, githubUrl, detailsUrl, submitBtn, originalBtnText) {
        // Create a storage reference
        const storage = firebase.storage();
        const storageRef = storage.ref();
        
        // Create file metadata including the content type
        const metadata = {
            contentType: file.type
        };
        
        // Create a unique filename with timestamp to prevent overwriting
        const timestamp = new Date().getTime();
        const fileName = `projects/${timestamp}_${file.name.replace(/\s+/g, '_')}`;
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
                    // Save project data to Firebase Database
                    saveProjectData(downloadURL, title, description, status, technologies, githubUrl, detailsUrl, submitBtn, originalBtnText);
                });
            }
        );
    }
    
    // Upload image from URL to Firebase Storage
    function uploadImageFromUrl(url, title, description, status, technologies, githubUrl, detailsUrl, submitBtn, originalBtnText) {
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
                const fileName = `projects/${timestamp}_image_from_url.${blob.type.split('/')[1] || 'jpg'}`;
                
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
                            // Save project data to Firebase Database
                            saveProjectData(downloadURL, title, description, status, technologies, githubUrl, detailsUrl, submitBtn, originalBtnText);
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
    
    // Save project data to Firebase Database
    function saveProjectData(imageUrl, title, description, status, technologies, githubUrl, detailsUrl, submitBtn, originalBtnText) {
        const db = firebase.database();
        const form = document.getElementById('upload-form');
        const projectId = form.getAttribute('data-id');
        
        const projectData = {
            title: title,
            description: description,
            status: status,
            technologies: technologies,
            imageUrl: imageUrl,
            githubUrl: githubUrl || '',
            detailsUrl: detailsUrl || '',
            lastUpdated: Date.now()
        };
        
        let savePromise;
        
        if (projectId) {
            // Update existing project
            savePromise = db.ref(`projects/${projectId}`).update(projectData);
        } else {
            // Add new project
            savePromise = db.ref('projects').push(projectData);
        }
        
        savePromise
            .then(() => {
                // Log activity
                const activityType = projectId ? 'update' : 'create';
                const activityTitle = projectId ? 'Project Updated' : 'New Project Added';
                const activityDescription = `${title} was ${projectId ? 'updated' : 'added'} to the projects.`;
                
                logActivity(activityType, activityTitle, activityDescription);
                
                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
                
                // Reset form and close modal after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    closeModal();
                    
                    // Reload projects
                    loadProjects();
                    
                    // Update project count
                    fetchProjectCount();
                }, 1500);
            })
            .catch((error) => {
                console.error("Error saving project:", error);
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                alert(`Error saving project: ${error.message}`);
            });
    }
    
    // Log activity to Firebase
    function logActivity(type, title, description) {
        const db = firebase.database();
        
        db.ref('activity').push({
            type: type,
            title: title,
            description: description,
            timestamp: Date.now()
        }).catch((error) => {
            console.error("Error logging activity:", error);
        });
    }
});
