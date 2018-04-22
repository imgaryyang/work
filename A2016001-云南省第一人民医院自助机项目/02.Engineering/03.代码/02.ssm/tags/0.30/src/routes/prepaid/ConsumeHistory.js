import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col,Modal }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './ConsumeHistory.css';
import listStyles           from '../../components/List.css';
import Week                 from '../../components/Week';
import Month                 from '../../components/Month';
import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import BackTimer            from '../../components/BackTimer';
import Empty                from '../../components/Empty';
import Confirm              from '../../components/Confirm';
import ToolBar              from '../../components/ToolBar';
import calendarIcon         from '../../assets/base/calendar.png';
import alltimeIcon          from '../../assets/base/alltime.png';
import searchIcon           from '../../assets/base/search.png';
class PrepaidHistory extends React.Component {

  constructor(props) {
    super(props);
    this.renderItems  = this.renderItems.bind(this);
    this.onSelectDay = this.onSelectDay.bind(this);
    this.showDatePicker = this.showDatePicker.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prePage = this.prePage.bind(this);
  }
  
  componentDidMount () {
	  const { baseInfo } = this.props.patient;
	  if( baseInfo.no )this.doSearch()
  }
  doSearch(){
	const {startTime,endTime } = this.state;
	const startTimeText = moment(startTime).format('YYYY-MM-DD')+' 00:00:00';
	const endTimeText = moment(endTime).format('YYYY-MM-DD')+' 23:59:59';
    this.props.dispatch({
      type: 'deposit/loadConsumeHistory',
      payload: {
        startTime:startTimeText,
        endTime:endTimeText
      },
    }); 
  }
  state = {
	  startTime: moment(new Date()).format('YYYY-MM-DD'),
	  endTime: moment(new Date()).format('YYYY-MM-DD'),
	  showDateModal:false,
	  dateField:'startTime',
	  pageNo:1,
	  pageSize : 8  ,
  };
  
  weekWinWidth = config.getWS().width - config.navBar.padding * 2 * config.remSize;
 
  modalWinTop  = config.navBar.height + config.navBar.padding * 2 + 5;

  showDatePicker(field){
	  this.setState({showDateModal:true,dateField:field});
  }
  onSelectDay(day){
	  var date = day ? moment(day).format('YYYY-MM-DD') : null;
	  const {dateField } = this.state;
	  this.state[dateField] = date;
	  this.state.showDateModal = false;
	  console.info(dateField);
	  console.info(this.state);
	  this.setState(this.state,this.doSearch);
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
	var records =this.props.deposit.consume.records;
	var title="消费记录";
	const {startTime,endTime } = this.state;
	
	const { pageNo,pageSize} = this.state;
	let start = pageSize*(pageNo-1);
	let limit = pageSize*pageNo;
	const data = records.slice(start,limit); 

    return (
        <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem'}} >
	      <Row style = {{paddingLeft: config.navBar.padding + 'rem',paddingRight: config.navBar.padding + 'rem'}}>
		    <Col span = {3} className = {styles.toolBarItem} style = {{ textAlign: 'left', paddingRight: '.5rem'}} >开始日期</Col>
			<Col span = {6} className = {styles.toolBarItem} style = {{paddingRight: '.5rem'}} >
			  	<Card  onClick = {()=>{this.showDatePicker('startTime')}} ><img src = {calendarIcon} />{startTime}</Card>
			</Col>
			
			<Col span = {6} className = {styles.toolBarItem} style = {{paddingRight: '.5rem'}} ></Col>
			
			<Col span = {3} className = {styles.toolBarItem} style = {{ textAlign: 'left', paddingRight: '.5rem'}} >结束日期</Col>
			<Col span = {6} className = {styles.toolBarItem} style = {{paddingRight: '.5rem'}} >
				<Card  onClick = {()=>{this.showDatePicker('endTime')}} ><img src = {calendarIcon} />{endTime}</Card>
			</Col>
		  </Row>
		  <Row>
	          <Col span = {8} className = {listStyles.title} >发生时间</Col>
	          <Col span = {4} className = {listStyles.title + ' ' + listStyles.center} >支付人</Col>
	          <Col span = {8} className = {listStyles.title + ' ' + listStyles.amt} >金额</Col>
	          <Col span = {4} className = {listStyles.title} >操作类型</Col>
	      </Row>
          <Card  radius = {false} className = {styles.rows} >
            {this.renderItems(data)}
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
          <Modal visible = {this.state.showDateModal} closable = {false} footer = {null} width = {this.weekWinWidth + 'px'} style = {{top: this.modalWinTop + 'rem'}} >
		    <div>
			  <Month width = {this.weekWinWidth - 32} initDate = {this.state[this.state.dateField]} onSelectDay = {this.onSelectDay} />
		    </div>
		  </Modal>	
        </WorkSpace>
    );
  }

  renderItems (records) {
    if (!records || records.length <=0){
    	let height = config.getWS().height - (config.navBar.padding + 10) * config.remSize;
      return (
        <Row style = {{height: height + 'px', paddingLeft: config.navBar.padding + 'rem'}} >
          <Empty info = '暂无记录' />
        </Row>
      )
    }
    return records.map ( (row, idx) => {
      const { patientNo, patientName, amount, type, time } = row;
      var typeName = "支付";
      const amt = parseFloat(amount||0).formatMoney();
        return (
          <div key = {'_order_items_' + idx} className = {styles.row} >
  	          <Row type="flex" align="middle" >
		          <Col span = {8} className = {listStyles.item } >
		          	{moment(time).format('YYYY-MM-DD HH:mm')}
		          </Col>
		          <Col span = {4} className = {listStyles.item +' ' + listStyles.center} >
		          	{patientName}
		          </Col>
		          <Col span = {8} className = {listStyles.item + ' ' + listStyles.amt} >
		            {amt}
		          </Col>
		          <Col span = {4} className = {listStyles.item } >
		            {typeName}
		          </Col>
	          </Row>
          </div>
        );
	});
  }
}	
export default connect(({patient,deposit}) => ({patient,deposit}))(PrepaidHistory);





