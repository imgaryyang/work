import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Modal }  from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './AssayRecords.css';
import listStyles           from '../../components/List.css';
import Month                from '../../components/Month';
import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import BackTimer            from '../../components/BackTimer';
import Empty                from '../../components/Empty';
import PrintWin             from '../../components/PrintWin';
import searchIcon           from '../../assets/base/search.png';
import calendarIcon         from '../../assets/base/calendar.png';

class ArrayRecords extends React.Component {

  constructor(props) {
    super(props);
    this.renderItems    = this.renderItems.bind(this);
    this.print          = this.print.bind(this);
    this.showDatePicker = this.showDatePicker.bind(this);
    this.onSelectDay = this.onSelectDay.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }
  state = {
	  startTime: moment(new Date()).format('YYYY-MM-DD'),
	  endTime: moment(new Date()).format('YYYY-MM-DD'),
	  showDateModal:false,
	  dateField:'startTime',
	  pageNo:1,
	  pageSize : 8  ,
  };
  componentDidMount () {
//		 AssayRecord param = new  AssayRecord();
//		 param.setDtEnd("2017-04-15");
//		 param.setDtReg("2017-04-01");
//		 param.setPatientId("0003463433");
//		 param.setPatientType("门诊");
	this.doSearch();
  }

  print (row) {
    this.props.dispatch({
      type: 'assay/print',
      payload: {  record:row },
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
	  this.setState(this.state,this.doSearch);
  }
  doSearch(){
	const {startTime,endTime } = this.state;
	const startTimeText = moment(startTime).format('YYYY-MM-DD');
	const endTimeText = moment(endTime).format('YYYY-MM-DD');
	const { baseInfo } = this.props.patient;
    this.props.dispatch({
      type: 'assay/loadAssayRecords',
      payload: {
    	  record:{
    		  dtReg:startTimeText,
    		  dtEnd:endTimeText,
    		  patientId:baseInfo.no,
    		   //patientId:'00018925634896',
    		  patientType:"门诊",
    	  }  
      },
    });
  }
  render() {
    const { records,imagePath,printing } = this.props.assay;
	const {startTime,endTime } = this.state;
    return (
        <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem'}} >
	      <Row style = {{ paddingLeft: config.navBar.padding + 'rem',paddingRight: config.navBar.padding + 'rem'}}>
		    <Col span = {4} className = {styles.toolBarItem} style = {{textAlign: 'left',paddingRight: '.5rem'}} >开始日期</Col>
			<Col span = {6} className = {styles.toolBarItem} style = {{paddingRight: '.5rem'}} >
			  	<Card onClick = {()=>{this.showDatePicker('startTime')}} ><img src = {calendarIcon} />{startTime}</Card>
			</Col>
			
			<Col span = {4} className = {styles.toolBarItem} style = {{paddingRight: '.5rem'}} ></Col>
			
			<Col span = {4} className = {styles.toolBarItem} style = {{textAlign: 'left',paddingRight: '.5rem'}} >结束日期</Col>
			<Col span = {6} className = {styles.toolBarItem} style = {{paddingRight: '.5rem'}} >
				<Card onClick = {()=>{this.showDatePicker('endTime')}} ><img src = {calendarIcon} />{endTime}</Card>
			</Col>
		  </Row>
          <Row>
            <Col span = {3} className = {listStyles.title} >申请时间</Col>
            <Col span = {4} className = {listStyles.title} >样本类型</Col>
            <Col span = {10} className = {listStyles.title} >检查科目</Col>
            <Col span = {7} className = {listStyles.title + ' ' + listStyles.center} >操作</Col>
          </Row>
          <Card radius = {false} className = {styles.rows} >
            {this.renderItems()}
          </Card>
          <PrintWin visible = {printing} />
          <Modal visible = {this.state.showDateModal} closable = {false} footer = {null} width = {this.weekWinWidth + 'px'} style = {{top: this.modalWinTop + 'rem'}} >
		    <div>
			  <Month width = {this.weekWinWidth - 32} initDate = {this.state[this.state.dateField]} onSelectDay = {this.onSelectDay} />
		    </div>
		  </Modal>	
      </WorkSpace>
    );
  }

  renderItems () {
    const { records } = this.props.assay;
    const hasRecords = (records && records.length > 0 );
    
    if( !hasRecords ){
    	let height = config.getWS().height - (config.navBar.padding + 10) * config.remSize;
    	return (
	    	<Row style = {{height: height + 'px', paddingLeft: config.navBar.padding + 'rem'}} >
	          <Empty info = '暂无记录' />
	        </Row>
	    );
    }
    
    return records.map ( (row, idx) => {
        const { barcode,machineId,sampleId,sampleType,testdate,applydate,patientGender,patientAge,subjectCode,subjectName} = row;
        	
        return (
          <div key = {'_appt_items_' + idx} className = {styles.row} >
            <Row type="flex" align="middle" >
              <Col span = {3} className = {listStyles.item + ' ' + listStyles.nowrap} style = {{fontSize: '1.8rem'}} >
                {moment(applydate).format('YYYY-MM-DD')}
              </Col>
              <Col span = {4} className = {listStyles.item} >
                {sampleType}
              </Col>
              <Col span = {10} className = {listStyles.item} >
                {subjectName}
              </Col>
              <Col span = {7} className = {listStyles.item + ' ' + listStyles.center} >
              {// disabled = {true}
              	<Button text = "打印" style = {{fontSize: '2.5rem'}} onClick = {() => this.print(row)} />
              }
              </Col>
            </Row>
          </div>
        );
      }
    );
  }
}

export default connect(({assay,patient}) => ({assay,patient}))( ArrayRecords );





