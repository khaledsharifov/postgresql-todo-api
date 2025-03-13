const express = require("express");
const cors = require("cors");
const app = express();
const pool = require('./db')

const PORT = process.env.PORT;

//middleware
app.use(cors());
app.use(express.json());

// routes

// create a todo
app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;

        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]);
        return res.json(newTodo.rows[0])
    } catch (error) {
        console.error(error.message);
    }
});

// get all todos
app.get("/todos", async (req, res) => {
    try {
        const todos = await pool.query("SELECT * FROM todo ORDER BY id ASC");
        return res.json(todos.rows)
    } catch (error) {
        console.error(error.message);
    }
});

// get a todo
app.get("/todos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await pool.query("SELECT * FROM todo WHERE id = $1", [id]);
        return res.json(todo.rows[0])
    } catch (error) {
        console.error(error.message);
    }
});

// update a todo
app.put("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    try {
        await pool.query("UPDATE todo SET description = $1 WHERE id = $2", [description, id]);
        return res.json({ message: "Todo was updated!" })
    } catch (error) {
        console.error(error.message);
    }
});

// delete a todo
app.delete("/todos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM todo WHERE id = $1", [id]);
        return res.json({ message: "Todo was deleted!" })
    } catch (error) {
        console.error(error.message);
    }
});


app.listen(PORT, () => {
    console.log(`Server has strated on port ${PORT}`);
});