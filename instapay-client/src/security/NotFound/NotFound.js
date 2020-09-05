import React from 'react';
import PropTypes from 'prop-types';
import './NotFound.scss';

const NotFound = ({ message }) => {
  return (
    <div className="not-found">
      <h2>{message ? message : 'Ups, otisli ste na nepostojeću stranu'}</h2>
    </div>
  );
};

NotFound.propTypes = {
  message: PropTypes.string,
};

export default NotFound;
