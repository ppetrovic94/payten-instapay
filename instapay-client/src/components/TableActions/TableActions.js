import React from 'react';
import { Button, Popup, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const TableActions = ({ actionKey, actionConfig }) => {
  const actions = actionConfig(actionKey);

  return (
    <div className="actionContainer">
      {actions &&
        actions.map((action, key) => {
          return (
            <Popup
              key={key}
              content={action.label}
              trigger={
                <Link to={{ pathname: action.redirectLink }}>
                  <Icon name={action.icon} size="big" />
                </Link>
              }
            />
          );
        })}
    </div>
  );
};

export default TableActions;
