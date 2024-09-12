const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); 
const mongoUri = 'mongodb+srv://venkateshmegavath75:venkey123@cluster0.ont51.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => console.log(err));

const taskSchema = new mongoose.Schema({
    name: String,
    description: String,
    completed: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', taskSchema);
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post('/tasks', async (req, res) => {
    const newTask = new Task({
        name: req.body.name,
        description: req.body.description,
    });
    await newTask.save();
    res.json(newTask);
});
app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
});

app.put('/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    task.completed = req.body.completed;
    await task.save();
    res.json(task);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
