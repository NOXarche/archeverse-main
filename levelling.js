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
    initQuestSystem();
    initChallenges();
    initDungeons();
    initMarket();
    initAnimatedBackground();
    initModals();
    loadUserData();
    
    // Check auth status
    checkAuthStatus();
});

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
    
    // Initialize Analytics if available
    if (firebase.analytics) {
        firebase.analytics();
    }
}

// Check if user is authenticated and admin
function checkAuthStatus() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            console.log("User is signed in:", user.email);
            
            // Check if user has admin role from Firestore
            firebase.firestore().collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists && doc.data().isAdmin === true) {
                        console.log("User has admin role");
                        // Allow access to levelling system
                        document.getElementById('player-name').textContent = user.displayName || user.email;
                    } else {
                        // Not an admin, redirect to main page
                        console.log("User is not an admin, redirecting");
                        window.location.href = 'mainpage.html';
                    }
                })
                .catch((error) => {
                    console.error("Error checking admin status:", error);
                    window.location.href = 'auth.html';
                });
        } else {
            // No user is signed in, redirect to auth page
            console.log("No user is signed in, redirecting to auth page");
            window.location.href = 'auth.html';
        }
    });
}

// Load user data from Firebase
function loadUserData() {
    const currentUser = firebase.auth().currentUser;
    
    if (!currentUser) {
        setTimeout(loadUserData, 1000); // Try again in 1 second
        return;
    }
    
    const db = firebase.firestore();
    const userId = currentUser.uid;
    
    // Check if user has levelling data
    db.collection('levelling').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                // User has levelling data, load it
                const data = doc.data();
                updateUIWithUserData(data);
            } else {
                // User doesn't have levelling data, create it
                const initialData = {
                    level: 1,
                    xp: 0,
                    xpToNextLevel: 1000,
                    rank: 'E',
                    title: 'Novice',
                    growthCoins: 100,
                    health: 100,
                    energy: 100,
                    stats: {
                        intelligence: 10,
                        focus: 10,
                        discipline: 10,
                        vitality: 10
                    },
                    quests: {
                        daily: generateDailyQuests(),
                        lastReset: new Date().toISOString()
                    },
                    challenges: {
                        weekly: generateWeeklyChallenges(),
                        lastReset: new Date().toISOString()
                    },
                    dungeons: {
                        'gre-verbal': { progress: 0, completed: false },
                        'gate-cs': { progress: 0, completed: false },
                        'gate-da': { progress: 0, completed: false, locked: true }
                    },
                    inventory: [],
                    achievements: [],
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                // Save initial data
                return db.collection('levelling').doc(userId).set(initialData)
                    .then(() => {
                        updateUIWithUserData(initialData);
                    });
            }
        })
        .catch((error) => {
            console.error("Error loading user data:", error);
        });
}

// Update UI with user data
function updateUIWithUserData(data) {
    // Update level and XP
    document.querySelector('.avatar-level').textContent = data.level;
    document.querySelector('.level-text').textContent = `LEVEL ${data.level}`;
    document.querySelector('.player-title').textContent = data.title;
    
    const progressPercent = (data.xp / data.xpToNextLevel) * 100;
    document.querySelector('.progress-fill').style.width = `${progressPercent}%`;
    document.querySelector('.progress-text').textContent = `${data.xp} / ${data.xpToNextLevel} XP`;
    
    // Update rank
    document.querySelector('.rank-letter').textContent = data.rank;
    
    // Update resources
    document.getElementById('growth-coins').textContent = data.growthCoins.toLocaleString();
    document.getElementById('market-coins').textContent = data.growthCoins.toLocaleString();
    
    document.querySelector('.health-fill').style.width = `${data.health}%`;
    document.querySelector('.health .bar-text').textContent = `${data.health}/100`;
    
    document.querySelector('.energy-fill').style.width = `${data.energy}%`;
    document.querySelector('.energy .bar-text').textContent = `${data.energy}/100`;
    
    // Update stats
    updateStats(data.stats);
    
    // Update quests
    updateQuests(data.quests);
    
    // Update challenges
    updateChallenges(data.challenges);
    
    // Update dungeons
    updateDungeons(data.dungeons);
    
    // Update achievements
    if (data.achievements) {
        updateAchievements(data.achievements);
    }
}

// Update stats in UI
function updateStats(stats) {
    document.querySelector('.stat-item:nth-child(1) .stat-value').textContent = stats.intelligence;
    document.querySelector('.stat-item:nth-child(1) .stat-fill').style.width = `${stats.intelligence}%`;
    
    document.querySelector('.stat-item:nth-child(2) .stat-value').textContent = stats.focus;
    document.querySelector('.stat-item:nth-child(2) .stat-fill').style.width = `${stats.focus}%`;
    
    document.querySelector('.stat-item:nth-child(3) .stat-value').textContent = stats.discipline;
    document.querySelector('.stat-item:nth-child(3) .stat-fill').style.width = `${stats.discipline}%`;
    
    document.querySelector('.stat-item:nth-child(4) .stat-value').textContent = stats.vitality;
    document.querySelector('.stat-item:nth-child(4) .stat-fill').style.width = `${stats.vitality}%`;
}

// Generate daily quests
function generateDailyQuests() {
    return [
        {
            id: 'code-1h',
            name: 'Code for 1 hour',
            description: 'Complete a coding session',
            completed: false,
            rewards: {
                xp: 50,
                growthCoins: 10
            }
        },
        {
            id: 'study-gre',
            name: 'Study GRE Vocabulary',
            description: 'Learn 20 new words',
            completed: false,
            rewards: {
                xp: 30,
                growthCoins: 5
            }
        },
        {
            id: 'workout',
            name: '15-minute Workout',
            description: 'Complete a quick exercise routine',
            completed: false,
            rewards: {
                xp: 20,
                health: 5
            }
        },
        {
            id: 'read-article',
            name: 'Read Technical Article',
            description: 'Read and summarize one article',
            completed: false,
            rewards: {
                xp: 25,
                growthCoins: 8
            }
        },
        {
            id: 'drink-water',
            name: 'Drink 2L Water',
            description: 'Stay hydrated throughout the day',
            completed: false,
            rewards: {
                xp: 15,
                health: 10
            }
        }
    ];
}

// Generate weekly challenges
function generateWeeklyChallenges() {
    return [
        {
            id: 'leetcode',
            name: 'Complete 3 LeetCode Hard Problems',
            progress: 0,
            total: 3,
            completed: false,
            rewards: {
                xp: 200,
                growthCoins: 50
            }
        },
        {
            id: 'blog-post',
            name: 'Write 1 Blog Post',
            progress: 0,
            total: 1,
            completed: false,
            rewards: {
                xp: 150,
                growthCoins: 30
            }
        },
        {
            id: 'exercise',
            name: 'Exercise 5 Days',
            progress: 0,
            total: 5,
            completed: false,
            rewards: {
                xp: 100,
                health: 25
            }
        }
    ];
}

// Update quests in UI
function updateQuests(questData) {
    const questList = document.querySelector('.quest-list');
    questList.innerHTML = '';
    
    questData.daily.forEach((quest, index) => {
        const questItem = document.createElement('div');
        questItem.className = 'quest-item';
        questItem.innerHTML = `
            <div class="quest-checkbox">
                <input type="checkbox" id="quest${index+1}" ${quest.completed ? 'checked' : ''}>
                <label for="quest${index+1}"></label>
            </div>
            <div class="quest-info">
                <div class="quest-name">${quest.name}</div>
                <div class="quest-description">${quest.description}</div>
            </div>
            <div class="quest-rewards">
                ${quest.rewards.xp ? `<div class="reward xp">+${quest.rewards.xp} XP</div>` : ''}
                ${quest.rewards.growthCoins ? `<div class="reward coins">+${quest.rewards.growthCoins} ₲</div>` : ''}
                ${quest.rewards.health ? `<div class="reward health">+${quest.rewards.health} ❤️</div>` : ''}
            </div>
        `;
        
        questList.appendChild(questItem);
        
        // Add event listener to checkbox
        const checkbox = questItem.querySelector(`#quest${index+1}`);
        checkbox.addEventListener('change', function() {
            completeQuest(quest.id, this.checked);
        });
    });
    
    // Check if quests need to be reset (daily at midnight)
    const lastReset = new Date(questData.lastReset);
    const now = new Date();
    
    if (lastReset.getDate() !== now.getDate() || lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
        resetDailyQuests();
    }
}

// Update challenges in UI
function updateChallenges(challengeData) {
    const challengeList = document.querySelector('.challenge-list');
    challengeList.innerHTML = '';
    
    challengeData.weekly.forEach(challenge => {
        const progressPercent = (challenge.progress / challenge.total) * 100;
        
        const challengeItem = document.createElement('div');
        challengeItem.className = 'challenge-item';
        challengeItem.innerHTML = `
            <div class="challenge-icon">
                <i class="${getChallengeIcon(challenge.id)}"></i>
            </div>
            <div class="challenge-info">
                <div class="challenge-name">${challenge.name}</div>
                <div class="challenge-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                        <span class="progress-text">${challenge.progress}/${challenge.total}</span>
                    </div>
                </div>
            </div>
            <div class="challenge-rewards">
                ${challenge.rewards.xp ? `<div class="reward xp">+${challenge.rewards.xp} XP</div>` : ''}
                ${challenge.rewards.growthCoins ? `<div class="reward coins">+${challenge.rewards.growthCoins} ₲</div>` : ''}
                ${challenge.rewards.health ? `<div class="reward health">+${challenge.rewards.health} ❤️</div>` : ''}
            </div>
        `;
        
        challengeList.appendChild(challengeItem);
    });
    
    // Update countdown timer
    updateWeeklyCountdown(challengeData.lastReset);
    
    // Check if challenges need to be reset (weekly)
    const lastReset = new Date(challengeData.lastReset);
    const now = new Date();
    const daysSinceReset = Math.floor((now - lastReset) / (1000 * 60 * 60 * 24));
    
    if (daysSinceReset >= 7) {
        resetWeeklyChallenges();
    }
}

// Get icon for challenge
function getChallengeIcon(challengeId) {
    const icons = {
        'leetcode': 'fas fa-code',
        'blog-post': 'fas fa-pen-fancy',
        'exercise': 'fas fa-dumbbell'
    };
    
    return icons[challengeId] || 'fas fa-trophy';
}

// Update weekly countdown
function updateWeeklyCountdown(lastReset) {
    const lastResetDate = new Date(lastReset);
    const nextReset = new Date(lastResetDate);
    nextReset.setDate(nextReset.getDate() + 7);
    
    const now = new Date();
    const timeRemaining = nextReset - now;
    
    if (timeRemaining <= 0) {
        document.getElementById('week-countdown').textContent = 'Resetting...';
        return;
    }
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    document.getElementById('week-countdown').textContent = `${days}d ${hours}h ${minutes}m`;
    
    // Update every minute
    setTimeout(() => updateWeeklyCountdown(lastReset), 60000);
}

// Update dungeons in UI
function updateDungeons(dungeonData) {
    // GRE Verbal Dungeon
    if (dungeonData['gre-verbal']) {
        const greProgress = document.querySelector('.dungeon-item:nth-child(1) .progress-fill');
        const greText = document.querySelector('.dungeon-item:nth-child(1) .progress-text');
        
        greProgress.style.width = `${dungeonData['gre-verbal'].progress}%`;
        greText.textContent = `${dungeonData['gre-verbal'].progress}%`;
    }
    
    // GATE CS Algorithm Arena
    if (dungeonData['gate-cs']) {
        const gateCSProgress = document.querySelector('.dungeon-item:nth-child(2) .progress-fill');
        const gateCSText = document.querySelector('.dungeon-item:nth-child(2) .progress-text');
        
        gateCSProgress.style.width = `${dungeonData['gate-cs'].progress}%`;
        gateCSText.textContent = `${dungeonData['gate-cs'].progress}%`;
    }
    
    // GATE DA Data Modeling Chamber
    if (dungeonData['gate-da']) {
        const gateDaItem = document.querySelector('.dungeon-item:nth-child(3)');
        
        if (dungeonData['gate-da'].locked) {
            gateDaItem.classList.add('locked');
            gateDaItem.querySelector('.dungeon-btn').disabled = true;
        } else {
            gateDaItem.classList.remove('locked');
            gateDaItem.querySelector('.dungeon-btn').disabled = false;
            
            const gateDaProgress = gateDaItem.querySelector('.progress-fill');
            const gateDaText = gateDaItem.querySelector('.progress-text');
            
            gateDaProgress.style.width = `${dungeonData['gate-da'].progress}%`;
            gateDaText.textContent = `${dungeonData['gate-da'].progress}%`;
        }
    }
}

// Update achievements in UI
function updateAchievements(achievements) {
    const achievementList = document.querySelector('.achievement-list');
    achievementList.innerHTML = '';
    
    // Add unlocked achievements
    achievements.forEach(achievement => {
        const achievementItem = document.createElement('div');
        achievementItem.className = 'achievement-item unlocked';
        achievementItem.innerHTML = `
            <div class="achievement-icon">
                <i class="${achievement.icon}"></i>
            </div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            </div>
            <div class="achievement-date">Unlocked: ${formatDate(achievement.unlockedAt)}</div>
        `;
        
        achievementList.appendChild(achievementItem);
    });
    
    // Add locked achievements (hardcoded for now)
    const lockedAchievements = [
        {
            name: 'Vocab Vanquisher',
            description: 'Master 500 GRE vocabulary words',
            icon: 'fas fa-brain',
            progress: 300,
            total: 500
        },
        {
            name: 'Streak Master',
            description: 'Maintain a 30-day study streak',
            icon: 'fas fa-fire',
            progress: 12,
            total: 30
        }
    ];
    
    lockedAchievements.forEach(achievement => {
        // Skip if already unlocked
        if (achievements.some(a => a.name === achievement.name)) {
            return;
        }
        
        const progressPercent = (achievement.progress / achievement.total) * 100;
        
        const achievementItem = document.createElement('div');
        achievementItem.className = 'achievement-item';
        achievementItem.innerHTML = `
            <div class="achievement-icon">
                <i class="${achievement.icon}"></i>
            </div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
                <div class="achievement-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                        <span class="progress-text">${achievement.progress}/${achievement.total}</span>
                    </div>
                </div>
            </div>
        `;
        
        achievementList.appendChild(achievementItem);
    });
}

// Format date
function formatDate(timestamp) {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Complete quest
function completeQuest(questId, completed) {
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) return;
    
    const db = firebase.firestore();
    const userId = currentUser.uid;
    
    db.collection('levelling').doc(userId).get()
        .then((doc) => {
            if (!doc.exists) return;
            
            const data = doc.data();
            const questIndex = data.quests.daily.findIndex(q => q.id === questId);
            
            if (questIndex === -1) return;
            
            const quest = data.quests.daily[questIndex];
            
            // Update quest completion status
            data.quests.daily[questIndex].completed = completed;
            
            // If completing the quest, award rewards
            if (completed && !quest.completed) {
                // Award XP
                if (quest.rewards.xp) {
                    data.xp += quest.rewards.xp;
                    
                    // Check for level up
                    if (data.xp >= data.xpToNextLevel) {
                        levelUp(data);
                    }
                }
                
                // Award Growth Coins
                if (quest.rewards.growthCoins) {
                    data.growthCoins += quest.rewards.growthCoins;
                }
                
                // Award Health
                if (quest.rewards.health) {
                    data.health = Math.min(100, data.health + quest.rewards.health);
                }
                
                // Update related challenges
                updateChallengeProgress(data, questId);
                
                // Show quest complete modal
                showQuestCompleteModal(quest);
            }
            
            // Save updated data
            return db.collection('levelling').doc(userId).update(data)
                .then(() => {
                    // Update UI
                    updateUIWithUserData(data);
                });
        })
        .catch((error) => {
            console.error("Error completing quest:", error);
        });
}

// Update challenge progress based on completed quest
function updateChallengeProgress(data, questId) {
    // Map quests to challenges
    const questChallengeMap = {
        'code-1h': 'leetcode',
        'read-article': 'blog-post',
        'workout': 'exercise'
    };
    
    const challengeId = questChallengeMap[questId];
    if (!challengeId) return;
    
    const challengeIndex = data.challenges.weekly.findIndex(c => c.id === challengeId);
    if (challengeIndex === -1) return;
    
    const challenge = data.challenges.weekly[challengeIndex];
    
    // Increment progress if not already completed
    if (!challenge.completed && challenge.progress < challenge.total) {
        data.challenges.weekly[challengeIndex].progress += 1;
        
        // Check if challenge is now completed
        if (data.challenges.weekly[challengeIndex].progress >= challenge.total) {
            data.challenges.weekly[challengeIndex].completed = true;
            
            // Award rewards
            if (challenge.rewards.xp) {
                data.xp += challenge.rewards.xp;
                
                // Check for level up
                if (data.xp >= data.xpToNextLevel) {
                    levelUp(data);
                }
            }
            
            if (challenge.rewards.growthCoins) {
                data.growthCoins += challenge.rewards.growthCoins;
            }
            
            if (challenge.rewards.health) {
                data.health = Math.min(100, data.health + challenge.rewards.health);
            }
        }
    }
}

// Level up
function levelUp(data) {
    // Calculate how many levels gained
    const levelsGained = Math.floor(data.xp / data.xpToNextLevel);
    
    // Update level and XP
    data.level += levelsGained;
    data.xp = data.xp % data.xpToNextLevel;
    
    // Increase XP required for next level
    data.xpToNextLevel = Math.round(data.xpToNextLevel * 1.2);
    
    // Update rank if needed
    updateRank(data);
    
    // Show level up modal
    showLevelUpModal(data.level);
    
    // Unlock dungeons based on level
    if (data.level >= 30 && data.dungeons['gate-da'].locked) {
        data.dungeons['gate-da'].locked = false;
    }
}

// Update rank based on level
function updateRank(data) {
    const rankThresholds = {
        'E': 1,
        'D': 10,
        'C': 20,
        'B': 30,
        'A': 40,
        'S': 50
    };
    
    for (const [rank, threshold] of Object.entries(rankThresholds).reverse()) {
        if (data.level >= threshold) {
            data.rank = rank;
            break;
        }
    }
}

// Reset daily quests
function resetDailyQuests() {
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) return;
    
    const db = firebase.firestore();
    const userId = currentUser.uid;
    
    db.collection('levelling').doc(userId).get()
        .then((doc) => {
            if (!doc.exists) return;
            
            const data = doc.data();
            
            // Generate new quests
            data.quests.daily = generateDailyQuests();
            data.quests.lastReset = new Date().toISOString();
            
            // Save updated data
            return db.collection('levelling').doc(userId).update({
                'quests.daily': data.quests.daily,
                'quests.lastReset': data.quests.lastReset
            })
            .then(() => {
                // Update UI
                updateQuests(data.quests);
            });
        })
        .catch((error) => {
            console.error("Error resetting daily quests:", error);
        });
}

// Reset weekly challenges
function resetWeeklyChallenges() {
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) return;
    
    const db = firebase.firestore();
    const userId = currentUser.uid;
    
    db.collection('levelling').doc(userId).get()
        .then((doc) => {
            if (!doc.exists) return;
            
            const data = doc.data();
            
            // Generate new challenges
            data.challenges.weekly = generateWeeklyChallenges();
            data.challenges.lastReset = new Date().toISOString();
            
            // Save updated data
            return db.collection('levelling').doc(userId).update({
                'challenges.weekly': data.challenges.weekly,
                'challenges.lastReset': data.challenges.lastReset
            })
            .then(() => {
                // Update UI
                updateChallenges(data.challenges);
            });
        })
        .catch((error) => {
            console.error("Error resetting weekly challenges:", error);
        });
}

// Show level up modal
function showLevelUpModal(newLevel) {
    const modal = document.getElementById('level-up-modal');
    const levelText = modal.querySelector('.new-level');
    
    levelText.textContent = `Level ${newLevel}`;
    
    modal.style.display = 'flex';
    
    // Add event listener to continue button
    const continueBtn = modal.querySelector('.continue-btn');
    continueBtn.onclick = function() {
        modal.style.display = 'none';
    };
}

// Show quest complete modal
function showQuestCompleteModal(quest) {
    const modal = document.getElementById('quest-complete-modal');
    const questName = modal.querySelector('.quest-name');
    const rewardsEarned = modal.querySelector('.rewards-earned');
    
    questName.textContent = quest.name;
    
    // Clear previous rewards
    rewardsEarned.innerHTML = '';
    
    // Add XP reward
    if (quest.rewards.xp) {
        const xpReward = document.createElement('div');
        xpReward.className = 'reward-item';
        xpReward.innerHTML = `<i class="fas fa-star"></i><span>+${quest.rewards.xp} XP</span>`;
        rewardsEarned.appendChild(xpReward);
    }
    
    // Add Growth Coins reward
    if (quest.rewards.growthCoins) {
        const coinsReward = document.createElement('div');
        coinsReward.className = 'reward-item';
        coinsReward.innerHTML = `<img src="https://via.placeholder.com/20" alt="Growth Coin" class="coin-icon-small"><span>+${quest.rewards.growthCoins} GROWTH</span>`;
        rewardsEarned.appendChild(coinsReward);
    }
    
    // Add Health reward
    if (quest.rewards.health) {
        const healthReward = document.createElement('div');
        healthReward.className = 'reward-item';
        healthReward.innerHTML = `<i class="fas fa-heart"></i><span>+${quest.rewards.health} Health</span>`;
        rewardsEarned.appendChild(healthReward);
    }
    
    modal.style.display = 'flex';
    
    // Add event listener to continue button
    const continueBtn = modal.querySelector('.continue-btn');
    continueBtn.onclick = function() {
        modal.style.display = 'none';
    };
}

// Initialize quest system
function initQuestSystem() {
    const refreshBtn = document.getElementById('refresh-quests');
    
    refreshBtn.addEventListener('click', function() {
        this.classList.add('rotating');
        
        setTimeout(() => {
            this.classList.remove('rotating');
        }, 1000);
        
        resetDailyQuests();
    });
}

// Initialize challenges
function initChallenges() {
    // Nothing to do here for now
}

// Initialize dungeons
function initDungeons() {
    const dungeonBtns = document.querySelectorAll('.dungeon-btn');
    
    dungeonBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            
            const dungeonIds = ['gre-verbal', 'gate-cs', 'gate-da'];
            const dungeonId = dungeonIds[index];
            
            enterDungeon(dungeonId);
        });
    });
}

// Enter dungeon
function enterDungeon(dungeonId) {
    // In a real implementation, this would navigate to a dungeon-specific page
    // For now, just show an alert
    alert(`Entering ${dungeonId} dungeon. This feature is coming soon!`);
}

// Initialize market
function initMarket() {
    const buyBtns = document.querySelectorAll('.buy-btn');
    
    buyBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const itemNames = ['Focus Booster', 'Secret Notes', 'Cram Potion', 'VIP Project'];
            const itemPrices = [50, 120, 200, 300];
            
            const itemName = itemNames[index];
            const itemPrice = itemPrices[index];
            
            purchaseItem(itemName, itemPrice);
        });
    });
}

// Purchase item
function purchaseItem(itemName, price) {
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) return;
    
    const db = firebase.firestore();
    const userId = currentUser.uid;
    
    db.collection('levelling').doc(userId).get()
        .then((doc) => {
            if (!doc.exists) return;
            
            const data = doc.data();
            
            // Check if user has enough coins
            if (data.growthCoins < price) {
                alert(`Not enough GROWTH coins! You need ${price} coins to purchase ${itemName}.`);
                return;
            }
            
            // Deduct coins
            data.growthCoins -= price;
            
            // Add item to inventory
            if (!data.inventory) data.inventory = [];
            
            data.inventory.push({
                name: itemName,
                purchasedAt: new Date().toISOString()
            });
            
            // Save updated data
            return db.collection('levelling').doc(userId).update({
                growthCoins: data.growthCoins,
                inventory: data.inventory
            })
            .then(() => {
                // Update UI
                document.getElementById('growth-coins').textContent = data.growthCoins.toLocaleString();
                document.getElementById('market-coins').textContent = data.growthCoins.toLocaleString();
                
                alert(`Successfully purchased ${itemName}!`);
            });
        })
        .catch((error) => {
            console.error("Error purchasing item:", error);
        });
}

// Theme Toggle
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    themeToggleBtn.addEventListener('click', function() {
        // For Solo Leveling theme, we don't actually toggle the theme
        // Just add a fun animation
        this.classList.add('rotating');
        
        setTimeout(() => {
            this.classList.remove('rotating');
        }, 1000);
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
        particle.style.backgroundColor = 'rgba(35, 35, 255, 0.5)';
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

// Initialize modals
function initModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        // Close when clicking outside the modal content
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
}
