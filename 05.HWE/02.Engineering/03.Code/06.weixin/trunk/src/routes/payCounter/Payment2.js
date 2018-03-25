import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { InputItem, Button, WingBlank, WhiteSpace, Flex, SegmentedControl,Modal } from 'antd-mobile';
import style from './Payment2.less';
import util from '../../utils/baseUtil';

class Payment2 extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.createBizOrder = this.createBizOrder.bind(this);
    this.getBillTitle = this.getBillTitle.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.gotoCashierDesk = this.gotoCashierDesk.bind(this);
    this.onSegmentedControChange = this.onSegmentedControChange.bind(this);
    this.refreshBalance = this.refreshBalance.bind(this);
  }
  state = {
    amt: 0.0,
    bizType: '00', // 门诊充值:00;住院预缴:01
    proNo: undefined,
  }
  componentWillMount() {
    const { currProfile } = this.props.base;
    if (currProfile !== undefined) {
      console.log('componentWillMount:refresh');
      this.refreshBalance();
    }
  }
  onSegmentedControChange = (e) => {
    console.log(`selectedIndex:${e.nativeEvent.selectedSegmentIndex}`);
    console.info(e.nativeEvent);
    if (e.nativeEvent.selectedSegmentIndex === 0) { // 第一个标签是门诊充值
      console.log('onSegmentedControChange:aaa');
      this.setState({ bizType: '00' }, this.refreshBalance);
    } else {
      console.log('onSegmentedControChange:bbb');
      this.setState({ bizType: '01' }, this.refreshBalance); // 第二个标签是住院预缴
    }
  }
  onChange = (amt) => {
    console.log('onChange1');
    this.setState({
      amt,
    });
    console.log('onChange2');
  }

  getBillTitle(amt, bizType) {
    const { currProfile: profile } = this.props.base;
    let bizTypeName = '';
    if (bizType === '00') {
      bizTypeName = '门诊充值';
    } else if (bizType === '01') {
      bizTypeName = '住院预缴';
    }
    return `患者${profile.name} ${bizTypeName}金额 ${amt} 元`;
  }
  refreshBalance() {
    const { bizType } = this.state;
    const { dispatch } = this.props;
    console.info('refreshBalance:', bizType);
    let baseInfoRoute = '';
    if (bizType === '00') { // 门诊充值
      baseInfoRoute = 'deposit/getPreStore';
    } else if (bizType === '01') { // 住院预缴
      baseInfoRoute = 'foregift/getPrePay';
    }
    console.log('refreshBalance:', baseInfoRoute);
    dispatch({
      type: baseInfoRoute,
      // payload: { query: bizOrder },
      // callback: () => { this.gotoCashierDesk(); },
    });
  }

  gotoCashierDesk = () => {
    console.log('gotoCashierDesk:Payment begin');
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: 'payCounter',
    }));
  }
  createBizOrder = () => {
    console.log('createBizOrder1');
    const { amt, bizType } = this.state;
    if (amt === 0) {
      Modal.alert('提示', '充值金额不能为0', [
        { text: '确认' },
      ]);
      return;
    }

    const bizOrder = {
      amt, // 充值金额
      appCode: util.getBroswerType() === 'W' ? 'GZH' : 'FWH', // 微信->公众号;支付宝->服务号
      billTitle: this.getBillTitle(),
      tradeType: '0', // 充值
      adFlag: '0', // '0',正常;'1',补录
      bizType,
    };
    console.log('createBizOrder2');
    const { dispatch } = this.props;
    let type = '';
    // 生成业务单数据
    if (bizType === '00') {
      type = 'deposit/create';
    } else {
      type = 'foregift/create';
    }
    console.log('createBizOrder3');
    // 本地生成交易订单后，跳转到收银台
    dispatch({
      type,
      payload: { query: bizOrder },
      callback: () => { this.gotoCashierDesk(); },
    });
  }

  render() {
    const { data } = this.state.bizType === '00' ? this.props.deposit : this.props.foregift;
    const { balance } = data === undefined ? '' : data;
    return (
      <div className={style['mainView']}>
        <WingBlank>
          <WhiteSpace size="md" />
          <div style={{ fontSize: 15 }}>
            &nbsp;&nbsp;&nbsp;&nbsp;可用余额&nbsp;&nbsp;  <span style={{ fontColor: 'yellow' }}>{balance}</span>
          </div>
          <WhiteSpace size="lg" />
          <SegmentedControl tintColor="#ff0000" selectedIndex={this.state.bizType === '00' ? 0 : 1} onChange={this.onSegmentedControChange} className={style['payTypeSegment']} values={['门诊充值', '住院预缴']} />
          <WhiteSpace size="lg" />
          <Flex>
            <Flex.Item>
              <InputItem
                type="money"
                placeholder="输入充值金额"
                onChange={this.onChange}
                clear
                moneyKeyboardAlign="left"
                style={{ fontSize: 15 }}
                disabled={this.props.base.currProfile.no === undefined}
              ><span style={{ fontSize: 15 }}>充值金额</span>
              </InputItem>
            </Flex.Item>
          </Flex>
          <WhiteSpace size="lg" />
          <Button type="primary" onClick={this.createBizOrder} disabled={this.props.base.currProfile.no === undefined}>马上充值</Button>
        </WingBlank>
      </div>
    );
  }
}
export default connect(({ payment, foregift, deposit, base }) => ({ payment, foregift, deposit, base }))(Payment2);
