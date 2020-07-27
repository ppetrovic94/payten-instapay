import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button } from 'semantic-ui-react';
import axios from 'axios';
import './LoginForm.scss';

const LoginFrom = () => {
  const [loginRequest, setLoginRequest] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState('');
  const history = useHistory();

  const onChange = (e) => {
    setLoginRequest({ ...loginRequest, [e.target.name]: e.target.value });
    console.log(loginRequest, 'login request');
  };

  const onSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:8080/login', loginRequest);
      console.log(res, 'login response');
      history.push('/merchants');
    } catch (err) {
      setErrors(err.response.data);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <label>Username</label>
        <input
          type="text"
          placeholder=""
          name="username"
          value={loginRequest.username}
          onChange={onChange}
        />
      </Form.Field>
      <Form.Field>
        <label>Password</label>
        <input
          type="password"
          placeholder=""
          name="password"
          value={loginRequest.password}
          onChange={onChange}
        />
      </Form.Field>
      <p style={{ color: 'red' }}>{errors && errors.message}</p>
      {/* <Form.Field className="checkboxWrapper">
            <input type="checkbox" onClick={this.onClick} name="Remember me" />
            <span className="loginLabel">Remember me</span>
          </Form.Field> */}
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default LoginFrom;
