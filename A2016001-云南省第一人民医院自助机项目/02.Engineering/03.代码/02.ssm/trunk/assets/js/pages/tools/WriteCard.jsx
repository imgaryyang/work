import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Icon }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import Confirm from '../../components/Confirm';
import styles from './WriteCard';
import {WorkSpace, Card, Button, Input, NumKeyboard} from '../../components';

class WiterCard extends React.Component {

  /**
  * 初始化状态
  */
	 
  state = {
	cardNo:{
		value:'100000001',
		focus:true,
		maxLength:9,
	},
	count:{
		value:'10',
		focus:false,
		maxLength:3,
	},
	needWrite:0,
	no:'',
	field:'cardNo'
  };

  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.submit = this.submit.bind(this);
    this.print  = this.print.bind(this);
  }
  componentWillReceiveProps(nextProps){
  	const { cardCount:old } = this.props.device;
  	const { cardCount:now } = nextProps.device;
	if(now != old) {
		console.info('打印成功');
		if(now < parseInt(this.state.count.value) ){
			var card =  parseInt(this.state.cardNo.value) + parseInt(now)
			 this.setState({no:card+''},()=>{
				 this.print(card);
			 })
		}
	}
  }
  submit(){
	  this.setState({no:this.state.cardNo.value},()=>{
		  this.print(parseInt(this.state.cardNo.value));
	  })
  }
  print(cardNo){
	  this.props.dispatch({
		  type:'device/writeCard',
		  payload:{cardNo:cardNo+''},
	  });
  }
  setFocus(field){
	  this.state['cardNo'].focus=false;
	  this.state['count'].focus=false;
	  this.state[field].focus=true;
	  this.state.field = field;
	  this.setState(this.state);
  }
  onKeyDown(key){
	  const field = this.state[this.state.field];
	  var old = field.value;
	  if('清空'==key)field.value="";
	  else if('删除'==key)field.value =old.substr(0, old.length - 1);//删除
	  else if(old.length < field.maxLength)field.value=old+key;
	  field.disable = (field.value.length < field.maxLength);
	  this.state[this.state.field] = field;
	  this.setState(this.state);
  }
  render() {
    const wsHeight  = config.getWS().height * 2 / 3;
    const cardStyle = {
            height: (wsHeight - 4 * config.remSize) + 'px',
            padding: '4rem 2rem 4rem 2rem',
          };
    const  buttonStyle = {marginTop: '3rem', marginBottom: '3rem', };
    
    const { cardNo,count }      = this.state;
    
    return (
      <WorkSpace height = {wsHeight + 'px'} style = {{padding: '2rem'}} >
        <Row>
          <Col span = {12} style = {{paddingRight: '1rem'}} >
            <Card  style = {cardStyle} >
            <div className = {styles.label} >起始卡号：</div>
            <Input focus = {cardNo.focus} value = {cardNo.value} onClick = {this.setFocus.bind(this,'cardNo')} />
            <div className = {styles.label} >数量：</div>
            <Input focus = {count.focus} value = {count.value} onClick = {this.setFocus.bind(this,'count')} />
            <Button text = "确定" style = {buttonStyle} onClick = {this.submit} />
            </Card>
          </Col>
          <Col span = {12} style = {{paddingLeft: '1rem'}} >
            <NumKeyboard onKeyDown = {this.onKeyDown} maxLength={4} height = {wsHeight - 4 * config.remSize} />
          </Col>
        </Row>
        <Confirm info = {'正在制作第'+(this.props.device.cardCount+1)+'张卡，卡号 :'+this.state.no } visible = {this.state.no?true:false}  />
       </WorkSpace>
    );
  }
}
export default connect(({device}) => ({device}))(WiterCard);
