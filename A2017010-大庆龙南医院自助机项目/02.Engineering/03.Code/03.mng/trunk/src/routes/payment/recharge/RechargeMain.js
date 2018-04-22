import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin,Modal } from 'antd';
import OrderList from './OrderList';
import SettleList from './SettleList';
class BatchMain extends Component {

  constructor(props) {
	  super(props);
	  this.handleCancel = this.handleCancel.bind(this);
  }
  handleCancel(){
	  this.props.dispatch({
	      type: 'recharge/setState',
	      payload: {
	    	  order:{},
	      },
	    });
  }
  render() {
    const { spin, order } = this.props.recharge;
     console.info('order : ', order);
    return (
      <Spin spinning={spin} >
        <OrderList />
        <Modal visible={(order.id?true:false)} width={1200} onCancel={this.handleCancel}>
        	<SettleList />
        </Modal>
      </Spin>
    );
  }
}
export default connect(({ recharge }) => ({ recharge }))(BatchMain);

