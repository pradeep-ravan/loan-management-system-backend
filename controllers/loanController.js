const Loan = require('../models/Loan');
const User = require('../models/User');
const { calculateEmiSchedule } = require('../utils/emiCalculator');
const connectToDatabase = require('../db'); // Import the database connection function

exports.createLoan = async (req, res) => {
  try {
    // Connect to database first
    await connectToDatabase();
    
    const { userId, disbursementDate, loanAmount, interestRate, tenure, repaymentDates } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const repaymentDateObjects = repaymentDates.map(date => new Date(date));
    
    const emiSchedule = calculateEmiSchedule(
      parseFloat(loanAmount),
      parseFloat(interestRate),
      parseInt(tenure),
      repaymentDateObjects,
      new Date(disbursementDate)
    );
    
    const loan = new Loan({
      userId,
      disbursementDate: new Date(disbursementDate),
      loanAmount: parseFloat(loanAmount),
      interestRate: parseFloat(interestRate),
      tenure: parseInt(tenure),
      repaymentDates: repaymentDateObjects,
      emiSchedule
    });
    
    await loan.save();
    
    res.status(201).json({
      success: true,
      data: loan
    });
  } catch (error) {
    console.error('Error creating loan:', error);
    
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

exports.getLoanById = async (req, res) => {
  try {
    // Connect to database first
    await connectToDatabase();
    
    const loan = await Loan.findById(req.params.id).populate('userId', 'name pan');
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: loan
    });
  } catch (error) {
    console.error('Error fetching loan:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getLoansByUserId = async (req, res) => {
  try {
    // Connect to database first
    await connectToDatabase();
    
    const loans = await Loan.find({
      userId: req.params.userId
    }).populate('userId', 'name pan');
    
    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    console.error('Error fetching loans by user ID:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.getLoanLedgerCSV = async (req, res) => {
  try {
    // Connect to database first
    await connectToDatabase();
    
    const loan = await Loan.findById(req.params.id);
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }
    
    const headers = [
      'Payment Number',
      'Payment Date',
      'EMI Amount',
      'Principal Component',
      'Interest Component',
      'Remaining Principal',
      'Status'
    ];
    
    let csvContent = headers.join(',') + '\n';
    
    loan.emiSchedule.forEach(payment => {
      const row = [
        payment.paymentNumber,
        new Date(payment.paymentDate).toISOString().split('T')[0],
        payment.emi.toFixed(2),
        payment.principalPayment.toFixed(2),
        payment.interestPayment.toFixed(2),
        payment.remainingPrincipal.toFixed(2),
        payment.isPaid ? 'Paid' : 'Pending'
      ];
      
      csvContent += row.join(',') + '\n';
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=loan_ledger_${loan._id}.csv`);
    
    res.send(csvContent);
  } catch (error) {
    console.error('Error generating CSV:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Add additional methods for updating loan payments or other functionality
exports.updateLoanPayment = async (req, res) => {
  try {
    // Connect to database first
    await connectToDatabase();
    
    const { paymentNumber, paymentDate } = req.body;
    
    const loan = await Loan.findById(req.params.id);
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }
    
    // Find the payment by payment number
    const paymentIndex = loan.emiSchedule.findIndex(p => p.paymentNumber === paymentNumber);
    
    if (paymentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    // Update the payment status
    loan.emiSchedule[paymentIndex].isPaid = true;
    loan.emiSchedule[paymentIndex].actualPaymentDate = paymentDate ? new Date(paymentDate) : new Date();
    
    await loan.save();
    
    res.status(200).json({
      success: true,
      data: loan
    });
  } catch (error) {
    console.error('Error updating loan payment:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all loans
exports.getAllLoans = async (req, res) => {
  try {
    // Connect to database first
    await connectToDatabase();
    
    const loans = await Loan.find()
      .populate('userId', 'name pan')
      .sort({ disbursementDate: -1 });
    
    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    console.error('Error fetching all loans:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};