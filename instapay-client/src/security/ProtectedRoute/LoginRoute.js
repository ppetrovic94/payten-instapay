import React from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { getCookie, getTrackingData } from '../utils/cookieUtils';

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
