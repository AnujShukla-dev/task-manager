const express = require("express");
const { Task } = require("../models/task.js");
const auth = require("../middleware/auth.js");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const saveTask = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await saveTask.save();
    res.status(201).send(saveTask);
  } catch (e) {
    res.status(400).send(e);
  }
});

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=20 
//skip
//sortBy=createadAt_asc
router.get("/tasks", auth, async (req, res) => {
  try {
    // const tasks = await Task.find({owner: req.user._id});
    // aletrnative
    const match = {};
    const sort =  {};

    if(req.query.completed){
      match.completed = req.query.completed === 'true' 
    }
    if(req.query.sortBy){
      const parts = req.query.sortBy.split(':')
      sort[parts[0]] = parts[1]==='desc'? -1:1;
    }
    await req.user.populate({
      path:'tasks',
      match,
      options:{
        limit:parseInt(req.query.limit),
        skip:parseInt(req.query.skip),
        sort
      }
    });
    res.send(req.user.tasks);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  // eslint-disable-next-line max-len
  try {
    const allowedUpdates = ["description", "completed"];
    const updated = Object.keys(req.body);
    // eslint-disable-next-line max-len
    const isValidOperation = updated.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid Updates" });
    }
    // eslint-disable-next-line max-len
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    updated.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/task/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
