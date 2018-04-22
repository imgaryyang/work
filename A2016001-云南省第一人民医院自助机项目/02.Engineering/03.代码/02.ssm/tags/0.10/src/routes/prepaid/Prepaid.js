import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './Prepaid.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Input                from '../../components/Input';
import NumKeyboard          from '../../components/keyboard/NumKeyboard';

class Prepaid extends React.Component {

  static displayName = 'Prepaid';
  static description = '预存-输入金额';

  static propTypes = {
  };

  static defaultProps = {
  };

  /**
  * 初始化状态
  */
  state = {
    amt: '',
    buttonDisabled: true,
  };

  constructor(props) {
    super(props);

    this.onInput      = this.onInput.bind(this);
    this.onClear      = this.onClear.bind(this);
    this.onDel        = this.onDel.bind(this);
    this.submit       = this.submit.bind(this);
  }

  componentWillMount() {
    if (!this.props.account.account.Balance)
      this.props.dispatch({
        type: 'account/loadAcctInfo',
        payload: {
          userId: this.props.user.UserId
        },
      });
  }

  /**
   * 监听键盘输入
   */
  onInput(key) {
    if (this.state.amt.length == 4)
      return;

    if (this.state.amt.length == 0 && key == '0')
      return;

    this.setState({
      amt: this.state.amt + key,
      buttonDisabled: false,
    });
  }

  /**
   * 监听键盘删除键
   */
  onDel() {
    const amt = this.state.amt.substr(0, this.state.amt.length - 1);
    this.setState({
      amt: amt,
      buttonDisabled: amt.length == 0 ? true : false,
    });
  }

  /**
   * 监听键盘清空键
   */
  onClear() {
    this.setState({
      amt: '',
      buttonDisabled: true,
    });
  }

  submit () {

    const { Balance } = this.props.account.account;
    const type = this.props.params.type; //bankCard | mobile

    if (Balance + parseInt(this.state.amt) > config.prepaid.limit) {
      this.props.dispatch({
        type: 'message/show',
        payload: {
          msg: (
            <div style = {{fontSize: '2.5rem', textAlign: 'center', margin: '1.5rem', lineHeight: '4rem', whiteSpace: 'nowrap'}} >
              预存账户限额&nbsp;<font style = {{color: '#BC1E1E'}} >{config.prepaid.limit}</font>&nbsp;元<br/>
              您此次预存最多只能存入&nbsp;<font style = {{color: '#BC1E1E'}} >{config.prepaid.limit - Balance}</font>&nbsp;元
            </div>
          ),
        }
      });
      return;
    }

    this.props.dispatch({
      type: 'order/prepaid',
      payload: {
        Amt: parseInt(this.state.amt),
        PaidType: type,
      }
    });

    this.props.dispatch(routerRedux.push({
      pathname: type == '20' ? '/bankCard' : '/scanQRCode', // 20 | 30
      state: {
        nav: {
          title: type == '20' ? '银行卡预存' : '支付宝/微信预存',
        },
      },
    }));
  }

  render() {

    const wsHeight    = config.getWS().height * 2 / 3,
          cardStyle   = {
            height: (wsHeight - 4 * config.remSize) + 'px',
            padding: '4rem 2rem 4rem 2rem',
          },
          buttonStyle  = {
            marginTop: '3rem',
            marginBottom: '3rem',
          };

    return (
      <WorkSpace height = {wsHeight + 'px'} style = {{padding: '2rem'}} >
        <Row>
          <Col span = {12} style = {{paddingRight: '1rem'}} >
            <Card shadow = {true} style = {cardStyle} >
              <span className = {styles.balance} >账户余额&nbsp;<font>{this.props.account.account.Balance}</font>&nbsp;元</span>
              <Input focus = {true} value = {this.state.amt} placeholder = "请输入您要预存的金额" />
              <Button text = "确定" disabled = {this.state.buttonDisabled} style = {buttonStyle} onClick = {this.submit} />
              <span className = {styles.tip} >填写完金额后，请按“确定”键并按照引导提示完成预存。</span>
            </Card>
          </Col>
          <Col span = {12} style = {{paddingLeft: '1rem'}} >
            <NumKeyboard onInput = {this.onInput} onClear = {this.onClear} onDel = {this.onDel} height = {wsHeight - 4 * config.remSize} />
          </Col>
        </Row>
      </WorkSpace>
    );
  }
}
  

export default connect(({user, order, account, message}) => ({user, order, account, message}))(Prepaid);



