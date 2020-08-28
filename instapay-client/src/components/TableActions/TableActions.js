import React from 'react';
import { Button, Popup, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from '../../utils/API';
import './TableActions.scss';

const TableActions = ({ actions, onDeleteHandler }) => {
  const onDeleteAlert = (action) => {
    console.log('onDelete');
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h3>Da li ste sigurni da želite da obrišete ovaj podatak?</h3>
            <button onClick={onClose}>Ne</button>
            <button
              onClick={() => {
                onDeleteHandler();
                onClose();
              }}>
              Da
            </button>
          </div>
        );
      },
    });
  };

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
                  <div onClick={() => onDeleteAlert(action)} className="deleteButton">
                    <Icon name={action.icon} size="large" />
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

export default TableActions;
