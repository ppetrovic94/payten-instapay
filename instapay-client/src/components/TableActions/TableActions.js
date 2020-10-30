import React from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './TableActions.scss';
import CustomModal from '../CustomModal/CustomModal';

const TableActions = ({ actions, onDeleteHandler }) => {
  const deleteModalContent = () => <h3>Da li ste sigurni da želite da obrišete ovaj podatak?</h3>;

  return (
    <div className="actionContainer">
      {actions &&
        actions.map((action, key) => {
          return (
            <Popup
              key={key}
              content={action.label}
              trigger={
                action.type === 'DELETE' ? (
                  <div className="customModal">
                    <CustomModal
                      content={deleteModalContent}
                      yesNoButtons
                      onAcceptHandler={onDeleteHandler}
                      triggerElement={() => <Icon name={action.icon} size="large" />}
                    />
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

TableActions.propTypes = {
  actions: PropTypes.array,
  onDeleteHandler: PropTypes.func,
};

export default TableActions;
