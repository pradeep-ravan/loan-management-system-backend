const User = require('../models/User');

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { name, dob, pan, aadhar, gstin, udyam } = req.body;
    
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
      message: 'Server error'
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
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
      message: 'Server error'
    });
  }
};

exports.getUserByPAN = async (req, res) => {
  try {
    const user = await User.findOne({
      pan: req.params.pan.toUpperCase()
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
      message: 'Server error'
    });
  }
};