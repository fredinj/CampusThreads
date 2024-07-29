require('dotenv').config();
const express = require("express");
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');

const postRoute = require("./routes/post.route.js")
const userRoutes = require('./routes/user.route.js'); 
const authRoutes = require('./routes/auth.route.js'); 

const app = express();

// connect to db
connectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: true, // Replace with your client URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// routes
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// move to a route + controller for media
app.use('/images/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send("Hi");
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});