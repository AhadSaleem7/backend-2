const router = require("express").Router();
const List = require("../models/list.js");
const User = require("../models/User.js");

// Add Task Route – creates a task and associates it with a user via email
router.post("/addtask", async (req, res) => {
  try {
    const { title, body, email } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Create new task, store user _id (not the whole object)
    const list = new List({ title, body, user: existingUser._id });
    await list.save();
    // Push task reference into user's list and save user
    existingUser.list.push(list._id);
    await existingUser.save();
    return res.status(200).json({ message: "Task added", list });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// Update Task Route
router.put("/updatetask/:id", async (req, res) => {
  try {
    const { title, body, email } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const list = await List.findByIdAndUpdate(
      req.params.id,
      { title, body },
      { new: true }
    );
    if (!list) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json({ message: "Task updated", list });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// Delete Task Route
router.delete("/deletetask/:id", async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const list = await List.findByIdAndDelete(req.params.id);
    if (!list) {
      return res.status(404).json({ message: "Task not found" });
    }
    // Optionally, remove the task from the user's list array:
    existingUser.list = existingUser.list.filter(
      (taskId) => taskId.toString() !== req.params.id
    );
    await existingUser.save();
    return res.status(200).json({ message: "Task deleted", list });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

// Get Tasks by Email Route
router.get("/gettask", async (req, res) => {
  try {
    // Expecting email in query parameters
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email query parameter is required" });
    }
    // Find tasks associated with this user's email
    // First, find the user with this email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Then, find all tasks that belong to that user (_id)
    const tasks = await List.find({ user: existingUser._id });
    if (tasks.length === 0) {
      return res.status(200).json({ message: "No tasks found", list: [] });
    }
    return res.status(200).json({ list: tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
