const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const env = require("dotenv").config()

mongoose.connect(process.env._dbURL, () => {
    console.log("Connected to MongoDB");
})

const taskSchema = new mongoose.Schema({
    title: String,
    desc: String,
    created: Date
})

let Task = mongoose.model("task", taskSchema);

router.post("/tasks", (req, res) => {
    console.log("Visited");
    const task = new Task({
        title: req.body.title,
        desc: req.body.desc,
        created: new Date().toDateString() + " " + new Date().toTimeString() ,
    })

    console.log(task);

    task.save()
        .then(data => {
            res.json(data).status(200);
            console.log("Added Task Successfully!!");
        })
        .catch(err => {
            res.json({ message: "Error adding task." });
            console.log("Error adding task.");
        })
})

router.get("/tasks", async (req, res) => {
    try {
        const all = await Task.find()
        res.send(all)
    } catch {
        res.json({
            "message": "Something went wrong",
        }).status(405)
    }
})

router.get("/tasks/:id", async (req, res) => {
    try {
        const all = await Task.find({ _id: req.params.id })
        res.send(all)
    } catch {
        res.json({
            "message": "Task not found",
        }).status(405)
    }
})

router.delete("/tasks/:id", async (req, res) => {
    const task = await Task.find({ _id: req.params.id })
        .then(async (data) => {
            await Task.remove(data[0]);
            res.json(data[0]).status(200);
            console.log("Task deleted Successfully!");
        })
        .catch(err => console.error(err))
})

router.put("/tasks/:id", async (req, res) => {
    const task = await Task.find({ _id: req.params.id })
        .then(async (data) => {
            await Task.updateOne(data[0], req.body);
            res.json(data[0]).status(200);
            console.log("Task updated Successfully!");
        })
        .catch(err => {
            console.log(err);
            res.send(err).status(405)
        })
})

router.all("**", (req, res) => {
    res.json({
        "message": "Invalid API Endpoint",
    })

    console.log("Invalid API Endpoint");
})


module.exports = router;
