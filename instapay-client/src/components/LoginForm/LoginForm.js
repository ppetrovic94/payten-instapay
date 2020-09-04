import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button } from 'semantic-ui-react';
import axios from '../../utils/API';
import './LoginForm.scss';
import { useAuthDataContext } from '../../security/AuthDataProvider/AuthDataProvider';
import Logo from '../Header/Logo';

const LoginForm = () => {
  const { onLogin } = useAuthDataContext();
  const [loginRequest, setLoginRequest] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const history = useHistory();

  const onChange = (e) => {
    setLoginRequest({ ...loginRequest, [e.target.name]: e.target.value });
    console.log(loginRequest, 'login request');
  };

  const onSubmit = async () => {
    try {
      const res = await axios.post('/login', loginRequest);
      onLogin({ roles: getRoles(res.data) });
      redirectBasedOnRole(res.data);
    } catch (err) {
      console.log('error', err.response);
      setError(err.response.data);
    }
  };

  const getRoles = (authorities) => {
    return authorities.map((role) => role['authority']);
  };

  const redirectBasedOnRole = (authorities) => {
    const roles = getRoles(authorities);
    if (roles[0] === 'ROLE_USER') {
      history.push('/merchants');
    } else if (roles[0] === 'ROLE_ADMIN') {
      history.push('/users');
    }
  };

  return (
    <div className="loginContainer">
      <Logo />
      <div className="loginForm">
        <Form onSubmit={onSubmit}>
          <Form.Field>
            <label style={{ color: 'white' }}>Korisničko ime</label>
            <input
              type="text"
              placeholder="Unesite korisničko ime..."
              name="username"
              value={loginRequest.username}
              onChange={onChange}
            />
          </Form.Field>
          <Form.Field>
            <label style={{ color: 'white' }}>Lozinka</label>
            <input
              type="password"
              placeholder="Unesite lozinku..."
              name="password"
              value={loginRequest.password}
              onChange={onChange}
            />
          </Form.Field>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="submitButton">
            <Button type="submit">Prijavi se</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
