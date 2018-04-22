import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, IndexRedirect, Link } from 'dva/router';

import Framework          from './routes/framework/Framework';
import Error404           from './routes/error/404';
import NavContainer       from './routes/framework/NavContainer';

import Homepage           from './routes/Homepage';
import Login              from './routes/login/Login';
import Info               from './routes/framework/Info';

import CreateCardMain    from './routes/card/CardMain';
import ReissueMain    from './routes/cardReissue/ReissueMain';
import ProfileMain       from './routes/profile/ProfileMain';

import PrepaidMain       from './routes/prepaid/PrepaidMain';
import RechargeHistory       from './routes/prepaid/RechargeHistory';
import ConsumeHistory       from './routes/prepaid/ConsumeHistory';
import ForegiftMain      from './routes/foregift/ForegiftMain';//住院预缴

import AppointMain       from './routes/appoint/AppointMain';
import AppointHistory       from './routes/appoint/AppointHistory';
import AppointTodayHistory       from './routes/appoint/AppointTodayHistory';
import CaseHistory       from './routes/clinic/CaseHistory';
import AssayRecords       from './routes/assay/AssayRecords';
import FeeMain       from './routes/fee/FeeMain';
import TmsAssayRecords       from './routes/assay/TmsAssayRecords';

import InpatientBill       from './routes/inpatient/InpatientBill';
import InpatientDailyBill       from './routes/inpatient/InpatientDailyBill';
import RefundMain       from './routes/refund/RefundMain';
import WriteCard       from './routes/tools/WriteCard';
import RegisterMain       from './routes/register/RegisterMain';
import CashMain       from './routes/cash/CashMain';
import CardPrinterMain       from './routes/tools/CardPrinterMain';
import ReportExpMain       from './routes/tools/ReportExpMain';
export default function({ history, app }) {
return (
  <Router history={history}>
    <Route component={Framework}>
      <IndexRoute component={Homepage}/>
      <Route path="/" component={ Homepage }/>
      <Route path="/homepage" component={ Homepage }/>
      <Route component={NavContainer}>
      	<Route path="/info" component={ Info }/>
      	<Route path="/login" component={ Login }/>
       
      	<Route path="/card/id/issue" component={ CreateCardMain }/>
      	<Route path="/card/id/reissue" component={ ReissueMain }/>
      	<Route path="/card/mi/issue" component={ ProfileMain }/>
      
      	<Route path="/appointment/appoint" component={ AppointMain }/>
      	<Route path="/appointment/history" component={ AppointHistory }/>
    	<Route path="/appointment/sign" component={ AppointTodayHistory }/>
      	<Route path="/assay/records" component={ AssayRecords }/>
      	<Route path="/assay/bloods" component={ TmsAssayRecords }/>
      	
      	<Route path="/clinic/caseHistory" component={ CaseHistory }/>
      	
      	<Route path="/clinic/consumeHistory" component={ ConsumeHistory }/>
      	<Route path="/clinic/rechargeHistory" component={ RechargeHistory }/>
      	
      	<Route path="/clinic/recharge/:channel" component={ PrepaidMain }/>
      	
      	<Route path="/clinic/refund" component={ RefundMain }/>
      	
      	<Route path="/clinic/payFee" component={ FeeMain }/>
      	
      	<Route path="/inpatient/dailyBill" component={ InpatientDailyBill }/>
      	<Route path="/inpatient/foregift/:channel" component={ ForegiftMain }/>
      	<Route path="/inpatient/bill" component={ InpatientBill }/>
      	
      	<Route path="/guide" component={ PrepaidMain }/>
      	<Route path="/opt/writeCard" component={ WriteCard }/>
      	<Route path="/opt/register" component={ RegisterMain }/>
      	<Route path="/opt/cash" component={ CashMain }/>
      	<Route path="/opt/cardPrinter" component={ CardPrinterMain }/>
      	<Route path="/opt/reportExp" component={ ReportExpMain }/>
      	<Route path="/*" component={ Error404 }/>
      </Route>
    </Route>
  </Router>
);
};



