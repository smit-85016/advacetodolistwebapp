document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#todo-form');
    const taskInput = document.querySelector('#task-input');
    const taskDesc = document.querySelector('#task-desc');
    const dueDate = document.querySelector('#due-date');
    const priority = document.querySelector('#priority');
    const taskList = document.querySelector('#task-list');
    const filterButtons = document.querySelectorAll('.filters button');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const renderTasks = (filter = 'all') => {
        taskList.innerHTML = '';
        tasks
            .filter(task => filter === 'all' || (filter === 'completed' && task.completed) || (filter === 'active' && !task.completed))
            .forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.priority}-priority ${task.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <span>${task.name} - ${task.desc} (Due: ${task.dueDate})</span>
                    <div>
                        <button onclick="editTask(${task.id})">Edit</button>
                        <button onclick="deleteTask(${task.id})">Delete</button>
                        <button onclick="toggleComplete(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                    </div>
                `;
                taskList.appendChild(li);
            });
    };

    const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = {
            id: Date.now(),
            name: taskInput.value,
            desc: taskDesc.value,
            dueDate: dueDate.value,
            priority: priority.value,
            completed: false
        };
        tasks.push(task);
        saveTasks();
        renderTasks();
        form.reset();
    });

    window.deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };

    window.editTask = (id) => {
        const task = tasks.find(task => task.id === id);
        taskInput.value = task.name;
        taskDesc.value = task.desc;
        dueDate.value = task.dueDate;
        priority.value = task.priority;
        deleteTask(id);
    };

    window.toggleComplete = (id) => {
        const task = tasks.find(task => task.id === id);
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            renderTasks(e.target.id.replace('-tasks', ''));
        });
    });

    renderTasks();
});