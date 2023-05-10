const express = require('express');
const {User} = require('../models/user');
const {Task} = require('../models/task.js');
const auth = require('../middleware/auth.js');
const router = new express.Router();

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({user, token});
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/users/me', auth, async (req, res) => {
  console.log(req.token);
  res.send(req.user);
});

router.post('/users/login', async (req, res)=>{
  try {
    // eslint-disable-next-line max-len
    console.log(req.body.password);
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    console.log(user);
    res.send({user, token});
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.patch('/user/me', auth, async (req, res)=>{
  const updates = Object.keys(req.body);
  console.log(updates);
  const allowUpdates = ['name', 'email', 'password', 'age'];
  // eslint-disable-next-line max-len
  const isValidOperation = updates.every((update)=>allowUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid Updates'});
  }

  try {
    // eslint-disable-next-line max-len

    updates.forEach((update)=>{
      req.user[update]=req.body[update];
    });
    await req.user.save();
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/user/me', auth, async (req, res)=>{
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    await Task.deleteMany({owner: user._id});
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});
module.exports = router;

router.post('/user/logout', auth, async (req, res)=>{
  try {
    req.user.tokens = req.user.tokens.filter((token)=>{
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/user/logoutAll', auth, async (req, res)=>{
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});
