import React from 'react';
import './NotFound.scss';

const NotFound = ({ message }) => {
  return (
    <div className="not-found">
      <h2>{message ? message : 'Ups, otisli ste na nepostojeću stranu'}</h2>
    </div>
  );
};

export default NotFound;
