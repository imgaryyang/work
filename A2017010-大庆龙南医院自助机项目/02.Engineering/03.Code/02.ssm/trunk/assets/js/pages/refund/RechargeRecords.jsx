import React, { PropTypes } from 'react';
import { Row, Col,Modal }         from 'antd';
import moment               from 'moment';

import styles               from './RechargeRecords.css';
import listStyles           from '../../components/List.css';
import Card                 from '../../components/Card.jsx';
import Button               from '../../components/Button.jsx';
import Empty                from '../../components/Empty.jsx';
import NavContainer         from '../../components/NavContainer.jsx';
import TimerPage from '../../TimerPage.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
class Page extends TimerPage {

  constructor(props) {
    super(props);
    this.onBack = this.bind(this.onBack,this);
    this.onHome = this.bind(this.onHome,this);
    this.loadRecords = this.bind(this.loadRecords,this);
    this.renderItems  = this.bind(this.renderItems,this);
    this.nextPage = this.bind(this.nextPage,this);
    this.prePage = this.bind(this.prePage,this);
    this.selectDetails = this.bind(this.selectDetails,this);
    
    this.state = {
    	//startTime 	endTime
    	pageNo:1,
        pageSize:6,
    	records:[],
    }
  }
  componentDidMount () {
	   this.loadRecords();
  }
  onBack(){
	if(this.props.cancel)this.props.cancel();
  }
  onHome(){
	  baseUtil.goHome('refundRecordHome');
  }
  loadRecords(){
	const patient = baseUtil.getCurrentPatient();
	const { account } = this.props;
	var query = {
    	patientNo:patient.no,
    	startTime:moment().subtract(50, 'days').format('YYYY-MM-DD')+" 00:00:00",
    	endTime:moment().format('YYYY-MM-DD')+" 23:59:59",
    	paymentWay:account.accType,
    	account:account.accId,
    }
	
	let fetch = Ajax.get("/api/ssm/treat/deposit/records/detail",query,{catch: 3600});
	fetch.then(res => {
	  if(res && res.success){
		  var records = res.result||[];
		  this.setState({records});
	  }else{
//		  var msg =(res && res.msg)?res.msg:"无法获充值记录列表";
//		  baseUtil.error(msg);
	  }
	}).catch((ex)=>{
		baseUtil.error("无法获充值记录列表");
	});
  }
  selectDetails(record){
	  if(this.props.selectRecord)this.props.selectRecord(record);
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
	const { records,pageNo,pageSize } = this.state;
	let start = pageSize*(pageNo-1);
	let limit = pageSize*pageNo;
	const data = records.slice(start,limit); 

    return (
    	<NavContainer title='充值明细' onBack={this.onBack} onHome={this.onHome} >
		  <Row>
	          <Col span = {6} className = 'list_title' >账户</Col>
	          <Col span = {5} className = 'list_title list_center' >支付时间</Col>
	          <Col span = {4} className = 'list_title list_amt' >支付金额</Col>
	          <Col span = {4} className = 'list_title list_amt' >已退金额</Col>
	          <Col span = {5} className = 'list_title list_center' >操作</Col>
	      </Row>
          <Card  radius = {false} className = 'refund_rs_rows' >
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
        </NavContainer>
    );
  }

  renderItems (records) {
    if (!records || records.length <=0){
    	let height = document.body.clientWidth - 138;
      return (
        <Row style = {{height: height + 'px', paddingLeft:  '1.5rem'}} >
          <Empty info = '暂无记录' />
        </Row>
      )
    }
    return records.map ( (row, idx) => {
      const { paymentWay, account, cardType, cardBankCode, recharge,refund,paymentTime } = row;
      var typeName = "支付";
      const amt = parseFloat(recharge||0).formatMoney();
      const refundAmt = parseFloat(refund||0).formatMoney();
      var acct = account.substr(0,4)+"******"+account.substr(account.length-4,account.length)
		 
      return (
          <div key = {'_order_items_' + idx} className = 'refund_rs_row' >
  	          <Row type="flex" align="middle" >
		          <Col span = {6} className = 'list_item' >
		          	{acct}
		          </Col>
		          <Col span = {5} className = 'list_item list_center' >
		          	{moment(paymentTime).format('YYYY-MM-DD HH:mm')}
		          </Col>
		          <Col span = {4} className = 'list_item list_amt' >
		            {amt}
		          </Col>
		          <Col span = {4} className ='list_item list_amt' >
		            {refundAmt}
		          </Col>
		          <Col span = {5} className ='list_item list_center' >
	                <Button text = "退款" style = {{fontSize: '2.5rem'}} onClick = {() => this.selectDetails(row)} />
	              </Col>
	          </Row>
          </div>
        );
	});
  }
}	
module.exports = Page;
