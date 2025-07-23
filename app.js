// PlannerPro Application JavaScript

// Global state
let currentTab = 'dashboard';
let tasks = [
    { id: 1, title: 'Review quarterly reports', priority: 'high', completed: false, dueDate: '2025-07-22' },
    { id: 2, title: 'Team standup meeting', priority: 'medium', completed: true, dueDate: '2025-07-22' },
    { id: 3, title: 'Update project documentation', priority: 'low', completed: false, dueDate: '2025-07-23' }
];

let goals = [
    { id: 1, title: 'Complete Project Alpha', category: 'work', progress: 75, target: 100 },
    { id: 2, title: 'Exercise 5x per week', category: 'health', progress: 3, target: 5 },
    { id: 3, title: 'Read 12 books this year', category: 'learning', progress: 8, target: 12 }
];

let habits = [
    { id: 1, name: '🧘 Morning meditation', streak: 7, completed: [true, true, true, true, true, true, true] },
    { id: 2, name: '💧 Drink water', streak: 12, completed: [true, true, false, true, true, true, true] }
];

let weeklyGoals = [
    { id: 1, title: 'Complete 3 workouts', progress: 3, target: 3, category: 'fitness', completed: true },
    { id: 2, title: 'Read 2 chapters', progress: 1, target: 2, category: 'learning', completed: false },
    { id: 3, title: 'Call 5 clients', progress: 0, target: 5, category: 'work', completed: false },
    { id: 4, title: 'Meal prep Sunday', progress: 1, target: 1, category: 'health', completed: true }
];

// DOM Elements
const navTabs = document.querySelectorAll('.nav-tab');
const mobileNavTabs = document.querySelectorAll('.mobile-nav-tab');
const tabContents = document.querySelectorAll('.tab-content');
const addTaskModal = document.getElementById('addTaskModal');
const addGoalModal = document.getElementById('addGoalModal');
const upgradeModal = document.getElementById('upgradeModal');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    renderTasks();
    renderGoals();
    renderHabits();
    renderTemplates();
    renderWeeklyGoals();
    updateDashboardStats();
});

function initializeApp() {
    // Set current date
    const dateElement = document.querySelector('.dashboard-date');
    if (dateElement) {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }

    // Initialize charts
    initializeCharts();
}

function setupEventListeners() {
    // Navigation tabs (desktop)
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });

    // Navigation tabs (mobile)
    mobileNavTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });

    // Modal controls
    setupModalControls();
    
    // Form submissions
    setupFormSubmissions();
    
    // Filter controls
    setupFilterControls();
    
    // Upgrade buttons
    setupUpgradeButtons();
    
    // Weekly goal interactions
    setupWeeklyGoalInteractions();
}

function switchTab(tabName) {
    // Update active tab (desktop)
    navTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update active tab (mobile)
    mobileNavTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update active content
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });

    currentTab = tabName;

    // Trigger specific tab initialization
    if (tabName === 'analytics') {
        initializeCharts();
    }
}

function setupModalControls() {
    // Modal close buttons
    document.querySelectorAll('.modal-close, .cancel-btn').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    // Modal overlay clicks
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModals();
            }
        });
    });

    // Add task buttons
    document.querySelectorAll('.add-task-btn, .add-quick-task').forEach(btn => {
        btn.addEventListener('click', () => {
            addTaskModal.style.display = 'flex';
        });
    });

    // Add goal button
    document.querySelector('.add-goal-btn')?.addEventListener('click', () => {
        addGoalModal.style.display = 'flex';
    });
}

function setupFormSubmissions() {
    // Add task form
    document.getElementById('addTaskForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask();
    });

    // Add goal form
    document.getElementById('addGoalForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        addGoal();
    });
}

function setupFilterControls() {
    // Task filters
    document.querySelector('.filter-priority')?.addEventListener('change', filterTasks);
    document.querySelector('.filter-status')?.addEventListener('change', filterTasks);
    
    // Template filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterTemplates(e.target.dataset.tier);
        });
    });
}

function setupUpgradeButtons() {
    document.querySelectorAll('.upgrade-btn, .upgrade-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            upgradeModal.style.display = 'flex';
        });
    });
}

function setupWeeklyGoalInteractions() {
    // Week navigation buttons
    document.querySelector('.prev-week-btn')?.addEventListener('click', () => {
        showUpgradePrompt('Week navigation is a premium feature');
    });
    
    document.querySelector('.next-week-btn')?.addEventListener('click', () => {
        showUpgradePrompt('Week navigation is a premium feature');
    });
    
    // Add weekly goal button
    document.querySelector('.add-weekly-goal-btn')?.addEventListener('click', () => {
        showUpgradePrompt('Adding custom weekly goals requires a premium subscription');
    });
}

function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.style.display = 'none';
    });
}

function addTask() {
    const title = document.getElementById('taskTitle').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;

    if (tasks.length >= 10) {
        showUpgradePrompt('Free tier limited to 10 tasks. Upgrade for unlimited tasks!');
        return;
    }

    const newTask = {
        id: Date.now(),
        title,
        priority,
        completed: false,
        dueDate
    };

    tasks.push(newTask);
    renderTasks();
    updateDashboardStats();
    closeModals();
    
    // Reset form
    document.getElementById('addTaskForm').reset();
    
    showNotification('Task added successfully! 🎉', 'success');
}

function addGoal() {
    const title = document.getElementById('goalTitle').value;
    const category = document.getElementById('goalCategory').value;
    const target = parseInt(document.getElementById('goalTarget').value);

    if (goals.length >= 5) {
        showUpgradePrompt('Free tier limited to 5 goals. Upgrade for unlimited goals!');
        return;
    }

    const newGoal = {
        id: Date.now(),
        title,
        category,
        progress: 0,
        target
    };

    goals.push(newGoal);
    renderGoals();
    updateDashboardStats();
    closeModals();
    
    // Reset form
    document.getElementById('addGoalForm').reset();
    
    showNotification('Goal added successfully! 🎯', 'success');
}

function renderTasks() {
    const taskList = document.getElementById('mainTaskList');
    const dashboardTasks = document.getElementById('dashboardTasks');
    
    if (!taskList) return;

    taskList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
            <div class="task-content">
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                       onchange="toggleTask(${task.id})">
                <span class="task-title">${task.title}</span>
            </div>
            <span class="task-priority ${task.priority}">${task.priority}</span>
            <span class="task-due-date">${task.dueDate || 'No date'}</span>
            <div class="task-actions">
                <button class="btn btn--sm btn--outline" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `).join('');

    // Update dashboard tasks (first 3)
    if (dashboardTasks) {
        dashboardTasks.innerHTML = tasks.slice(0, 3).map((task, index) => `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <input type="checkbox" id="dashTask${index}" ${task.completed ? 'checked' : ''} 
                       onchange="toggleTask(${task.id})">
                <label for="dashTask${index}" class="${task.completed ? 'completed' : ''}">${task.title}</label>
                <span class="task-priority ${task.priority}">${task.priority}</span>
            </div>
        `).join('');
    }
}

function renderGoals() {
    const goalsGrid = document.getElementById('goalsGrid');
    if (!goalsGrid) return;

    goalsGrid.innerHTML = goals.map(goal => `
        <div class="goal-card">
            <div class="goal-header">
                <h4>${goal.title}</h4>
                <span class="goal-category ${goal.category}">${goal.category}</span>
            </div>
            <div class="goal-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(goal.progress / goal.target) * 100}%"></div>
                </div>
                <span class="progress-text">${goal.progress}/${goal.target}</span>
            </div>
            <div class="goal-actions">
                <button class="btn btn--sm btn--outline" onclick="updateGoalProgress(${goal.id})">Update</button>
                <button class="btn btn--sm btn--outline" onclick="deleteGoal(${goal.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function renderHabits() {
    const habitsGrid = document.getElementById('habitsGrid');
    if (!habitsGrid) return;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    habitsGrid.innerHTML = `
        <div class="habits-header">
            <div class="habit-name-header">Habit</div>
            ${days.map(day => `<div class="day-header">${day}</div>`).join('')}
            <div class="streak-header">Streak</div>
        </div>
        ${habits.map(habit => `
            <div class="habit-row">
                <div class="habit-name">${habit.name}</div>
                ${habit.completed.map((completed, index) => `
                    <div class="habit-day ${completed ? 'completed' : ''}" 
                         onclick="toggleHabit(${habit.id}, ${index})">
                        ${completed ? '✓' : ''}
                    </div>
                `).join('')}
                <div class="habit-streak">${habit.streak} days</div>
            </div>
        `).join('')}
    `;
}

function renderTemplates() {
    const templatesGrid = document.getElementById('templatesGrid');
    if (!templatesGrid) return;

    const templates = [
        { name: 'Daily Planner', tier: 'free', description: 'Basic daily task planning' },
        { name: 'Weekly Review', tier: 'free', description: 'Weekly goal assessment' },
        { name: 'Project Tracker', tier: 'free', description: 'Simple project management' },
        { name: 'Habit Builder', tier: 'basic', description: 'Advanced habit tracking' },
        { name: 'Goal Setting', tier: 'basic', description: 'SMART goal framework' },
        { name: 'Time Blocking', tier: 'pro', description: 'Advanced time management' },
        { name: 'Team Planner', tier: 'pro', description: 'Collaborative planning' }
    ];

    templatesGrid.innerHTML = templates.map(template => `
        <div class="template-card ${template.tier}" data-tier="${template.tier}">
            <div class="template-header">
                <h4>${template.name}</h4>
                <span class="template-tier ${template.tier}">${template.tier}</span>
            </div>
            <p class="template-description">${template.description}</p>
            <button class="btn btn--primary btn--sm ${template.tier !== 'free' ? 'premium-feature' : ''}" 
                    onclick="${template.tier === 'free' ? 'useTemplate()' : 'showUpgradePrompt()'}">
                ${template.tier === 'free' ? 'Use Template' : 'Upgrade to Use'}
            </button>
        </div>
    `).join('');
}

function renderWeeklyGoals() {
    const weeklyGoalsList = document.querySelector('.weekly-goals-list');
    if (!weeklyGoalsList) return;

    const categoryIcons = {
        fitness: '💪',
        learning: '📚',
        work: '💼',
        health: '🥗'
    };

    weeklyGoalsList.innerHTML = weeklyGoals.map(goal => `
        <div class="weekly-goal-item ${goal.completed ? 'completed' : goal.progress > 0 ? 'in-progress' : 'pending'}" 
             data-goal-id="${goal.id}">
            <div class="goal-checkbox" onclick="updateWeeklyGoalProgress(${goal.id})">
                ${goal.completed ? 
                    '<svg class="checkmark" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/></svg>' :
                    goal.progress > 0 ? '<div class="progress-indicator"></div>' : '<div class="empty-indicator"></div>'
                }
            </div>
            <div class="goal-content">
                <span class="goal-title">${goal.title}</span>
                <div class="goal-progress-mini">
                    <div class="progress-dots">
                        ${Array.from({length: goal.target}, (_, i) => 
                            `<span class="dot ${i < goal.progress ? 'completed' : 'pending'}"></span>`
                        ).join('')}
                    </div>
                    <span class="goal-count">${goal.progress}/${goal.target}</span>
                </div>
            </div>
            <div class="goal-category ${goal.category}">${categoryIcons[goal.category] || '📋'}</div>
        </div>
    `).join('');

    updateWeeklyProgress();
}

function updateWeeklyProgress() {
    const completedGoals = weeklyGoals.filter(goal => goal.completed).length;
    const totalGoals = weeklyGoals.length;
    const percentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    
    // Update progress ring
    const progressRing = document.querySelector('.progress-ring-progress');
    const progressText = document.querySelector('.progress-percentage');
    
    if (progressRing && progressText) {
        const circumference = 2 * Math.PI * 32; // radius = 32
        const offset = circumference - (percentage / 100) * circumference;
        progressRing.style.strokeDashoffset = offset;
        progressText.textContent = `${percentage}%`;
    }
}

function updateWeeklyGoalProgress(goalId) {
    const goal = weeklyGoals.find(g => g.id === goalId);
    if (!goal || goal.completed) return;

    goal.progress = Math.min(goal.progress + 1, goal.target);
    if (goal.progress >= goal.target) {
        goal.completed = true;
        showNotification('Weekly goal completed! 🎉', 'success');
        
        // Add celebration animation
        const goalElement = document.querySelector(`[data-goal-id="${goalId}"]`);
        if (goalElement) {
            goalElement.style.animation = 'bounce 0.6s ease-in-out';
            setTimeout(() => {
                goalElement.style.animation = '';
            }, 600);
        }
    }

    renderWeeklyGoals();
    updateDashboardStats();
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateDashboardStats();
        
        if (task.completed) {
            showNotification('Task completed! Great job! 🎉', 'success');
        }
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    renderTasks();
    updateDashboardStats();
    showNotification('Task deleted', 'info');
}

function toggleHabit(habitId, dayIndex) {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
        habit.completed[dayIndex] = !habit.completed[dayIndex];
        
        // Recalculate streak
        let streak = 0;
        for (let i = habit.completed.length - 1; i >= 0; i--) {
            if (habit.completed[i]) {
                streak++;
            } else {
                break;
            }
        }
        habit.streak = streak;
        
        renderHabits();
        updateDashboardStats();
        
        if (habit.completed[dayIndex]) {
            showNotification('Habit tracked! Keep it up! 💪', 'success');
        }
    }
}

function updateGoalProgress(goalId) {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
        const newProgress = prompt(`Update progress for "${goal.title}" (current: ${goal.progress}/${goal.target}):`);
        if (newProgress !== null && !isNaN(newProgress)) {
            goal.progress = Math.min(Math.max(0, parseInt(newProgress)), goal.target);
            renderGoals();
            updateDashboardStats();
            showNotification('Goal progress updated! 📈', 'success');
        }
    }
}

function deleteGoal(goalId) {
    goals = goals.filter(g => g.id !== goalId);
    renderGoals();
    updateDashboardStats();
    showNotification('Goal deleted', 'info');
}

function filterTasks() {
    const priorityFilter = document.querySelector('.filter-priority').value;
    const statusFilter = document.querySelector('.filter-status').value;
    
    const taskItems = document.querySelectorAll('#mainTaskList .task-item');
    
    taskItems.forEach(item => {
        const taskId = parseInt(item.dataset.taskId);
        const task = tasks.find(t => t.id === taskId);
        
        let show = true;
        
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
            show = false;
        }
        
        if (statusFilter !== 'all') {
            if (statusFilter === 'completed' && !task.completed) show = false;
            if (statusFilter === 'pending' && task.completed) show = false;
        }
        
        item.style.display = show ? 'flex' : 'none';
    });
}

function filterTemplates(tier) {
    const templateCards = document.querySelectorAll('.template-card');
    
    templateCards.forEach(card => {
        if (tier === 'all' || card.dataset.tier === tier) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function updateDashboardStats() {
    // Update task stats
    const todayTasks = tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0]).length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const activeGoals = goals.length;
    const bestStreak = Math.max(...habits.map(h => h.streak), 0);
    
    document.getElementById('todayTasks').textContent = todayTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('activeGoals').textContent = activeGoals;
    document.getElementById('habitStreak').textContent = bestStreak;
}

function initializeCharts() {
    // Simple chart initialization (placeholder)
    const charts = ['taskCompletionChart', 'goalProgressChart', 'habitStreakChart'];
    
    charts.forEach(chartId => {
        const canvas = document.getElementById(chartId);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#1FB8CD';
            ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
            ctx.fillStyle = '#9333EA';
            ctx.fillRect(0, canvas.height - 80, canvas.width * 0.7, 30);
        }
    });
}

function useTemplate() {
    showNotification('Template applied successfully! 📋', 'success');
}

function showUpgradePrompt(message = 'This feature requires a premium subscription') {
    showNotification(message + ' 👑', 'upgrade');
    setTimeout(() => {
        upgradeModal.style.display = 'flex';
    }, 2000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✅' : type === 'upgrade' ? '👑' : 'ℹ️'}
            </span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}