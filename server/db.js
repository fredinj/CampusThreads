const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log('Mongoose connected to DB');
  } catch (error) {
    console.error('Mongoose connection failed', error);
    process.exit(1);
  }
};

module.exports = connectDB;