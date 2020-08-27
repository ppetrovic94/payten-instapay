import React from 'react';
import { Button, Popup, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { Link } from 'react-router-dom';

const TableActions = ({ actions, actionIds }) => {
  const onChangeRoute = () => {
    _.map(actionIds, (value, key) => {
      localStorage.setItem(key, value);
    });
    console.log('changed route');
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
                <Link onClick={onChangeRoute} to={{ pathname: action.redirectLink }}>
                  <Icon name={action.icon} size="large" />
                </Link>
              }
            />
          );
        })}
    </div>
  );
};

export default TableActions;
