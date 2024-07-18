const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.model.js");
const Post = require("./models/post.model.js");
const postRoute = require("./routes/post.route.js")
const app = express();


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// routes
app.use("/api/posts", postRoute);

app.get("/", (req, res) => {
  res.send("Hi There !!");
});


// mongodb connect using moongose
mongoose
  .connect(
    "mongodb+srv://rithinpaul10:ViqpfD3Nnzfo2lhX@cluster0.odnoxsr.mongodb.net/Posts-Test?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Mongoose connected to db");
    app.listen(3000, () => {
      console.log("Server on 3000");
    });
  })
  .catch(() => {
    console.log("Mongoose connection failed");
  });
