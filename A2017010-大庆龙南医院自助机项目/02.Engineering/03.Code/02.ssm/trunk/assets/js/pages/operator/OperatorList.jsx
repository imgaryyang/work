import React, { PropTypes } from 'react';
import { Row, Col,Modal } from 'antd';
import moment               from 'moment';

import styles               from './OperatorList.css';
import listStyles           from '../../components/List.css';
import Card                 from '../../components/Card.jsx';
import Button               from '../../components/Button.jsx';
import Empty                from '../../components/Empty.jsx';
import Confirm              from '../../components/Confirm.jsx';
import ToolBar              from '../../components/ToolBar.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{ log } from '../../utils/logUtil.jsx';
import cardPrinter from '../../utils/cardPrinterUtil.jsx';

class OperatorList extends React.Component {

  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.onHome = this.onHome.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prePage = this.prePage.bind(this);
    
    this.printCard = this.printCard.bind(this);
    this.issueCard = this.issueCard.bind(this);
    this.forPrint = this.forPrint.bind(this);
    this.cardErrorHandler = this.cardErrorHandler.bind(this);
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
	const patient = baseUtil.getCurrentPatient();
	let fetch = Ajax.get("/api/ssm/base/operator/list",{},{catch: 3600});
	fetch.then(res => {
	  if(res && res.success){
		  var records = res.result||[];
		  this.setState({records});
	  }else if( res && res.msg ){
		  baseUtil.error(res.msg);
	  }else{
		  baseUtil.error("查询运维人员出错");
	  }
	}).catch((ex) =>{
		baseUtil.error("查询运维人员异常");
	})  
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
      <NavContainer title='颁发运维卡' onBack={this.onBack} onHome={this.onHome} >
		  <Row>
	          <Col span = {6} className = 'list_title' >姓名</Col>
	          <Col span = {4} className = 'list_title list_center' >编号</Col>
	          <Col span = {10} className = 'list_title list_center' >现有卡号</Col>
	          <Col span = {4} className = 'list_title list_center' >操作</Col>
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
        </NavContainer>
    );
  }
  forPrint(record){
	 this.issueCard(false,record);
  }
  cardErrorHandler(retry,msg,record){
	log("运维办卡-制卡错误,是否重试["+retry+"]",msg);
	if(retry){
		baseUtil.error(msg);
		try{
			lightUtil.cardPrinter.turnOff();
		}catch(e){
			console.info('关灯失败')
		}
		this.setState({showPrintWin:false,printMsg:''});
	}else{
		this.setState({showPrintWin:true,printMsg:'尝试重新制卡，请耐心等待'},()=>{
			setTimeout(()=>{
				this.issueCard(true,record);
			},200);
		});
	}
  }
  issueCard(retry,record){//async
		try{
			lightUtil.cardPrinter.blink();
			//await baseUtil.sleep(100);
		}catch(e){
			console.info('闪灯异常');
		}
		if(retry){
			// 尝试排卡
			try{
				cardPrinter.moveToBasket();
			}catch(e){console.info(e);
				this.cardErrorHandler(true,'无法排卡，请联系运维人员',record);
				return;
			}
			// 尝试重启
			try{
				cardPrinter.reset();
			}catch(e){
				this.cardErrorHandler(true,'无法重启打印机，请联系运维人员',record);
				return;
			}
		}
		try{
	  		const state  = cardPrinter.checkPrinterStatus();
	  		if(state == 0){
	  			console.info('当前状态'+state);
		    	}else{
		    		console.info('证卡打印机状态异常');
		    		var msg = cardPrinter.getErrorMsg(state);
		    		this.cardErrorHandler(retry,msg,record);// 1 状态错误 重新制卡
		    		return;
		    	}
			}catch(e){
				console.info('无法读取打印机状态');
				this.cardErrorHandler(retry,'无法读取打印机状态，请联系运维人员',record);// 1 状态错误 重新制卡
	  		return;
		} 
		try{
	  		cardPrinter.moveToReader();
	  		console.info('移动至非接读卡区成功');
		}catch(e){
			console.info('移动至非接读卡区异常');
			this.cardErrorHandler(retry,'卡箱内无卡，请联系管理人员',record);// 2 移动至非接错误 重新制卡
			return;
		} 
		var medicalCardNo = null;
		try{
	  		medicalCardNo  = cardPrinter.readCardNo();
	  		console.info('读取卡号成功：'+medicalCardNo);
		}catch(e){
			console.info('读取卡号异常');
			this.cardErrorHandler(retry,'读取卡号异常,请更换自助机',record);// 3 读卡错误  重新制卡
			return;
		}
		if(!medicalCardNo){
			lightUtil.cardPrinter.turnOff();
			this.cardErrorHandler(retry,'无效卡片,请更换自助机',record);// 4 卡号错误  重新制卡
			return;
		}
		try{
			cardPrinter.setStandbyParameter();
			console.info('设置基本参数成功');
		}catch(e){
			console.info('设置基本参数异常');
			this.cardErrorHandler(retry,'设置基本参数异常,请更换自助机',record);// 5 设置参数错误  重新制卡
			return;
		}
		log("运维办卡-准备绑卡，卡号： ",medicalCardNo);
		let fetch = Ajax.post("/api/ssm/base/operator/issueCard",{...record,medicalCardNo},{catch: 3600});
		fetch.then(res => {
			log("运维办卡-绑卡返回： ",res);
			if(res && res.success){
				var baseInfo = res.result||{};
				this.printCard(baseInfo,record.no);
				try{
					baseUtil.speak('card_tackMdeicalCard');// 
					lightUtil.cardPrinter.turnOff();
				}catch(e){
					console.info('关灯失败')
				}
				this.setState({showPrintWin:false,printMsg:''},()=>{
					this.doSearch();
				});
			}else if( res && res.msg ){
				this.cardErrorHandler(retry,res.msg,record);
	    	}else{
	    		this.cardErrorHandler(retry,'绑定卡异常,请更换自助机');//  6  可能卡号被占用 重新制卡
	    	}
		}).catch((ex) =>{
			this.cardErrorHandler(retry,'绑定卡异常,请更换自助机',record);//  6  可能卡号被占用 重新制卡
		})
	}
	printCard(baseInfo,miPatientNo){
		try{//如果有关联医保卡号，打医保卡号
			cardPrinter.printCard(baseInfo.name,miPatientNo || baseInfo.no,'运维');
		}catch(e){
			console.info(e);
			this.cardErrorHandler(true,'发送打印指令异常,请更换自助机');// 6 发送打印指令异常  不重新制卡
			return;
		}
		baseUtil.speak('card_tackMdeicalCard');// 
		try{
			lightUtil.cardPrinter.turnOn();
		}catch(e){
			console.info('开灯异常');
		} 
		// this.doSearch();		
		try{
			lightUtil.cardPrinter.turnOff();
		}catch(e){
			console.info('关灯异常');
		} 
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
    	const {  name,no,medicalCardNo } = row;
        return (
          <div key = {'_order_items_' + idx} className = 'recharge_row' >
  	          <Row type="flex" align="middle" >
		  	      <Col span = {6} className = 'list_item'>
		            {name}
		          </Col>
		          <Col span = {4} className = 'list_item list_center' >
		            {no}
		          </Col>
		          <Col span = {10} className = 'list_item list_center' >
		            {medicalCardNo}
		          </Col>
		          <Col span = {4} className = 'list_item list_center' >
		          	{ 
		              	<Button text = "发卡" style = {{fontSize: '2.5rem'}} onClick = {() => this.forPrint(row)} />
		             }
		          </Col>
	          </Row>
          </div>
        );
	});
  }
}	
module.exports= OperatorList;