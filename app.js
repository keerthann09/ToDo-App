// To-Do App JavaScript
(function () {
  'use strict';

  // Constants & Storage Key
  const STORAGE_KEY = 'todo_app_tasks';

  // State
  let tasks = loadTasks();
  let currentFilter = 'all';

  // DOM Elements
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const emptyState = document.getElementById('empty-state');
  const emptyTitle = document.getElementById('empty-title');
  const emptyDesc = document.getElementById('empty-desc');
  const itemsLeft = document.getElementById('items-left');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const currentDateEl = document.getElementById('current-date');
  const completedCountEl = document.getElementById('completed-count');
  const totalCountEl = document.getElementById('total-count');

  // Initialize
  function init() {
    displayDate();
    setupEventListeners();
    render();
  }

  // Display human-readable current date
  function displayDate() {
    if (!currentDateEl) return;
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const today = new Date().toLocaleDateString(undefined, options);
    currentDateEl.textContent = today;
  }

  // Load tasks from localStorage
  function loadTasks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Error loading tasks from localStorage:', err);
      return [];
    }
  }

  // Save tasks to localStorage
  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Error saving tasks to localStorage:', err);
    }
  }

  // Add new task
  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      text: trimmed,
      completed: false,
      createdAt: Date.now()
    };

    tasks.unshift(newTask);
    saveTasks();
    render();
  }

  // Toggle task completion
  function toggleTask(id) {
    tasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    saveTasks();
    render();
  }

  // Delete task with optional smooth exit
  function deleteTask(id) {
    const taskEl = document.querySelector(`[data-id="${id}"]`);
    if (taskEl) {
      taskEl.classList.add('fade-out');
      taskEl.addEventListener(
        'transitionend',
        () => {
          tasks = tasks.filter((task) => task.id !== id);
          saveTasks();
          render();
        },
        { once: true }
      );
    } else {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      render();
    }
  }

  // Clear all completed tasks
  function clearCompleted() {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    render();
  }

  // Set active filter
  function setFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.filter === filter;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    render();
  }

  // Render the task list and counters
  function render() {
    // 1. Filter tasks
    const filteredTasks = tasks.filter((task) => {
      if (currentFilter === 'active') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true;
    });

    // 2. Clear current list DOM
    todoList.innerHTML = '';

    // 3. Render items safely using DOM nodes
    filteredTasks.forEach((task) => {
      const li = document.createElement('li');
      li.className = `todo-item ${task.completed ? 'completed' : ''}`;
      li.dataset.id = task.id;

      const label = document.createElement('label');
      label.className = 'task-label';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.checked = task.completed;
      checkbox.setAttribute('aria-label', `Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`);
      checkbox.addEventListener('change', () => toggleTask(task.id));

      const spanText = document.createElement('span');
      spanText.className = 'task-text';
      spanText.textContent = task.text;

      label.appendChild(checkbox);
      label.appendChild(spanText);

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn-delete';
      deleteBtn.setAttribute('aria-label', `Delete task "${task.text}"`);
      deleteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      `;
      deleteBtn.addEventListener('click', () => deleteTask(task.id));

      li.appendChild(label);
      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    });

    // 4. Update Empty State
    if (filteredTasks.length === 0) {
      emptyState.classList.remove('hidden');
      if (tasks.length === 0) {
        emptyTitle.textContent = 'No tasks yet';
        emptyDesc.textContent = 'Type a task above and press "Add" to get started!';
      } else if (currentFilter === 'active') {
        emptyTitle.textContent = 'No active tasks';
        emptyDesc.textContent = 'You have tackled all your pending tasks!';
      } else if (currentFilter === 'completed') {
        emptyTitle.textContent = 'No completed tasks';
        emptyDesc.textContent = 'Tasks you finish will show up right here.';
      }
    } else {
      emptyState.classList.add('hidden');
    }

    // 5. Update Counters & Statistics
    const activeTasksCount = tasks.filter((t) => !t.completed).length;
    const completedTasksCount = tasks.filter((t) => t.completed).length;

    itemsLeft.textContent = `${activeTasksCount} ${activeTasksCount === 1 ? 'item' : 'items'} left`;

    if (completedCountEl && totalCountEl) {
      completedCountEl.textContent = completedTasksCount;
      totalCountEl.textContent = tasks.length;
    }

    // 6. Update Clear Completed Button State
    clearCompletedBtn.disabled = completedTasksCount === 0;
  }

  // Event Listeners
  function setupEventListeners() {
    // Form submit
    todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      addTask(todoInput.value);
      todoInput.value = '';
      todoInput.focus();
    });

    // Filter clicks
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
      });
    });

    // Clear completed
    clearCompletedBtn.addEventListener('click', clearCompleted);
  }

  // Start app
  init();
})();
