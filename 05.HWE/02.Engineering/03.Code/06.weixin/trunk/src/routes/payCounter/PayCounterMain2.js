import { Tabs, WhiteSpace, Badge, Radio } from 'antd-mobile';
import { connect } from 'dva';
import React from 'react';
// import { Route } from "dva/router";
// import styles from './PayCounterMain2.less';
import PayDoctorAdvice from './PayDoctorAdvice';
import Payment2 from './Payment2';
import Payment from './Payment';

const tabs = [
  { title: <Badge>在线充值</Badge>, page: 1 },
  { title: <Badge>门诊缴费</Badge>, page: 2 },
];
class PayCounterMain2 extends React.Component {
  // constructor(props) {
  //   super(props);
  //   // this.callback = this.callback.bind(this);
  // }

  componentWillMount() {
    // const { currProfile } = this.props.base;
    // const arr = Object.keys(currProfile);
    // // 已经选择了就诊人
    // if (arr.length !== 0) {
    //   this.loadInpatientBill(currProfile);
    // }
  }

  render() {
    // const { type } = this.state;
    return (<div>
      <Tabs
        tabs={tabs}
        initalPage="t1"
        onChange={(tab, index) => {
              console.log('onChange', index, tab);
            }}
        onTabClick={(tab, index) => {
              console.log('onTabClick', index, tab);
            }}
      >
        <Payment2 />
        <PayDoctorAdvice />
      </Tabs>
      <WhiteSpace />
    </div>);
  }
}


export default connect()(PayCounterMain2);
