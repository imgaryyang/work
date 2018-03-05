import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Login from './routes/Login';
import IndexPage from './routes/IndexPage';
import HomePage from './routes/HomePage';
import AppointMain from './routes/appoint/AppointMain';
import PaymentMain from './routes/payment/PaymentMain';
import Me from './routes/me/Me';
import PatientMain from './routes/patients/PatientMain';
import PaymentRecordMain from './routes/paymentRecord/PaymentRecordMain';
import PayCounterMain from './routes/payCounter/PayCounterMain';
import InpatientPaymentRecordMain from './routes/inpatientPaymentRecord/InpatientPaymentRecordMain';
import OutpatientRefundMain from './routes/outpatientRefund/OutpatientRefundMain';
import ReportMain from './routes/report/ReportMain';
import InpatientBillQuery from './routes/inpatient/InpatientBillQuery';
import InpatientDailyMain from './routes/inpatient/InpatientDailyMain';
import ReportDetail from './routes/report/ReportDetail';
import News from './routes/news/NewsList';
import NewsContent from './routes/news/NewsContent';
import ContactUs from './routes/me/ContactUs';
import AboutUs from './routes/me/AboutUs';
import FeedBack from './routes/me/FeedBack';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/login" exact component={Login} />
        <Route path="/home" exact component={HomePage} />
        <Route path="/report" exact component={ReportMain} />
        <Route path="/reportDetail" exact component={ReportDetail} />
        <Route path="/news" exact component={News} />
        <Route path="/newsDetail" exact component={NewsContent} />
        <Route path="/appoint" component={AppointMain} />
        <Route path="/payment" component={PaymentMain} />
        <Route path="/me" component={Me} />
        <Route path="/contactUs" component={ContactUs} />
        <Route path="/aboutUs" component={AboutUs} />
        <Route path="/feedBack" component={FeedBack} />
        <Route path="/patientMain" component={PatientMain} />
        <Route path="/paymentRecord" component={PaymentRecordMain} />
        <Route path="/inpatientPaymentRecord" component={InpatientPaymentRecordMain} />
        <Route path="/payCouter" component={PayCounterMain} />
        <Route path="/outpatientReturn" component={OutpatientRefundMain} />
        <Route path="/inpatientBillQuery" component={InpatientBillQuery} />
        <Route path="/inpatientDaily" component={InpatientDailyMain} />

      </Switch>
    </Router>
  );
}
export default RouterConfig;
