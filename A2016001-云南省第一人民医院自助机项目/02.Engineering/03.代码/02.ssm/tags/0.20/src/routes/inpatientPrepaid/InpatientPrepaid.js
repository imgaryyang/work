import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './InpatientPrepaid.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Input                from '../../components/Input';
import NumKeyboard          from '../../components/keyboard/NumKeyboard';

class InpatientPrepaid extends React.Component {

  static displayName = 'InpatientPrepaid';
  static description = '住院预缴-输入金额';

  static propTypes = {
  };

  static defaultProps = {
  };

  /**
  * 初始化状态
  */
  state = {
    amt: '',
    bal: 0,
    buttonDisabled: true,
  };

  constructor(props) {
    super(props);

    this.onInput      = this.onInput.bind(this);
    this.onClear      = this.onClear.bind(this);
    this.onDel        = this.onDel.bind(this);
    this.submit       = this.submit.bind(this);
    this.acctTransToInpatientPrepaid = this.acctTransToInpatientPrepaid.bind(this);
  }

  componentWillMount() {
	this.props.dispatch({
		type: 'inpatient/loadPrepaidBalance',
		payload: {
			userId : this.props.patient.id
		},
	});  
    /*if (this.props.inpatient.prepaidBalance == 'undefined'){
    	this.props.dispatch({
	        type: 'inpatient/loadPrepaidBalance',
	        payload: {
	          userId : this.props.patient.id
	        },
    	});
    }*/
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

  acctTransToInpatientPrepaid () {
    this.props.dispatch({
      type: 'inpatient/acctTransToIpptPrepaid', 
      payload:{
        amt: this.state.amt
      }
    });

//    this.props.dispatch({
//      type: 'order/paid',
//      payload: {
//    	  
//      }
//    });

    this.props.dispatch(routerRedux.push({
      pathname: '/paidDone',
      state: {
        nav: {
          title: this.props.location.state.nav.title,
          backDisabled: true,
        },
      },
    }));
  }

  submit () {

//    const { Balance } = this.props.patient.account,
//          { PrepaidBalance } = this.props.inpatient;
	const Balance = this.props.patient.account.balance;
	const { PrepaidBalance } = this.props.inpatient;
    const type = this.props.params.type; //medCard | bankCard | mobile
    
    if (type == '00' && parseFloat(this.state.amt) > parseFloat(Balance)) {
      this.props.dispatch({
        type: 'message/show',
        payload: {
          msg: (
            <div style = {{fontSize: '2.5rem', textAlign: 'center', margin: '1.5rem', lineHeight: '4rem', whiteSpace: 'nowrap'}} >
              就诊卡预存账户余额不足<br/>
              您此次最多只能转入&nbsp;<font style = {{color: '#BC1E1E'}} >{Balance.formatMoney()}</font>&nbsp;元
            </div>
          ),
        }
      });
      return;
    }

    if (parseFloat(PrepaidBalance) + parseFloat(this.state.amt) > config.inpatientPrepaid.limit) {
      this.props.dispatch({
        type: 'message/show',
        payload: {
          msg: (
            <div style = {{fontSize: '2.5rem', textAlign: 'center', margin: '1.5rem', lineHeight: '4rem', whiteSpace: 'nowrap'}} >
              住院预缴限额&nbsp;<font style = {{color: '#BC1E1E'}} >{config.inpatientPrepaid.limit.formatMoney()}</font>&nbsp;元<br/>
              您此次最多只能预缴&nbsp;<font style = {{color: '#BC1E1E'}} >{(config.inpatientPrepaid.limit - PrepaidBalance).formatMoney()}</font>&nbsp;元
            </div>
          ),
        }
      });
      return;
    }

    this.props.dispatch({
      type: 'order/inpatientPrepaid',
      payload: {
        Amt: parseFloat(this.state.amt),
        PaidType: type,
      }
    });

    if (type == '00') {

      this.setState({
        bal: PrepaidBalance + parseFloat(this.state.amt)
      }, () => this.acctTransToInpatientPrepaid());
      
      return;
    }

    this.props.dispatch(
    	routerRedux.push({
    	  pathname: type == '20' ? '/bankCard' : '/scanQRCode',
	      state: {
	        nav: {
	          title: type == '20' ? '银行卡预缴' : '支付宝/微信预缴',
	        },
	      },
    	})
    );
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

    const {PrepaidBalance} = this.props.inpatient;

    return (
      <WorkSpace height = {wsHeight + 'px'} style = {{padding: '2rem'}} >
        <Row>
          <Col span = {12} style = {{paddingRight: '1rem'}} >
            <Card shadow = {true} style = {cardStyle} >
              <span className = {styles.balance} >住院预缴余额&nbsp;<font>{PrepaidBalance ? PrepaidBalance.formatMoney() : 0}</font>&nbsp;元</span>
              <Input focus = {true} value = {this.state.amt} placeholder = "请输入您要预缴的金额" />
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
  

export default connect(({patient, order, inpatient, message}) => ({patient, order, inpatient, message}))(InpatientPrepaid);



