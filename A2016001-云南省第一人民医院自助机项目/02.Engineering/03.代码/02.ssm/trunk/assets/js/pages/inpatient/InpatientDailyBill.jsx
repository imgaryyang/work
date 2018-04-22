import React, { PropTypes } from 'react';
import { Row, Col, Modal }  from 'antd';
import moment               from 'moment';

import styles               from './InpatientDailyBill.css';
import listStyles           from '../../components/List.css';

import Card                 from '../../components/Card.jsx';
import Button               from '../../components/Button.jsx';
import BackTimer            from '../../components/BackTimer.jsx';
import Empty                from '../../components/Empty.jsx';
import Confirm              from '../../components/Confirm.jsx';
import ToolBar              from '../../components/ToolBar.jsx';
import InpatientCalendar    from '../../components/InpatientCalendar.jsx';
import Month                from '../../components/Month.jsx';
import NavContainer from '../../components/NavContainer.jsx';

import baseUtil from '../../utils/baseUtil.jsx';
import logUtil,{log} from '../../utils/logUtil.jsx';

const  calendarIcon = './images/base/calendar.png';

class InpatientDailyBill extends React.Component {
  
  constructor(props) {
    super(props);
    this.loadBills = this.loadBills.bind(this);
    this.renderItems      = this.renderItems.bind(this);
    this.openCalendarWin = this.openCalendarWin.bind(this);
    this.onSelectDate   = this.onSelectDate.bind(this);
    this.preDay           = this.preDay.bind(this);
    this.nextDay          = this.nextDay.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prePage = this.prePage.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onHome = this.onHome.bind(this);
    this.loadInpatientInfo = this.loadInpatientInfo.bind(this);
    this. state = {
	    selectedDate: moment(new Date()).format('YYYY-MM-DD'),
	    showCalendar: false,
	    pageNo:1,
		pageSize : 8  ,
		records:[],
		inpatientInfo:{},
	  };
  }
  onBack(){
	  baseUtil.goHome('ForegiftOrderBack'); 
  }
  onHome(){
	  baseUtil.goHome('ForegiftOrderHome'); 
  }
  componentDidMount () {
	this.loadInpatientInfo();
  }
  loadInpatientInfo(){
	var patient = baseUtil.getCurrentPatient();
	if(!patient.no)return;
	var param = {patientNo:patient.no};
	log('加载住院信息');
	let fetch = Ajax.get("/api/ssm/treat/inpatient/info",param,{catch: 3600});
	fetch.then(res => {
	  log('加载住院信息返回',res);
	  if(res && res.success){
		  var inpatientInfo = res.result||{};
		  const endDate = inpatientInfo.outDate?moment(inpatientInfo.outDate).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
		  this.setState({inpatientInfo,selectedDate:endDate},()=>{
			  this.loadBills();
		  })
	  }else if( res && res.msg ){
		  this.error(res.msg);
	  }else{
		  this.error("暂无该病人的住院信息,请核实该病人是否已经办理完入院手续");
	  }
	}).catch((ex) =>{
		baseUtil.error("无法加载住院信息");
	})
  }
  loadBills () {
	  const { inpatientInfo,selectedDate } = this.state;
	  //const { inDate, outDate } = inpatientInfo
      var query ={
      		...inpatientInfo,
      		beginDate:selectedDate+" 00:00:00",
			endDate:selectedDate+" 23:59:59",
      		//beginDate:beginDate||inDate,
      		//endDate:endDate||outDate
      };
      let fetch = Ajax.get("/api/ssm/treat/inpatient/inpatientBill/list",query,{catch: 3600});
      fetch.then(res => {
    	  if(res && res.success){
    		  var records = res.result;
    		  console.info('*****************',res.result);
    		  this.setState({records})
  	      }else{
  	    	  var msg = "查询住院清单失败";
  	    	  if( res && res.msg )msg =res.msg;
  	    	  baseUtil.error(msg);
  	      } 
      }).catch((ex) =>{
    	  baseUtil.error('查询住院清单异常');
      })  
  }

  openCalendarWin () {
    this.setState({showCalendar: true});
  }

  onSelectDate (d) {
	var date = moment(d).format('YYYY-MM-DD');
	this.setState({selectedDate:date,showCalendar:false},this.loadBills);
  }

  preDay () {
	  var date = moment(this.state.selectedDate).add('d',-1).format('YYYY-MM-DD');
	  this.setState({selectedDate:date},this.loadBills);
  }

  nextDay () {
	  var date = moment(this.state.selectedDate).add( 'd',1).format('YYYY-MM-DD');
	  this.setState({selectedDate:date},this.loadBills);
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
    const { records,inpatientInfo } = this.state;
    if (!(inpatientInfo && inpatientInfo.patientNo )){
      return (   <NavContainer title='住院日清单' onBack={this.onBack} onHome={this.onHome} ><Empty info = '暂无住院信息！' /></NavContainer> );
    }
    const weekWinWidth = document.body.clientWidth - 36;
    const modalWinTop  = 18;
    const { pageNo,pageSize} = this.state;
	let start = pageSize*(pageNo-1);
	let limit = pageSize*pageNo;
	
    const {
	    medicalRecordId/*病历ID*/,inpatientId/*住院ID*/,inpatientNo/*住院号*/,patientNo/*病人编号*/,
		patientName/*病人姓名*/,deptId/*专科编号*/,deptName/*专科名称*/,wardId/*病区ID*/,
		wardName/*病区名称*/,bedNo/*床位号*/,hospitalArea/*入院院区*/,admission/*入院情况 1:一般 2:差 3:危急*/,
		cardNo/*门诊病历号*/,inDate/*入院时间*/,outDate/*出院时间*/,sex/*病人性别*/,
		status/*状态标志 0:普通 1:挂账 2:呆账 5:特殊回归 7:普通回归 9:病区出院*/,
		idenNo/*身份证号*/,mobile/*联系电话*/,birthday/*出生日期*/,inDiagnoseNo/*入院诊断代码*/,
		inDiagnose/*入院诊断*/,payment/*自付预缴款*/,drId/*主管医生编码*/,drName/*主管医生姓名*/,
		nurId/*病区编码*/,nurName/*病区名称*/,
		nursingLevel/*护理级别 1:I级护理(常规护理)2:I级护理(优质护理)3:II级护理(常规护理)4:II级护理(优质护理)*/,
    } = inpatientInfo;
    
    const { selectedDate } = this.state;
    const endDate = outDate?moment(outDate).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
    const startDate = inDate?moment(inDate).format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
    
    var canNext = selectedDate < endDate ;
    var canPre = selectedDate > startDate ;
    
    return (
     <NavContainer title='住院日清单' onBack={this.onBack} onHome={this.onHome} >
        <Card  radius = {false} >
          <Row>
	        <Col span = {3} className = 'list_title' >姓名</Col>
	        <Col span = {7} className = 'list_item' >{patientName}</Col>
	        <Col span = {3} className = 'list_title' >住院号</Col>
	        <Col span = {4} className = 'list_item' >{inpatientNo}</Col>
	        <Col span = {3} className = 'list_title' >床位号</Col>
	        <Col span = {4} className = 'list_item' >{bedNo}</Col>
	      </Row>
	      <Row className = 'idb_brief' >
	        <Col span = {3} className = 'list_title' >病区</Col>
	        <Col span = {7} className = 'list_item' >{wardName}</Col>
	        <Col span = {3} className = 'list_title' >入院日期</Col>
	        <Col span = {4} className = 'list_item' >{moment(inDate).format('YYYY-MM-DD')}</Col>
	        <Col span = {3} className = 'list_title' >费用日期</Col>
	        <Col span = {4} className = 'list_item' >{moment(endDate).format('YYYY-MM-DD')}</Col>
	      </Row>
        </Card>
         <ToolBar style = {{paddingTop: '10px'}} >
	        <Row className = 'idb_toolBarItems' >
	          <Col span = {8} className = 'idb_toolBarItem' >
	            <Button text = "前一天" disabled={!canPre} onClick = {this.preDay} />
	          </Col>
	          <Col span = {8} className = 'idb_toolBarItem idb_date'  >
	            <Card  onClick = {this.openCalendarWin} >
	              <img src = {calendarIcon} />{this.state.selectedDate}
	            </Card>
	          </Col>
	          <Col span = {8} className = 'idb_toolBarItem' >
	            <Button text = "后一天" disabled={!canNext} onClick = {this.nextDay} />
	          </Col>
	        </Row>
	      </ToolBar>
        <Row>
          <Col span = {8} className = 'list_title' >收费项目/（规格）</Col>
          <Col span = {4} className = 'list_title list_amt' >单价</Col>
          <Col span = {4} className = 'list_title list_amt' >数量</Col>
          <Col span = {4} className = 'list_title list_amt' >金额</Col>
          <Col span = {4} className = 'list_title list_amt' >缴费状态</Col>
        </Row>
        <Card  radius = {false} className = 'idb_rows' >
          {this.renderItems()}
        </Card>
        {
       	 records.length > pageSize ? (
 	        	<Row style = {{padding :'1.5rem'}} >
 		            <Col span = {8}><Button text = "上一页" disabled={start== 0} onClick = {this.prePage} /></Col>
 		            <Col span = {8}>&nbsp;</Col>
 		            <Col span = {8} ><Button text = "下一页" disabled={limit >= records.length } onClick = {this.nextPage} /></Col>
 	            </Row>
             ):null
         }
        <Modal visible = {this.state.showCalendar} closable = {false} footer = {null} width = {this.weekWinWidth + 'px'} style = {{top: this.modalWinTop + 'rem'}} >
	      <div>
		    <Month width = {this.weekWinWidth - 32} initDate = {selectedDate} onSelectDay = {this.onSelectDate} />
	      </div>
	    </Modal>
      </NavContainer>
    );
  }
  renderItems () {
    const { records  } = this.state;
    if (!records || records.length <=0 )return null;
    
    const { pageNo,pageSize} = this.state;
	let start = pageSize*(pageNo-1);
	let limit = pageSize*pageNo;
	const data = records.slice(start,limit); 
	
    return data.map((row, idx) => {
      let {
		recipeNo     /*处方号*/,
		indeptId     /*专科ID*/,
		indeptName   /*专科名称*/,
		doctorId     /*医师ID*/,
		doctorName   /*医生姓名*/,
		itemId       /*项目ID*/,
		itemName     /*项目名称*/,
		feeType      /*分类码*/,
		dose         /*剂量*/,
		frequency    /*频次*/,
		usage        /*方法*/,
		dosage       /*每次用量*/,
		dosageSpec   /*每次用量单位*/,
		itemPrice    /*单价*/,
		itemNum      /*数量*/,
		itemSepc     /*规格*/,
		paymentStatus/*缴费状态*/,
		execStatus   /*确认状态*/, 
      } = row ;
      itemPrice = itemPrice||0;
      itemNum = itemNum||0;
      itemSepc = itemSepc?"("+itemSepc+")":"";
      const state = {'1':'收费','2':'已退','9':'退费'} 
      return (
    		  <div key = {'_daily_bill_items_' + idx} className = 'idb_row' >
	              <Row type="flex" align="middle" >
	                <Col span = {8} className = 'list_item' >{itemName}{itemSepc}</Col>
	                <Col span = {4} className = 'list_item list_amt' >
	                  {itemPrice.formatMoney()}
	                </Col>
	                <Col span = {4} className = 'list_item list_amt' >
	                  {itemNum}
	                </Col>
	                <Col span = {4} className = 'list_item list_amt' >
	                  {(itemPrice*itemNum).formatMoney() }
	                </Col>
	                <Col span = {4} className = 'list_title list_amt' >
	                  {state[paymentStatus]||""}
	                </Col>
	              </Row>
	            </div>
	          );
	        }
      );
  }
}
module.exports = InpatientDailyBill;