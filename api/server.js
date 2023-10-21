const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/react-todo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Define the Todo model
const Todo = require('./models/Todo');

// Get all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        console.error("Error fetching todos:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Create a new todo
app.post('/todo/new', async (req, res) => {
    try {
        const todo = new Todo({
            text: req.body.text
        });

        const savedTodo = await todo.save();
        res.json(savedTodo);
    } catch (err) {
        console.error("Error creating todo:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Delete a todo by ID
app.delete('/todo/delete/:id', async (req, res) => {
    try {
        const result = await Todo.findByIdAndDelete(req.params.id);
        res.json({ result });
    } catch (err) {
        console.error("Error deleting todo:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Toggle the "complete" status of a todo by ID
app.get('/todo/complete/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        todo.complete = !todo.complete;
        await todo.save();
        res.json(todo);
    } catch (err) {
        console.error("Error completing todo:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Update a todo by ID
app.put('/todo/update/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        todo.text = req.body.text;
        await todo.save();
        res.json(todo);
    } catch (err) {
        console.error("Error updating todo:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
