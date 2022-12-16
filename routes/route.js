const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("main");
});

router.post("/", (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  console.log(username);
  console.log(password);
});

// exports the routers
module.exports = router;
