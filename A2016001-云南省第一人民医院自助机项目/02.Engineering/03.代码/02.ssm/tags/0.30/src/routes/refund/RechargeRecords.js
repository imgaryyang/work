import React, { PropTypes } from 'react';
import { connect }          from 'dva';
import { routerRedux }      from 'dva/router';
import { Row, Col,Modal }         from 'antd';
import moment               from 'moment';

import config               from '../../config';
import styles               from './RechargeRecords.css';
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
    this.nextPage = this.nextPage.bind(this);
    this.prePage = this.prePage.bind(this);
    this.selectDetails = this.selectDetails.bind(this);
  }
  
  componentDidMount () {
  }
  state = {
	  pageNo:1,
	  pageSize : 6  ,
  };
  selectDetails(record){
	  //var limit = record.recharge-record.refund;
	  this.props.dispatch({
		  type:'refund/setState',
		  payload:{record}
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
  render() {
	var { records } =this.props.refund;
	const {startTime,endTime } = this.state;
	
	const { pageNo,pageSize} = this.state;
	let start = pageSize*(pageNo-1);
	let limit = pageSize*pageNo;
	const data = records.slice(start,limit); 

    return (
        <WorkSpace fullScreen = {true} style = {{paddingTop: '2rem'}} >
		  <Row>
	          <Col span = {6} className = {listStyles.title} >账户</Col>
	          <Col span = {5} className = {listStyles.title + ' ' + listStyles.center} >支付时间</Col>
	          <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >支付金额</Col>
	          <Col span = {4} className = {listStyles.title + ' ' + listStyles.amt} >已退金额</Col>
	          <Col span = {5} className = {listStyles.title+ ' ' + listStyles.center} >操作</Col>
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
      const { paymentWay, account, cardType, cardBankCode, recharge,refund,paymentTime } = row;
      var typeName = "支付";
      const amt = parseFloat(recharge||0).formatMoney();
      const refundAmt = parseFloat(refund||0).formatMoney();
      return (
          <div key = {'_order_items_' + idx} className = {styles.row} >
  	          <Row type="flex" align="middle" >
		          <Col span = {6} className = {listStyles.item } >
		          	{account}
		          </Col>
		          <Col span = {5} className = {listStyles.item +' ' + listStyles.center} >
		          	{moment(paymentTime).format('YYYY-MM-DD HH:mm')}
		          </Col>
		          <Col span = {4} className = {listStyles.item + ' ' + listStyles.amt} >
		            {amt}
		          </Col>
		          <Col span = {4} className = {listStyles.item + ' ' + listStyles.amt } >
		            {refundAmt}
		          </Col>
		          <Col span = {5} className = {listStyles.item + ' ' + listStyles.center} >
	                {
	                	<Button text = "退款" style = {{fontSize: '2.5rem'}} onClick = {() => this.selectDetails(row)} />
	                }
	              </Col>
	          </Row>
          </div>
        );
	});
  }
}	
export default connect(({patient,refund}) => ({patient,refund}))(PrepaidHistory);