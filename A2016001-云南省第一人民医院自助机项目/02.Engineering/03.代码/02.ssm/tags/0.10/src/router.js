import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, IndexRedirect, Link } from 'dva/router';

import Framework          from './routes/framework/Framework';
import Error404           from './routes/error/404';
import NavContainer       from './routes/framework/NavContainer';

import Homepage           from './routes/Homepage';
//办卡
import CreateCard01       from './routes/medicalCard/CreateCard01';
import CreateCard02       from './routes/medicalCard/CreateCard02';
import CreateCard03       from './routes/medicalCard/CreateCard03';
//建档
import CreateProfile00    from './routes/createProfile/CreateProfile00';
import CreateProfile01    from './routes/createProfile/CreateProfile01';
import CreateProfile02    from './routes/createProfile/CreateProfile02';
import CreateProfile03    from './routes/createProfile/CreateProfile03';
//公用
import Info               from './routes/framework/Info';
import SelectDept         from './routes/base/SelectDept';
import SearchDoctor       from './routes/base/SearchDoctor';
//预约
import ChooseDoctor       from './routes/appointment/ChooseDoctor';
import ChooseTimePeriod   from './routes/appointment/ChooseTimePeriod';
import AppointmentConfirm from './routes/appointment/AppointmentConfirm';
import AppointmentRecords from './routes/appointment/AppointmentRecords';
import SignIn             from './routes/appointment/SignIn';
import Signed             from './routes/appointment/Signed';
//收银台
import PaymentConfirm     from './routes/cashierDesk/PaymentConfirm';
import PaymentChannels    from './routes/cashierDesk/PaymentChannels';
import BankCard           from './routes/cashierDesk/BankCard';
import InputPassword      from './routes/cashierDesk/InputPassword';
import ScanQRCode         from './routes/cashierDesk/ScanQRCode';
import ScanWeixinQRCode   from './routes/cashierDesk/ScanWeixinQRCode';
import ScanAlipayQRCode   from './routes/cashierDesk/ScanAlipayQRCode';
import PaymentRecords     from './routes/cashierDesk/PaymentRecords';
import PaidDone           from './routes/cashierDesk/PaidDone';
//预存
import PrepaidOpen        from './routes/prepaid/PrepaidOpen';
import Prepaid            from './routes/prepaid/Prepaid';
import PrepaidCash        from './routes/prepaid/PrepaidCash';
//缴费
import NeedPay            from './routes/pay/NeedPay';
//住院预缴
import InpatientPrepaidNav from './routes/inpatientPrepaid/InpatientPrepaidNav';
import InpatientPrepaid   from './routes/inpatientPrepaid/InpatientPrepaid';
//门诊
import CaseHistoryRecords from './routes/outpatient/CaseHistoryRecords';
import CheckRecords       from './routes/outpatient/CheckRecords';
import CheckResult        from './routes/outpatient/CheckResult';
//住院
import InpatientBill      from './routes/inpatient/InpatientBill';
import InpatientDailyBill from './routes/inpatient/InpatientDailyBill';

import UnionPay           from './routes/cashierDesk/UnionPay';

/**
 * router的入参由框架传入，共有两个history和app
 * @auther xiaweiyi
 */
export default function({ history, app }) {
return (
    <Router history={history}>
    	<Route path="/" component={Framework}>
    	 	<IndexRoute component={Homepage}/>
        <Route path="/homepage" component={ Homepage }/>
    	 	<Route path="/nav" component={NavContainer}>

          <Route path="/info" component={ Info }/>

	    	 	<Route path="/createCard01" component={ CreateCard01 }/>
          <Route path="/createCard02" component={ CreateCard02 }/>
          <Route path="/createCard03" component={ CreateCard03 }/>

          <Route path="/createProfile00" component={ CreateProfile00 }/>
          <Route path="/createProfile01" component={ CreateProfile01 }/>
          <Route path="/createProfile02" component={ CreateProfile02 }/>
          <Route path="/createProfile03" component={ CreateProfile03 }/>

          <Route path="/selectDept/:type" component={ SelectDept }/>
          <Route path="/searchDoctor" component={ SearchDoctor }/>

          <Route path="/chooseDoctor" component={ ChooseDoctor }/>
          <Route path="/chooseTimePeriod" component={ ChooseTimePeriod }/>
          <Route path="/appointmentConfirm" component={ AppointmentConfirm }/>
          <Route path="/appointmentRecords" component={ AppointmentRecords }/>
          <Route path="/signIn" component={ SignIn }/>
          <Route path="/signed" component={ Signed }/>

          <Route path="/paymentConfirm" component={ PaymentConfirm }/>
          <Route path="/paymentChannels" component={ PaymentChannels }/>
          <Route path="/bankCard" component={ BankCard }/>
          <Route path="/inputPassword" component={ InputPassword }/>
          <Route path="/scanQRCode" component={ ScanQRCode }/>
          <Route path="/scanWeixinQRCode" component={ ScanWeixinQRCode }/>
          <Route path="/scanAlipayQRCode" component={ ScanAlipayQRCode }/>
          <Route path="/paymentRecords" component={ PaymentRecords }/>
          <Route path="/paidDone" component={ PaidDone }/>

          <Route path="/prepaidOpen" component={ PrepaidOpen }/>
          <Route path="/prepaid/:type" component={ Prepaid }/>
	    	 	<Route path="/prepaidCash" component={ PrepaidCash }/>
          <Route path="/payment" component={ UnionPay }/>

          <Route path="/needPay" component={ NeedPay }/>

          <Route path="/inpatientPrepaidNav" component={ InpatientPrepaidNav }/>
          <Route path="/inpatientPrepaid/:type" component={ InpatientPrepaid }/>
	    	 	
          <Route path="/caseHistoryRecords" component={ CaseHistoryRecords }/>
          <Route path="/checkRecords" component={ CheckRecords }/>
          <Route path="/checkResult" component={ CheckResult }/>

          <Route path="/inpatientBill" component={ InpatientBill }/>
          <Route path="/inpatientDailyBill" component={ InpatientDailyBill }/>

	    	 	<Route path="/*" component={ Error404 }/>
	    	</Route>
    	 </Route>
    </Router>
  );
};



