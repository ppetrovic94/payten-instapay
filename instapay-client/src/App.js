import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import AuthDataProvider from './security/AuthDataProvider/AuthDataProvider';
import Layout from './components/Layout/Layout';
import LoginForm from './components/LoginForm/LoginForm';
import { LoginRoute } from './security/ProtectedRoute/LoginRoute';

const App = () => {
  return (
    <div className="App">
      <Router>
        <AuthDataProvider>
          <Switch>
            <LoginRoute path="/ips" exact component={LoginForm} />
            <Route component={Layout} />
          </Switch>
        </AuthDataProvider>
      </Router>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default App;
