const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  disbursementDate: {
    type: Date,
    required: true
  },
  loanAmount: {
    type: Number,
    required: true,
    min: [1000, 'Loan amount must be at least 1000']
  },
  interestRate: {
    type: Number,
    required: true,
    min: [0.1, 'Interest rate must be positive'],
    max: [100, 'Interest rate cannot exceed 100%']
  },
  tenure: {
    type: Number,
    required: true,
    min: [1, 'Tenure must be at least 1 month']
  },
  repaymentDates: {
    type: [Date],
    required: true,
    validate: {
      validator: function(dates) {
        return dates.length > 0;
      },
      message: 'At least one repayment date is required'
    }
  },
  emiSchedule: [{
    paymentNumber: Number,
    paymentDate: Date,
    emi: Number,
    principalPayment: Number,
    interestPayment: Number,
    remainingPrincipal: Number,
    isPaid: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Loan', loanSchema);