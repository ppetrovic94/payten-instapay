import React, { useState } from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import axios from '../../../utils/API';
import CustomModal from '../../CustomModal/CustomModal';
import CustomTable from '../../CustomTable/CustomTable';
import { transactionDetailsTableHeader, formatTerminalDetails } from '../utils/transactionsTable';
import CustomLoader from '../../CustomLoader/CustomLoader';
import './TransactionActions.scss';

const TransactionActions = ({ endToEndId, actions }) => {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);

  const onOpenModal = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/user/terminals/transactions/${endToEndId}`);
      setDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error.response);
      setLoading(false);
    }
  };

  const detailsContent = () => {
    return loading ? (
      <CustomLoader />
    ) : (
      details && (
        <CustomTable
          tableTitle={`Detalji transakcije - ${endToEndId}`}
          content={formatTerminalDetails(details)}
          tableHeader={transactionDetailsTableHeader}
        />
      )
    );
  };

  return (
    <div>
      {actions &&
        actions.map((action, key) => {
          return (
            <Popup
              key={key}
              content={action.label}
              trigger={
                <div className="customModal">
                  <CustomModal
                    content={detailsContent}
                    onOpenHandler={onOpenModal}
                    triggerElement={() => <Icon name={action.icon} size="large" />}
                    size="large"
                  />
                </div>
              }
            />
          );
        })}
    </div>
  );
};

export default TransactionActions;
