import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './Prepaid.css';

import {WorkSpace, Card, Button, Input, NumKeyboard} from '../../components';

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
  state = {amt: '', buttonDisabled: true,keyConfig:{maxLength:4,stateName:'amt'}};

  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.submit = this.submit.bind(this);
  }
  componentWillMount() {
	  this.props.dispatch({ type: 'prepaid/reset',});
  }
  
  componentDidMount() {
	  const {type} = this.props.params;
	  if('cash' == type){ //现金，直接补充结算单信息,生成虚拟结算单号
		  this.props.dispatch({ type: 'prepaid/createCashOrder',});
	  }
  }
  
  componentDidUpdate(nextProps){ 		  
	  //如果有结算单，则跳转至收银台
	  if(this.props.prepaid.settlement.id){
		  this.goToPay();
	  }
  }

  goToPay(){ 
	  const {order , settlement }    = this.props.prepaid;
	  this.props.dispatch(routerRedux.push({
			pathname: "/cashierDesk",
			state : {
				nav:{title:"预存"},
				order:order,
				settlement:settlement,
			}
	  }));
  }
  
  onKeyDown(key){
	  var {maxLength,stateName} = this.state.keyConfig;
	  var old = this.state[stateName];
	  if('0' == key && old.length == 0 )return;
	  if('清空'==key)this.state[stateName]="";
	  else if('删除'==key)this.state[stateName]=old.substr(0, old.length - 1);//删除
	  else if(old.length < maxLength)this.state[stateName]=old+key;
	  this.setState(this.state);
  }
  submit () {console.info('submit');
	const {prepaid,patient,params} = this.props;
	const {amt }                   = this.state;
	const {order , settlement }    = prepaid;
	
	const param = {...order,amt:amt,payChannel:params.type,canChooseChannel:false};
	console.info(param);
	this.props.dispatch({//点击保存，生成订单结算单
      type: 'prepaid/createOrder',
      payload: {param: param,}
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
    
    const { account}   = this.props.patient;
    const { limit }    = config.prepaid;
    const { amt }      = this.state;

    return (
      <WorkSpace height = {wsHeight + 'px'} style = {{padding: '2rem'}} >
        <Row>
          <Col span = {12} style = {{paddingRight: '1rem'}} >
            <Card shadow = {true} style = {cardStyle} >
              <span className = {styles.balance} >账户余额&nbsp;<font>{account.balance}</font>&nbsp;元</span>
              <Input focus = {true} value = {amt} placeholder = "请输入您要预存的金额" />
              <Button text = "确定" disabled = {(amt.length<=0)} style = {buttonStyle} onClick = {this.submit} />
              <span className = {styles.tip} >填写完金额后，请按“确定”键并按照引导提示完成预存。</span>
            </Card>
          </Col>
          <Col span = {12} style = {{paddingLeft: '1rem'}} >
            <NumKeyboard onKeyDown = {this.onKeyDown} maxLength={4} height = {wsHeight - 4 * config.remSize} />
          </Col>
        </Row>
      </WorkSpace>
    );
  }
}
  

export default connect(({patient,prepaid}) => ({patient,prepaid}))(Prepaid);

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

