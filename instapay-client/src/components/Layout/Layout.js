import React from 'react';
import Header from '../Header/Header';
import { Switch, Route } from 'react-router-dom';
import AddMerchant from '../Merchant/AddMerchant/AddMerchant';
import EditMerchant from '../Merchant/EditMerchant/EditMerchant';
import PointOfSales from '../PointOfSale/PointOfSales/PointOfSales';
import AddPointOfSale from '../PointOfSale/AddPointOfSale/AddPointOfSale';
import EditPointOfSale from '../PointOfSale/EditPointOfSale/EditPointOfSale';
import Terminals from '../Terminal/Terminals/Terminals';
import AddTerminal from '../Terminal/AddTerminal/AddTerminal';
import EditTerminal from '../Terminal/EditTerminal/EditTerminal';
import TerminalDetails from '../Terminal/TerminalDetails/TerminalDetails';
import Merchants from '../Merchant/Merchants/Merchants';
import Users from '../User/Users/Users';
import AddUser from '../User/AddUser/AddUser';
import EditUser from '../User/EditUser/EditUser';
import Groups from '../Group/Groups/Groups';
import AddGroup from '../Group/AddGroup/AddGroup';
import EditGroup from '../Group/EditGroup/EditGroup';
import Fees from '../Fee/Fees/Fees';
import AddFee from '../Fee/AddFee/AddFee';
import EditFee from '../Fee/EditFee/EditFee';
import { ProtectedRoute } from '../../security/ProtectedRoute/ProtectedRoute';
import Cities from '../City/Cities/Cities';
import NotFound from '../../security/NotFound/NotFound';
import Transactions from '../Transactions/Transactions';
import './Layout.scss';

const Layout = () => {
  return (
    <div className="appContent">
      <Header />
      <Switch>
        <ProtectedRoute path="/ips/merchants" exact component={Merchants} />
        <ProtectedRoute path="/ips/merchants/add" exact component={AddMerchant} />
        <ProtectedRoute path="/ips/merchant/:id" exact component={EditMerchant} />
        <ProtectedRoute path="/ips/merchant/:id/pos" exact component={PointOfSales} />
        <ProtectedRoute path="/ips/merchant/:id/fees" exact component={Fees} />
        <ProtectedRoute path="/ips/merchant/:id/pos/add" exact component={AddPointOfSale} />
        <ProtectedRoute path="/ips/pos/:id" exact component={EditPointOfSale} />
        <ProtectedRoute path="/ips/pos/:id/terminals" exact component={Terminals} />
        <ProtectedRoute path="/ips/pos/:id/terminals/add" exact component={AddTerminal} />
        <ProtectedRoute path="/ips/terminals/:id" exact component={EditTerminal} />
        <ProtectedRoute path="/ips/terminals/:id/details" exact component={TerminalDetails} />
        <ProtectedRoute path="/ips/terminals/:id/transactions" exact component={Transactions} />
        <ProtectedRoute path="/ips/cities" exact component={Cities} />
        <ProtectedRoute path="/ips/users" exact component={Users} />
        <ProtectedRoute path="/ips/users/add" exact component={AddUser} />
        <ProtectedRoute path="/ips/users/:id" exact component={EditUser} />
        <ProtectedRoute path="/ips/groups" exact component={Groups} />
        <ProtectedRoute path="/ips/groups/add" exact component={AddGroup} />
        <ProtectedRoute path="/ips/groups/:id" exact component={EditGroup} />
        <ProtectedRoute path="/ips/fees" exact component={Fees} />
        <ProtectedRoute path="/ips/fees/add" exact component={AddFee} />
        <ProtectedRoute path="/ips/fees/:id" exact component={EditFee} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default Layout;
