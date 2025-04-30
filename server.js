const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);

app.get('/', (req, res) => {
  res.send('Loan Management System API is running');
});

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/loan-management-system';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000, 
})
.then(() => {
  console.log('Connected to MongoDB');
  

  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

module.exports = app;