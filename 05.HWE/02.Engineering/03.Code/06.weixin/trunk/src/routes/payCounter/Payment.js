import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { InputItem, Button, WingBlank, WhiteSpace, Flex } from 'antd-mobile';


class Payment extends React.Component {
  state = {
    amt: 0.0,
    bizType: '00',
  }
  componentWillMount() {
    const type = this.props.location.state;
    const { patient } = this.props;
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
  createBizOrder = () => {
    const { amt, bizType } = this.state;
    const bizOrder = {
      amt, // 充值金额
      appCode: 'GZH', // 应用渠道
      billTitle: 'test',
    };
    const { dispatch } = this.props;
    if (bizType === '00') {
      dispatch({
        type: 'deposit/create',
        payload: { query: bizOrder },
        callback: () => { this.gotoCashierDesk(); },
      });
    } else {
      dispatch({
        type: 'foregift/create',
        payload: { query: bizOrder },
        callback: () => { this.gotoCashierDesk(); },
      });
    }
  }

  render() {
    return (
      <div style={{ padding: '15px 0' }}>
        <WingBlank>
          <Flex>
            <Flex.Item><div>患者姓名：张三</div></Flex.Item>
            <Flex.Item><div>类型：{this.state.bizType === '00' ? '门诊预存' : '住院预缴'}</div></Flex.Item>
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
          <Button type="primary" onClick={this.createBizOrder}>马上充值</Button>
        </WingBlank>
      </div>
    );
  }
}

Payment.propTypes = {
};

export default connect(({ payment, foregift, deposit }) => ({ payment, foregift, deposit }))(Payment);
