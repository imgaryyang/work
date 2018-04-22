import React from 'react';
import { Router, Route, IndexRoute } from 'dva/router';
import Framework from './routes/framework/Framework';
import Error404 from './routes/framework/404';
import CommonLayout from './routes/framework/CommonLayout';
import Login from './routes/framework/Login';
import Homepage from './routes/framework/Homepage';
import BaseHome from './routes/base/BaseHome';
import UserMain from './routes/base/user/UserMain';
import OrgMain from './routes/base/org/OrgMain';
import PayChannelMain from './routes/base/paychannel/PayChannelMain';
import RoleMain from './routes/base/role/RoleMain';
import AreaMain from './routes/base/area/AreaMain';
import ModelMain from './routes/base/model/ModelMain';
import MachineMain from './routes/base/machine/MachineMain';
import OperatorMain from './routes/base/operator/OperatorMain';
import ClientMenuMain from './routes/base/clientMenu/ClientMenuMain';
import MngMenuMain from './routes/base/mngMenu/MngMenuMain';
import LoggerMain from './routes/base/logger/LoggerMain';
import MonitorMain from './routes/base/monitor/MonitorMain';

import ClientAuthMain from './routes/base/auth/client/AuthMain';
import MngAuthMain from './routes/base/auth/mng/AuthMain';
import OptAuthMain from './routes/base/auth/opt/AuthMain';

import CashBatchMain from './routes/payment/cash/BatchMain';
import RechargeMain from './routes/payment/recharge/RechargeMain';
import CheckMain from './routes/payment/check/CheckMain';
import TranQueryMain from './routes/tran/tranQuery/TranQueryMain';
import TranCashMain from './routes/tran/tranCash/TranCashMain';
import TranThirdMain from './routes/tran/tranThird/TranThirdMain';
import TranRefundMain from './routes/tran/tranRefund/TranRefundMain';
import DealRefundMain from './routes/tran/dealRefund/DealRefundMain';

/* 运营 */
import BackTracking from './routes/opt/backTracking/BackTracking'; // 补录

/* 统计 */
import TrilateralChecking from './routes/statistics/trilateralChecking/TrilateralChecking'; // 三方对账统计

/* 材料管理 */
import MaterialManageMain from './routes/materials/materialManage/MaterialManageMain'; 
import OutManageMain from './routes/materials/detailManage/outManage/OutManageMain'; 
import InManageMain from './routes/materials/detailManage/inManage/InManageMain'; 

/* 故障管理 */
import TroubleMain from './routes/troubles/trouble/TroubleMain';
import TroubleDetailMain from './routes/troubles/troubleDetail/TroubleDetailMain';

/**
 * @auther xiaweiyi 
 */
export default function ({ history }) { 
  return (
    <Router history={history} >
      <Route path="/" component={Framework} >
        <IndexRoute component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/homepage" component={Homepage} />
        <Route path="/base" component={CommonLayout} >
          <IndexRoute component={BaseHome} />
          <Route path="paychannel" component={PayChannelMain} />
          <Route path="org" component={OrgMain} />
          <Route path="user" component={UserMain} />
          <Route path="role" component={RoleMain} />
          <Route path="area" component={AreaMain} />
          <Route path="model" component={ModelMain} />
          <Route path="logger" component={LoggerMain} />
          <Route path="machine" component={MachineMain} />
          <Route path="monitor" component={MonitorMain} />
          <Route path="operator" component={OperatorMain} />
          <Route path="auth/client" component={ClientAuthMain} />
          <Route path="auth/mng" component={MngAuthMain} />
          <Route path="auth/operator" component={OptAuthMain} />
          <Route path="menu/client" component={ClientMenuMain} />
          <Route path="menu/mng" component={MngMenuMain} />
          <Route path="cash/clean" component={CashBatchMain} />
          <Route path="pay/recharge" component={RechargeMain} />
          <Route path="check/mng" component={CheckMain} />
          <Route path="tran/tranQuery" component={TranQueryMain} />
          <Route path="tran/tranCash" component={TranCashMain} />
          <Route path="tran/tranThird" component={TranThirdMain} />
          <Route path="tran/tranRefund" component={TranRefundMain} />
          <Route path="tran/dealRefundMain" component={DealRefundMain} />
          <Route path="statistics/trilateralChecking" component={TrilateralChecking} />
          <Route path="backTracking" component={BackTracking} />
            
          <Route path="materials/materialManage" component={MaterialManageMain} />
          <Route path="materials/outManage" component={OutManageMain} />
          <Route path="materials/inManage" component={InManageMain} />
          
          <Route path="troubles/troubleMain" component={TroubleMain} />
          <Route path="troubles/troubleDetailMain" component={TroubleDetailMain} />
          
          <Route path="*" component={Error404} />
        </Route>
        <Route path="*" component={Error404} />
      </Route>
    </Router>
  );
}
