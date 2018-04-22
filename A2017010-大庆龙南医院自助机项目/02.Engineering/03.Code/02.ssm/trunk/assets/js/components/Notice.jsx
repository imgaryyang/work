import React, { PropTypes } from 'react';
import { Row, Col, Icon }   from 'antd';

import styles               from './Notice.css';

const _time      = 6,
      _top       = -216,
      _stepping  = 10;
var showMsg = function(){};
var hideMsg =  function(){};
class Message extends React.Component {

  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    showMsg = this.show ;
    hideMsg = this.hide;
    this.startTimer = this.startTimer.bind(this);
    this.state = {
	    top: _top,
	    direction:'down',
	    second:_time
	};
  }
  componentDidMount () {
  }

  componentWillUnmount () {
	  clearTimeout(this.timer);
  }
  hide(){
	 this.setState({direction: 'up',top:-1});
  }
  show(){
	clearTimeout(this.timer);
	this.setState({top: _top,second:_time,direction:'down',},()=>{
		this.startTimer();
	});
  }
  startTimer(){
	  var { top,direction,second } = this.state;
	  if(top >= 0 && second>0){//计时
		  this.timer = setTimeout (() => {
			  this.setState({second: (second-1)},()=>{
				 this.startTimer();
			  });
		  },1000); 
	  }else if(top >= 0 && second <=0){//计时完毕
		  this.setState({direction: 'up',top:-1},()=>{
			 this.startTimer();
		  }); 
	  }else if( _top <= top && top <= 0){//上下移动
		  var newTop = top;
		  if(direction == 'up'){
			  newTop = top - _stepping ;
		  }else{
			  newTop = top + _stepping ;
		  }
		  this.timer = setTimeout (() => {
			  this.setState({top: newTop},()=>{
				  this.startTimer();
			  });
		  },1); 
	  } 
  }
  render() {
    const { msg }  = this.props;
    const width           = document.body.clientWidth - 60,
          height          = 216,
          bottomHeight    = 72,
          containerStyle  = {
            width: width + 'px',
            height: height + 'px',
            top: this.state.top + 'px',
          },
          msgStyle        = {
            height: (height - bottomHeight) + 'px',
          },
          bottomStyle     = {
            height: bottomHeight + 'px',
          };

    return (
      <div className = 'notice_container' style = {containerStyle} >
        <div className = 'notice_iconContainer' ><Icon type = 'message' /></div>
        <div className = 'notice_msgContainer' style = {msgStyle} >
          {
            typeof msg == 'string' ? (
              <div className = 'notice_msg' >{msg}</div>
            ) : msg
          }
        </div>
        <Row style = {bottomStyle} >
          <Col span = {12} style = {{padding: '0 1rem 2rem 2rem'}} className = 'notice_timer' >
            {
              this.state.second > 0 ? (
                <font>{this.state.second}&nbsp;秒后自动关闭</font>
              ) : null
            }
          </Col>
          <Col span = {12} style = {{padding: '0 2rem 2rem 1rem'}} ><div className = 'notice_btn' onClick = {this.hide} >我知道了</div></Col>
        </Row>
      </div>
    );
  }
}
Message.showMsg = ()=>{showMsg()};
Message.hideMsg = ()=>{hideMsg()};

module.exports = Message;