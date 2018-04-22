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
import logUtil,{ log } from '../../utils/logUtil.jsx';
import miCardUtil from '../../utils/miCardUtil.jsx';
import TimerPage from '../../TimerPage.jsx';
import PinKeyboard from '../base/PinKeyboard.jsx';

const checked = './images/base/checked.png';
const unchecked = './images/base/unchecked.png';
const siCard = './images/guide/si-card-read.gif';

/**
 * 选择组，预结算，预结算后将订单信息和选择完毕的缴费项目回传，此时还未后台生成订单
 */
class NeedPay extends TimerPage {

  constructor(props) {
    super(props);
    this.onBack = this.bind(this.onBack,this);
	this.onHome = this.bind(this.onHome,this);
	
    this.loadFees = this.bind(this.loadFees,this);
    this.renderItems    = this.bind(this.renderItems,this);
    this.onCheck        = this.bind(this.onCheck,this);
    this.goToPay        = this.bind(this.goToPay,this);
    this.nextPage = this.bind(this.nextPage,this);
    this.prePage = this.bind(this.prePage,this);
    
    this.afterPreCreate = this.bind(this.afterPreCreate,this);
    this.state = {
		selectedMap : {},
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
		  var miInfo = this.props.miInfo;
		  var msg = "A|" + patient.medicalCardNo + "|"+ machine.hisUser + "|"+miInfo.password;
		  
		  var {data} = socket.SEND(msg);  
		  if(data && data.resultCode == '0'){
			var result =  data.recMsg||{};
			if(result.state != '0'){
				var msg = result.cwxx || '查询缴费项失败'
				baseUtil.error(msg); 
			}
			var fees = result.items||[];
			var selectedMap = {};
			var today = moment().format('YYYY-MM-DD');
			var first ;
			
			for(var fee of fees){
				var time = moment(fee.yzsj).format('YYYY-MM-DD');
				if( fee.yzlb == '4S' ||  fee.yzlb == '4B' ){//默认选中
					selectedMap[fee.zh]=fee;
					continue;
				}else if(!first){
					first = fee;
				}
				if(today == time && fee.jslx == first.jslx){//今天的 //与第一个结算类型一样的
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
//	  const {jslx,yzlb} = item;//结算类型 医嘱类别
	  const { selectedMap ,fees } = this.state;
	  const key = selectedMap[item.zh];
	  if(key && !( item.yzlb == '4S' ||  item.yzlb == '4B' )){//4s 4b无法删除
		  delete selectedMap[item.zh]
	  }else{
		  for(var fee of fees){//删除非当前结算类型 但是不是4b 4s 的选中项目
			if( (selectedMap[fee.zh] && fee.jslx != item.jslx ) && !( fee.yzlb == '4S' ||  fee.yzlb == '4B' ) ){
				delete selectedMap[fee.zh];
			}
		  }
		  selectedMap[item.zh] = item
	  }
	  this.setState({selectedMap});
  }
  goToPay () {
	baseUtil.mask('SOCKET-PRE-PAY');
	try{
		const patient = baseUtil.getCurrentPatient();
		const machine =  baseUtil.getMachineInfo();
		const { selectedMap,fees } = this.state; 
		var selectedFees=[],groupMap = {};
		var actives=[],activeMap={};
		var gMsg = '',totalAmt = 0 ;
		
		for(var fee of fees){
			if(selectedMap[fee.zh]){
				selectedFees.push(fee);
				var amt = fee.dj * fee.sl* fee.cs;
				totalAmt = totalAmt+amt;
				if(!groupMap[fee.zh]){
					groupMap[fee.zh] = fee;
					gMsg = gMsg +fee.zh+'|';
				}
				//log('诊疗活动-fee ',fee.zlhdid);
				if(!activeMap[fee.zlhdid]){//统计诊疗活动id
					actives.push(fee.zlhdid);
					//log('诊疗活动-add ',fee.zlhdid);
					activeMap[fee.zlhdid] = fee.zlhdid;
				}
			}
		}
		var msg = "B|" +  patient.medicalCardNo +'|'+ machine.hisUser + "|"+ gMsg;
		
		var { data } = socket.SEND(msg);
	    if(data && data.resultCode == '0'){
			var result = data.recMsg||{};
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
				log('诊疗活动-afterPreCreate-actives ',actives);
				this.afterPreCreate(order,selectedFees,actives);
			}
	    }else{
		  baseUtil.error("预结算失败");  
	    }
	}catch(e){
		baseUtil.error("预结算异常");   
	}
	baseUtil.unmask('SOCKET-PRE-PAY');
  }
  afterPreCreate(order,selectedFees,actives){
	if(this.props.afterPreCreate)this.props.afterPreCreate(order,selectedFees,actives);
  }
  render() {
    const btnHeight   = 120,
          listHeight  = document.body.clientHeight - 344;
    const modalWinTop  = 17;
    const { fees,selectedMap } =  this.state;
    var patient = baseUtil.getCurrentPatient();
    const unitCode = patient.unitCode ||"0000";
    const medicalCardNo = patient.medicalCardNo;
    var tip="";
    if(medicalCardNo.substring(0,2) == '01'){//01油田医保（管局）
    	tip="您是管局医保患者!";
    }
    else if(medicalCardNo.substring(0,2) == '02'){//02市政医保
    	tip="您是市政医保患者!";
    }
    else{
    	tip="您是自费患者!";
    }
    /*if(unitCode.substring(0,1) == 'Y'){
    	tip="您是医保用户 !";
	} */
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
	          	<Button text = '去缴费' disabled={totalAmt <= 0} onClick = {this.goToPay} />
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
	    		<Col span = {2} className = 'list_item needpay_titleCol' >
	    		<font>病种</font>
	    		</Col>
	    		<Col span = {3} className = 'list_item needpay_titleCol' >
	    		<font>科室</font>
	    		</Col>
	    		<Col span = {3} className = 'list_item needpay_titleCol' >
	    		<font>医生</font>
	    		</Col>
	    		<Col span = {4} className = 'list_item needpay_titleCol' >
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
			flmmc,/*分类码名称*/
			jslx,/*结算类型*/
			yzlb/*医嘱类别*/
		} = row;
		var type = "";
		if(row.jslx == ''){
			type = '普通';
		}
		else{
			type = row.jslx;
		}
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
	    		<Col span = {2} className = 'list_item needpay_titleCol' >
	    			{type}
	    		</Col>
	    		<Col span = {3} className = 'list_item needpay_titleCol' >
	    			{ksmc}
	    		</Col>
	    		<Col span = {3} className = 'list_item needpay_titleCol' >
	    			{ysxm}
	    		</Col>
	    		<Col span = {4} className = 'list_item needpay_titleCol' >
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