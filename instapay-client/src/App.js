import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.scss';
import HomePage from './pages/HomePage/HomePage';
import AuthDataProvider from './security/AuthDataProvider/AuthDataProvider';
import Layout from './components/Layout/Layout';

const App = () => {
  return (
    <div className="App">
      <Router>
        <AuthDataProvider>
          <div className="appContent">
            <Switch>
              <Route path="/" exact component={HomePage} />
              <Route component={Layout} />
            </Switch>
          </div>
        </AuthDataProvider>
      </Router>
    </div>
  );
};

export default App;
