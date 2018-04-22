import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col,Modal }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './CashMain.css';
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
import PrintWin from '../../components/PrintWin';
import baseUtil          from '../../utils/baseUtil';
class CashMain extends React.Component {

  constructor(props) {
    super(props);
    this.renderItems  = this.renderItems.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.createBatch = this.createBatch.bind(this);
    this.closeCash  = this.closeCash.bind(this);
    this.enableCash = this.enableCash.bind(this);
  }
  state = { opt :0}
  componentDidMount () {
	  if(this.props.patient.baseInfo.no)this.doSearch()
  }
  doSearch(){
    this.props.dispatch({
      type: 'settle/loadBatches',
    }); 
  }
  state = {
  };
  
  weekWinWidth = config.getWS().width - config.navBar.padding * 2 * config.remSize;
 
  modalWinTop  = config.navBar.height + config.navBar.padding * 2 + 5;

  closeCash(){
	 baseUtil.closeTodayCash();
	 var opt = this.state.opt+1;
	 this.setState({opt}) 
  }
  enableCash(){
	  baseUtil.enableTodayCash(); 
	  //TODO 初始化钱箱
	  var opt = this.state.opt+1;
	  this.setState({opt}) 
  }
  createBatch(batch){
	this.props.dispatch({
      type: 'settle/createCashBatch',
    }); 
  }
  render() {
	var canCash = baseUtil.isTodayCanCash();
	var data = this.props.settle.batchs;
	var page = this.props.settle.page;
	var printing = this.props.settle.printing;
	var { total, pageSize, pageNo } = page;
	var pageCount =Math.ceil(total/pageSize);
    return (
        <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem'}} >
        {
        	canCash?(
        			<Row>
        				<Col span={14}>当前自助机现金功能处于<font style={{fontSize:'5rem',color:'red'}}>启用</font>状态</Col>
        				<Col span={2}></Col>
        				<Col span={6}>
        					<Button text = "关闭现金"   onClick = {()=>{this.closeCash()}} />
        				</Col>
        				<Col span={2}></Col>
        			</Row>
        	):(
        			<Row>
	        			<Col span={14}>当前自助机现金功能处于<font style={{fontSize:'5rem',color:'red'}}>停用</font>状态</Col>
	    				<Col span={2}></Col>
	    				<Col span={6}>
	    					<Button text = "启用现金"   onClick = {()=>{this.enableCash()}} />
	    				</Col>
	    			</Row>
        	)
        }
          <Row>
            <Col span = {6} className = {listStyles.title} >批次号</Col>
            <Col span = {6} className = {listStyles.title + ' ' + listStyles.center} >创建时间</Col>
            <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >总金额</Col>
            <Col span = {4} className = {listStyles.title} >总笔数</Col>
            <Col span = {4} className = {listStyles.title} >收钞</Col>
          </Row>
          <Card  radius = {false} className = {styles.rows} >
            {this.renderItems(data)}
          </Card>
          <PrintWin visible = {printing} msg={'正在打印第'+(pageNo-1)+"/"+pageCount+'张'} /> 
        </WorkSpace>
    );
  }

  renderItems (records) {
    if (!records || records.length <= 0 ){
    	let height = config.getWS().height - (config.navBar.padding + 10) * config.remSize;
      return (
        <Row style = {{height: height + 'px', paddingLeft: config.navBar.padding + 'rem'}} >
          <Empty info = '暂无记录' />
        </Row>
      )
    }
    return records.map((record,idx)=>{
    	const {batchNo,createTime,count,printTime,amt } = record;
	    return (
	      <div className = {styles.row} key={idx} >
	          <Row type="flex" align="middle" >
		          <Col span = {6} className = {listStyles.item} >
		            {batchNo?batchNo:'未生成'}
		          </Col>
		          <Col span = {6} className = {listStyles.item + ' ' + listStyles.center} >
		            {createTime}
		          </Col>
		          <Col span = {4} className = {listStyles.item + ' ' + listStyles.amt} >
		          {(amt||0).formatMoney()}
		          </Col>
		          <Col span = {4} className = {listStyles.item} >
		          {count}
		          </Col>
		          <Col span = {4} className = {listStyles.item} >
		          {
		        	  batchNo?'已收钞':(
		        	     <Button text = "收钞"   onClick = {()=>{this.createBatch()}} />
		        	  )
		          }
		          </Col>
	          </Row>
	      </div>
	    );
    })
  }
}

export default connect(({settle,patient}) => ({settle,patient}))(CashMain);





