import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { getTrackingData } from '../utils/cookieUtils';

export const ProtectedRoute = ({ component: Component, ...options }) => {
  const jsessionid = getTrackingData('JSESSIONID');

  return (
    <Route
      {...options}
      render={(props) => {
        return jsessionid ? <Component {...props} /> : <Redirect to="/ips/" />;
      }}
    />
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.elementType,
};
