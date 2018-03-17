import React from 'react';
import { Route } from 'dva/router';
import { connect } from 'dva';
import { Flex } from 'antd-mobile';

import styles from './BasicLayout.less';

import Config from '../Config';
import Global from '../Global';
import NavBar from './NavBar';

// import AppointMain from '../routes/appoint/AppointMain';
import Departments from '../routes/appoint/Departments';
import Schedule from '../routes/appoint/Schedule';
import AppointSource from '../routes/appoint/AppointSource';
import Appoint from '../routes/appoint/Appoint';
import AppointSuccess from '../routes/appoint/AppointSuccess';
import AppointRecords from '../routes/appoint/AppointRecords';
import AppointRecordDetail from '../routes/appoint/AppointRecordDetail';

// import PaymentMain from '../routes/payment/PaymentMain';
import InputMoney from '../routes/payment/InputMoney';
import CashierDesk from '../routes/payment/CashierDesk';

// import PaymentRecordMain from '../routes/paymentRecord/PaymentRecordMain';
import PaymentRecordList from '../routes/paymentRecord/PaymentRecordList';

// import PayCounterMain from '../routes/payCounter/PayCounterMain';
import Payment from '../routes/payCounter/Payment';
import PayCounter from '../routes/payCounter/PayCounter';

import OutpatientRefundList from '../routes/outpatientRefund/OutpatientRefundList';

import ReportMain from '../routes/report/ReportMain';
import ReportDetail from '../routes/report/ReportDetail';

import News from '../routes/news/NewsList';
import NewsContent from '../routes/news/NewsContent';

// import PatientMain from '../routes/patients/PatientMain';
import Patient from '../routes/patients/Patient';
import AddPatient from '../routes/patients/AddPatient';
import Profiles from '../routes/patients/Profiles';

// import Me from '../routes/me/Me';
import ContactUs from '../routes/me/ContactUs';
import AboutUs from '../routes/me/AboutUs';
import FeedBack from '../routes/me/FeedBack';

import InpatientPaymentRecordList from '../routes/inpatientPaymentRecord/InpatientPaymentRecordList';

import InpatientBillQuery from '../routes/inpatient/InpatientBillQuery';
import InpatientDailyMain from '../routes/inpatient/InpatientDailyMain';

const screenWidth = document.documentElement.clientWidth;
const screenHeight = document.documentElement.clientHeight;

class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    Global.setConfig(Config);
    const { dispatch } = this.props;
    dispatch({
      type: 'base/setScreen',
      payload: {
        width: screenWidth,
        height: screenHeight,
      },
    });
  }

  render() {
    const { match } = this.props;
    return (
      <Flex direction="column" >
        <NavBar />
        <Flex.Item className={styles.wsContainer} >
          <Route path={`${match.url}/appoint/departments`} component={Departments} />
          <Route path={`${match.url}/appoint/schedule`} component={Schedule} />
          <Route path={`${match.url}/appoint/source`} component={AppointSource} />
          <Route path={`${match.url}/appoint/appoint`} component={Appoint} />
          <Route path={`${match.url}/appoint/success`} component={AppointSuccess} />
          <Route path={`${match.url}/appoint/records`} component={AppointRecords} />
          <Route path={`${match.url}/appoint/recordDetail`} component={AppointRecordDetail} />

          <Route path={`${match.url}/payment/inputMoney`} component={InputMoney} />
          <Route path={`${match.url}/payment/cashierDesk`} component={CashierDesk} />

          <Route path={`${match.url}/report`} component={ReportMain} />
          <Route path={`${match.url}/reportDetail`} component={ReportDetail} />

          <Route path={`${match.url}/paymentRecord`} component={PaymentRecordList} />

          <Route path={`${match.url}/payment`} component={Payment} />
          <Route path={`${match.url}/payCounter`} component={PayCounter} />

          <Route path={`${match.url}/outpatientReturn`} component={OutpatientRefundList} />

          <Route path={`${match.url}/news`} component={News} />
          <Route path={`${match.url}/newsDetail`} component={NewsContent} />

          <Route path={`${match.url}/inpatientPaymentRecord`} component={InpatientPaymentRecordList} />
          <Route path={`${match.url}/inpatientBillQuery`} component={InpatientBillQuery} />
          <Route path={`${match.url}/inpatientDaily`} component={InpatientDailyMain} />

          <Route path={`${match.url}/patient`} component={Patient} />
          <Route path={`${match.url}/addPatient`} component={AddPatient} />
          <Route path={`${match.url}/profiles`} component={Profiles} />

          <Route path={`${match.url}/contactUs`} component={ContactUs} />
          <Route path={`${match.url}/aboutUs`} component={AboutUs} />
          <Route path={`${match.url}/feedBack`} component={FeedBack} />
        </Flex.Item>
      </Flex>
    );
  }
}

BasicLayout.propTypes = {
};

export default connect(base => (base))(BasicLayout);
