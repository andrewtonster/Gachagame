const bodyParser = require("body-parser");
const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const User = require("../models/users");

// make a route to the users id

router.get("/", (req, res) => {
  res.render("main", { error: "", message: "" });
});

router.get("/gatcha", (req, res) => {
  res.render("gatcha");
});

router.get("/createaccount", (req, res) => {
  res.render("create", { error: "" });
});

router.post("/createaccount", async (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  let user = await findUser(username); // returns true if username HASNT been used
  let pass = await findPass(password); // returns true if password HASNT been used
  if (!user && !pass) {
    res.render("create", { error: "Username and Password already in use" });
  } else if (!pass) {
    res.render("create", { error: "Password already in use " });
  } else if (!user) {
    res.render("create", { error: "Username is already in use" });
  } else if (user && pass) {
    const user = await User.create({
      username: username,
      password: password,
    });
    res.render("create", { error: "Account Created" });
    console.log(user);
  }

  printAll();
});

router.post("/", async (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  User.exists(
    { username: username, password: password },
    async (err, result) => {
      if (result === null) {
        console.log("Failed to Login");
        res.render("main", {
          error: "Failed to login, check username and password",
          message: "",
        });
        printAll();
      } else {
        res.render("main", {
          error: "Succuessful Login",
          message: "gatcha",
        });
        console.log("logged in ");
      }
    }
  );
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

const findUser = async (user) => {
  return User.findOne({ username: user }).then(function (user) {
    if (user) {
      // user exists, you can throw an error if you want
      console.log("user alreadty exist");
      return false;
    }

    console.log("User does not exist");
    return true;
    // user doesn't exist, all is good in your case
  });
};

const findPass = async (pass) => {
  return User.findOne({ password: pass }).then(function (user) {
    if (user) {
      // user exists, you can throw an error if you want
      console.log("user alreadty exist");
      return false;
    }

    console.log("Password does not exist");
    return true;
    // user doesn't exist, all is good in your case
  });
};
