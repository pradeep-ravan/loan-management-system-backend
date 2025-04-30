const calculateEMI = (loanAmount, interestRate, tenureMonths) => {
    const monthlyRate = interestRate / 12 / 100;
    
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    return Math.round(emi * 100) / 100; 
  };
  
  exports.calculateEmiSchedule = (loanAmount, interestRate, tenureMonths, repaymentDates, disbursementDate) => {
    const monthlyRate = interestRate / 12 / 100;
    const emi = calculateEMI(loanAmount, interestRate, tenureMonths);
    
    let remainingPrincipal = loanAmount;
    const schedule = [];
    
    // Sort repayment dates
    const sortedDates = [...repaymentDates].sort((a, b) => a - b);
    
    if (sortedDates.length === 1) {
      const startDate = new Date(sortedDates[0]);
      
      for (let i = 0; i < tenureMonths; i++) {
        const paymentDate = new Date(startDate);
        paymentDate.setMonth(startDate.getMonth() + i);
        
        const interestPayment = remainingPrincipal * monthlyRate;
        const principalPayment = emi - interestPayment;
        remainingPrincipal -= principalPayment;
        
        schedule.push({
          paymentNumber: i + 1,
          paymentDate,
          emi,
          principalPayment: Math.round(principalPayment * 100) / 100,
          interestPayment: Math.round(interestPayment * 100) / 100,
          remainingPrincipal: Math.max(0, Math.round(remainingPrincipal * 100) / 100),
          isPaid: false
        });
      }
    } else {
      let installmentNumber = 1;
      
      for (let date of sortedDates) {
        const paymentDate = new Date(date);
        
        const interestPayment = remainingPrincipal * monthlyRate;
        const principalPayment = emi - interestPayment;
        remainingPrincipal -= principalPayment;
        
        schedule.push({
          paymentNumber: installmentNumber++,
          paymentDate,
          emi,
          principalPayment: Math.round(principalPayment * 100) / 100,
          interestPayment: Math.round(interestPayment * 100) / 100,
          remainingPrincipal: Math.max(0, Math.round(remainingPrincipal * 100) / 100),
          isPaid: false
        });
      }
    }
    
    return schedule;
  };