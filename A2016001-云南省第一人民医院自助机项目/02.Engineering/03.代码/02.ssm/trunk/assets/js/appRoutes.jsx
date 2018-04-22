'use strict';

import {Route, Router,IndexRoute,RouterContext,useRouterHistory} from 'react-router';
import { Component} from 'react';
import createHashHistory from 'history/lib/createHashHistory';

import { Modal, Button } from 'antd';

import Framework from './pages/Framework.jsx';
import Login from './pages/Login.jsx';
import Error404 from './pages/error/404.jsx';
import Homepage from './pages/Homepage2.jsx';
import OperationHome from './pages/OptHome.jsx';
import PrepaidMain from './pages/prepaid/PrepaidMain.jsx';
import ConsumeHistory from './pages/prepaid/ConsumeHistory.jsx';
import RechargeHistory from './pages/prepaid/RechargeHistory.jsx';
import CardMain from './pages/card/CardMain.jsx';
import ProfileMain from './pages/profile/ProfileMain.jsx';
import NewProfileMain from './pages/newProfile/ProfileMain.jsx';
import RefundMain from './pages/refund/RefundMain.jsx';
import AppointMain from './pages/appoint/AppointMain.jsx';
import AppointHistory from './pages/appoint/AppointHistory.jsx';
import AppointTodayHistory from './pages/appoint/AppointTodayHistory.jsx';
import CashMain from './pages/cash/CashMain.jsx';
import CardPrinterMain from './pages/tools/CardPrinterMain.jsx';
import PrtCardMain from './pages/card/PrtCardMain.jsx';
import FeeMain from './pages/fee/FeeMain.jsx';
import CaseHistory from './pages/clinic/CaseHistory.jsx';
import TmsAssayRecords from './pages/assay/TmsAssayRecords.jsx';
import AssayRecords from './pages/assay/AssayRecords.jsx';

import ForegiftMain from './pages/foregift/ForegiftMain.jsx';
import InpatientDailyBill from './pages/inpatient/InpatientDailyBill.jsx';

import Register from './pages/register/Register.jsx';
import PayHistory from './pages/prepaid/PayHistory.jsx';
import FeeHistory from './pages/prepaid/FeeHistory.jsx';



const history = useRouterHistory(createHashHistory)({ queryKey: true });

class AppRoutes extends Component {

  constructor (props) {
    super(props);
  }
	  
  getRouteComponent(route,nextState, cb){
    let ui = cmpRequire(route.menu.url);
	if(ui)cb(null, ui);
  }
  render () {
    var scope = this;
    var result =   (
	  <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
	    <Route component={Framework}>
	      <IndexRoute component={Homepage}/>
	      <Route path="/" component={ Homepage }/>
	      <Route path="/homepage" component={ Homepage }/>
	      <Route path="/clinic/recharge/:channel" component={ PrepaidMain }/>
	      <Route path="/card/id/:type" component={ CardMain }/>
	      <Route path="/card/mi/:type" component={ ProfileMain }/>
	      <Route path="/profile/:type" component={ NewProfileMain }/>
	      <Route path="/login" component={ Login }/>
	      <Route path="/clinic/refund" component={ RefundMain } /> 
	      <Route path="/clinic/payFee" component={ FeeMain } />  
	      <Route path="/clinic/consumeHistory" component={ ConsumeHistory }/>  
	      <Route path="/clinic/CaseHistory" component={ CaseHistory }/> 
	      <Route path="/clinic/rechargeHistory" component={ RechargeHistory }/> 
	      <Route path="/assay/bloods" component={ TmsAssayRecords }/>  
	      <Route path="/assay/records" component={AssayRecords }/>  
	      <Route path="/appointment/appoint" component={ AppointMain }/> 
	      <Route path="/appointment/history" component={ AppointHistory }/> 
	      <Route path="/appointment/sign" component={ AppointTodayHistory }/> 
	      
	      <Route path="/inpatient/foregift/:channel" component={ ForegiftMain }/> 
	      <Route path="/inpatient/dailyBill" component={ InpatientDailyBill }/>
	      
	      <Route path="/opt/cash" component={ CashMain }/> 
	      <Route path="/opt/cardPrinter" component={ CardPrinterMain }/>  
	      
	      <Route path="/opt/prtCard" component={ PrtCardMain }/>   
 	      <Route path="/opt/register" component={ Register }/>   
	      <Route path="/opt/main" component={ OperationHome }/>
	      <Route path="/pay/payHistory" component={ PayHistory }/>		
	      <Route path="/pay/feeHistory" component={ FeeHistory }/>		

	      
	      <Route path="*" component={ Error404 }/>
	    </Route>
	  </Router>
	);
	return result;
  }
}
module.exports = AppRoutes;










