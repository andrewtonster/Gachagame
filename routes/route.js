const bodyParser = require("body-parser");
const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const User = require("../models/users");

// make a route to the users id

router.get("/", (req, res) => {
  res.render("main", { error: "" });
});

router.get("/createaccount", (req, res) => {
  res.render("create");
});

router.post("/", async (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  if (
    User.exists({ username: username }) &&
    User.exists({ password: password })
  ) {
    console.log("you have been logged in");
  } else {
    res.render("main", { error: "Username or Password is Incorrect" });
  }

  User.exists({ username: username }, async (err, doc) => {
    if (doc === null) {
      console.log("Created new User");
      const user = await User.create({
        username: username,
        password: password,
      });
    }

    printAll();
  });
});

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
