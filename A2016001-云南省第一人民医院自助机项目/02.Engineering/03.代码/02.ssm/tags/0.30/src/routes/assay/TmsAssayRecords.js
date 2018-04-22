import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col,Modal }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './AssayRecords.css';
import listStyles           from '../../components/List.css';
import Month                 from '../../components/Month';
import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import BackTimer            from '../../components/BackTimer';
import Empty                from '../../components/Empty';
import PrintWin             from '../../components/PrintWin';
import searchIcon           from '../../assets/base/search.png';
import TmsResult           from './TmsResult';
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
      type: 'assay/printTms',
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
	const startTimeText = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
	const endTimeText = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
	const { baseInfo } = this.props.patient;
    this.props.dispatch({
      type: 'assay/loadTmsRecords',
      payload: {
    	  record:{
    		  startDate:startTimeText,
    		  endDate:endTimeText,
    		  patientNo:baseInfo.no,
//    		  patientNo:'LS10171127',
    	  }  
      },
    });
  }
  showCheckResult(row){
	  this.props.dispatch({
	      type: 'assay/loadTmsDetails',
	      payload: {
	    	  record:row
	      },
	  });
  }
  render() {
    const { tmsRecords,tmsRecord,printing } = this.props.assay;
	const {startTime,endTime } = this.state;
	const height = config.getWS().height - 11 * config.remSize+ 'px';
    return (
        <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem'}} >
	     {
	      <Row style = {{ paddingLeft: config.navBar.padding + 'rem',paddingRight: config.navBar.padding + 'rem'}}>
		    <Col span = {4} className = {styles.toolBarItem} style = {{paddingRight: '.5rem'}} >开始日期</Col>
			<Col span = {6} className = {styles.toolBarItem} style = {{paddingRight: '.5rem'}} >
			  	<Card onClick = {()=>{this.showDatePicker('startTime')}} ><img src = {searchIcon} />{startTime}</Card>
			</Col>
			
			<Col span = {4} className = {styles.toolBarItem} style = {{paddingRight: '.5rem'}} ></Col>
			
			<Col span = {4} className = {styles.toolBarItem} style = {{paddingRight: '.5rem'}} >结束日期</Col>
			<Col span = {6} className = {styles.toolBarItem} style = {{paddingRight: '.5rem'}} >
				<Card shadow = {true} onClick = {()=>{this.showDatePicker('endTime')}} ><img src = {searchIcon} />{endTime}</Card>
			</Col>
		  </Row>
	     }
          <Row>
            <Col span = {4} className = {listStyles.title} >申请时间</Col>
            <Col span = {3} className = {listStyles.title} >检查科室</Col>
            <Col span = {5} className = {listStyles.title} >检查科目</Col>
            <Col span = {3} className = {listStyles.title} >检查医生</Col>
            <Col span = {2} className = {listStyles.title} >状态</Col>
            <Col span = {3} className = {listStyles.title} >打印次数</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.center} >操作</Col>
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
		  <Modal visible = {tmsRecord?true:false} height={height} closable = {false} footer = {null} width = {this.weekWinWidth + 'px'} style = {{top: this.modalWinTop + 'rem'}} >
		  	<TmsResult />
		  </Modal>
		  
      </WorkSpace>
    );
  }

  renderItems () {
    const { tmsRecords } = this.props.assay;
    const hasRecords = (tmsRecords && tmsRecords.length > 0 );
    
    if( !hasRecords ){
    	let height = config.getWS().height - (config.navBar.padding + 10) * config.remSize;
    	return (
	    	<Row style = {{height: height + 'px', paddingLeft: config.navBar.padding + 'rem'}} >
	          <Empty info = '暂无记录' />
	        </Row>
	    );
    }
    
    return tmsRecords.map ( (row, idx) => {
        const {orderno, patientNo,jymodelname,patientName, patientDeptname,orderdate,jsdoctor, patientSex,startDate, endDate, state, printtimes} = row;
        var doctor = jsdoctor.split('|')[1];
        return (
          <div key = {'_appt_items_' + idx} className = {styles.row} >
            <Row type="flex" align="middle" >
              <Col span = {4} className = {listStyles.item + ' ' + listStyles.nowrap} style = {{fontSize: '1.8rem'}} >
                {moment(orderdate).format('YYYY-MM-DD HH:mm')}
              </Col>
              <Col span = {3} className = {listStyles.item} >
                {patientDeptname}
              </Col>
              <Col span = {5} className = {listStyles.item} >
                {jymodelname}
              </Col>
              <Col span = {3} className = {listStyles.item} >
	            {doctor}
	          </Col>
	          <Col span = {2} className = {listStyles.item} >
	            {state == '1' ? '已签收' : (state == '2' ? '已检验' : (state == '3' ? '已审核' : '已出结果'))}
	          </Col>
	          <Col span = {3} className = {listStyles.item} >
	            {printtimes}
	          </Col>
              <Col span = {4} className = {listStyles.item + ' ' + listStyles.center} >
              {
            	  <Button text = "打印" style = {{fontSize: '2.5rem'}} onClick = {() => this.print(row)} />
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

export default connect(({assay,patient}) => ({assay,patient}))( ArrayRecords );





