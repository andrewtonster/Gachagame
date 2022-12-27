const bodyParser = require("body-parser");
const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const User = require("../models/users");
const cookieSession = require("cookie-session");
const crypto = require("crypto");
const util = require("util");
const { update } = require("../models/users");

const scrypt = util.promisify(crypto.scrypt);

let clientId;
let pokemonArr;

// make a route to the users id

router.get("/", (req, res) => {
  res.render("main", { error: "", message: "undef", userId: "undef", gems: 0 });
});

router.get("/gatcha:num", async (req, res) => {
  res.render("gatcha", { userId: clientId });
});

router.get("/roll:num", async (req, res) => {
  let currUser = await findId(clientId);
  console.log(currUser);
  let numGems = currUser.gems;
  res.render("roll", { gems: numGems, userId: clientId });
});

router.get("/gems:num", async (req, res) => {
  let currUser = await findId(clientId);
  let numGems = currUser.gems;
  res.render("inventory", { gems: numGems });
});

router.get("/gemmine:num", async (req, res) => {
  let currUser = await findId(clientId);
  console.log(currUser);
  let numGems = currUser.gems;
  console.log(numGems);
  res.render("gemmine", { gems: numGems, userId: clientId });
});

router.get("/storage:num", (req, res) => {
  res.render("storage", { pokemonList: pokemonArr, userId: clientId });
});

router.get("/createaccount", (req, res) => {
  res.render("create", { error: "" });
});
async function updateUser(numGems) {
  try {
    const user = await User.updateOne({ _id: clientId }, { gems: numGems });
    console.log(user);
    const userInfo = await findId(clientId);
    console.log(userInfo);
  } catch (err) {
    console.log(err);
  }
}

async function updatePokemon(name) {
  try {
    const user = await User.updateOne({ _id: clientId }, { pokemon: name });
    console.log(user);
  } catch (err) {
    console.log(err);
  }
}

router.post("/roll:num", async (req, res) => {
  const { gems, pokemon } = req.body;
  console.log(pokemon);
  await addValueToArray(clientId, pokemon);
  pokemonArr = await findArray(clientId);
  updateUser(gems);
  res.redirect(`/storage:&${clientId}`);
});

router.post("/gemmine:num", async (req, res) => {
  const { gems } = req.body;
  updateUser(gems);
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
      gems: 0,
    });
    console.log(user);
    const id = user._id.toString();
    res.render("create", { error: "Account Created" });
  }
});

router.post("/", async (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  const user = await find(username);
  if (user) {
    const validPassword = await comparePasswords(user.password, password);
    clientId = user._id.toString();
    if (validPassword) {
      res.render("main", {
        error: "Succuessful Login",
        message: "valid",
        userId: clientId,
      });
      console.log("logged in ");
    } else {
      console.log("Failed to Login");
      res.render("main", {
        error: "Failed to login, check username and password",
        message: "",
        userId: "invalid",
      });
      printAll();
    }
  } else {
    res.render("main", {
      error: "Failed to login, check username and password",
      message: "",
      userId: "invalid",
    });
  }
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

const comparePasswords = async (saved, supplied) => {
  const [hashed, salt] = saved.split(".");
  const hashedSupplied = await scrypt(supplied, salt, 64);

  return hashed === hashedSupplied.toString("hex");
};

async function find(username) {
  try {
    return await User.findOne({ username: username }).exec();
  } catch (err) {
    console.log("invalid username");
  }
}

async function findId(id) {
  try {
    return await User.findOne({ _id: id }).exec();
  } catch (err) {
    console.log("invalid username");
  }
}

async function findGems(userid) {
  try {
    let currUser = await findId(clientId);
    let numGems = currUser.gems;
    return numGems;
  } catch (err) {
    console.log("invalid username");
  }
}

async function findArray(userid) {
  try {
    let currUser = await findId(clientId);
    let numGems = currUser.stringArray;
    return numGems;
  } catch (err) {
    console.log("invalid array");
  }
}

async function addValueToArray(id, value) {
  try {
    await User.updateOne({ _id: id }, { $push: { stringArray: value } });
  } catch (error) {
    console.log(error);
  }
}

async function printArrayValues(id) {
  try {
    const doc = await User.findById(id);
    for (let i = 0; i < doc.stringArray.length; i++) {
      console.log(doc.stringArray[i]);
    }
  } catch (error) {
    console.log(error);
  }
}

const deleteArrayValues = () => {
  User.updateOne({ _id: clientId }, { $set: { stringArray: [] } }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`deleted all`);
    }
  });
};

// Use the function
