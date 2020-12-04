import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Popup } from 'semantic-ui-react';
import CustomModal from '../../CustomModal/CustomModal';
import MerchantCredentials from '../MerchantCredentials/MerchantCredentials';
import './MerchantActions.scss';

const MerchantActions = ({ actions, merchant, merchantRerender }) => {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState(null);

  const onGenerateCredentials = () => {};

  const credentialDetails = () => {
    return (
      <MerchantCredentials
        userId={merchant.acqUser.userId}
        merchantName={merchant.merchantName}
        merchantId={merchant.merchantId}
        merchantRerender={merchantRerender}
      />
    );
  };

  const credentialForm = () => {
    return (
      <MerchantCredentials
        merchantName={merchant.merchantName}
        merchantId={merchant.merchantId}
        merchantRerender={merchantRerender}
      />
    );
  };

  return (
    <div className="merchantActionsContainer">
      {actions &&
        actions.map((action, key) => {
          return (
            <Popup
              key={key}
              content={
                action.name == 'merchantCredentials'
                  ? merchant.acqUser
                    ? 'Kredencijali (USER ID)'
                    : 'Generisi kredencijale'
                  : action.label
              }
              trigger={
                action.name === 'merchantCredentials' ? (
                  <div className="customModal">
                    {merchant.acqUser && merchant.acqUser.terminalId == null ? (
                      <CustomModal
                        content={credentialDetails}
                        triggerElement={() => <Icon name="key" size="large" />}
                      />
                    ) : (
                      <CustomModal
                        content={credentialForm}
                        triggerElement={() => <Icon name="add" size="large" />}
                      />
                    )}
                  </div>
                ) : (
                  <Link to={{ pathname: action.redirectLink }}>
                    <Icon name={action.icon} size="large" />
                  </Link>
                )
              }
            />
          );
        })}
    </div>
  );
};

export default MerchantActions;
