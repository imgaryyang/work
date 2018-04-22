import React, { PropTypes } from 'react';
import { Row, Col,Modal}         from 'antd';
import moment from 'moment';

import styles from './CashMain.css';
import listStyles from '../../components/List.css';
import Button from '../../components/Button.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import Card from '../../components/Card.jsx';
import Empty from '../../components/Empty.jsx';
import printUtil from '../../utils/printUtil.jsx';
import NavContainer from '../../components/NavContainer.jsx';
class CashMain extends React.Component {

  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.onHome = this.onHome.bind(this);
    this.renderItems  = this.renderItems.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.createBatch = this.createBatch.bind(this);
    this.closeCash  = this.closeCash.bind(this);
    this.enableCash = this.enableCash.bind(this);
    this.calType = this.calType.bind(this);
    this.state = { opt :0,batchs:[]}
  }
 
  componentDidMount () {
	  var patient = baseUtil.getCurrentPatient();
	  if(patient.id)this.doSearch()
  }
  onBack(){
	 baseUtil.goOptHome('cashBack');
  }
  onHome(){
	 baseUtil.goOptHome('cashHome');
  }
  doSearch(){
    let fetch = Ajax.get("/api/ssm/pay/settle/cash/unPrinted/machine", null, {catch: 3600});
	fetch.then(res => {
		let batchs = res.result||[];
		console.log('uncreateBatch_result:',batchs);
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
  calType(amtType){
	  var sum=0;
	  var len=amtType.length;
	  for(var i=0;i<amtType.length;i++){
		  if(amtType[i]==null||amtType[i]==0){
			  sum+=1;
			  amtType[i]=0; 
		  }
  };
  	
	  return len-sum;
	  
  }
 
  	createBatch(batch){
  	const patient = baseUtil.getCurrentPatient();
	let fetch = Ajax.get("/api/ssm/pay/settle/cash/createBatch", null, {catch: 3600});
	fetch.then(res => {
		this.closeCash();
		var result = res.result;
		console.log('createBatch_result:',result);
		var amtType = [result.amt1,result.amt2,result.amt5,result.amt10,result.amt20,result.amt50,result.amt100];
		const amtTypeSum=this.calType(amtType);
		result.amtTypeSum=amtTypeSum;
		printUtil.printCashDetails(result,patient);
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
            <Col span = {2} className = 'list_title list_amt' >总金额</Col>
            <Col span = {2} className = 'list_title' >总笔数</Col>
            <Col span = {4} className = 'list_title' >收钞状态</Col>
            <Col span = {4} className = 'list_title' >操作</Col>
           
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
    	var Denomination='面额';
    	var Number='笔数';
    	var Money='金额';
    	const {machineMac,hisUser,batchNo,createTime,count,printTime,amt,amt1,amt2,amt5,amt10,amt20,amt50,amt100,count1,count2,count5,count10,count20,count50,count100,} = record;
    	var amtType = [amt1,amt2,amt5,amt10,amt20,amt50,amt100];
    	const patient = baseUtil.getCurrentPatient();
    	const amtTypeSum=this.calType(amtType);
    	record.amtTypeSum=amtTypeSum;
	    return (
	      <div className = 'cash_opt_row' key={idx} >
	          <Row type="flex" align="middle" >
		          <Col span = {6} className = 'list_item' >
		            {batchNo?batchNo:'未生成'}
		          </Col>
		          <Col span = {6} className = 'list_item   list_center'>
		            {createTime?createTime:'无'}
		          </Col>
		          <Col span = {2} className = 'list_item   list_amt' >
		          {(amt||0).formatMoney()}
		          </Col>
		          <Col span = {2} className = 'list_item' >
		          {count}
		          </Col>
		          <Col span = {4} className = 'list_item' >
		          {
		        	  batchNo?'已收钞':'未收钞'
		          }
		          </Col>
		          <Col span = {4} className = 'list_item'>
		          {batchNo?'收钞完毕':(
		        	<Button text = "开始收钞"   onClick = {()=>{this.createBatch()}} />
			    )}
			    </Col>
	          </Row>
	          <Row>
	          <hr />
	          </Row>
	          <Row  >
	          <Col span = {2} className = 'list_item   list_amt'>
	            {Denomination}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {1}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {2}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {5}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {10}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {20}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {50}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {100}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {'币种数'}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {amtTypeSum?amtTypeSum:'0'}
	          </Col>
	          </Row>
	          
	          <Row  >
	          <Col span = {2} className = 'list_item   list_amt'>
	            {Number}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {count1?count1:'0'}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {count2?count2:'0'}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {count5?count5:'0'}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {count10?count10:'0'}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {count20?count20:'0'}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {count50?count50:'0'}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {count100?count100:'0'}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {'总笔数'}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {count?count:'0'}
	          </Col>
	          </Row>
	          
	          <Row>
	          <hr />
	          </Row>
	          <Row >
	          <Col span = {2} className = 'list_item   list_amt'>
	            {Money}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {(amt1||0).formatMoney()}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {(amt2||0).formatMoney()}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {(amt5||0).formatMoney()}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {(amt10||0).formatMoney()}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {(amt20||0).formatMoney()}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {(amt50||0).formatMoney()}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {(amt100||0).formatMoney()}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {'总金额'}
	          </Col>
	          <Col span = {2} className = 'list_item   list_amt'>
	            {(amt||0).formatMoney()?(amt||0).formatMoney():'0'}
	          </Col>
	          </Row>
	          <Row><hr /></Row>
	          <Row>
	          <Col  className ='list_center' >
	          {
	        	  
	        	     <Button text = "打印凭证"   onClick = {()=>{
	        	    	 printUtil.printCashDetails(record,patient);}} />
	        	
	          }
	          </Col>
	          </Row>
	          
	      </div>
	   
	    );
    })
  }
}
module.exports = CashMain;