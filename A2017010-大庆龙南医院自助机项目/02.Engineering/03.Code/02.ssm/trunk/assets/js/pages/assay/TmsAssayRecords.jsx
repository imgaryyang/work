import React, { PropTypes } from 'react';
import { Row, Col,Modal }         from 'antd';
import moment               from 'moment';

import styles               from './TmsAssayRecords.css';
import listStyles           from '../../components/List.css';

import Month                 from '../../components/Month.jsx';
import Card                 from '../../components/Card.jsx';
import Button               from '../../components/Button.jsx';
import BackTimer            from '../../components/BackTimer.jsx';
import Empty                from '../../components/Empty.jsx';
import PrintWin             from '../../components/PrintWin.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import TimerModule from '../../TimerModule.jsx';
import printUtil from '../../utils/printUtil.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import polyfill from 'babel-polyfill';
const searchIcon = './images/base/search.png';

class ArrayRecords extends TimerModule {

  constructor(props) {
    super(props);
    this.onBack = this.bind(this.onBack,this);
    this.onHome = this.bind(this.onHome,this);
    this.renderItems    = this.bind(this.renderItems,this);
    this.print          = this.bind(this.print,this);
    this.showDatePicker = this.bind(this.showDatePicker,this);
    this.onSelectDay = this.bind(this.onSelectDay,this);
    this.doSearch = this.bind(this.doSearch,this);
    this.forPrint = this.bind(this.forPrint,this);
    this.doPrint = this.bind(this.doPrint,this);
    this.print = this.bind(this.print,this);
    this.printCallback = this.bind(this.printCallback,this);
    this.state = {
	  startTime: moment(new Date()).format('YYYY-MM-DD'),
	  endTime: moment(new Date()).format('YYYY-MM-DD'),
	  showDateModal:false,
	  dateField:'startTime',
	  pageNo:1,
	  pageSize : 8  ,
	  tmsRecords:[],
	  tmsRecord:null,
	  printing :false,
    };
  }
 
  componentDidMount () {
	const patient = baseUtil.getCurrentPatient();
	if(patient.no)this.doSearch();
  }
  onBack(){
	  baseUtil.goHome('tmsBack'); 
  }
  onHome(){
	  baseUtil.goHome('tmsHome'); 
  }
  forPrint(row) {
	 this.setState({printing:true},()=>{
		 this.print(row);
	 });
  }
  print(row){
	  const { id } = row ;
	  let fetch = Ajax.get( '/api/ssm/treat/assay/tms/details/'+id.orderno + "/" + id.itemCode, {}, {catch: 3600});
	  fetch.then(res => {
		if(!(res && res.success && res.result )){
			this.setState({printing:false},()=>{
				baseUtil.error("无法获取报告内容，请至柜台办理打印业务！");
			});
	  		return;
		}
		try{
			var tmsRecord = {...row,details:res.result||[]};
			this.doPrint(tmsRecord);
		}catch(e){
			console.info(e);
			this.setState({printing:false},()=>{
				baseUtil.error("打印检验报告错误，请至柜台办理打印业务！");
			});
		}
	  }).catch((e)=>{
		  this.setState({printing:false},()=>{
			  baseUtil.error("无法获取报告内容，请至柜台办理打印业务！");
		  });
	  });
  }
  async doPrint(tmsRecord){
	printUtil.printBloodAssay(tmsRecord);
	await baseUtil.sleep(8000);
	this.printCallback(tmsRecord);
  }
  printCallback(tmsRecord){
	  const { id } = tmsRecord ;
	  this.setState({printing:false},()=>{
		  let fetch = Ajax.put( '/api/ssm/treat/assay/tms/print/'+id.orderno + "/" + id.itemCode, {}, {catch: 3600});
		  fetch.then(res => {console.info('打印回传结果 ',res);
			if (res && res.success ) {
	    		if(res.msg == "1"){//成功
	    		  this.doSearch();
	    		}else{//失败  if(res.msg == "0")
	    		  baseUtil.warning("打印结果记录失败,请至柜台办理打印业务！");	
	    		}
	    	}else{
	    		baseUtil.warning("打印结果记录失败,请至柜台办理打印业务！");
	    	}
		  }).catch((e)=>{
			  this.setState({printing:false},()=>{
				  baseUtil.warning("无法获取报告内容，请至柜台办理打印业务！");
			  });
		  });
	  });
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
	const startTimeText = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
	const endTimeText = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
	const  patient = baseUtil.getCurrentPatient();
	
	var  query = {
		  startDate:startTimeText,
		  endDate:endTimeText,
		  patientNo:patient.no,
//		  patientNo:'LS10171127',
	  }  
	let fetch = Ajax.get("/api/ssm/treat/assay/tms/list", query, {catch: 3600});
	fetch.then(res => {
		let tmsRecords = res.result||[];
	  	return tmsRecords;
	}).then((tmsRecords)=>{
		this.setState({tmsRecords});
	});
  }
  showCheckResult(row){
  }
  render() {
    const { tmsRecords,tmsRecord,printing } = this.state;
	const {startTime,endTime } = this.state;
	const height = document.body.clientHeight - 11 * 12+ 'px';
    return (
      <NavContainer title='血液科检查' onBack={this.onBack} onHome={this.onHome} >
	     {
	      <Row style = {{ paddingLeft: 1.5 + 'rem',paddingRight: 1.5 + 'rem'}}>
		    <Col span = {4} className = 'tms_assay_toolBarItem' style = {{paddingRight: '.5rem'}} >开始日期</Col>
			<Col span = {6} className = 'tms_assay_toolBarItem' style = {{paddingRight: '.5rem'}} >
			  	<Card onClick = {()=>{this.showDatePicker('startTime')}} ><img src = {searchIcon} />{startTime}</Card>
			</Col>
			
			<Col span = {4} className = 'tms_assay_toolBarItem' style = {{paddingRight: '.5rem'}} ></Col>
			
			<Col span = {4} className = 'tms_assay_toolBarItem' style = {{paddingRight: '.5rem'}} >结束日期</Col>
			<Col span = {6} className = 'tms_assay_toolBarItem' style = {{paddingRight: '.5rem'}} >
				<Card shadow = {true} onClick = {()=>{this.showDatePicker('endTime')}} ><img src = {searchIcon} />{endTime}</Card>
			</Col>
		  </Row>
	     }
          <Row>
            <Col span = {4} className = 'list_title' >申请时间</Col>
            <Col span = {3} className = 'list_title' >检查科室</Col>
            <Col span = {5} className = 'list_title' >检查科目</Col>
            <Col span = {3} className = 'list_title' >检查医生</Col>
            <Col span = {2} className = 'list_title' >状态</Col>
            <Col span = {3} className = 'list_title' >打印次数</Col>
            <Col span = {4} className = 'list_title list_center' >操作</Col>
          </Row>
          <Card radius = {false} className = 'tms_assay_rows' >
            {this.renderItems()}
          </Card>
          <PrintWin visible = {printing} />
          <Modal visible = {this.state.showDateModal} closable = {false} footer = {null} width = {this.weekWinWidth + 'px'} style = {{top: this.modalWinTop + 'rem'}} >
		    <div>
			  <Month width = {this.weekWinWidth - 32} initDate = {this.state[this.state.dateField]} onSelectDay = {this.onSelectDay} />
		    </div>
		  </Modal>
      </NavContainer>
    );
  }

  renderItems () {
    const { tmsRecords } = this.state;
    const hasRecords = (tmsRecords && tmsRecords.length > 0 );
    
    if( !hasRecords ){
    	let height = document.body.clientHeight - (1.5 + 10) * 12;
    	return (
	    	<Row style = {{height: height + 'px', paddingLeft: 1.5 + 'rem'}} >
	          <Empty info = '暂无记录' />
	        </Row>
	    );
    }
    
    return tmsRecords.map ( (row, idx) => {
        const {orderno, patientNo,jymodelname,patientName, patientDeptname,orderdate,jsdoctor, patientSex,startDate, endDate, state, printtimes} = row;
        var doctor = jsdoctor.split('|')[1];
        return (
          <div key = {'_appt_items_' + idx} className = 'tms_assay_row' >
            <Row type="flex" align="middle" >
              <Col span = {4} className = 'list_item list_nowrap' style = {{fontSize: '1.8rem'}} >
                {moment(orderdate).format('YYYY-MM-DD HH:mm')}
              </Col>
              <Col span = {3} className = 'list_item' >
                {patientDeptname}
              </Col>
              <Col span = {5} className = 'list_item' >
                {jymodelname}
              </Col>
              <Col span = {3} className = 'list_item' >
	            {doctor}
	          </Col>
	          <Col span = {2} className = 'list_item' >
	            {state == '1' ? '已签收' : (state == '2' ? '已检验' : (state == '3' ? '已审核' : '已出结果'))}
	          </Col>
	          <Col span = {3} className = 'list_item' >
	            {printtimes}
	          </Col>
              <Col span = {4} className = 'list_item list_center' >
              {
            	  <Button text = "打印" style = {{fontSize: '2.5rem'}} onClick = {() => this.forPrint(row)} />
            	  /*state == '3' ? (
            	    <Button text = "打印" style = {{fontSize: '2.5rem'}} onClick = {() => this.print(row)} />
            	  ) : null*/
            	  
//                <Row>
//	                <Col span = {16} style = {{paddingRight: '.5rem'}} >
//	                  <Button text = "查看结果" style = {{fontSize: '2.5rem'}} onClick = {() => this.showCheckResult(row)} />
//	                </Col>
//	                <Col span = {8} style = {{paddingLeft: '.5rem'}} >
//	                  <Button text = "打印" style = {{fontSize: '2.5rem'}} onClick = {() => this.print(row)} />
//	                </Col>
//                </Row>
              }
              </Col>
            </Row>
          </div>
        );
      }
    );
  }
}
module.exports = ArrayRecords;