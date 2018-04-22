import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import listStyles           from '../../components/List.css';

import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Input                from '../../components/Input';

class PaymentConfirm extends React.Component {

  static displayName = 'PaymentConfirm';
  static description = '支付确认';

  static propTypes = {
  };

  static defaultProps = {
  };

  /**
  * 初始化状态
  */
  state = {
  };

  constructor(props) {
    super(props);
    this.goToPay = this.goToPay.bind(this);
  }

  componentWillMount() {
  }

  goToPay () {
	this.props.dispatch({
		type: 'deposit/createFeeOrder',
	});
  }

  render() {
    let wsHeight    = 50 * config.remSize,
        cardHeight  = 28 * config.remSize;

    let { consume } = this.props.deposit;
    let { order } = consume;
    let { baseInfo } = this.props.patient
//    ...order,
//	selfAmt:result.yczf,// 预存支付
//	miAmt:result.jzje,// 记账金额
//	paAmt:result.zfje,// 自费金额
//	reduceAmt:result.jmje,// 减免金额
	
    return (
      <WorkSpace fullScreen = {true} >
        <WorkSpace height = {wsHeight + 'px'} style = {{padding: '3rem', fontSize: '2.6rem', lineHeight: '5rem'}} >
          <Row>
            <Col span = {24} style = {{padding: '0 0 3rem 1.5rem'}} >
              <Card  style = {{height: cardHeight + 'px', padding: '2rem'}} >
                <Row>
                  <Col span = {12} className = {listStyles.amt} >共需支付：</Col>
                  <Col span = {12} className = {listStyles.amt} >{order.amt||0}&nbsp;元</Col>
                </Row>
                <Row>
                  <Col span = {12} className = {listStyles.amt} >医保报销：</Col>
                  <Col span = {12} className = {listStyles.amt} >{order.miAmt||0}&nbsp;元</Col>
                </Row>
                <Row>
                  <Col span = {12} className = {listStyles.amt} style = {{whiteSpace: 'nowrap'}} >医保个人账户支付：</Col>
                  <Col span = {12} className = {listStyles.amt} >{order.paAmt||0}&nbsp;元</Col>
                </Row>
                <Row style = {{color: '#BC1E1E'}} >
                  <Col span = {12} className = {listStyles.amt} >还需支付：</Col>
                  <Col span = {12} className = {listStyles.amt} >{order.selfAmt|| 0}&nbsp;元</Col>
                </Row>
                {
	                  order.selfAmt > baseInfo.balance ?( 
	                		<Row style = {{color: '#BC1E1E'}} >
	                          <Col span = {12} className = {listStyles.amt} >余额不足，需要充值：</Col>
	                          <Col span = {12} className = {listStyles.amt} >{(order.selfAmt - baseInfo.balance)|| 0}&nbsp;元</Col>
	                        </Row>
	                  ):null
                }
              </Card>
            </Col>
          </Row>
          <Button text = "确认缴费" onClick = {this.goToPay} />
        </WorkSpace>
      </WorkSpace>
    );
  }
}
  

export default connect(({patient,deposit}) => ({patient,deposit}))(PaymentConfirm);



