const mongoose = require("mongoose");
const express = require("express");
const router = require("./routes");
const session = require('express-session');
const { checAuth } = require("./utils/auth");
const app = express();

require('dotenv').config();

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.jkt8qpe.mongodb.net/?retryWrites=true&w=majority`
  )
  .then((res) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

app.set("view engine", "ejs");

app.use(checAuth)
app.use(router)


app.listen(3000, () => {
  console.log("listening to port 3000");
});
