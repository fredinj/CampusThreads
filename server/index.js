require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const cookieParser = require("cookie-parser");
const postRoute = require("./routes/post.route.js");
const userRoute = require("./routes/user.route.js");
const authRoute = require("./routes/auth.route.js");
const categoryRoute = require("./routes/category.route.js");
const commentRoute = require("./routes/comment.route.js");
const uploadRoute = require("./routes/upload.route.js")

const app = express();

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.CLIENT_URL] 
  : ['http://localhost:3001'];

// connect to db
connectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    // origin: true, // Consider setting this to your specific frontend URL in production
    origin: function(origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      'Content-Type',
      'X-XSRF-TOKEN',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'Origin',
      'Cache-Control',
      'Accept-Language'
    ],
    credentials: true,
  })
);

app.use(cookieParser());

// routes
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/comments", commentRoute);
app.use("/api/uploads", uploadRoute)

app.get("/", (req, res) => {
  res.send("Hi");
});

// Start the server
const port = process.env.NODE_ENV === 'production' 
  ? process.env.PORT
  : 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});