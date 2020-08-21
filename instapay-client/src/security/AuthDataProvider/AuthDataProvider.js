import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export const AuthDataContext = createContext(null);

const initialAuthData = {};

const AuthDataProvider = (props) => {
  const [authData, setAuthData] = useState(initialAuthData);
  const history = useHistory();

  axios.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      console.log('response status', response);
      return response;
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      console.log('error status', error.response.status);
      //setAuthData({ ...authData, isAuthenticated: false });
      if (error.response.status == 403) history.push('/');

      return Promise.reject(error);
    },
  );

  /* The first time the component is rendered, it tries to
   * fetch the auth data from a source, like a cookie or
   * the localStorage.
   */
  useEffect(() => {
    //console.log('isAuthenticated useEffecat', authData.isAuthenticated);
    const fetchCurrentUserRoles = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/currentroles');
        setAuthData({ ...authData, roles: res.data });
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentUserRoles();
  }, []);

  const onLogout = () => setAuthData(initialAuthData);

  const onLogin = (newAuthData) => setAuthData({ ...authData, ...newAuthData });

  const onSessionExpired = () => setAuthData({ ...authData, isAuthenticated: false });

  const authDataValue = useMemo(() => ({ ...authData, onLogin, onLogout, onSessionExpired }), [
    authData,
  ]);

  return <AuthDataContext.Provider value={authDataValue} {...props} />;
};

export const useAuthDataContext = () => useContext(AuthDataContext);

export default AuthDataProvider;
