import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './PrepaidOrder.css';
import Confirm from '../../components/Confirm';

import {WorkSpace, Card, Button, Input, NumKeyboard} from '../../components';

class PrepaidOrder extends React.Component {

  /**
  * 初始化状态
  */
  state = {amt: '',showConfirm:false, buttonDisabled: true,keyConfig:{maxLength:6,stateName:'amt'}};

  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.submit = this.submit.bind(this);
  }
  componentWillMount() {
  }
  componentDidMount() {
  }
  onKeyDown(key){
	  const { baseInfo}   = this.props.patient;
	  const { limit } = this.props.payment;
	  var {maxLength,stateName} = this.state.keyConfig;
	  var old = this.state[stateName];
	  if('0' == key && old.length == 0 )return;
	  if('清空'==key)this.state[stateName]="";
	  else if('删除'==key)this.state[stateName]=old.substr(0, old.length - 1);//删除
	  else if(old.length < maxLength){
		  var value = parseFloat(old+key);
		  if(limit < value){
			  console.info('limit',limit,'value ',value,'超过限额')
			  this.setState({showConfirm:true});
			  return;
		  }else{
			  this.state[stateName]=old+key;
		  }
	  }
	  this.setState(this.state);
  }
  submit () {
	const {deposit,patient} = this.props;
	const {baseInfo }              = patient;
	const {amt }                   = this.state;
	const order = {
			amt,
			patientNo:baseInfo.no,//病人姓名
			patientName:baseInfo.name,//病人姓名	
			patientIdNo:baseInfo.idNo,//病人身份证号
			patientCardNo:baseInfo.medicalCardNo,//病人卡号	
			patientCardType:baseInfo.cardType,//就诊卡类型 TODO 就诊卡
	};
	
	this.props.dispatch({//点击保存，生成订单
      type: 'deposit/createRechargeOrder',
      payload: {order : order,}
    });
  }
  showMessage(){
	  
  }
  render() {
    const wsHeight  = config.getWS().height * 2 / 3;
    const cardStyle = {
            height: (wsHeight - 4 * config.remSize) + 'px',
            padding: '4rem 2rem 4rem 2rem',
          };
    const  buttonStyle = {marginTop: '3rem', marginBottom: '3rem', };
    
    const { baseInfo}   = this.props.patient;
    const { limit } = this.props.payment;
    const { amt }      = this.state;
    
    return (
      <WorkSpace height = {wsHeight + 'px'} style = {{padding: '2rem'}} >
        <Card  style = {{margin: '-4rem 2rem 2rem 2rem', padding: '2rem 2rem 0 2rem', fontSize: '3rem'}} >
      	  <span>当前患者<font style = {{color: '#DB5A5A', fontSize: '4.5rem'}} >{baseInfo.name}</font>,请在充值前确认身份，以免您的财产损失！！</span>
	    </Card>
        <Row>
          <Col span = {12} style = {{paddingRight: '1rem'}} >
            <Card  style = {cardStyle} >
              <span className = {styles.balance} >账户余额&nbsp;<font>{baseInfo.balance}</font>&nbsp;元</span>
              <span className = {styles.balance} >最多可再存&nbsp;<font>{limit}</font>&nbsp;元</span>
              <Input focus = {true} value = {amt} placeholder = "请输入您要预存的金额" />
              <Button text = "确定" disabled = {(amt.length<=0)} style = {buttonStyle} onClick = {this.submit} />
              <span className = {styles.tip} >填写完金额后，请按“确定”键并按照引导提示完成预存。</span>
            </Card>
          </Col>
          <Col span = {12} style = {{paddingLeft: '1rem'}} >
            <NumKeyboard onKeyDown = {this.onKeyDown} maxLength={4} height = {wsHeight - 4 * config.remSize} />
          </Col>
        </Row>
        <Confirm info = {'您最多可以再预存'+limit+'元'} visible = {this.state.showConfirm} 
	        buttons = {[{text: '确定', onClick: () =>{
	       	 this.setState({showConfirm: false});
	        }},]}
	       />
       </WorkSpace>
    );
  }
}
  

export default connect(({patient,deposit,payment}) => ({patient,deposit,payment}))(PrepaidOrder);

//if (balance + parseInt(this.state.amt) > limit) {
//    this.props.dispatch({type: 'message/show',  payload:{
//        msg: (
//          <div style = {{fontSize: '2.5rem', textAlign: 'center', margin: '1.5rem', lineHeight: '4rem', whiteSpace: 'nowrap'}} >
//            预存账户限额&nbsp;<font style = {{color: '#BC1E1E'}} >{config.prepaid.limit}</font>&nbsp;元<br/>
//            您此次预存最多只能存入&nbsp;<font style = {{color: '#BC1E1E'}} >{config.prepaid.limit - Balance}</font>&nbsp;元
//          </div>
//        ),
//    }});
//    return;
//  }

