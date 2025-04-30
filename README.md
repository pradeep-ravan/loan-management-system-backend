# Full-Stack Loan Management System

A complete loan management system with user onboarding, loan details input, and EMI tracking functionality.

## Features

- **User Onboarding**: Collect and validate user details including Name, DOB, PAN, Aadhar, GSTIN, and UDYAM.
- **Loan Details**: Input loan amount, interest rate, tenure, and repayment dates.
- **EMI Calculation**: Automatic calculation of EMIs based on loan details.
- **Ledger View**: Detailed view of loan repayment schedule.
- **CSV Export**: Download loan schedule as a CSV file.

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose

## Setup Instructions

### Prerequisites
- Node.js (v14 or above)
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/pradeep-ravan/loan-management-system-backend.git
   cd loan-management-system
   ```

2. Set up the backend:
   ```
   cd server
   npm install
   ```

3. Set up the frontend:
   ```
   cd ../client
   npm install
   ```

4. Start MongoDB (if using local MongoDB):
   ```
   mongod
   ```

5. Start the backend server:
   ```
   cd ../server
   npm run dev
   ```

6. Start the frontend development server:
   ```
   cd ../client
   npm start
   ```

7. Open your browser and navigate to `http://localhost:3000`


## Sample Data

### User Details Sample
```json
{
  "name": "Pradeep kumar",
  "dob": "1999-07-21",
  "pan": "ABCDE1234F",
  "aadhar": "123456789012",
  "gstin": "27AADCB2230M1ZP",
  "udyam": "UDYAM-MH-01-0000001"
}
```

### Loan Details Sample
```json
{
  "userId": "60d9a4f85e238f001c9a0d1a",
  "disbursementDate": "2023-04-01",
  "loanAmount": 100000,
  "interestRate": 12,
  "tenure": 12,
  "repaymentDates": [
    "2023-05-01",
    "2023-06-01",
    "2023-07-01",
    "2023-08-01",
    "2023-09-01",
    "2023-10-01",
    "2023-11-01",
    "2023-12-01",
    "2024-01-01",
    "2024-02-01",
    "2024-03-01",
    "2024-04-01"
  ]
}
```

## Validation Formats

- **PAN**: 10 character alphanumeric (e.g., ABCDE1234F)
- **Aadhar**: 12 digit number
- **GSTIN**: 15 character alphanumeric (e.g., 27AADCB2230M1ZP)
- **UDYAM**: Format: UDYAM-XX-XX-XXXXXXX

## EMI Calculation

The system uses the following formula for EMI calculation:

```
EMI = [P x R x (1+R)^N]/[(1+R)^N-1]

Where:
P = Principal loan amount
R = Monthly interest rate (annual rate / 12 / 100)
N = Loan tenure in months
```

## License

MIT