import React from 'react';
import PropTypes from 'prop-types';
import { Route, useHistory } from 'react-router-dom';
import { getTrackingData } from '../utils/cookieUtils';

export const LoginRoute = ({ component: Component, ...options }) => {
  const jsessionid = getTrackingData('JSESSIONID');
  const history = useHistory();

  return (
    <Route
      {...options}
      render={(props) => (jsessionid ? history.goBack() : <Component {...props} />)}
    />
  );
};

LoginRoute.propTypes = {
  component: PropTypes.element,
};
