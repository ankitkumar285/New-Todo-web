// script.js
document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const taskDescription = document.getElementById('taskDescription');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const allTasksBtn = document.getElementById('allTasksBtn');
    const activeTasksBtn = document.getElementById('activeTasksBtn');
    const completedTasksBtn = document.getElementById('completedTasksBtn');

    let tasks = [];

    // Load tasks from local storage
    loadTasks();

    addTaskBtn.addEventListener('click', function () {
        const taskText = taskInput.value.trim();
        const descriptionText = taskDescription.value.trim();
        if (taskText !== '') {
            addTask(taskText, descriptionText);
            taskInput.value = '';
            taskDescription.value = '';
            saveTasks();
        }
    });

    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const taskText = taskInput.value.trim();
            const descriptionText = taskDescription.value.trim();
            if (taskText !== '') {
                addTask(taskText, descriptionText);
                taskInput.value = '';
                taskDescription.value = '';
                saveTasks();
            }
        }
    });

    allTasksBtn.addEventListener('click', function () {
        filterTasks('all');
        setActiveButton(allTasksBtn);
    });

    activeTasksBtn.addEventListener('click', function () {
        filterTasks('active');
        setActiveButton(activeTasksBtn);
    });

    completedTasksBtn.addEventListener('click', function () {
        filterTasks('completed');
        setActiveButton(completedTasksBtn);
    });

    function addTask(taskText, descriptionText) {
        const task = {
            id: Date.now(),
            text: taskText,
            description: descriptionText,
            completed: false
        };
        tasks.push(task);
        renderTask(task);
        saveTasks();
    }

    function renderTask(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;

        // Task header (checkbox + task text)
        const taskHeader = document.createElement('div');
        taskHeader.classList.add('task-header');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', function () {
            task.completed = !task.completed;
            taskTextSpan.classList.toggle('completed');
            saveTasks();
            filterTasks(getCurrentFilter());
        });

        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = task.text;
        if (task.completed) {
            taskTextSpan.classList.add('completed');
        }

        taskHeader.appendChild(checkbox);
        taskHeader.appendChild(taskTextSpan);

        // Task description
        const taskDesc = document.createElement('div');
        taskDesc.classList.add('task-description');
        taskDesc.textContent = task.description;

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.addEventListener('click', function () {
            tasks = tasks.filter(t => t.id !== task.id);
            taskList.removeChild(li);
            saveTasks();
        });

        li.appendChild(taskHeader);
        if (task.description !== '') {
            li.appendChild(taskDesc);
        }
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }

    function filterTasks(filter) {
        const allTasks = taskList.querySelectorAll('li');
        allTasks.forEach(task => {
            const isCompleted = task.querySelector('input[type="checkbox"]').checked;
            switch (filter) {
                case 'all':
                    task.style.display = 'flex';
                    break;
                case 'active':
                    task.style.display = isCompleted ? 'none' : 'flex';
                    break;
                case 'completed':
                    task.style.display = isCompleted ? 'flex' : 'none';
                    break;
            }
        });
    }

    function setActiveButton(button) {
        document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    function getCurrentFilter() {
        if (allTasksBtn.classList.contains('active')) return 'all';
        if (activeTasksBtn.classList.contains('active')) return 'active';
        if (completedTasksBtn.classList.contains('active')) return 'completed';
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => renderTask(task));
    }
});