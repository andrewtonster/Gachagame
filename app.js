const express = require("express");
const app = express();
const ejs = require("ejs");
const router = require("./routes/route");
const mongoose = require("mongoose");

//STATIC FILES
// this is middleware
// this will serve the static files in the public class

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://localhost/gacha")
  .then(() => {
    console.log("connected");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/img", express.static(__dirname + "public/img"));

app.use(express.urlencoded({ extended: false }));
app.use("/", router);

app.set("view engine", "ejs");

app.use(express.static(__dirname + "./styles/main"));

app.listen("3000", () => {
  console.log("listening ");
});

app.get("/", (req, res) => {
  res.render("main", { phrase: "hello world" });
});
