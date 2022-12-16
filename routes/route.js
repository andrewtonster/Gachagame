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

  User.exists({ username: username }, async (err, doc) => {
    if (doc === null) {
      console.log("User does not exist");
      const user = await User.create({
        username: username,
        password: password,
      });
    } else {
      console.log("user exist");
    }

    printAll();
  });
});
/*
const checkLogin = async (user, pass) => {
  const exists = await User.exists({ username: user });
  console.log(exists);
  printAll();
};
*/
const printAll = () => {
  User.find().then((users) => {
    console.log(users);
  });
};

const deleteAll = async () => {
  try {
    const deleted = await User.deleteMany({});
    console.log(deleted);
  } catch (err) {
    console.log(err);
  }
};

// exports the routers
module.exports = router;
