import React, { PropTypes } from 'react';
import { Row, Col,Modal }         from 'antd';
import moment from 'moment';

import styles from './CashMain.css';
import listStyles from '../../components/List.css';
import TimerPage from '../../TimerPage.jsx';
import Button from '../../components/Button.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import Card from '../../components/Card.jsx';
import Empty from '../../components/Empty.jsx';
import NavContainer from '../../components/NavContainer.jsx';
class CashMain extends TimerPage {

  constructor(props) {
    super(props);
    this.onBack = this.bind(this.onBack,this);
    this.onHome = this.bind(this.onHome,this);
    this.renderItems  = this.bind(this.renderItems,this);
    this.doSearch = this.bind(this.doSearch,this);
    this.createBatch = this.bind(this.createBatch,this);
    this.closeCash  = this.bind(this.closeCash,this);
    this.enableCash = this.bind(this.enableCash,this);
    this.state = { opt :0,batchs:[]}
  }
 
  componentDidMount () {
	  var patient = baseUtil.getCurrentPatient();
	  if(patient.id)this.doSearch()
  }
  onBack(){
	 baseUtil.goHome('cashBack');
  }
  onHome(){
	 baseUtil.goHome('cashHome');
  }
  doSearch(){
    let fetch = Ajax.get("/api/ssm/pay/settle/cash/unPrinted/machine", null, {catch: 3600});
	fetch.then(res => {
		let batchs = res.result||[];
    	return batchs;
	}).then((batchs)=>{
		this.setState({batchs});
	});
  }

  closeCash(){
	 baseUtil.closeTodayCash();
	 var opt = this.state.opt+1;
	 this.setState({opt}) 
  }
  enableCash(){
	  baseUtil.enableTodayCash(); 
	  //TODO 初始化钱箱
	  var opt = this.state.opt+1;
	  this.setState({opt}) 
  }
  createBatch(batch){console.info('createBatch');
	let fetch = Ajax.get("/api/ssm/pay/settle/cash/createBatch", null, {catch: 3600});
	fetch.then(res => {
		this.closeCash();
		this.doSearch();
	});
  }
  render() {
	  var patient = baseUtil.getCurrentPatient();
	  if(!patient.id)return null;
	var canCash = baseUtil.isTodayCanCash();
	var data = this.state.batchs;
	
    return (
      <NavContainer title='现金清钞' onBack={this.onBack} onHome={this.onHome} >
        {
        	canCash?(
        			<Row>
        				<Col span={14}>当前自助机现金功能处于<font style={{fontSize:'5rem',color:'red'}}>启用</font>状态</Col>
        				<Col span={2}></Col>
        				<Col span={6}>
        					<Button text = "关闭现金"   onClick = {()=>{this.closeCash()}} />
        				</Col>
        				<Col span={2}></Col>
        			</Row>
        	):(
        			<Row>
	        			<Col span={14}>当前自助机现金功能处于<font style={{fontSize:'5rem',color:'red'}}>停用</font>状态</Col>
	    				<Col span={2}></Col>
	    				<Col span={6}>
	    					<Button text = "启用现金"   onClick = {()=>{this.enableCash()}} />
	    				</Col>
	    			</Row>
        	)
        }
          <Row>
            <Col span = {6} className = 'list_title' >批次号</Col>
            <Col span = {6} className = 'list_title list_center' >创建时间</Col>
            <Col span = {4} className = 'list_title list_amt' >总金额</Col>
            <Col span = {4} className = 'list_title' >总笔数</Col>
            <Col span = {4} className = 'list_title' >收钞</Col>
          </Row>
          <Card  radius = {false} className = 'cash_opt_rows' >
            {this.renderItems(data)}
          </Card>
        </NavContainer>
    );
  }

  renderItems (records) {
    if (!records || records.length <= 0 ){
    	let height = document.body.clientHeight - 138;
      return (
        <Row style = {{height: height + 'px', paddingLeft: '1.5rem'}} >
          <Empty info = '暂无记录' />
        </Row>
      )
    }
    return records.map((record,idx)=>{
    	const {batchNo,createTime,count,printTime,amt } = record;
	    return (
	      <div className = 'cash_opt_row' key={idx} >
	          <Row type="flex" align="middle" >
		          <Col span = {6} className = 'list_item' >
		            {batchNo?batchNo:'未生成'}
		          </Col>
		          <Col span = {6} className = 'list_item   list_center'>
		            {createTime}
		          </Col>
		          <Col span = {4} className = 'list_item   list_amt' >
		          {(amt||0).formatMoney()}
		          </Col>
		          <Col span = {4} className = 'list_item' >
		          {count}
		          </Col>
		          <Col span = {4} className = 'list_item' >
		          {
		        	  batchNo?'已收钞':(
		        	     <Button text = "收钞"   onClick = {()=>{this.createBatch()}} />
		        	  )
		          }
		          </Col>
	          </Row>
	      </div>
	    );
    })
  }
}
module.exports = CashMain;