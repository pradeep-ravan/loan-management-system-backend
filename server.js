const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.send('Loan Management System API is running');
});

app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);

// Only start server in non-serverless environment
if (process.env.NODE_ENV !== 'production') {
  const mongoose = require('mongoose');
  
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
}

module.exports = app;