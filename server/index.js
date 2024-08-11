require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./db");
const cookieParser = require("cookie-parser");

const postRoute = require("./routes/post.route.js");
const userRoute = require("./routes/user.route.js");
const authRoute = require("./routes/auth.route.js");
const categoryRoute = require("./routes/category.route.js");
const commentRoute = require("./routes/comment.route.js");

const app = express();

// connect to db
connectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: true, // Replace with your client URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow credentials to be sent with requests
  })
);
app.use(cookieParser()); // for jwt in cookies

// routes
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/comments", commentRoute);

// move to a route + controller for media
app.use("/images/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Hi");
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
