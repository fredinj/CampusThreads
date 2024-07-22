const express = require("express");
const mongoose = require("mongoose");
const postRoute = require("./routes/post.route.js")
const app = express();
const path = require('path');


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// routes
app.use("/api/posts", postRoute);

app.use('/images/uploads', express.static(path.join(__dirname, 'uploads')));

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
