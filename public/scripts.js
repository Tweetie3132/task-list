document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskDate = document.getElementById('task-date');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

    // Fetch tasks from the server and render them
    const fetchTasks = async () => {
        try {
            const res = await fetch('/tasks');
            const tasks = await res.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Add a new task
    const addTask = async () => {
        const text = taskInput.value;
        const inputDate = taskDate.value;
        if (!text || !inputDate) {
            alert('Both the Task name and Date fields must be valid.')
            return
        };

        const addedDate = new Date().toISOString().split('T')[0];
        try {
            const res = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text, inputDate, addedDate })
            });

            const task = await res.json();
            renderTask(task);
            taskInput.value = '';
            taskDate.value = '';
            checkTasks();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };


    // Render a list of tasks
    const renderTasks = (tasks) => {
        taskList.innerHTML = '';
        tasks.forEach(task => renderTask(task));
        checkTasks();
    };

    // Render a single task
    const renderTask = (task) => {
        const li = document.createElement('li');
        li.className = 'task';
        li.id = `task-${task.id}`;

        // Calculate days left
        const today = new Date();
        const inputDate = new Date(task.inputDate);
        const timeDiff = inputDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if(daysLeft === 1){
            li.innerHTML = `
                <div style="font-size: 15px; margin:0px 10px;">${`Tomorrow` } </div>
                <div style="font-size: 0px;">${task.addedDate}-${task.inputDate}</div> 
                ${task.text} 
                <button id="deleteTask" style="width: 50%; margin:0px 10px;" onclick="deleteTask(${task.id})">Done!</button>`;
        } else{
            li.innerHTML = `
                <div style="font-size: 15px; margin:0px 10px;">${daysLeft === 0 ? `Today`: `${daysLeft} days left` } </div>
                <div style="font-size: 0px;">${task.addedDate}-${task.inputDate}</div> 
                ${task.text} 
                <button id="deleteTask" style="width: 50%; margin:0px 10px;" onclick="deleteTask(${task.id})">Done!</button>`;
        }
        taskList.appendChild(li);
    };

    // Check tasks for highlighting and removing old tasks
    const checkTasks = () => {
        const now = new Date();
        const tomorrow = new Date();
        const yesterday = new Date();
        tomorrow.setDate(now.getDate() + 1);
        yesterday.setDate(now.getDate() - 1);


        const tasks = Array.from(document.querySelectorAll('.task'));

        tasks.forEach(task => {
            const taskText = task.innerText;
            const taskDates = taskText.match(/\d{4}-\d{2}-\d{2}/g);
            const inputDate = new Date(taskDates[1]);
            if (inputDate < yesterday) {
                task.remove();
            } else if (inputDate.toDateString() === tomorrow.toDateString() || inputDate.toDateString() === now.toDateString()) {
                task.classList.add('highlight');
                taskList.insertBefore(task, taskList.firstChild);
            } else {
                task.classList.remove('highlight');
            }
        });
    };

    // Add task event listener
    addTaskButton.addEventListener('click', addTask);

    // Fetch and render tasks on page load
    fetchTasks();
});

// Global delete task function to handle onclick event
const deleteTask = async (id) => {
    try {
        await fetch(`/tasks/${id}`, {
            method: 'DELETE'
        });
        document.getElementById(`task-${id}`).remove();
        checkTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
};

window.onload = function() {
            document.getElementById('container').classList.add('breathe')
            changeCssVariable();
}


async function changeCssVariable() {
    const root = document.documentElement; 

    //  generate a random dark color 
    const getRandomDarkColor = () => {
        const r = Math.floor(Math.random() * 128); 
        const g = Math.floor(Math.random() * 128); 
        const b = Math.floor(Math.random() * 128); 
        return `rgb(${r}, ${g}, ${b})`; 
    };

    // update the CSS variable
    const updateVariable = () => {
        const randomColor = getRandomDarkColor(); // Get a random dark color
        root.style.setProperty('--shadow-color', randomColor); // Update the CSS variable
        setTimeout(() => {root.style.setProperty('--spoiler-btns', randomColor);}, 2500);
        // document.getElementById('container').classList.remove('breathe'); laggy af
        // document.getElementById('container').classList.add('breathe'); same
    };

    const makeThingsNormal = () => {
        // Call updateVariable every 10 seconds
        const container = document.getElementById('container')
        container.classList.add('pleaseBeNormal')
        container.classList.remove('breatheCubicThingy')
        setInterval(updateVariable, 5000);
    }

    setTimeout(makeThingsNormal, 7000);

}



