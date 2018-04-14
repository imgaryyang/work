import { Tabs, WhiteSpace, Badge, Modal } from 'antd-mobile';
import { connect } from 'dva';
import React from 'react';
import ActivityIndicatorView from '../../components/ActivityIndicatorView';
import PayDoctorAdvice from './PayDoctorAdvice';
import Payment2 from './Payment2';

const tabs = [
  { title: <Badge>在线充值</Badge>, page: 1 },
  { title: <Badge>门诊缴费</Badge>, page: 2 },
];
class PayCounterMain2 extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.setServiceType = this.setServiceType.bind(this);
  }

  componentWillMount() {
    const { currProfile } = this.props.base;
    const { dispatch } = this.props;
    dispatch({
      type: 'base/save',
      payload: {
        title: '充值缴费',
        hideNavBarBottomLine: true,
        showCurrHospitalAndPatient: true,
        headerRight: null,
      },
    });
    if (currProfile === undefined || currProfile.no === undefined) {
      Modal.alert('提示', '请选择就诊人', [
        { text: '确认' },
      ]);
    }
  }

  onChange(tab, index) {
    const { currProfile } = this.props.base;
    if (currProfile === undefined || currProfile.no === undefined) {
      Modal.alert('提示', '请选择就诊人', [
        { text: '确认' },
      ]);
      return;
    }
    if (index === 1 && currProfile.type !== '1') {
      Modal.alert('提示', '目前仅支持自费患者缴费', [
        { text: '确认' },
      ]);
    }
    this.setServiceType(index);
  }

  setServiceType(serviceType) {
    // 本地生成交易订单后，跳转到收银台
    this.props.dispatch({
      type: 'payment/setServiceType',
      serviceType,
    });
  }

  render() {
    const { serviceType } = this.props.payment;
    const { isLoading } = this.props.paymentRecord;
    return (
      <div>
        <Tabs
          tabs={tabs}
          page={serviceType}
          onChange={(tab, index) => { this.onChange(tab, index); }}
        >
          <Payment2 />
          <PayDoctorAdvice />
        </Tabs>
        <WhiteSpace />
        { (isLoading && serviceType === 1) ? (<ActivityIndicatorView />) : null }
      </div>);
  }
}


export default connect(({ base, payment, paymentRecord }) => ({ base, payment, paymentRecord }))(PayCounterMain2);
