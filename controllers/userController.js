const User = require('../models/User');
const connectToDatabase = require('../db'); // Import the connection function

// Create new user
exports.createUser = async (req, res) => {
  try {
    // Connect to database first
    await connectToDatabase();
    
    const { name, dob, pan, aadhar, gstin, udyam } = req.body;
    
    if (!name || !dob || !pan || !aadhar || !gstin || !udyam) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    const existingUser = await User.findOne({
      $or: [
        { pan: pan.toUpperCase() },
        { aadhar }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this PAN or Aadhar already exists'
      });
    }
    
    const user = new User({
      name,
      dob: new Date(dob),
      pan: pan.toUpperCase(),
      aadhar,
      gstin: gstin.toUpperCase(),
      udyam: udyam.toUpperCase()
    });
    
    await user.save();
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      
      return res.status(400).json({
        success: false,
        message: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    // Connect to database first
    await connectToDatabase();
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user by PAN
exports.getUserByPAN = async (req, res) => {
  try {
    // Connect to database first
    await connectToDatabase();
    
    const pan = req.params.pan || '';
    
    const user = await User.findOne({
      pan: pan.toUpperCase()
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user by PAN:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Connect to database first
    await connectToDatabase();
    
    const users = await User.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    // Connect to database first
    await connectToDatabase();
    
    const { name, dob, gstin, udyam } = req.body;
    
    // Only allow updating non-critical fields
    const updateData = {};
    
    if (name) updateData.name = name;
    if (dob) updateData.dob = new Date(dob);
    if (gstin) updateData.gstin = gstin.toUpperCase();
    if (udyam) updateData.udyam = udyam.toUpperCase();
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      
      return res.status(400).json({
        success: false,
        message: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    // Connect to database first
    await connectToDatabase();
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await user.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};