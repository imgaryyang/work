import React, { PropTypes } from 'react';
import { Row, Col, Modal }  from 'antd';
import moment               from 'moment';

import styles               from './AssayRecords.css';
import listStyles           from '../../components/List.css';
import Month                from '../../components/Month.jsx';
import Card                 from '../../components/Card.jsx';
import Button               from '../../components/Button.jsx';
import BackTimer            from '../../components/BackTimer.jsx';
import Empty                from '../../components/Empty.jsx';
import PrintWin             from '../../components/PrintWin.jsx';

import NavContainer from '../../components/NavContainer.jsx';

import printUtil from '../../utils/printUtil.jsx';
import baseUtil from '../../utils/baseUtil.jsx';
import polyfill from 'babel-polyfill';

const calendarIcon = './images/base/calendar.png';

class ArrayRecords extends React.Component {

  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.onHome = this.onHome.bind(this);
    this.renderItems    = this.renderItems.bind(this);
    this.forPrint = this.forPrint.bind(this);
    this.print          = this.print.bind(this);
    this.doPrint          = this.doPrint.bind(this);
    this.printCallback = this.printCallback.bind(this);
    this.showDatePicker = this.showDatePicker.bind(this);
    this.onSelectDay = this.onSelectDay.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.state = {
	  startTime: moment(new Date()).format('YYYY-MM-DD'),
	  endTime: moment(new Date()).format('YYYY-MM-DD'),
	  showDateModal:false,
	  dateField:'startTime',
	  pageNo:1,
	  pageSize : 8  ,
	  records:[],
	  imagePath:null,
	  printing:false, 
   };
  }
 
  componentDidMount () {
	const patient = baseUtil.getCurrentPatient();
	if(patient.no)this.doSearch();
  }
  onBack(){
	  baseUtil.goHome('assayBack'); 
  }
  onHome(){
	  baseUtil.goHome('assayHome'); 
  }
  forPrint(row){
	 this.setState({printing:true},()=>{
		 this.print(row);
	 }); 
  }
  print (assay) {
    let fetch = Ajax.get("/api/ssm/treat/assay/image/"+assay.barcode, {}, {catch: 3600});
	fetch.then(res => {console.info('查询图片返回 ',res);
		if (res && res.success && res.result ) {
			var imagePath = res.result.filePath;
			this.doPrint(assay,imagePath);
	  	}else{
  		   this.setState({printing:false},()=>{
  			  baseUtil.warning("无法获取报告内容，请至柜台办理打印业务！");
  		   });
	  	}
	}).catch((e)=>{
	   this.setState({printing:false},()=>{
		  baseUtil.warning("无法获取报告内容，请至柜台办理打印业务！");
	   });
    });
  }
  async doPrint(assay,imagePath){
	  printUtil.printCommonAssay(imagePath);
	  await baseUtil.sleep(8000);
	  this.printCallback(assay);
  }
  printCallback(assay){
	let fetch = Ajax.put("/api/ssm/treat/assay/printed/",assay, {catch: 3600});
	fetch.then(res => {console.info('检查单打印回传结果 ',res);
		if ( res && res.success) {
			this.setState({printing:false},()=>{
  			  this.doSearch();
  		    });
	  	}else{
  		   this.setState({printing:false},()=>{
  			  baseUtil.warning("记录打印结果失败");
  		   });
	  	}
	}).catch((e)=>{
	   this.setState({printing:false},()=>{
		  baseUtil.warning("记录打印结果失败");
	   });
    });
  }
  showDatePicker(field){console.info('showDatePicker');
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
  doSearch(){console.info('查询检查单打印列表');
	const {startTime,endTime } = this.state;
	const startTimeText = moment(startTime).format('YYYY-MM-DD');
	const endTimeText = moment(endTime).format('YYYY-MM-DD');
	const patient = baseUtil.getCurrentPatient();
	var query = {
	  dtReg:startTimeText,
	  dtEnd:endTimeText,
	  patientId:patient.no,
	  unitCode:patient.unitCode,
	  patientCardNo:patient.medicalCardNo,
	  patientType:"门诊",
   }  
	let fetch = Ajax.get("/api/ssm/treat/assay/list", query, {catch: 3600});
	fetch.then(res => {
		let records = res.result||[];
	  	return records;
	}).then((records)=>{
		this.setState({records});
	});
  }
  render() {
    const { records,imagePath,printing,startTime,endTime } = this.state;
    return (
      <NavContainer title='检查检验' onBack={this.onBack} onHome={this.onHome} >
	      <Row style = {{ paddingLeft: 1.5+ 'rem',paddingRight: 1.5+ 'rem'}}>
		    <Col span = {4} className = 'assay_toolBarItem' style = {{textAlign: 'left',paddingRight: '.5rem'}} >开始日期</Col>
			<Col span = {6} className = 'assay_toolBarItem' style = {{paddingRight: '.5rem'}} >
			  	<Card onClick = {()=>{this.showDatePicker('startTime')}} ><img src = {calendarIcon} />{startTime}</Card>
			</Col>
			
			<Col span = {4} className = 'assay_toolBarItem' style = {{paddingRight: '.5rem'}} ></Col>
			
			<Col span = {4} className = 'assay_toolBarItem' style = {{textAlign: 'left',paddingRight: '.5rem'}} >结束日期</Col>
			<Col span = {6} className = 'assay_toolBarItem' style = {{paddingRight: '.5rem'}} >
				<Card onClick = {()=>{this.showDatePicker('endTime')}} ><img src = {calendarIcon} />{endTime}</Card>
			</Col>
		  </Row>
          <Row>
            <Col span = {3} className = 'list_title' >申请时间</Col>
            <Col span = {4} className = 'list_title' >样本类型</Col>
            <Col span = {10} className = 'list_title' >检查科目</Col>
            <Col span = {7} className = 'list_title list_center' >操作</Col>
          </Row>
          <Card radius = {false} className = 'assay_rows' >
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
    const { records } = this.state;
    const hasRecords = (records && records.length > 0 );
    
    if( !hasRecords ){
    	let height = document.body.clientHeight - (1.5+ 10) * 12;
    	return (
	    	<Row style = {{height: height + 'px', paddingLeft: 1.5+ 'rem'}} >
	          <Empty info = '暂无记录' />
	        </Row>
	    );
    }
    
    return records.map ( (row, idx) => {
        const { barcode,machineId,sampleId,sampleType,testdate,applydate,patientGender,patientAge,subjectCode,subjectName} = row;
        	
        return (
          <div key = {'_appt_items_' + idx} className = 'assay_row' >
            <Row type="flex" align="middle" >
              <Col span = {3} className = 'list_item list_nowrap' style = {{fontSize: '1.8rem'}} >
                {moment(applydate).format('YYYY-MM-DD')}
              </Col>
              <Col span = {4} className = 'list_item' >
                {sampleType}
              </Col>
              <Col span = {10} className = 'list_item' >
                {subjectName}
              </Col>
              <Col span = {7} className = 'list_item list_center' >
              {// disabled = {true}
              	<Button text = "打印" style = {{fontSize: '2.5rem'}} onClick = {() => this.forPrint(row)} />
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