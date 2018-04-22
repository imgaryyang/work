import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col,Modal }   from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './ReportExpMain.css';
import listStyles           from '../../components/List.css';
import WorkSpace            from '../../components/WorkSpace';
import Card                 from '../../components/Card';
import Button               from '../../components/Button';
import Empty                from '../../components/Empty';
class ReportExpMain extends React.Component {

  constructor(props) {
    super(props);
    this.renderItems  = this.renderItems.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prePage = this.prePage.bind(this);
    this.reportExp  = this.reportExp.bind(this);
  }
  
  componentDidMount () {
	  console.info("componentDidMount");
	  this.doSearch()
  }
  doSearch(){
	const {start, pageSize } = this.state;
	console.info("start",start);
	console.info("pageSize",pageSize);
	const {code } = this.props.frame.machine;
    this.props.dispatch({
      type: 'order/loadOrders',
      payload: {
    	  query:{ 
        	  pageSize: pageSize,
        	  machineCode: code,
    	  }
      },
    }); 
  }
  state = {
	  pageSize:8,
	  pageNo: 1,
  };
  
  nextPage(){
	  const { pageNo, pageSize } = this.state;
	  this.setState({pageNo: pageNo+1},()=>{
		  this.doSearch();
	  });
	 
  }
  prePage(){
	  const { pageNo, pageSize } = this.state;
	  this.setState({pageNo:pageNo-1},()=>{
		  this.doSearch();
	  });
	 
  }
  reportExp (row) {
	  this.props.dispatch({
		  type: 'order/reportExp',
	      payload: { order:row },
	  });
  }
  render() {
	  console.info("render");
	var records = this.props.order.orders;
	var page = this.props.order.page;
	var title = "预存记录";
	const { start, pageSize} = this.state;
	const data = records; 

    return (
        <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem'}} >
          <Row>
            <Col span = {6} className = {listStyles.title + ' ' + listStyles.center} >发生时间</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.center} >病人(编号)</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >金额</Col>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.center} >状态</Col>
            <Col span = {3} className = {listStyles.title + ' ' + listStyles.center} >运维状态</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.center} >操作</Col>
          </Row>
          <Card  radius = {false} className = {styles.rows} >
            {this.renderItems(data)}
          </Card>
          {
        	  page.total > pageSize ? (
  	        	<Row style = {{padding : config.navBar.padding + 'rem'}} >
  		            <Col span = {8}><Button text = "上一页" disabled= {start == 1} onClick = {this.prePage} /></Col>
  		            <Col span = {8}>&nbsp;</Col>
  		            <Col span = {8}><Button text = "下一页" disabled={pageSize >= page.total } onClick = {this.nextPage} /></Col>
  	            </Row>
              ):null
          }
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
      const { createTime, patientNo, patientName, realAmt, status, optStatus} = row;
      const amt = parseFloat(realAmt||0).formatMoney();
      let statusName,optStatusName;
      	if(status=="0")
      		statusName = "交易成功";
	  	else if(status=="1")
	  		statusName = "支付成功";
	  	else if(status=="2")
	  		statusName = "支付失败";
	  	else if(status=="3")
	  		statusName = "通知应用失败";
	  	else if(status=="4")
	  		statusName = "交易完成";
	  	else if(status=="5")
	  		statusName = "退款中";
	  	else if(status=="6")
	  		statusName = "退款失败 ";
	  	else if(status=="7")
	  		statusName = "退款成功";
	  	else if(status=="8")
	  		statusName = "交易异常";
	  	else if(status=="9")
	  		statusName = "交易关闭";
      	
      	if(optStatus=="0")
      		optStatusName = "正常";
    	else if(optStatus=="E")
    		optStatusName = "异常";
    	else if(optStatus=="T")
    		optStatusName = "同步";
    	else if(optStatus=="A")
    		optStatusName = "补录";
      	
        return (
          <div key = {'_order_items_' + idx} className = {styles.row} >
	          <Row type="flex" align="middle" >
		          <Col span = {6} className = {listStyles.item} >
		            {moment(createTime).format('YYYY-MM-DD HH:mm')}
		          </Col>
		          <Col span = {4} className = {listStyles.item + ' ' + listStyles.center} >
		            {patientName + "(" + patientNo + ")"}
		          </Col>
		          <Col span = {4} className = {listStyles.item + ' ' + listStyles.amt} >
		            {amt}
		          </Col>
		          <Col span = {3} className = {listStyles.item + ' ' + listStyles.center} >
		            {statusName}
		          </Col>
		          <Col span = {3} className = {listStyles.item + ' ' + listStyles.center} >
		            {optStatusName}
		          </Col>
		          <Col span = {4} className = {listStyles.item} >
		          	{
	                	<Button text = "异常" style = {{fontSize: '2.5rem'}} onClick = {() => this.reportExp(row)} />
	                }
		          </Col>
	          </Row>
          </div>
        );
	});
  }
}

export default connect(({order,frame}) => ({order,frame}))(ReportExpMain);





