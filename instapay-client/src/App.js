import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.scss';
import HomePage from './pages/HomePage/HomePage';
import Header from './components/Header/Header';
import AddMerchant from './components/Merchant/AddMerchant/AddMerchant';
import Store from './store/index';
import EditMerchant from './components/Merchant/EditMerchant/EditMerchant';
import PointOfSales from './components/PointOfSale/PointOfSales/PointOfSales';
import AddPointOfSale from './components/PointOfSale/AddPointOfSale/AddPointOfSale';
import EditPointOfSale from './components/PointOfSale/EditPointOfSale/EditPointOfSale';
import Terminals from './components/Terminal/Terminals/Terminals';
import AddTerminal from './components/Terminal/AddTerminal/AddTerminal';
import EditTerminal from './components/Terminal/EditTerminal/EditTerminal';
import TerminalDetails from './components/Terminal/TerminalDetails/TerminalDetails';
import Merchants from './components/Merchant/Merchants/Merchants';
import Users from './components/User/Users/Users';
import AddUser from './components/User/AddUser/AddUser';
import EditUser from './components/User/EditUser/EditUser';
import Groups from './components/Group/Groups/Groups';
import AddGroup from './components/Group/AddGroup/AddGroup';
import EditGroup from './components/Group/EditGroup/EditGroup';
import Fees from './components/Fee/Fees/Fees';
import AddFee from './components/Fee/AddFee/AddFee';
import EditFee from './components/Fee/EditFee/EditFee';

const App = () => {
  return (
    <div className="App">
      <Provider store={Store}>
        <Router>
          <Header />
          <div className="appContent">
            <Switch>
              <Route path="/" exact component={HomePage} />
              <Route path="/merchants" exact component={Merchants} />
              <Route path="/addMerchant" exact component={AddMerchant} />
              <Route path="/merchant/:id" exact component={EditMerchant} />
              <Route path="/merchant/:id/pos" exact component={PointOfSales} />
              <Route path="/merchant/:id/fees" exact component={Fees} />
              <Route path="/merchant/:id/pos/add" exact component={AddPointOfSale} />
              <Route path="/pos/:id" exact component={EditPointOfSale} />
              <Route path="/pos/:id/terminals" exact component={Terminals} />
              <Route path="/pos/:id/terminals/add" exact component={AddTerminal} />
              <Route path="/terminals/:id" exact component={EditTerminal} />
              <Route path="/terminals/:id/details" exact component={TerminalDetails} />
              <Route path="/users" exact component={Users} />
              <Route path="/users/add" exact component={AddUser} />
              <Route path="/users/:id" exact component={EditUser} />
              <Route path="/groups" exact component={Groups} />
              <Route path="/groups/add" exact component={AddGroup} />
              <Route path="/groups/:id" exact component={EditGroup} />
              <Route path="/fees" exact component={Fees} />
              <Route path="/fees/add" exact component={AddFee} />
              <Route path="/fees/:id" exact component={EditFee} />
            </Switch>
          </div>
        </Router>
      </Provider>
    </div>
  );
};

export default App;
