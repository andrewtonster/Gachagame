const bodyParser = require("body-parser");
const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const User = require("../models/users");

router.get("/", (req, res) => {
  res.render("main");
});

router.post("/", async (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  if (checkLogin(username, password) === true) {
    console.log("User already in use");
  } else {
    const user = await User.create({
      username: username,
      password: password,
    });
  }
});

const checkLogin = (user, pass) => {
  if (User.find({ username: user })) {
    return true;
  }
};

const printAll = () => {
  User.find().then((users) => {
    console.log(users);
  });
};

printAll();

// exports the routers
module.exports = router;
