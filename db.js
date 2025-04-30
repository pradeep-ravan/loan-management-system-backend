// db.js
const mongoose = require('mongoose');

let isConnected = false;
let connectionPromise = null;

const connectToDatabase = async () => {
  // If already connected or connecting, return the existing promise
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
    bufferCommands: false, // Disable mongoose buffering
    // Remove bufferMaxEntries as it's no longer supported
    connectTimeoutMS: 20000, // Increase connect timeout
    socketTimeoutMS: 45000, // Increase socket timeout
    family: 4               // Use IPv4
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