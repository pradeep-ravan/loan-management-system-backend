// db.js
const mongoose = require('mongoose');

let isConnected = false;
let connectionPromise = null;

const connectToDatabase = async () => {
  if (isConnected) {
    return Promise.resolve();
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGO_URI;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false, 
    connectTimeoutMS: 20000, 
    socketTimeoutMS: 45000, 
    family: 4               
  };

  console.log('Connecting to MongoDB...');
  
  connectionPromise = mongoose.connect(uri, options)
    .then(() => {
      console.log('MongoDB connected successfully!');
      isConnected = true;
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      connectionPromise = null;
      isConnected = false;
      throw err;
    });

  return connectionPromise;
};

module.exports = connectToDatabase;