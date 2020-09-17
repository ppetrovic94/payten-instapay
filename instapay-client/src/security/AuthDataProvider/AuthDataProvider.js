import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from '../../utils/API';

export const AuthDataContext = createContext(null);

const initialAuthData = {};

const AuthDataProvider = (props) => {
  const [authData, setAuthData] = useState(initialAuthData);
  const history = useHistory();

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 403) {
        document.cookie = `JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/ips; domain=${document.cookie.hostname};`;
        history.push('/ips');
      }

      return Promise.reject(error);
    },
  );

  useEffect(() => {
    const fetchCurrentUserRoles = async () => {
      try {
        const roles = await axios.get('/currentroles');
        setAuthData({
          ...authData,
          roles: roles.data,
        });
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
