import React from 'react';
import { useOutletContext } from 'react-router-dom';
import AccountDetails from '../../AccountDetails/AccountDetails';

const DashboardAccountDetailsRoute = () => {
  const shared = useOutletContext();
  const data = shared || { accountNumber: '********1234', currentBalance: 7450.8, transactions: [] };

  return (
    <div style={{ paddingTop: 8 }}>
      <AccountDetails
        accountNumber={data.accountNumber}
        currentBalance={data.currentBalance}
        transactions={data.transactions}
      />
    </div>
  );
};

export default DashboardAccountDetailsRoute;
