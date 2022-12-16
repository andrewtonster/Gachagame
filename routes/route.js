const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to router page");
});

// exports the router
module.exports = router;
