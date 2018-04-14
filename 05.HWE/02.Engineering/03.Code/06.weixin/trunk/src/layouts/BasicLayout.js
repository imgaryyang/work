import React from 'react';
import { Route, routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Toast } from 'antd-mobile';

import styles from './BasicLayout.less';

import Config from '../Config';
import Global from '../Global';
import NavBar from './NavBar';

import Departments from '../routes/appoint/Departments';
import Schedule from '../routes/appoint/Schedule';
import AppointSource from '../routes/appoint/AppointSource';
import Appoint from '../routes/appoint/Appoint';
import AppointSuccess from '../routes/appoint/AppointSuccess';
import AppointRecordsMain from '../routes/appoint/AppointRecordsMain';

// import PaymentMain from '../routes/payment/PaymentMain';
import InputMoney from '../routes/payment/InputMoney';
import CashierDesk from '../routes/payment/CashierDesk';


// import PaymentRecordMain from '../routes/paymentRecord/PaymentRecordMain';
import PaymentRecordMain2 from '../routes/paymentRecord/PaymentRecordMain2';
import PaymentRecordPrePay from '../routes/paymentRecord/PaymentRecordPrePay';
import CompletePaySuccess from '../routes/payCounter/CompletePaySuccess';
import CompletePayFailure from '../routes/payCounter/CompletePayFailure';


// import PayCounterMain from '../routes/payCounter/PayCounterMain';
import Payment from '../routes/payCounter/Payment';
import PayCounter from '../routes/payCounter/PayCounter';
import PayCounterMain2 from '../routes/payCounter/PayCounterMain2';

import OutpatientRefundList from '../routes/outpatientRefund/OutpatientRefundList';
import OutpatientRefundDetail from '../routes/outpatientRefund/OutpatientRefundDetail';
import CompleteRefundSuccess from '../routes/outpatientRefund/CompleteRefundSuccess';
import CompleteRefundFailure from '../routes/outpatientRefund/CompleteRefundFailure';
import ReportMain from '../routes/report/ReportMain';
import ReportDetail from '../routes/report/ReportDetail';
import ReportPacsDetail from '../routes/report/ReportPacsDetail';

import RecordMain from '../routes/record/RecordMain';
import RecordDetail from '../routes/record/RecordDetail';

import News from '../routes/news/NewsList';
import NewsContent from '../routes/news/NewsContent';

// components of patients
import Patients from '../routes/patients/Patients';
import PatientInfo from '../routes/patients/PatientInfo';
import EditPatientInfo from '../routes/patients/EditPatientInfo';
import BindProfile from '../routes/patients/BindProfile';
import ChoosePatient from '../routes/patients/ChoosePatient';

// import Me from '../routes/me/Me';
import ContactUs from '../routes/me/ContactUs';
import AboutUs from '../routes/me/AboutUs';
import FeedBack from '../routes/me/FeedBack';
import Profile from '../routes/me/Profile';
import EditProfile from '../routes/me/EditProfile';

import InpatientPrepaidRecords from '../routes/inpatient/InpatientPrepaidRecords';
import InpatientInfo from '../routes/inpatient/InpatientInfo';
import InpatientDailyMain from '../routes/inpatient/InpatientDailyMain';

const screenWidth = document.documentElement.clientWidth;
const screenHeight = document.documentElement.clientHeight;

class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    Global.setConfig(Config);
    const { dispatch } = this.props;
    dispatch({
      type: 'base/setState',
      payload: {
        currHospital: Global.Config.hospital,
      },
    });
    dispatch({
      type: 'base/setScreen',
      payload: {
        width: screenWidth,
        height: screenHeight,
      },
    });

    // TODO: 重载用户信息，测试用，正式环境需要删除
    if (!this.props.base.user.id) {
      dispatch({
        type: 'base/reloadUserInfo',
        callback: msg => (msg.id ? Toast.info('重新载入用户信息成功！', 2, null, false) : Toast.info(msg, 2, null, false)),
      });
    }
  }

  componentDidMount() {
    const { base, dispatch } = this.props;
    const { currProfile } = base;
    const { needProfileComp } = Global.Config;
    const url = window.location.href;
    console.log('url:', url);
    console.log('currProfile:', currProfile);
    // 如果当前请求的功能需要当前就诊人有档案，且无当前档案，则拦截，跳转到选择就诊人界面
    for (let i = 0; i < needProfileComp.length; i++) {
      if (url.indexOf(`/stack/${needProfileComp[i]}`) !== -1) {
        if (!currProfile.id) {
          Toast.info('请先选择就诊人！', 2, null, false);
          dispatch(routerRedux.push('/stack/choosePatient'));
        }
        break;
      }
    }
  }

  render() {
    const { match } = this.props;
    return (
      <div className={styles.container}>
        <NavBar />
        <div className={styles.wsContainer}>
          <Route path={`${match.url}/appoint/departments`} component={Departments} />
          <Route path={`${match.url}/appoint/schedule`} component={Schedule} />
          <Route path={`${match.url}/appoint/source`} component={AppointSource} />
          <Route path={`${match.url}/appoint/appoint`} component={Appoint} />
          <Route path={`${match.url}/appoint/success`} component={AppointSuccess} />
          <Route path={`${match.url}/appoint/records`} component={AppointRecordsMain} />

          <Route path={`${match.url}/payment/inputMoney`} component={InputMoney} />
          <Route path={`${match.url}/payment/cashierDesk`} component={CashierDesk} />

          <Route path={`${match.url}/report`} component={ReportMain} />
          <Route path={`${match.url}/reportDetail`} component={ReportDetail} />
          <Route path={`${match.url}/ReportPacsDetail`} component={ReportPacsDetail} />

          <Route path={`${match.url}/record`} component={RecordMain} />
          <Route path={`${match.url}/recordDetail`} component={RecordDetail} />

          <Route path={`${match.url}/paymentRecord`} component={PaymentRecordMain2} />
          <Route path={`${match.url}/PaymentRecordPrePay`} component={PaymentRecordPrePay} />

          <Route path={`${match.url}/payment`} component={Payment} />
          <Route path={`${match.url}/payCounter`} component={PayCounter} />
          <Route path={`${match.url}/payCounterMain2`} component={PayCounterMain2} />
          <Route path={`${match.url}/completePaySuccess`} component={CompletePaySuccess} />
          <Route path={`${match.url}/completePayFailure`} component={CompletePayFailure} />
          <Route path={`${match.url}/outpatientReturn`} component={OutpatientRefundList} />
          <Route path={`${match.url}/outpatientRefundDetail`} component={OutpatientRefundDetail} />
          <Route path={`${match.url}/completeRefundSuccess`} component={CompleteRefundSuccess} />
          <Route path={`${match.url}/completeRefundFailure`} component={CompleteRefundFailure} />


          <Route path={`${match.url}/news`} component={News} />
          <Route path={`${match.url}/newsDetail`} component={NewsContent} />

          <Route path={`${match.url}/inpatientPrepaidRecords`} component={InpatientPrepaidRecords} />
          <Route path={`${match.url}/inpatientBillQuery`} component={InpatientInfo} />
          <Route path={`${match.url}/inpatientDaily`} component={InpatientDailyMain} />

          <Route path={`${match.url}/patients`} component={Patients} />
          <Route path={`${match.url}/patientInfo`} component={PatientInfo} />
          <Route path={`${match.url}/editPatientInfo`} component={EditPatientInfo} />
          <Route path={`${match.url}/bindProfile`} component={BindProfile} />
          <Route path={`${match.url}/choosePatient`} component={ChoosePatient} />

          <Route path={`${match.url}/contactUs`} component={ContactUs} />
          <Route path={`${match.url}/aboutUs`} component={AboutUs} />
          <Route path={`${match.url}/feedBack`} component={FeedBack} />
          <Route path={`${match.url}/profile`} component={Profile} />
          <Route path={`${match.url}/editProfile`} component={EditProfile} />
        </div>
      </div>
    );
  }
}

BasicLayout.propTypes = {
};

export default connect(base => (base))(BasicLayout);
