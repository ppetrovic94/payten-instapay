import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const ProtectedRoute = ({ component: Component, ...options }) => {
  const getCookie = (cookieName) => {
    const cookies = document.cookie.split(';');
    return cookies.find((cookie) => cookie.search(cookieName) !== -1);
  };

  const jsessionid = getCookie('JSESSIONID');

  console.log(jsessionid, 'cookiee');

  return (
    <Route
      {...options}
      render={(props) => (jsessionid ? <Component {...props} /> : <Redirect to="/" />)}
    />
  );
};
