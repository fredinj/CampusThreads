const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product.model.js");
const Post = require("./models/post.model.js");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hellooooggg");
});

app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.post("/api/posts", async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/posts", async (req, res) => {
  try {
    const post = await Post.find({});
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/post/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// app.put("/api/product/:id", async)
//

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
