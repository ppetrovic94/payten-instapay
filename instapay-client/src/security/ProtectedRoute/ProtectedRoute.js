import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getCookie, getTrackingData } from '../utils/cookieUtils';

export const ProtectedRoute = ({ component: Component, ...options }) => {
  const jsessionid = getTrackingData('JSESSIONID');

  console.log(jsessionid, 'cookiee');

  return (
    <Route
      {...options}
      render={(props) =>
        jsessionid ? (
          options.path == '/' ? (
            <Redirect to="/merchants" />
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};
