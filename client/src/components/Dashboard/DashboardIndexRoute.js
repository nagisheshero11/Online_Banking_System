import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';

const DashboardIndexRoute = () => {
  const shared = useOutletContext();
  const data = shared || {
    accountNumber: '********1234',
    currentBalance: 7450.8,
    transactions: [
      { id: 1, date: '2024-10-26', description: 'Coffee Shop', amount: -2100.0 },
      { id: 2, date: '2024-10-24', description: 'Salary Deposit', amount: 85.0 },
    ],
  };

  return (
    <DashboardLayout
      accountNumber={data.accountNumber}
      currentBalance={data.currentBalance}
      transactions={data.transactions}
    />
  );
};

export default DashboardIndexRoute;
