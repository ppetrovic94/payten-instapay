import React from 'react';
import Header from '../Header/Header';
import { Switch } from 'react-router-dom';
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
import './Layout.scss';

const Layout = () => {
  return (
    <div className="appContent">
      <Header />
      <Switch>
        <ProtectedRoute path="/merchants" exact component={Merchants} />
        <ProtectedRoute path="/merchants/add" exact component={AddMerchant} />
        <ProtectedRoute path="/merchant/:id" exact component={EditMerchant} />
        <ProtectedRoute path="/merchant/:id/pos" exact component={PointOfSales} />
        <ProtectedRoute path="/merchant/:id/fees" exact component={Fees} />
        <ProtectedRoute path="/merchant/:id/pos/add" exact component={AddPointOfSale} />
        <ProtectedRoute path="/pos/:id" exact component={EditPointOfSale} />
        <ProtectedRoute path="/pos/:id/terminals" exact component={Terminals} />
        <ProtectedRoute path="/pos/:id/terminals/add" exact component={AddTerminal} />
        <ProtectedRoute path="/terminals/:id" exact component={EditTerminal} />
        <ProtectedRoute path="/terminals/:id/details" exact component={TerminalDetails} />
        <ProtectedRoute path="/cities" exact component={Cities} />
        <ProtectedRoute path="/users" exact component={Users} />
        <ProtectedRoute path="/users/add" exact component={AddUser} />
        <ProtectedRoute path="/users/:id" exact component={EditUser} />
        <ProtectedRoute path="/groups" exact component={Groups} />
        <ProtectedRoute path="/groups/add" exact component={AddGroup} />
        <ProtectedRoute path="/groups/:id" exact component={EditGroup} />
        <ProtectedRoute path="/fees" exact component={Fees} />
        <ProtectedRoute path="/fees/add" exact component={AddFee} />
        <ProtectedRoute path="/fees/:id" exact component={EditFee} />
      </Switch>
    </div>
  );
};

export default Layout;
