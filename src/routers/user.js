const express = require("express");
const { User } = require("../models/user");
const { Task } = require("../models/task.js");
const auth = require("../middleware/auth.js");
const {sendWelomeEmail,deleteAccountEmail} = require('../emails/account.js')
const sharp = require ('sharp')
const multer = require("multer");
const upload = multer({
  limit: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx|pdf|pdfx|jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a Pdf"));
    }
    cb(undefined, true);
    // cb(new Error('File must be PDF'))
    // cb(undefined,true)
  },
});
const errorHandling = (error, req, res, next) => {
  res.status(400).send({ error: error.message });
};

const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelomeEmail(user.email,user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.post("/users/login", async (req, res) => {
  try {
    // eslint-disable-next-line max-len
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/user/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "email", "password", "age"];
  // eslint-disable-next-line max-len
  const isValidOperation = updates.every((update) =>
    allowUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    // eslint-disable-next-line max-len

    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/user/me", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    await Task.deleteMany({ owner: user._id });
    deleteAccountEmail(user.email,user.name)
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});
module.exports = router;

router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/user/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    req.user.avatar =await sharp(req.file.buffer).resize({
      width:250,
      height:250
    }).png().toBuffer();
    await req.user.save();
    res.send();
  },
  errorHandling
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/user/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-type", "image/jpg");
    res.send(user.avatar);
  } catch (e) {}
});
