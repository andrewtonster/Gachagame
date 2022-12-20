const bodyParser = require("body-parser");
const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const User = require("../models/users");
const cookieSession = require("cookie-session");
const crypto = require("crypto");
const util = require("util");

const scrypt = util.promisify(crypto.scrypt);

// make a route to the users id

router.get("/", (req, res) => {
  res.render("main", { error: "", message: "" });
});

router.get("/gatcha", (req, res) => {
  res.render("gatcha");
});

router.get("/roll", (req, res) => {
  res.send("roll");
});

router.get("/gems", (req, res) => {
  res.send("my gems");
});

router.get("/gemine", (req, res) => {
  res.render("gemmine");
});

router.get("/createaccount", (req, res) => {
  res.render("create", { error: "" });
});

router.post("/createaccount", async (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  const salt = crypto.randomBytes(8).toString("hex");
  const hashedHex = await scrypt(password, salt, 64); // hashes the password + salt into a buffer
  const hashed = hashedHex.toString("hex"); // converts the buffer back into a string
  console.log(hashed);

  let user = await findUser(username); // returns true if username HASNT been used
  if (!user) {
    res.render("create", { error: "Username is already in use" });
  } else if (user) {
    const user = await User.create({
      username: username,
      password: `${hashed}.${salt}`,
    });
    console.log(user);
    const id = user._id.toString();
    res.render("create", { error: "Account Created" });
  }
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
printAll();
