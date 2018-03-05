import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { List, InputItem, Button, WingBlank, WhiteSpace, Flex } from 'antd-mobile';


class Payment extends React.Component {
  state = {
    amt: 0.0,
    bizType: '01',
  }
  componentWillMount() {
    console.log(this.props.location.state);
    const type = this.props.location.state;
    let { patient } = this.props;
    console.log(patient);
    if (type) {
      this.setState({
        bizType: type.bizType,
      });
    }
  }
  onChange = (amt) => {
    console.info('----------', amt);
    this.setState({
      amt,
    });
  }


  gotoCashierDesk = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: 'payCounter',
    }));
  }
  createBill= () => {
    let { patient } = this.props;
    const { amt, bizType } = this.state;
    patient = patient || { no: '005203675', openId: 'oFTG9w-pyYc4iBPJvUSHo9HIFGzg' };
    const bill = {
      billTitle: `测试公众号充值 ${amt}`,
      amt, // 充值金额
      appCode: 'GZH', // 应用渠道
      terminalCode: patient.openId, // zhon
      payerNo: patient.no, // 病人编号
      bizType, // 门诊预存
      bizNo: 'bizNo000003', // 门诊预存流水号
      bizUrl: '',
      bizBean: 'testBean',
      bizTime: '2018-01-22 00:00:00',
    };
    const { dispatch } = this.props;
    if (bizType === '01') {
      dispatch({
        type: 'deposit/create',
        payload: { query: bill },
        callback: () => { this.gotoCashierDesk(); },
      });
    } else {
      dispatch({
        type: 'foregift/create',
        payload: { query: bill },
        callback: () => { this.gotoCashierDesk(); },
      });
    }
  }
  submit = () => {
    let { patient } = this.props;
    const { amt } = this.state;
    patient = patient || { no: '005203675', openId: 'oFTG9w-pyYc4iBPJvUSHo9HIFGzg' };
    const bill = {
      billTitle: `测试公众号充值 ${amt}`,
      amt, // 充值金额
      appCode: 'GZH', // 应用渠道
      terminalCode: patient.openId, // zhon
      payerNo: patient.no, // 病人编号
      bizType: '00', // 门诊预存
      bizNo: 'bizNo000003', // 门诊预存流水号
      bizUrl: '',
      bizBean: 'testBean',
      bizTime: '2018-01-22 00:00:00',
    };

    this.props.dispatch({// 点击保存，生成订单
      type: 'payment/createBill',
      payload: { bill },
      callback: () => { this.gotoCashierDesk(); },
    });
  }

  render() {
    return (
      <div style={{ padding: '15px 0' }}>
        <WingBlank>
          <Flex>
            <Flex.Item><div>患者姓名：张三</div></Flex.Item>
            <Flex.Item><div>类型：{this.state.bizType === '01' ? '门诊预存' : '住院预存'}</div></Flex.Item>
          </Flex>
        </WingBlank>
        <WhiteSpace size="lg" />
        <WingBlank>
          <Flex>
            <Flex.Item><div>卡号：90000000021</div></Flex.Item>
          </Flex>
        </WingBlank>
        <WhiteSpace size="lg" />
        <Flex>
          <Flex.Item>
            <InputItem
              type="money"
              placeholder="输入充值金额"
              onChange={this.onChange}
              clear
              moneyKeyboardAlign="left"
              // extra="¥"
            >充值金额:¥
            </InputItem>
          </Flex.Item>
        </Flex>
        <WingBlank>
          <Button type="primary" onClick={this.createBill}>马上充值</Button>
        </WingBlank>
      </div>
    );
  }
}

Payment.propTypes = {
};

export default connect(({ payment, foregift, deposit }) => ({ payment, foregift, deposit }))(Payment);
