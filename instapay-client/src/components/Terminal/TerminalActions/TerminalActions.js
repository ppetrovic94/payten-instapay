import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './TerminalActions.scss';

const TerminalActions = ({ terminal, actionConfig }) => {
  const terminalActions = actionConfig(terminal.terminalId);

  return (
    <div className="actionContainer">
      {terminalActions &&
        terminalActions.map((action, key) => {
          if (action.type === 'GET_ANDROID_DETAILS') {
            if (terminal.terminalType === 'Android') {
              return (
                <Popup
                  key={key}
                  content={action.label}
                  trigger={
                    <Link to={{ pathname: action.redirectLink }}>
                      <Icon color={'green'} name={action.icon} size="large" />
                    </Link>
                  }
                />
              );
            } else return null;
          } else
            return (
              <Popup
                key={key}
                content={action.label}
                trigger={
                  <Link to={{ pathname: action.redirectLink }}>
                    <Icon name={action.icon} size="large" />
                  </Link>
                }
              />
            );
        })}
    </div>
  );
};

export default TerminalActions;
