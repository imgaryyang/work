import React, { PropTypes } from 'react';
import { Row, Col,Modal } from 'antd';
import moment               from 'moment';

import styles               from './ConsumeHistory.css';
import listStyles           from '../../components/List.css';
import Week                 from '../../components/Week.jsx';
import Month                 from '../../components/Month.jsx';
import Card                 from '../../components/Card.jsx';
import Button               from '../../components/Button.jsx';
import BackTimer            from '../../components/BackTimer.jsx';
import Empty                from '../../components/Empty.jsx';
import Confirm              from '../../components/Confirm.jsx';
import ToolBar              from '../../components/ToolBar.jsx';
import NavContainer from '../../components/NavContainer.jsx';
import baseUtil from '../../utils/baseUtil.jsx';

const calendarIcon = './images/base/calendar.png';

class FeeHistory extends React.Component {

  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.onHome = this.onHome.bind(this);
    this.renderItems  = this.renderItems.bind(this);
    this.onSelectDay = this.onSelectDay.bind(this);
    this.showDatePicker = this.showDatePicker.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prePage = this.prePage.bind(this);
    this.state ={ 
      records:[],
      startTime: moment(new Date()).format('YYYY-MM-DD'),
  	  endTime: moment(new Date()).format('YYYY-MM-DD'),
  	  showDateModal:false,
  	  dateField:'startTime',
  	  pageNo:1,
  	  pageSize:5,
    }
  }
  
  componentDidMount () {
	  const patient = baseUtil.getCurrentPatient();
	 	  if( patient.no )this.doSearch()
  }
  onBack(){
	  baseUtil.goHome('consumeHisBack'); 
  }
  onHome(){
	  baseUtil.goHome('consumeHisHome'); 
  }
  doSearch(){
	const {startTime,endTime } = this.state;
	if(startTime>endTime){
		baseUtil.warning("请选择正确的时间段");
		}
	const patient = baseUtil.getCurrentPatient();
	var brbh=patient.no;
	var query = {
	  brbh,
	  startTime,
	  endTime,		
	}
	let fetch = Ajax.get("/api/ssm/treat/deposit/records/feeHistory",query,{catch: 3600});
	fetch.then(res => {
	  if(res && res.success){
		  var records = res.result||[];
		  this.setState({records},()=>{
		 console.log("返回信息",this.state.records)});
	  }else if( res && res.msg ){
		  baseUtil.error(res.msg);
	  }else{
		  baseUtil.error("查询门诊收费清单出错");
	  }
	}).catch((ex) =>{
		baseUtil.error("查询门诊收费清单异常");
	})  
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
  nextPage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo+1});
  }
  prePage(){
	  const { pageNo } =this.state;
	  this.setState({pageNo:pageNo-1});
  }
  render() {
    const  weekWinWidth = document.body.clientWidth - 36;
	const  modalWinTop  = 18;
	
	var {records,startTime,endTime, pageNo,pageSize } = this.state;
	let start = pageSize*(pageNo-1);
	let limit = pageSize*pageNo;
	const patient = baseUtil.getCurrentPatient();
	const data = records.slice(start,limit);
	var payAmt=0.00;
	for(var i=0;i<records.length;i++){
			payAmt=parseFloat(payAmt)+parseFloat(records[i].je);
		//	console.log("payAmt:"+payAmt);	
	}
	
    return (
      <NavContainer title='门诊收费清单' onBack={this.onBack} onHome={this.onHome} >
      <Card  style = {{marginBottom: '2rem',fontSize: '3rem'}} >
		<span>
			当前患者<font style = {{color: '#DB5A5A', fontSize: '4.5rem'}} >{patient.name}</font>,
			账户余额<font style = {{color: '#BC1E1E', fontSize: '4rem'}} >{(patient.balance||0).formatMoney()}</font>&nbsp;&nbsp;元,&nbsp;&nbsp;&nbsp;
			<font style = {{color: '#DB5A5A', fontSize: '4rem'}} >如需打印请到指定窗口</font>
		</span>
	  </Card>
	      <Row style = {{paddingLeft: '1.5rem',paddingRight: '1.5rem'}}>
		    <Col span = {3} className = 'comsume_toolBarItem' style = {{ textAlign: 'left', paddingRight: '.5rem'}} >开始日期</Col>
			<Col span = {6} className = 'comsume_toolBarItem' style = {{paddingRight: '.5rem'}} >
			  	<Card  onClick = {()=>{this.showDatePicker('startTime')}} ><img src = {calendarIcon} />{startTime}</Card>
			</Col>
			<Col span = {6} className = 'comsume_toolBarItem'>消费<font style = {{color: '#BC1E1E', fontSize: '4rem'}} >{(payAmt||0).formatMoney()}</font>元</Col>
			<Col span = {3} className = 'comsume_toolBarItem' style = {{ textAlign: 'left', paddingRight: '.5rem'}} >结束日期</Col>
			<Col span = {6} className = 'comsume_toolBarItem' style = {{paddingRight: '.5rem'}} >
				<Card  onClick = {()=>{this.showDatePicker('endTime')}} ><img src = {calendarIcon} />{endTime}</Card>
			</Col>
		  </Row>
		  <Row>
	          <Col span = {3} className = 'list_title list_center' >项目名称</Col>
	          <Col span = {3} className = 'list_title list_amt' >数量</Col>
	          <Col span = {3} className = 'list_title list_amt' >总金额</Col>
	          <Col span = {3} className = 'list_title list_center' >医师</Col>
	          <Col span = {3} className = 'list_title list_center' >科室</Col>
	          <Col span = {3} className = 'list_title list_center' >收据号</Col>
	          <Col span = {3} className = 'list_title list_center' >收费员</Col>
	          <Col span = {3} className = 'list_title list_center' >收费时间</Col>

	      </Row>
          <Card  radius = {false} className = 'comsume_rows' >
            {this.renderItems(data)}
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
          <Modal visible = {this.state.showDateModal} closable = {false} footer = {null} width = {this.weekWinWidth + 'px'} style = {{top: this.modalWinTop + 'rem'}} >
		    <div>
			  <Month width = {this.weekWinWidth - 32} initDate = {this.state[this.state.dateField]} onSelectDay = {this.onSelectDay} />
		    </div>
		  </Modal>	
        </NavContainer>
    );
  }

  renderItems (records) {
    if (!records || records.length <=0){
    	let height = document.body.clientHeight - 138;
      return (
        <Row style = {{height: height + 'px', paddingLeft: '1.5rem'}} >
          <Empty info = '暂无记录' />
        </Row>
      )
    }
    return records.map ( (row, idx) => {
    	const { mc, sl, je,yhxm,zkmc,sjh,sfryxm,sfsj} = row;
        return (
          <div key = {'_order_items_' + idx} className = 'comsume_row' >
  	          <Row type="flex" align="middle" >
		          <Col span = {3} className = 'list_item list_center' >
		            {mc}
		          </Col>
		          <Col span = {3} className = 'list_item list_amt' >
		          	{parseFloat(sl||0).formatMoney()}
		          </Col>
		          <Col span = {3} className = 'list_item list_amt' >
		            {parseFloat(je||0).formatMoney()}
		          </Col>
		          <Col span = {3} className = 'list_item list_center' >
		            {yhxm}
		          </Col>
		          <Col span = {3} className = 'list_item list_center' >
		            {zkmc}
		          </Col>
		          <Col span = {3} className = 'list_item list_center' >
		            {sjh}
		          </Col>
		          <Col span = {3} className = 'list_item list_center' >
		            {sfryxm}
		          </Col>
		          <Col span = {3} className = 'list_item list_center' >
		            {moment(sfsj).format('YYYY-MM-DD HH:mm')}
		          </Col>
	          </Row>
          </div>
        );
	});
  }
}	
module.exports= FeeHistory;