const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 80;

const tasksFile = 'tasks.json';

let tasks = [];

// Load tasks from file
const loadTasks = () => {
    if (fs.existsSync(tasksFile)) {
        const data = fs.readFileSync(tasksFile);
        tasks = JSON.parse(data);
    }
};

// Save tasks to file
const saveTasks = () => {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const { text, inputDate, addedDate } = req.body;
    const task = { text, inputDate, addedDate, id: Date.now() };
    tasks.push(task);
    tasks.sort((a, b) => new Date(a.inputDate) - new Date(b.inputDate));
    saveTasks();
    res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
    tasks = tasks.filter(task => task.id != req.params.id);
    saveTasks();
    res.status(204).send();
});

loadTasks();  // Load tasks when server starts

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
