// PlannerPro Digital Productivity Planner JavaScript - Fixed Version

// Sample data based on provided JSON
const sampleData = {
  tasks: [
    {id: 1, title: "Review quarterly reports", priority: "high", completed: false, dueDate: "2025-07-25"},
    {id: 2, title: "Team standup meeting", priority: "medium", completed: true, dueDate: "2025-07-23"},
    {id: 3, title: "Update project documentation", priority: "low", completed: false, dueDate: "2025-07-26"}
  ],
  goals: [
    {id: 1, title: "Complete Project Alpha", progress: 75, target: 100, category: "work"},
    {id: 2, title: "Exercise 5x per week", progress: 3, target: 5, category: "health"},
    {id: 3, title: "Read 2 books this month", progress: 1, target: 2, category: "personal"}
  ],
  habits: [
    {id: 1, title: "Morning meditation", streak: 7, completed: true},
    {id: 2, title: "Drink 8 glasses of water", streak: 12, completed: false},
    {id: 3, title: "Write daily journal", streak: 5, completed: true}
  ],
  templates: [
    {id: 1, title: "Daily Focus Planner", price: 7, preview: "Priority planning with time blocking", tier: "free"},
    {id: 2, title: "Weekly Goal Tracker", price: 12, preview: "Goal breakdown and progress monitoring", tier: "basic"},
    {id: 3, title: "Monthly Reflection Journal", price: 15, preview: "Achievement review and planning", tier: "basic"},
    {id: 4, title: "Habit Tracker Dashboard", price: 10, preview: "Visual habit building with streaks", tier: "basic"},
    {id: 5, title: "Project Management Board", price: 18, preview: "Deadline tracking and milestones", tier: "pro"}
  ]
};

// App state
const appState = {
  currentTab: 'dashboard',
  currentTier: 'free',
  tasks: [...sampleData.tasks],
  goals: [...sampleData.goals],
  habits: [...sampleData.habits],
  templates: [...sampleData.templates],
  taskIdCounter: 4,
  goalIdCounter: 4,
  habitIdCounter: 4,
  limitations: {
    free: { maxGoals: 5, maxTasks: 10, maxTemplates: 3 },
    basic: { maxGoals: Infinity, maxTasks: Infinity, maxTemplates: 10 },
    pro: { maxGoals: Infinity, maxTasks: Infinity, maxTemplates: 50 },
    premium: { maxGoals: Infinity, maxTasks: Infinity, maxTemplates: Infinity }
  }
};

// Utility functions
function showNotification(message, type = 'info') {
  // Remove existing notifications first
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(n => n.remove());
  
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-base);
    padding: var(--space-12) var(--space-16);
    box-shadow: var(--shadow-lg);
    z-index: 2001;
    max-width: 350px;
    font-size: var(--font-size-sm);
    color: var(--color-text);
    transform: translateX(400px);
    transition: transform 0.3s ease-out;
    line-height: 1.4;
  `;
  
  if (type === 'success') {
    notification.style.borderLeft = '4px solid var(--color-success)';
    notification.innerHTML = `<span class="success-checkmark"></span> ${message}`;
  } else if (type === 'error') {
    notification.style.borderLeft = '4px solid var(--color-error)';
    notification.innerHTML = `<span style="color: var(--color-error);">⚠️</span> ${message}`;
  } else if (type === 'warning') {
    notification.style.borderLeft = '4px solid var(--color-warning)';
    notification.innerHTML = `<span style="color: var(--color-warning);">⚡</span> ${message}`;
  } else {
    notification.style.borderLeft = '4px solid var(--color-primary)';
    notification.innerHTML = `<span style="color: var(--color-primary);">ℹ️</span> ${message}`;
  }
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function checkLimitations(type, showUpgrade = true) {
  const limits = appState.limitations[appState.currentTier];
  const current = appState[type].length;
  const max = limits[`max${type.charAt(0).toUpperCase() + type.slice(1)}`];
  
  if (current >= max) {
    if (showUpgrade) {
      showNotification(`Free tier limit reached (${current}/${max} ${type}). Upgrade for unlimited access!`, 'warning');
      setTimeout(() => showUpgradeModal(), 1500);
    }
    return false;
  }
  return true;
}

// Tab navigation - FIXED
function switchTab(tabName) {
  console.log('Switching to tab:', tabName);
  
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active class from all nav tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab
  const targetTab = document.getElementById(tabName);
  const navTab = document.querySelector(`.nav-tab[data-tab="${tabName}"]`);
  
  if (targetTab && navTab) {
    targetTab.classList.add('active');
    navTab.classList.add('active');
    appState.currentTab = tabName;
    
    // Update content based on tab
    switch (tabName) {
      case 'dashboard':
        updateDashboard();
        break;
      case 'tasks':
        renderTasks();
        break;
      case 'goals':
        renderGoals();
        break;
      case 'habits':
        renderHabits();
        break;
      case 'analytics':
        renderAnalytics();
        break;
      case 'templates':
        renderTemplates();
        break;
      case 'premium':
        renderPremium();
        break;
    }
    
    showNotification(`Switched to ${tabName.charAt(0).toUpperCase() + tabName.slice(1)} section`, 'info');
  } else {
    console.error('Tab not found:', tabName);
  }
}

// Dashboard functions - FIXED
function updateDashboard() {
  const completedTasks = appState.tasks.filter(task => task.completed).length;
  const totalTasks = appState.tasks.length;
  const activeGoals = appState.goals.length;
  const bestStreak = Math.max(...appState.habits.map(h => h.streak), 0);
  
  // Update stats
  const todayTasksEl = document.getElementById('todayTasks');
  const completedTasksEl = document.getElementById('completedTasks');
  const activeGoalsEl = document.getElementById('activeGoals');
  const habitStreakEl = document.getElementById('habitStreak');
  
  if (todayTasksEl) todayTasksEl.textContent = totalTasks;
  if (completedTasksEl) completedTasksEl.textContent = completedTasks;
  if (activeGoalsEl) activeGoalsEl.textContent = activeGoals;
  if (habitStreakEl) habitStreakEl.textContent = bestStreak;
  
  // Update dashboard tasks
  const dashboardTasks = document.getElementById('dashboardTasks');
  if (dashboardTasks) {
    dashboardTasks.innerHTML = '';
    
    appState.tasks.slice(0, 3).forEach((task) => {
      const taskElement = document.createElement('div');
      taskElement.className = 'task-item';
      taskElement.innerHTML = `
        <input type="checkbox" id="dash-task-${task.id}" ${task.completed ? 'checked' : ''}>
        <label for="dash-task-${task.id}" ${task.completed ? 'class="completed"' : ''}>${task.title}</label>
        <span class="task-priority ${task.priority}">${task.priority}</span>
      `;
      
      const checkbox = taskElement.querySelector('input');
      checkbox.addEventListener('change', () => {
        toggleTask(task.id);
        updateDashboard();
      });
      
      dashboardTasks.appendChild(taskElement);
    });
  }
}

// Task management - FIXED
function renderTasks() {
  const taskList = document.getElementById('mainTaskList');
  if (!taskList) return;
  
  taskList.innerHTML = '';
  
  appState.tasks.forEach(task => {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
        <label for="task-${task.id}" ${task.completed ? 'class="completed"' : ''}>${task.title}</label>
      </div>
      <span class="task-priority ${task.priority}">${task.priority}</span>
      <span class="task-due-date">${formatDate(task.dueDate)}</span>
      <div>
        <button class="btn btn--outline btn--sm edit-task-btn" data-task-id="${task.id}">Edit</button>
        <button class="btn btn--outline btn--sm delete-task-btn" data-task-id="${task.id}" style="margin-left: 8px; color: var(--color-error);">Delete</button>
      </div>
    `;
    
    const checkbox = taskElement.querySelector('input');
    checkbox.addEventListener('change', () => {
      toggleTask(task.id);
    });
    
    taskList.appendChild(taskElement);
  });
  
  // Add event listeners for edit and delete buttons
  document.querySelectorAll('.edit-task-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const taskId = parseInt(e.target.dataset.taskId);
      editTask(taskId);
    });
  });
  
  document.querySelectorAll('.delete-task-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const taskId = parseInt(e.target.dataset.taskId);
      deleteTask(taskId);
    });
  });
  
  // Update limitation notice
  updateTaskLimitationNotice();
}

function updateTaskLimitationNotice() {
  const currentTasks = appState.tasks.length;
  const maxTasks = appState.limitations[appState.currentTier].maxTasks;
  
  if (maxTasks !== Infinity) {
    const notice = document.querySelector('#tasks .limitation-notice');
    if (notice) {
      const noticeText = notice.querySelector('.notice-text');
      if (noticeText) {
        noticeText.innerHTML = `<strong>Free Tier:</strong> ${currentTasks} of ${maxTasks} tasks used. <a href="#" class="upgrade-link">Upgrade to Basic</a> for unlimited tasks.`;
      }
    }
  }
}

function addTask(title, priority, dueDate) {
  if (!checkLimitations('tasks')) {
    return false;
  }
  
  // Add loading state
  const addButton = document.querySelector('#addTaskModal .btn--primary');
  if (addButton) {
    addButton.innerHTML = '<div class="spinner"></div> Adding...';
    addButton.disabled = true;
  }
  
  // Simulate API call delay for better UX
  setTimeout(() => {
    const newTask = {
      id: appState.taskIdCounter++,
      title,
      priority,
      completed: false,
      dueDate: dueDate || new Date().toISOString().split('T')[0]
    };
    
    appState.tasks.unshift(newTask);
    if (appState.currentTab === 'tasks') renderTasks();
    updateDashboard();
    
    // Reset button
    if (addButton) {
      addButton.innerHTML = 'Add Task';
      addButton.disabled = false;
    }
    
    showNotification('Task added successfully! 🎉', 'success');
    
    // Add bounce animation to new task
    setTimeout(() => {
      const newTaskElement = document.querySelector(`[data-task-id="${newTask.id}"]`);
      if (newTaskElement) {
        newTaskElement.closest('.task-item').classList.add('bounce-in');
      }
    }, 100);
  }, 800);
  
  return true;
}

function toggleTask(taskId) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    
    // Add visual feedback
    const taskElement = document.querySelector(`#task-${taskId}`);
    if (taskElement) {
      const taskItem = taskElement.closest('.task-item');
      if (task.completed) {
        taskItem.classList.add('bounce-in');
        setTimeout(() => taskItem.classList.remove('bounce-in'), 600);
      }
    }
    
    if (appState.currentTab === 'tasks') renderTasks();
    updateDashboard();
    
    if (task.completed) {
      showNotification('Task completed! Great job! 🎉', 'success');
      // Confetti effect simulation
      setTimeout(() => {
        showNotification('🎊 Keep up the momentum!', 'info');
      }, 1500);
    } else {
      showNotification('Task reopened 🔄', 'info');
    }
  }
}

function deleteTask(taskId) {
  if (confirm('Are you sure you want to delete this task?')) {
    appState.tasks = appState.tasks.filter(t => t.id !== taskId);
    if (appState.currentTab === 'tasks') renderTasks();
    updateDashboard();
    showNotification('Task deleted', 'info');
  }
}

function editTask(taskId) {
  showNotification('Task editing is available in Basic tier ($19/month). Upgrade to unlock!', 'info');
  setTimeout(() => showUpgradeModal(), 1000);
}

// Goal management - FIXED
function renderGoals() {
  const goalsGrid = document.getElementById('goalsGrid');
  if (!goalsGrid) return;
  
  goalsGrid.innerHTML = '';
  
  appState.goals.forEach(goal => {
    const progressPercent = Math.round((goal.progress / goal.target) * 100);
    const goalCard = document.createElement('div');
    goalCard.className = 'goal-card';
    goalCard.innerHTML = `
      <div class="goal-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
        <div>
          <h3 style="margin: 0 0 8px 0;">${goal.title}</h3>
          <span class="goal-category ${goal.category}">${goal.category}</span>
        </div>
        <button class="btn btn--outline btn--sm update-goal-btn" data-goal-id="${goal.id}">Update</button>
      </div>
      <div class="goal-progress">
        <div class="progress-bar" style="width: 100%; margin-bottom: 8px;">
          <div class="progress-fill" style="width: ${progressPercent}%"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px;">
          <span>${goal.progress} / ${goal.target}</span>
          <span>${progressPercent}%</span>
        </div>
      </div>
    `;
    goalsGrid.appendChild(goalCard);
  });
  
  // Add event listeners for update buttons
  document.querySelectorAll('.update-goal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const goalId = parseInt(e.target.dataset.goalId);
      updateGoalProgress(goalId);
    });
  });
  
  // Update limitation notice
  updateGoalLimitationNotice();
}

function updateGoalLimitationNotice() {
  const currentGoals = appState.goals.length;
  const maxGoals = appState.limitations[appState.currentTier].maxGoals;
  
  if (maxGoals !== Infinity) {
    const notice = document.querySelector('#goals .limitation-notice');
    if (notice) {
      const noticeText = notice.querySelector('.notice-text');
      if (noticeText) {
        noticeText.innerHTML = `<strong>Free Tier:</strong> ${currentGoals} of ${maxGoals} goals used. <a href="#" class="upgrade-link">Upgrade to Basic</a> for unlimited goals.`;
      }
    }
  }
}

function addGoal(title, category, target) {
  if (!checkLimitations('goals')) {
    return false;
  }
  
  // Add loading state
  const addButton = document.querySelector('#addGoalModal .btn--primary');
  if (addButton) {
    addButton.innerHTML = '<div class="spinner"></div> Creating...';
    addButton.disabled = true;
  }
  
  setTimeout(() => {
    const newGoal = {
      id: appState.goalIdCounter++,
      title,
      progress: 0,
      target: parseInt(target),
      category
    };
    
    appState.goals.push(newGoal);
    if (appState.currentTab === 'goals') renderGoals();
    updateDashboard();
    
    // Reset button
    if (addButton) {
      addButton.innerHTML = 'Add Goal';
      addButton.disabled = false;
    }
    
    showNotification('Goal created! Time to make it happen! 🎯', 'success');
  }, 600);
  
  return true;
}

function updateGoalProgress(goalId) {
  const goal = appState.goals.find(g => g.id === goalId);
  if (goal) {
    const newProgress = prompt(`Update progress for "${goal.title}" (current: ${goal.progress}/${goal.target}):`, goal.progress);
    if (newProgress !== null) {
      const progress = Math.max(0, Math.min(parseInt(newProgress) || 0, goal.target));
      goal.progress = progress;
      if (appState.currentTab === 'goals') renderGoals();
      updateDashboard();
      showNotification('Goal progress updated! 📈', 'success');
    }
  }
}

// Habit management - FIXED
function renderHabits() {
  const habitsGrid = document.getElementById('habitsGrid');
  if (!habitsGrid) return;
  
  habitsGrid.innerHTML = '';
  
  // Create week header
  const weekHeader = document.createElement('div');
  weekHeader.className = 'habit-row';
  weekHeader.style.fontWeight = 'bold';
  weekHeader.innerHTML = `
    <div>Habit</div>
    <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
  `;
  habitsGrid.appendChild(weekHeader);
  
  appState.habits.forEach(habit => {
    const habitRow = document.createElement('div');
    habitRow.className = 'habit-row';
    
    let habitDays = `<div>${habit.title} <span style="color: var(--color-primary); font-weight: bold;">🔥${habit.streak}</span></div>`;
    
    for (let day = 0; day < 7; day++) {
      const isCompleted = Math.random() > 0.4; // Random completion for demo
      habitDays += `
        <div class="habit-day ${isCompleted ? 'completed' : ''}" data-habit-id="${habit.id}" data-day="${day}">
          ${isCompleted ? '✓' : ''}
        </div>
      `;
    }
    
    habitRow.innerHTML = habitDays;
    habitsGrid.appendChild(habitRow);
  });
  
  // Add event listeners for habit day toggles
  document.querySelectorAll('.habit-day').forEach(day => {
    day.addEventListener('click', (e) => {
      const habitId = parseInt(e.target.dataset.habitId);
      const dayIndex = parseInt(e.target.dataset.day);
      toggleHabitDay(habitId, dayIndex);
    });
  });
}

function toggleHabitDay(habitId, day) {
  const habitDay = document.querySelector(`[data-habit-id="${habitId}"][data-day="${day}"]`);
  if (habitDay) {
    if (habitDay.classList.contains('completed')) {
      habitDay.classList.remove('completed');
      habitDay.textContent = '';
      showNotification('Habit unchecked. Tomorrow is a new opportunity! 💪', 'info');
    } else {
      habitDay.classList.add('completed');
      habitDay.textContent = '✓';
      habitDay.classList.add('bounce-in');
      setTimeout(() => habitDay.classList.remove('bounce-in'), 600);
      
      // Motivational messages
      const messages = [
        'Habit completed! Building consistency! 🔥',
        'Great job! Your streak is growing! ⚡',
        'Consistency is key! Keep it up! 💪',
        'Another day, another win! 🎯',
        'You\'re building momentum! 🚀'
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      showNotification(randomMessage, 'success');
    }
  }
}

// Analytics - FIXED
function renderAnalytics() {
  // Simple analytics without external libraries
  setTimeout(() => {
    drawSimpleCharts();
  }, 100);
}

function drawSimpleCharts() {
  // Task completion chart
  const taskCanvas = document.getElementById('taskCompletionChart');
  if (taskCanvas) {
    const ctx = taskCanvas.getContext('2d');
    const completionRate = Math.round((appState.tasks.filter(t => t.completed).length / appState.tasks.length) * 100);
    
    ctx.clearRect(0, 0, taskCanvas.width, taskCanvas.height);
    ctx.strokeStyle = '#1FB8CD';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(150, 75, 40, 0, (completionRate / 100) * 2 * Math.PI);
    ctx.stroke();
    
    ctx.fillStyle = '#333';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${completionRate}%`, 150, 80);
  }
  
  // Goal progress chart
  const goalCanvas = document.getElementById('goalProgressChart');
  if (goalCanvas) {
    const ctx = goalCanvas.getContext('2d');
    ctx.clearRect(0, 0, goalCanvas.width, goalCanvas.height);
    
    const barWidth = 40;
    const barSpacing = 20;
    const maxHeight = 100;
    
    appState.goals.forEach((goal, index) => {
      const progress = (goal.progress / goal.target) * maxHeight;
      const x = 50 + index * (barWidth + barSpacing);
      const y = 120 - progress;
      
      ctx.fillStyle = '#1FB8CD';
      ctx.fillRect(x, y, barWidth, progress);
    });
  }
  
  // Habit streak chart
  const habitCanvas = document.getElementById('habitStreakChart');
  if (habitCanvas) {
    const ctx = habitCanvas.getContext('2d');
    ctx.clearRect(0, 0, habitCanvas.width, habitCanvas.height);
    
    ctx.strokeStyle = '#1FB8CD';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    appState.habits.forEach((habit, index) => {
      const x = 50 + index * 80;
      const y = 130 - (habit.streak * 5);
      
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    
    ctx.stroke();
  }
}

// Templates - FIXED
function renderTemplates() {
  const templatesGrid = document.getElementById('templatesGrid');
  if (!templatesGrid) return;
  
  templatesGrid.innerHTML = '';
  
  appState.templates.forEach(template => {
    const templateCard = document.createElement('div');
    templateCard.className = `template-card ${template.tier !== 'free' && appState.currentTier === 'free' ? 'locked' : ''}`;
    
    const isLocked = template.tier !== 'free' && appState.currentTier === 'free';
    
    templateCard.innerHTML = `
      <div class="template-header">
        <h3>${template.title}</h3>
        <div>
          <span class="template-tier ${template.tier}">${template.tier}</span>
          <span class="template-price">$${template.price}</span>
        </div>
      </div>
      <div class="template-preview">
        ${template.preview}
      </div>
      <div class="template-actions">
        <button class="btn btn--primary btn--sm use-template-btn" data-template-id="${template.id}" ${isLocked ? 'disabled' : ''}>
          ${isLocked ? 'Upgrade to Use' : 'Use Template'}
        </button>
        <button class="btn btn--outline btn--sm preview-template-btn" data-template-id="${template.id}">Preview</button>
      </div>
      ${isLocked ? `
        <div class="lock-overlay">
          <div class="lock-content">
            <span class="lock-icon">🔒</span>
            <h4>Upgrade Required</h4>
            <p>Available in ${template.tier} tier</p>
            <button class="btn btn--primary btn--sm upgrade-for-template">Upgrade Now</button>
          </div>
        </div>
      ` : ''}
    `;
    
    templatesGrid.appendChild(templateCard);
  });
  
  // Add event listeners
  document.querySelectorAll('.use-template-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const templateId = parseInt(e.target.dataset.templateId);
      useTemplate(templateId);
    });
  });
  
  document.querySelectorAll('.preview-template-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const templateId = parseInt(e.target.dataset.templateId);
      previewTemplate(templateId);
    });
  });
  
  document.querySelectorAll('.upgrade-for-template').forEach(btn => {
    btn.addEventListener('click', showUpgradeModal);
  });
}

function useTemplate(templateId) {
  const template = appState.templates.find(t => t.id === templateId);
  if (template) {
    if (template.tier !== 'free' && appState.currentTier === 'free') {
      showUpgradeModal();
      return;
    }
    showNotification(`Using template: ${template.title} 📝`, 'success');
  }
}

function previewTemplate(templateId) {
  const template = appState.templates.find(t => t.id === templateId);
  if (template) {
    showNotification(`Preview: ${template.preview}`, 'info');
  }
}

// Premium/Upgrade functionality - FIXED
function renderPremium() {
  // Premium tab is already rendered in HTML
  console.log('Premium tab loaded');
}

function showUpgradeModal() {
  const modal = document.getElementById('upgradeModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add premium entrance effect
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.classList.add('bounce-in');
      setTimeout(() => modalContent.classList.remove('bounce-in'), 600);
    }
    
    showNotification('✨ Unlock your full potential! Choose your plan! 👑', 'info');
  }
}

function hideUpgradeModal() {
  const modal = document.getElementById('upgradeModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

function upgradeToPlan(planName) {
  // Enhanced upgrade flow
  const upgradeButton = event.target;
  upgradeButton.innerHTML = '<div class="spinner"></div> Processing...';
  upgradeButton.disabled = true;
  
  setTimeout(() => {
    showNotification(`🎉 ${planName} selected! Redirecting to secure checkout...`, 'success');
    
    setTimeout(() => {
      showNotification('💳 In a real app, this would process payment securely', 'info');
      upgradeButton.innerHTML = `Choose ${planName.split(' - ')[0]}`;
      upgradeButton.disabled = false;
    }, 2000);
  }, 1500);
  
  hideUpgradeModal();
}

// Modal management - FIXED
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Form handlers - FIXED
function handleAddTaskForm(event) {
  event.preventDefault();
  const title = document.getElementById('taskTitle').value.trim();
  const priority = document.getElementById('taskPriority').value;
  const dueDate = document.getElementById('taskDueDate').value;
  
  if (!title) {
    showNotification('Please enter a task title', 'error');
    return;
  }
  
  if (addTask(title, priority, dueDate)) {
    document.getElementById('addTaskForm').reset();
    hideModal('addTaskModal');
  }
}

function handleAddGoalForm(event) {
  event.preventDefault();
  const title = document.getElementById('goalTitle').value.trim();
  const category = document.getElementById('goalCategory').value;
  const target = document.getElementById('goalTarget').value;
  
  if (!title || !target) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  if (addGoal(title, category, target)) {
    document.getElementById('addGoalForm').reset();
    hideModal('addGoalModal');
  }
}

// Initialize app - FIXED
document.addEventListener('DOMContentLoaded', function() {
  console.log('PlannerPro initializing...');
  
  try {
    // Initialize dashboard
    updateDashboard();
    
    // Tab navigation - FIXED
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = tab.dataset.tab;
        if (tabName) {
          switchTab(tabName);
        }
      });
    });
    
    // Add task button handlers - FIXED
    document.addEventListener('click', (e) => {
      if (e.target.matches('.add-task-btn, .add-quick-task')) {
        e.preventDefault();
        showModal('addTaskModal');
      }
    });
    
    // Add goal button handler - FIXED
    document.addEventListener('click', (e) => {
      if (e.target.matches('.add-goal-btn')) {
        e.preventDefault();
        showModal('addGoalModal');
      }
    });
    
    // Add habit button handler - FIXED
    document.addEventListener('click', (e) => {
      if (e.target.matches('.add-habit-btn')) {
        e.preventDefault();
        showNotification('Habit creation available in Basic tier ($19/month). Upgrade to unlock! 🔥', 'info');
        setTimeout(() => showUpgradeModal(), 1000);
      }
    });
    
    // Upgrade button handlers - FIXED
    document.addEventListener('click', (e) => {
      if (e.target.matches('.upgrade-btn, .upgrade-link')) {
        e.preventDefault();
        showUpgradeModal();
      }
    });
    
    // Modal close handlers - FIXED
    document.addEventListener('click', (e) => {
      if (e.target.matches('.modal-close, .cancel-btn')) {
        e.preventDefault();
        hideModal('addTaskModal');
        hideModal('addGoalModal');
        hideUpgradeModal();
      }
    });
    
    // Form submit handlers - FIXED
    const addTaskForm = document.getElementById('addTaskForm');
    if (addTaskForm) {
      addTaskForm.addEventListener('submit', handleAddTaskForm);
    }
    
    const addGoalForm = document.getElementById('addGoalForm');
    if (addGoalForm) {
      addGoalForm.addEventListener('submit', handleAddGoalForm);
    }
    
    // Upgrade plan buttons - FIXED
    document.addEventListener('click', (e) => {
      if (e.target.closest('#upgradeModal') && e.target.matches('.btn--primary')) {
        const upgradeModal = e.target.closest('#upgradeModal');
        if (upgradeModal) {
          const planElement = e.target.closest('.upgrade-plan').querySelector('h4');
          const planName = planElement ? planElement.textContent : 'Selected Plan';
          upgradeToPlan(planName);
        }
      }
    });
    
    // Close modals when clicking overlay - FIXED
    document.addEventListener('click', (e) => {
      if (e.target.matches('.modal-overlay')) {
        hideModal('addTaskModal');
        hideModal('addGoalModal');
        hideUpgradeModal();
      }
    });
    
    // Template filters - FIXED
    document.addEventListener('click', (e) => {
      if (e.target.matches('.filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const tier = e.target.dataset.tier;
        showNotification(`Filtering templates by: ${tier}`, 'info');
      }
    });
    
    // Task and goal filters - FIXED
    document.addEventListener('change', (e) => {
      if (e.target.matches('.filter-priority, .filter-status')) {
        showNotification('Filters applied 🔍', 'info');
      }
    });
    
    // Logo click handler - FIXED
    document.addEventListener('click', (e) => {
      if (e.target.matches('.logo')) {
        switchTab('dashboard');
      }
    });
    
    // Mobile navigation for small screens
    if (window.innerWidth <= 767) {
      const mobileNav = document.createElement('div');
      mobileNav.className = 'mobile-nav';
      mobileNav.innerHTML = `
        <div class="mobile-nav-item active" data-tab="dashboard">
          <span>📊</span>
          <span>Dashboard</span>
        </div>
        <div class="mobile-nav-item" data-tab="tasks">
          <span>✅</span>
          <span>Tasks</span>
        </div>
        <div class="mobile-nav-item" data-tab="goals">
          <span>🎯</span>
          <span>Goals</span>
        </div>
        <div class="mobile-nav-item" data-tab="habits">
          <span>🔥</span>
          <span>Habits</span>
        </div>
        <div class="mobile-nav-item" data-tab="analytics">
          <span>📈</span>
          <span>Analytics</span>
        </div>
        <div class="mobile-nav-item" data-tab="templates">
          <span>📝</span>
          <span>Templates</span>
        </div>
        <div class="mobile-nav-item" data-tab="premium">
          <span>👑</span>
          <span>Premium</span>
        </div>
      `;
      document.body.appendChild(mobileNav);
      
      mobileNav.addEventListener('click', (e) => {
        const navItem = e.target.closest('.mobile-nav-item');
        if (navItem) {
          const tabName = navItem.dataset.tab;
          if (tabName) {
            switchTab(tabName);
            
            document.querySelectorAll('.mobile-nav-item').forEach(i => i.classList.remove('active'));
            navItem.classList.add('active');
          }
        }
      });
      
      // Handle window resize to remove mobile nav on larger screens
      window.addEventListener('resize', () => {
        if (window.innerWidth > 767 && document.querySelector('.mobile-nav')) {
          document.querySelector('.mobile-nav').remove();
        }
      });
    }
    
    // Set default due date for new tasks
    const taskDueDateInput = document.getElementById('taskDueDate');
    if (taskDueDateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      taskDueDateInput.value = tomorrow.toISOString().split('T')[0];
    }
    
    // Welcome message
    setTimeout(() => {
      showNotification('🚀 Welcome to PlannerPro! Your productivity journey starts here!', 'success');
      
      setTimeout(() => {
        showNotification('💡 Try adding tasks, goals, and see our freemium features in action!', 'info');
      }, 3000);
    }, 1000);
    
    // Enhanced engagement tracking
    let interactionCount = 0;
    let taskCompletions = 0;
    
    document.addEventListener('click', () => {
      interactionCount++;
      
      if (interactionCount === 5) {
        showNotification('🎯 You\'re exploring well! Loving the experience?', 'info');
      } else if (interactionCount === 10) {
        showNotification('🚀 You\'re really engaged! Ready to unlock unlimited features?', 'info');
        setTimeout(() => showUpgradeModal(), 2000);
      } else if (interactionCount === 20) {
        showNotification('🏆 Power user detected! You\'d love our Pro features!', 'info');
      }
    });
    
    // Track task completions for targeted messaging
    document.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox' && e.target.checked) {
        taskCompletions++;
        if (taskCompletions === 3) {
          setTimeout(() => {
            showNotification('🎉 You\'re productive! Imagine with unlimited tasks...', 'info');
          }, 1000);
        }
      }
    });
    
    // Periodic engagement prompts
    setTimeout(() => {
      if (interactionCount < 5) {
        showNotification('💪 Try completing a task or updating a goal progress!', 'info');
      }
    }, 30000); // After 30 seconds
    
    console.log('✅ PlannerPro initialized successfully!');
    
  } catch (error) {
    console.error('Error initializing PlannerPro:', error);
    showNotification('App initialization error. Please refresh the page.', 'error');
  }
});

// Export functions for global access
window.switchTab = switchTab;
window.showUpgradeModal = showUpgradeModal;
window.hideUpgradeModal = hideUpgradeModal;