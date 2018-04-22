import React, { PropTypes } from 'react';
import { Row, Col,Modal } from 'antd';
import moment               from 'moment';

import styles               from './rechargeHistory.css';
import listStyles           from '../../components/List.css';
import Week                 from '../../components/Week.jsx';
import Month                 from '../../components/Month.jsx';
import Card                 from '../../components/Card.jsx';
import Button               from '../../components/Button.jsx';
import BackTimer            from '../../components/BackTimer.jsx';
import Empty                from '../../components/Empty.jsx';
import Confirm              from '../../components/Confirm.jsx';
import ToolBar              from '../../components/ToolBar.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import TimerModule from '../../TimerModule.jsx';
import baseUtil from '../../utils/baseUtil.jsx';

const calendarIcon = './images/base/calendar.png';

class PrepaidHistory extends TimerModule {

  constructor(props) {
    super(props);
    this.onBack = this.bind(this.onBack,this);
    this.onHome = this.bind(this.onHome,this);
    this.renderItems  = this.bind(this.renderItems,this);
    this.onSelectDay = this.bind(this.onSelectDay,this);
    this.showDatePicker = this.bind(this.showDatePicker,this);
    this.doSearch = this.bind(this.doSearch,this);
    this.nextPage = this.bind(this.nextPage,this);
    this.prePage = this.bind(this.prePage,this);
    this.state ={ 
      records:[],
      startTime: moment(new Date()).format('YYYY-MM-DD'),
  	  endTime: moment(new Date()).format('YYYY-MM-DD'),
  	  showDateModal:false,
  	  dateField:'startTime',
  	  pageNo:1,
  	  pageSize : 8  ,
    }
  }
  
  componentDidMount () {
	  const patient = baseUtil.getCurrentPatient();
	  if( patient.no )this.doSearch()
  }
  onBack(){
	  baseUtil.goHome('RechargeBack'); 
  }
  onHome(){
	  baseUtil.goHome('RechargeHome'); 
  }
  doSearch(){
	const {startTime,endTime } = this.state;
	const patient = baseUtil.getCurrentPatient();
	const startTimeText = moment(startTime).format('YYYY-MM-DD')+' 00:00:00';
	const endTimeText = moment(endTime).format('YYYY-MM-DD')+' 23:59:59';
	var query = {
	  ...patient,
	  startTime:startTimeText,
	  endTime:endTimeText,	
	}
	let fetch = Ajax.get("/api/ssm/treat/deposit/records/recharge",query,{catch: 3600});
	fetch.then(res => {
	  if(res && res.success){
		  var records = res.result||[];
		  this.setState({records});
	  }else if( res && res.msg ){
		  baseUtil.error(res.msg);
	  }else{
		  baseUtil.error("查询预存记录出错");
	  }
	}).catch((ex) =>{
		baseUtil.error("查询预存记录异常");
	})  
  }
  showDatePicker(field){
	  this.setState({showDateModal:true,dateField:field});
  }
  onSelectDay(day){
	  var date = day ? moment(day).format('YYYY-MM-DD') : null;
	  const {dateField } = this.state;
	  this.state[dateField] = date;
	  this.state.showDateModal = false;
	  this.state.pageNo = 1;
	  this.setState(this.state,this.doSearch);
  }
  nextPage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo+1});
  }
  prePage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo-1});
  }
  render() {
    const  weekWinWidth = document.body.clientWidth - 36;
	const  modalWinTop  = 18;
	var {records,startTime,endTime, pageNo,pageSize } = this.state;
	let start = pageSize*(pageNo-1);
	let limit = pageSize*pageNo;
	const patient = baseUtil.getCurrentPatient();
	const { name , balance } = patient;
	const data = records.slice(start,limit); 

    return (
      <NavContainer title='充值记录' onBack={this.onBack} onHome={this.onHome} >
      	  <Card  style = {{marginBottom: '2rem',fontSize: '3rem'}} >
  	  		<span>
  	  			当前患者<font style = {{color: '#DB5A5A', fontSize: '4.5rem'}} >{name}</font>,
  	  			&nbsp;&nbsp;&nbsp;就诊卡账户余额<font style = {{color: '#BC1E1E', fontSize: '4rem'}} >{(balance||0).formatMoney()}</font>&nbsp;&nbsp;元
  	  		</span>
  	  	  </Card>
	      <Row style = {{paddingLeft: '1.5rem',paddingRight: '1.5rem'}}>
		    <Col span = {3} className = 'recharge_toolBarItem' style = {{ textAlign: 'left', paddingRight: '.5rem'}} >开始日期</Col>
			<Col span = {6} className = 'recharge_toolBarItem' style = {{paddingRight: '.5rem'}} >
			  	<Card  onClick = {()=>{this.showDatePicker('startTime')}} ><img src = {calendarIcon} />{startTime}</Card>
			</Col>
			
			<Col span = {6} className = 'recharge_toolBarItem' style = {{paddingRight: '.5rem'}} ></Col>
			
			<Col span = {3} className = 'recharge_toolBarItem' style = {{ textAlign: 'left', paddingRight: '.5rem'}} >结束日期</Col>
			<Col span = {6} className = 'recharge_toolBarItem' style = {{paddingRight: '.5rem'}} >
				<Card  onClick = {()=>{this.showDatePicker('endTime')}} ><img src = {calendarIcon} />{endTime}</Card>
			</Col>
		  </Row>
		  <Row>
	          <Col span = {6} className = 'list_title' >发生时间</Col>
	          <Col span = {4} className = 'list_title list_center' >操作类型</Col>
	          <Col span = {6} className = 'list_title list_amt' >金额</Col>
	          <Col span = {4} className = 'list_title list_center' >状态</Col>
	          <Col span = {4} className = 'list_title' >支付方式</Col>
	      </Row>
          <Card  radius = {false} className = 'recharge_rows' >
            {this.renderItems(data)}
          </Card>
          {
        	 records.length > pageSize ? (
  	        	<Row style = {{padding : '1.5rem'}} >
  		            <Col span = {8}><Button text = "上一页" disabled={start== 0} onClick = {this.prePage} /></Col>
  		            <Col span = {8}>&nbsp;</Col>
  		            <Col span = {8} ><Button text = "下一页" disabled={limit >= records.length } onClick = {this.nextPage} /></Col>
  	            </Row>
              ):null
          }
          <Modal visible = {this.state.showDateModal} closable = {false} footer = {null} width = {this.weekWinWidth + 'px'} style = {{top: this.modalWinTop + 'rem'}} >
		    <div>
			  <Month width = {this.weekWinWidth - 32} initDate = {this.state[this.state.dateField]} onSelectDay = {this.onSelectDay} />
		    </div>
		  </Modal>	
        </NavContainer>
    );
  }

  renderItems (records) {
    if (!records || records.length <=0){
    	let height = document.body.clientHeight - 138;
      return (
        <Row style = {{height: height + 'px', paddingLeft: '1.5rem'}} >
          <Empty info = '暂无记录' />
        </Row>
      )
    }
    return records.map ( (row, idx) => {
    	const { requestNo, cardNo, paymentWay, outTradeNo, amount ,paymentTime,patientNo,tradeType,status } = row;
        const amt = parseFloat(amount||0).formatMoney();
        return (
          <div key = {'_order_items_' + idx} className = 'recharge_row' >
  	          <Row type="flex" align="middle" >
		  	      <Col span = {6} className = 'list_item'>
		            {moment(paymentTime).format('YYYY-MM-DD HH:mm')}
		          </Col>
		          <Col span = {4} className = 'list_item list_center' >
		            {tradeType}
		          </Col>
		          <Col span = {6} className = 'list_item list_amt' >
		            {amt}
		          </Col>
		          <Col span = {4} className = 'list_item list_center'  >
		            {status=="0"?"处理中":'成功'}
		          </Col>
		          <Col span = {4} className = 'list_item' >
		            {paymentWay}
		          </Col>
	          </Row>
          </div>
        );
	});
  }
}	
module.exports= PrepaidHistory;