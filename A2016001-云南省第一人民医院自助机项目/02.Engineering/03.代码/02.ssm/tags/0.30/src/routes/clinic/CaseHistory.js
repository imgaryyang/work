import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col, Modal }  from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './CaseHistory.css';
import listStyles           from '../../components/List.css';

import Month                from '../../components/Month';
import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import BackTimer            from '../../components/BackTimer';
import Empty                from '../../components/Empty';
import PrintWin             from '../../components/PrintWin';
import Confirm              from '../../components/Confirm';
import searchIcon           from '../../assets/base/search.png';
import calendarIcon         from '../../assets/base/calendar.png';
class CaseHistory extends React.Component {
	
  constructor(props) {
    super(props);
    this.renderItems    = this.renderItems.bind(this);
    this.print          = this.print.bind(this);
    this.showDatePicker = this.showDatePicker.bind(this);
    this.onSelectDay 	= this.onSelectDay.bind(this);
    this.doSearch 		= this.doSearch.bind(this);
    this.nextPage 		= this.nextPage.bind(this);
    this.prePage 		= this.prePage.bind(this);
  }
  state = {
	  startTime: moment(new Date()).format('YYYY-MM-DD'),
	  endTime: moment(new Date()).format('YYYY-MM-DD'),
	  showDateModal:false,
	  dateField:'startTime',
	  pageNo:1,
	  pageSize: 6,
	  showWarning:false,
	  warnInfo:'',
  }
  componentDidMount () {
//	const { baseInfo } = this.props.patient;
//	if( !baseInfo.no )return;
//    this.props.dispatch({
//      type: 'medicalCase/loadCaseHistory',
//    });
    this.doSearch();
  }
  print (row) {
	  //TODO: 载入供打印的病历详情
	  const {startTime, endTime } = this.state;
	  const startTimeText = moment(startTime).format('YYYY-MM-DD')+" 00:00:00";
	  const endTimeText = moment(endTime).format('YYYY-MM-DD')+" 23:59:59";
	  row.startTime = startTimeText;
	  row.endTime = endTimeText;
//	  if(row.printCount > 0) {
//		  this.setState({warnInfo : "您已打印"+ row.printCount +"次，如需再次打印，请自行到"+ row.specName +"科分诊台处理。", showWarning:true });
//		  return;
//	  } 
	  this.props.dispatch({
		  type: 'medicalCase/print',
	      payload: { record:row },
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
	  const startTimeText = moment(startTime).format('YYYY-MM-DD')+" 00:00:00";
	  const endTimeText = moment(endTime).format('YYYY-MM-DD')+" 23:59:59";
	  const { baseInfo } = this.props.patient;
	  if( !baseInfo.no ) return;
	  this.props.dispatch({
		  type: 'medicalCase/loadCaseHistory',
	      payload: {
	    	  record:{
	    		  startTime:startTimeText,
	    		  endTime:endTimeText,
	    		  patientNo:baseInfo.no,
	    		  //patientNo:'00018999966896'
	    	  }  
	      },
	  });
  }
  render() {
	const { records,record } = this.props.medicalCase;
	const {startTime,endTime } = this.state;
	
	const { pageNo,pageSize} = this.state;
    let start = pageSize*(pageNo-1);
    let limit = pageSize*pageNo;
    const filteredRecords = records.slice(start,limit); // 输出：2
    return (
        <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem'}} >
	      <Row style = {{ paddingLeft: config.navBar.padding + 'rem',paddingRight: config.navBar.padding + 'rem'}}>
		    <Col span = {3} className = {styles.toolBarItem} style = {{textAlign: 'left',paddingRight: '.5rem'}} >开始日期</Col>
			<Col span = {6} className = {styles.toolBarItem} style = {{paddingRight: '.5rem'}} >
			  	<Card  onClick = {()=>{this.showDatePicker('startTime')}} ><img src = {calendarIcon} />{startTime}</Card>
			</Col>
			
			<Col span = {6} className = {styles.toolBarItem} style = {{paddingRight: '.5rem'}} ></Col>
			
			<Col span = {3} className = {styles.toolBarItem} style = {{textAlign: 'left',paddingRight: '.5rem'}} >结束日期</Col>
			<Col span = {6} className = {styles.toolBarItem} style = {{paddingRight: '.5rem'}} >
				<Card  onClick = {()=>{this.showDatePicker('endTime')}} ><img src = {calendarIcon} />{endTime}</Card>
			</Col>
		  </Row>
          <Row>
            <Col span = {4} className = {listStyles.title} >就诊时间</Col>
            <Col span = {4} className = {listStyles.title} >科室</Col>
            <Col span = {4} className = {listStyles.title} >医生</Col>
            <Col span = {4} className = {listStyles.title} >病种</Col>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.center} >已打印次数</Col>
            <Col span = {5} className = {listStyles.title + ' ' + listStyles.center} >操作</Col>
          </Row>
          <Card  radius = {false} className = {styles.rows} >
            {this.renderItems()}
          </Card>
          {
        	  records.length > pageSize ? (
  	        	<Row style = {{padding : config.navBar.padding + 'rem'}} >
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
      </WorkSpace>
    );
  }

  renderItems () {
	  const { records } = this.props.medicalCase;
	  const hasRecords = (records && records.length > 0 );
	  const { pageNo,pageSize} = this.state;
      let start = pageSize*(pageNo-1);
      let limit = pageSize*pageNo;
      const filteredRecords = records.slice(start,limit); // 输出：2
	  if( !hasRecords ){
		  let height = config.getWS().height - (config.navBar.padding + 10) * config.remSize;
		  return (
		  	<Row style = {{height: height + 'px', paddingLeft: config.navBar.padding + 'rem'}} >
		    	<Empty info = '暂无记录' />
		   	</Row>
		  );
	  }
	  return filteredRecords.map ( (row, idx) => {
        const { recordName,specStartTime,doctorName,doctorTypeName,specName,diseaseName,printCount } = row;
        return (
          <div key = {'_case_his_items_' + idx} className = {styles.row} >
            <Row type="flex" align="middle" >
              <Col span = {4} className = {listStyles.item} >
              {specStartTime}
              </Col>
              <Col span = {4} className = {listStyles.item} >
                {specName}
              </Col>
              <Col span = {4} className = {listStyles.item} >
                {doctorName}<br/><font style = {{fontSize: '1.8rem'}} >{doctorTypeName}</font>
              </Col>
              <Col span = {4} className = {listStyles.item} >
              	{diseaseName}
              </Col>
              <Col span = {3} className = {listStyles.item + ' ' + listStyles.center} >
                {printCount}
              </Col>
              <Col span = {5} className = {listStyles.item + ' ' + listStyles.center} >
                {
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

export default connect(({medicalCase, patient}) => ({medicalCase, patient}))(CaseHistory);





