const Loan = require('../models/Loan');
const User = require('../models/User');
const { calculateEmiSchedule } = require('../utils/emiCalculator');

exports.createLoan = async (req, res) => {
  try {
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
      message: 'Server error'
    });
  }
};

exports.getLoanById = async (req, res) => {
  try {
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
      message: 'Server error'
    });
  }
};

exports.getLoansByUserId = async (req, res) => {
  try {
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
      message: 'Server error'
    });
  }
};

exports.getLoanLedgerCSV = async (req, res) => {
  try {
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
      message: 'Server error'
    });
  }
};