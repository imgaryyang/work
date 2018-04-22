import React from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { List, InputItem, Button } from 'antd-mobile';


class InputMoney extends React.Component {
  state = {
    amt: 0.0,
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
      pathname: 'cashierDesk',
    }));
  }
  submit = () => {
    let { patient } = this.props;
    const { amt } = this.state;
    patient = patient || { no: '005203675' };
    const bill = {
      billTitle: `测试公众号充值 ${amt}`,
      amt, // 充值金额
      appCode: 'GZH', // 应用渠道
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
      <div >
        <List>
          <InputItem
            type="money"
            placeholder="input your amt"
            onChange={this.onChange}
            value={this.state.amt}
            clear
            moneyKeyboardAlign="left"
          >充值金额
          </InputItem>

          <Button onClick={this.submit} > 确定 </Button>
        </List>
      </div>
    );
  }
}

InputMoney.propTypes = {
};

export default connect(payment => (payment))(InputMoney);
