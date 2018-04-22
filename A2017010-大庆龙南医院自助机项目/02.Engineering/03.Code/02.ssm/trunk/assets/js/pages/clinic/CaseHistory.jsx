import React, { PropTypes } from 'react';
import { Row, Col, Modal }  from 'antd';
import moment               from 'moment';

import styles               from './CaseHistory.css';
import listStyles           from '../../components/List.css';

import Month                from '../../components/Month.jsx';
import Card                 from '../../components/Card.jsx';
import Button               from '../../components/Button.jsx';
import Empty                from '../../components/Empty.jsx';
import PrintWin             from '../../components/PrintWin.jsx';
import Confirm              from '../../components/Confirm.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import TimerModule from '../../TimerModule.jsx';
import printUtil from '../../utils/printUtil.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import polyfill from 'babel-polyfill';

const calendarIcon = './images/base/calendar.png';
class CaseHistory extends TimerModule {
	
  constructor(props) {
    super(props);
    this.onBack = this.bind(this.onBack,this);
    this.onHome = this.bind(this.onHome,this);
    this.renderItems    = this.bind(this.renderItems,this);
    this.loadDetail = this.bind(this.loadDetail,this);
    this.print          = this.bind(this.print,this);
    this.showDatePicker = this.bind(this.showDatePicker,this);
    this.onSelectDay 	= this.bind(this.onSelectDay,this);
    this.doSearch 		= this.bind(this.doSearch,this);
    this.nextPage 		= this.bind(this.nextPage,this);
    this.prePage 		= this.bind(this.prePage,this);
    var limit = baseUtil.getSysConfig('case.print.limit',2);
    this.state = {
		  startTime: moment(new Date()).format('YYYY-MM-DD'),
		  endTime: moment(new Date()).format('YYYY-MM-DD'),
		  showDateModal:false,
		  dateField:'startTime',
		  pageNo:1,
		  pageSize: 6,
		  showWarning:false,
		  warnInfo:'',
		  records:[],
		  record:null, 
	  }
  }
 
  componentDidMount () {
	var patient = baseUtil.getCurrentPatient();
    if(patient.no)this.doSearch();
  }
  onBack(){
	  baseUtil.goHome('caseBack'); 
  }
  onHome(){
	  baseUtil.goHome('caseHome'); 
  }
  loadDetail(row){
	  const {startTime, endTime,limit } = this.state;
	  const startTimeText = moment(startTime).format('YYYY-MM-DD')+" 00:00:00";
	  const endTimeText = moment(endTime).format('YYYY-MM-DD')+" 23:59:59";
	  row.startTime = startTimeText;
	  row.endTime = endTimeText;
	  if(row.printCount > limit) {
		  this.setState({warnInfo : "您已打印"+ row.printCount +"次，如需再次打印，请自行到"+ row.specName +"科分诊台处理。", showWarning:true });
		  return;
	  } 
	  
	  let fetch = Ajax.get("/api/ssm/treat/medicalRecord/info", row, {catch: 3600});
	  fetch.then(res => {
		if(!(res && res.success && res.result )){
	  		baseUtil.error("无法获取报告内容，请至柜台办理打印业务！");
	  		return;
		}
		try{
			var content = res.result.content;
			var array = JSON.parse(content);
			var msg = array[0].RecordHTML;
			this.setState({record:row},()=>{
				this.print(msg);
			});
		}catch(e){
			console.info(e);
			baseUtil.error("病历格式错误，请至柜台办理打印业务！");
  		}
	  }).catch((e)=>{
		  baseUtil.error("无法获取报告内容，请至柜台办理打印业务！");
	  });
  }
  async print (msg) { //TODO: 载入供打印的病历详情
	try{
		printUtil.printMedicalRecord(msg);
		await baseUtil.sleep(8000);
	}catch(e){
		baseUtil.error("打印机异常，请联系工作人员");
		return;
	}
	const { record } = this.state;
	console.info('print record ',record);
	let fetch = Ajax.put("/api/ssm/treat/medicalRecord/print/"+record.recordId, {}, {catch: 3600});
	fetch.then(res => {
	  if(res && res.success ){
		  this.setState({record:null},()=>{
			  this.doSearch();
		  });
	  }else{
		  this.setState({record:null},()=>{
			  baseUtil.warning("打印结果记录失败,请联系管理员");
		  });
	  }
    }).catch((e)=>{
    	this.setState({record:null},()=>{
    		baseUtil.warning("无法获取报告内容，请至柜台办理打印业务！");
		});
    });
  }
  nextPage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo+1});
  }
  prePage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo-1});
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
  doSearch(){
	  const {startTime,endTime } = this.state;
	  const startTimeText = moment(startTime).format('YYYY-MM-DD')+" 00:00:00";
	  const endTimeText = moment(endTime).format('YYYY-MM-DD')+" 23:59:59";
	  const patient = baseUtil.getCurrentPatient();
	  
	  var query = {
		  startTime:startTimeText,
		  endTime:endTimeText,
		  patientNo:patient.no,	  
	  }
	  
	  let fetch = Ajax.get("/api/ssm/treat/medicalRecord/list", query, {catch: 3600});
	  fetch.then(res => {
		let records = res.result||[];
    	return records;
	  }).then((records)=>{
		this.setState({records});
	  });
  }
  render() {
	const {startTime,endTime , records,record } = this.state;
	
	const { pageNo,pageSize} = this.state;
    let start = pageSize*(pageNo-1);
    let limit = pageSize*pageNo;
    const filteredRecords = records.slice(start,limit); // 输出：2
    return (
      <NavContainer title='门诊病历' onBack={this.onBack} onHome={this.onHome} >
	      <Row style = {{ paddingLeft: '1.5rem',paddingRight:'1.5rem'}}>
		    <Col span = {3} className = 'case_toolBarItem' style = {{textAlign: 'left',paddingRight: '.5rem'}} >开始日期</Col>
			<Col span = {6} className = 'case_toolBarItem' style = {{paddingRight: '.5rem'}} >
			  	<Card  onClick = {()=>{this.showDatePicker('startTime')}} ><img src = {calendarIcon} />{startTime}</Card>
			</Col>
			
			<Col span = {6} className = 'case_toolBarItem' style = {{paddingRight: '.5rem'}} ></Col>
			
			<Col span = {3} className = 'case_toolBarItem' style = {{textAlign: 'left',paddingRight: '.5rem'}} >结束日期</Col>
			<Col span = {6} className = 'case_toolBarItem' style = {{paddingRight: '.5rem'}} >
				<Card  onClick = {()=>{this.showDatePicker('endTime')}} ><img src = {calendarIcon} />{endTime}</Card>
			</Col>
		  </Row>
          <Row>
            <Col span = {4} className = 'list_title' >就诊时间</Col>
            <Col span = {4} className = 'list_title' >科室</Col>
            <Col span = {4} className = 'list_title' >医生</Col>
            <Col span = {4} className = 'list_title' >病种</Col>
            <Col span = {3} className = 'list_title list_center' >已打印次数</Col>
            <Col span = {5} className = 'list_title list_center' >操作</Col>
          </Row>
          <Card  radius = {false} className = 'case_rows' >
            {this.renderItems()}
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
          <PrintWin visible = {record?true:false} />
          <Modal visible = {this.state.showDateModal} closable = {false} footer = {null} width = {this.weekWinWidth + 'px'} style = {{top: this.modalWinTop + 'rem'}} >
		    <div>
			  <Month width = {this.weekWinWidth - 32} initDate = {this.state[this.state.dateField]} onSelectDay = {this.onSelectDay} />
		    </div>
		  </Modal>
		  <Confirm info = {this.state.warnInfo} visible = {this.state.showWarning} 
        	buttons = {[{text: '确定', onClick: () => this.setState({showWarning: false}) },]}
		  />
      </NavContainer>
    );
  }

  renderItems () {
	  const { pageNo,pageSize,records} = this.state;
	  const hasRecords = (records && records.length > 0 );
	  
      let start = pageSize*(pageNo-1);
      let limit = pageSize*pageNo;
      const filteredRecords = records.slice(start,limit); // 输出：2
	  if( !hasRecords ){
		  let height = document.body.clientHeight - 138;
		  return (
		  	<Row style = {{height: height + 'px', paddingLeft:  '1.5rem'}} >
		    	<Empty info = '暂无记录' />
		   	</Row>
		  );
	  }
	  return filteredRecords.map ( (row, idx) => {
        const { recordName,specStartTime,doctorName,doctorTypeName,specName,diseaseName,printCount } = row;
        return (
          <div key = {'_case_his_items_' + idx} className = 'case_row' >
            <Row type="flex" align="middle" >
              <Col span = {4} className = 'list_item' >
              {specStartTime}
              </Col>
              <Col span = {4} className = 'list_item' >
                {specName}
              </Col>
              <Col span = {4} className = 'list_item' >
                {doctorName}<br/><font style = {{fontSize: '1.8rem'}} >{doctorTypeName}</font>
              </Col>
              <Col span = {4} className = 'list_item' >
              	{diseaseName}
              </Col>
              <Col span = {3} className = 'list_item list_center' >
                {printCount}
              </Col>
              <Col span = {5} className = 'list_item list_center' >
                {
                	<Button text = "打印" style = {{fontSize: '2.5rem'}} onClick = {() => this.loadDetail(row)} />
                }
              </Col>
            </Row>
          </div>
        );
      }
    );
  }
}
module.exports = CaseHistory;