import React from 'react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const TableActions = ({ actionKey, actionConfig }) => {
  const actions = actionConfig(actionKey);

  return (
    <div className="actionContainer">
      {actions &&
        actions.map((action, key) => {
          return (
            <Button key={key} as={Link} to={{ pathname: action.redirectLink }}>
              {action.label}
            </Button>
          );
        })}
    </div>
  );
};

export default TableActions;
