const express = require('express');
const {Task} = require('../models/task.js');
const router = new express.Router();

router.post('/tasks', async (req, res) => {
  const saveTask = new Task(req.body);
  try {
    await saveTask.save();
    res.status(201).send(saveTask);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/tasks/:id', async (req, res)=>{
  // eslint-disable-next-line max-len
  try {
    const allowedUpdates= ['description', 'completed'];
    const updated = Object.keys(req.body);
    // eslint-disable-next-line max-len
    const isValidOperation = updated.every((update)=>(allowedUpdates.includes(update)));
    if (!isValidOperation) {
      return res.status(400).send({error: 'Invalid Updates'});
    }
    // eslint-disable-next-line max-len
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/task/:id', async (req, res)=>{
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;