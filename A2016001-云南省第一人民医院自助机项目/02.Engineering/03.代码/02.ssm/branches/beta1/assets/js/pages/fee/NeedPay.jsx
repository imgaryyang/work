import React, { PropTypes } from 'react';
import { Row, Col, Icon,Modal }   from 'antd';
import moment from 'moment';

import styles from './NeedPay.css';
import listStyles from '../../components/List.css';

import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import BackTimer from '../../components/BackTimer.jsx';
import Empty from '../../components/Empty.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import socket from '../../utils/socket.jsx';

import baseUtil from '../../utils/baseUtil.jsx';
import miCardUtil from '../../utils/miCardUtil.jsx';

const checked = './images/base/checked.png';
const unchecked = './images/base/unchecked.png';
const siCard = './images/guide/si-card-read.gif';
/**
 * 选择组，预结算，预结算后将订单信息和选择完毕的缴费项目回传，此时还未后台生成订单
 */
class NeedPay extends React.Component {

  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
	this.onHome = this.onHome.bind(this);
	
    this.loadFees = this.loadFees.bind(this);
    this.onMiCardPushed = this.onMiCardPushed.bind(this);
    
    this.renderItems    = this.renderItems.bind(this);
    this.onCheck        = this.onCheck.bind(this);
    this.goToPay        = this.goToPay.bind(this);
    this.checkMi = this.checkMi.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prePage = this.prePage.bind(this);
    
    this.afterPreCreate = this.afterPreCreate.bind(this);
    this.state = {
		selectedMap : {},
		miModal:false,
		pageNo:1,
		pageSize : 5 ,
		
		fees:[],
		order:{},
	 };
  }
  
  componentWillReceiveProps ( next ) {
  }
  componentDidMount () {
	baseUtil.mask('SOCKET-LOAD-FEE');
	setTimeout(()=>{
		this.loadFees();
		baseUtil.unmask('SOCKET-LOAD-FEE');
	},200);//防止调用socket造成的卡界面
  }
  onBack(){
	 baseUtil.goHome('needPayBack'); 
  }
  onHome(){
	 baseUtil.goHome('needPayHome'); 
  }
  loadFees(){
	  try{
		  var patient = baseUtil.getCurrentPatient();
		  var machine = baseUtil.getMachineInfo();
		  var msg = "A^" + patient.medicalCardNo + "^"+ machine.hisUser + "^";
		  
		  var {data} = socket.SEND(msg);  
		  if(data && data.resultCode == '0'){
			var fees = data.recMsg||[];
			var selectedMap = {};
			var today = moment().format('YYYY-MM-DD');
			for(var fee of fees){
				var time = moment(fee.yzsj).format('YYYY-MM-DD');
				if(today == time){
					selectedMap[fee.zh]=fee;
				}
			}
			console.info("加载缴费信息完毕");
			this.setState({fees,selectedMap});
		  }else{
			console.info("加载缴费信息失败");
			baseUtil.error("查询待缴费项失败");  
		  }
	  }catch(e){
		  baseUtil.error("查询待缴费项异常");   
	  }
  }
  nextPage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo+1});
  }
  prePage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo-1});
  }
  onCheck (item) {
	  const { selectedMap } = this.state;
	  const key = selectedMap[item.zh];
	  if(key){ delete selectedMap[item.zh] }
	  else{ selectedMap[item.zh] = item }
	  this.setState({selectedMap});
  }
  checkMi(){
	var patient = baseUtil.getCurrentPatient();
	const unitCode = patient.unitCode ||"0000";
	if(unitCode.substring(0,1) == 'Y'){
		console.info("医保用户，需要插入医保卡");
		baseUtil.speak('card_pushMiCard');// 播放语音：请插入您的医保卡
		this.setState({miModal:true},()=>{
			miCardUtil.listenCard(this.onMiCardPushed);
		});
	}else{
		this.goToPay();
	}  
  }
  onMiCardPushed(){
	this.setState({miModal:false},()=>{
		console.info("医保卡已插入，进入预结算阶段");
		this.goToPay();
	});
  }
  onCancel(){
	  this.setState({miModal:false});
  }
  goToPay () {
	baseUtil.mask('SOCKET-PRE-PAY');
	try{
		const patient = baseUtil.getCurrentPatient();
		const machine =  baseUtil.getMachineInfo();
		const { selectedMap,fees } = this.state; 
		var selectedFees=[],groupMap = {};
		var gMsg = '',totalAmt = 0 ;
		
		for(var fee of fees){
			if(selectedMap[fee.zh]){
				selectedFees.push(fee);
				var amt = fee.dj * fee.sl;
				totalAmt = totalAmt+amt;
				if(!groupMap[fee.zh]){
					groupMap[fee.zh] = fee;
					gMsg = gMsg +fee.zh+'^';
				}
			}
		}
		var msg = "B^" +  patient.medicalCardNo +'^'+ gMsg+ machine.hisUser + "^";
		
		var { data } = socket.SEND(msg);
	    if(data && data.resultCode == '0'){
			var result = data.recMsg||[];
			if(result.state != '0'){
				var msg = result.cwxx || '预结算失败'
				baseUtil.error(msg); 
			}else{
				var order = {
					patientNo:patient.no,//病人姓名
					patientName:patient.name,//病人姓名	
					patientIdNo:patient.idNo,//病人身份证号
					patientCardNo:patient.medicalCardNo,//病人卡号	
					//patientCardType:patient.cardType,//就诊卡类型 TODO 就诊卡	
					fees:selectedFees,
					amt:totalAmt,
					selfAmt:result.yczf,// 预存支付
					miAmt:result.jzje,// 记账金额
					paAmt:result.zfje,// 自费金额
					reduceAmt:result.jmje,// 减免金额
				}
				this.afterPreCreate(order,selectedFees);
			}
	    }else{
		  baseUtil.error("预结算失败");  
	    }
	}catch(e){
		baseUtil.error("预结算异常");   
	}
	baseUtil.unmask('SOCKET-PRE-PAY');
  }
  afterPreCreate(order,selectedFees){
	if(this.props.afterPreCreate)this.props.afterPreCreate(order,selectedFees);
  }
  render() {
    const btnHeight   = 120,
          listHeight  = document.body.clientHeight - 344;
    const modalWinTop  = 17;
    const { fees,selectedMap } =  this.state;
    var patient = baseUtil.getCurrentPatient();
    const unitCode = patient.unitCode ||"0000";
    var tip="您是非医保患者!";
    if(unitCode.substring(0,1) == 'Y'){
    	tip="您是医保用户，请准备好医保卡并在交费时插入!";
	} 
    var totalAmt = 0;
    fees.map ( (row, idx) => {
		const {zh,dj,sl,cs} = row;	
		var key = selectedMap[zh];
		//此事即使转换成整数，运算后可能还会小数点
		if( key ) {
			var amt = (sl*100)*(dj*10000)/1000000;
			if(cs)amt =(amt*100 )*(cs*100)/10000;
			totalAmt =( totalAmt*10000+amt*10000)/10000;
			//console.info(amt,totalAmt);
		}
	});
    
    const { pageNo,pageSize} = this.state;
    let start = pageSize*(pageNo-1);
    let limit = pageSize*pageNo;
    const filteredFees = fees.slice(start,limit); // 输出：2
    
    return (
     fees && fees.length == 0 ? (
    	<NavContainer title='缴费明细' onBack={this.onBack} onHome={this.onHome} >
    		 	<Empty info = '暂无待缴费项目' />
        </NavContainer>
     ) : (
        <NavContainer title='缴费明细' onBack={this.onBack} onHome={this.onHome} >
	      <Card  radius = {false} style = {{marginBottom: '1rem'}} >
	        <Row className = 'needpay_footer' >
	          <Col span = {15} className = 'needpay_tip'>{tip}</Col>
	          <Col span = {5} className = 'needpay_totalamt' style = {{textAlign: 'right'}} >合计：{parseFloat(totalAmt||0).formatMoney()}</Col>
	          <Col span = {4} className = 'needpay_buttonContainer'>
	          	<Button text = '去缴费' disabled={totalAmt <= 0} onClick = {this.checkMi} />
	          </Col>
	        </Row>
	      </Card>  
          <div className = 'needpay_listContainer' style = {{height: listHeight + 'px', paddingTop: '2rem'}} >
            <Card  radius = {false} style = {{marginBottom: '1rem'}} >
	          <Row type="flex" align="middle" className = 'needpay_titleRow' >
	    		<Col span = {1} className = 'list_item list_center needpay_titleCol' onClick = {() => this.onCheckAll()} >
	    		</Col>
	    		<Col span = {1} className = 'list_item needpay_titleCol' >
	    			<font>组</font>
	    		</Col>
	    		<Col span = {3} className = 'list_item needpay_titleCol' >
	    		<font>时间</font>
	    		</Col>
	    		<Col span = {4} className = 'list_item needpay_titleCol' >
	    		<font>科室</font>
	    		</Col>
	    		<Col span = {3} className = 'list_item needpay_titleCol' >
	    		<font>医生</font>
	    		</Col>
	    		<Col span = {5} className = 'list_item needpay_titleCol' >
	    		<font>费用类型</font>
	    		</Col>
	    		<Col span = {2} className = 'list_item list_amt needpay_titleCol' >
	    		<font>单价</font>
	    		</Col>
	    		<Col span = {2} className = 'list_item list_amt needpay_titleCol' >
	    		<font>数量</font>
	    		</Col>
	    		<Col span = {2} className = 'list_item list_amt needpay_titleCol' >
	    		<font>金额</font>
	    		</Col>
	          </Row>
			</Card>  
            {this.renderItems(filteredFees)}
          </div>
          {
        	  fees.length > pageSize ? (
  	        	<Row style = {{padding :  '1.5rem'}} >
  		            <Col span = {8}><Button text = "上一页" disabled={start== 0} onClick = {this.prePage} /></Col>
  		            <Col span = {8}>&nbsp;</Col>
  		            <Col span = {8} ><Button text = "下一页" disabled={limit >= fees.length } onClick = {this.nextPage} /></Col>
  	            </Row>
              ):null
          }
          <Modal visible = {this.state.miModal} closable = {false} footer = {null} width = {document.body.clientWidth * 0.6836 + 'px'} style={{top:modalWinTop+'rem'}} >
	        <div style = {{	backgroundColor:'#f5f5f5',marginTop:'-16px',marginBottom:'-50px',marginLeft:'-16px',marginRight:'-16px',}}>
		        <div className = 'needpay_guideTextContainer' >
					<font className = 'needpay_guideText' >请插入社保卡</font>
				</div>	
				<div style = {{height: '30rem', width: '30rem', margin: '3rem auto',backgroundColor:'#f5f5f5'}} >
					<img alt = "" src = {siCard} className = 'needpay_guidePic' />
				</div>
				<Row style = {{padding : '1.5rem'}} >
		            <Col span = {8}>&nbsp;</Col>
		            <Col span = {8}><Button text = "取消"  onClick = {this.onCancel} /></Col>
		            <Col span = {8} >&nbsp;</Col>
	            </Row>
	        </div>
          </Modal>
        </NavContainer>
      )
    );

  }
  renderItems (fees) {
	  const { selectedMap } = this.state; 
	  return fees.map ( (row, idx) => {
		const {
			zh,/*组号*/
			mc,/*名称*/
			dj,/*单价*/
			sl,/*数量*/
			cs,/* 次数*/
			kzjb,/*控制级别*/
			yzsj,/*医嘱 时间*/
			ysid,/*医生编号*/
			kzjbmc,/*控制级别名称*/
			ysxm,/*医生姓名*/
			ksmc,/*科室名称*/
			ksid,/*科室id*/
			flmmc/*分类码名称*/
		} = row;	
		var key = selectedMap[zh]
		var checkIcon = key?checked:unchecked;
		return (
	      <Card  radius = {false} key = {'_np_items_' + idx} style = {{marginBottom: '1rem'}} >
	        <Row type="flex" align="middle" className = 'needpay_titleRow' >
	    		<Col span = {1} className = 'list_item list_center needpay_titleCol' onClick = {() => this.onCheck(row)} >
	    			<img src = {checkIcon} width = {36} height = {36} />
	    		</Col>
	    		<Col span = {1} className = 'list_item needpay_titleCol' >
	    			<span style = {{fontSize: '2rem'}} >{zh}</span>
	    		</Col>
	    		<Col span = {3} className = 'list_item needpay_titleCol' >
	    			<span style = {{fontSize: '2rem'}} >{moment(yzsj).format('YYYY-MM-DD')}</span>
	    		</Col>
	    		<Col span = {4} className = 'list_item needpay_titleCol' >
	    			{ksmc}
	    		</Col>
	    		<Col span = {3} className = 'list_item needpay_titleCol' >
	    			{ysxm}
	    		</Col>
	    		<Col span = {5} className = 'list_item needpay_titleCol' >
	    			{flmmc||" "}<br/>({mc})
	    		</Col>
	    		<Col span = {2} className = 'list_item list_amt needpay_titleCol' >
	    			<b>{dj.formatMoney(4)}</b>
	    		</Col>
	    		<Col span = {2} className = 'list_item list_amt needpay_titleCol' >
	    			<b>{sl}</b>
	    		</Col>
	    		<Col span = {2} className = 'list_item list_amt needpay_titleCol' >
	    			<b>{(sl*dj)/*.formatMoney(4)*/}</b>
	    		</Col>
	          </Row>
			</Card>
		)
	  });
  }
}
module.exports = NeedPay;