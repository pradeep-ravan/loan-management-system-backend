const express = require('express');
const router = express.Router();
const { 
  createLoan, 
  getLoanById, 
  getLoansByUserId, 
  getLoanLedgerCSV 
} = require('../controllers/loanController');

router.post('/', createLoan);

router.get('/:id', getLoanById);

router.get('/user/:userId', getLoansByUserId);

router.get('/:id/csv', getLoanLedgerCSV);

module.exports = router;