import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Row, Col, notification } from 'antd';

import CommonTable from '../../../components/CommonTable';

class SettlementList extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
  }
  
  componentWillMount() {
  }

  onSearch(values) {
	const { transaction } = this.props;
	const { order } = transaction;
    this.props.dispatch({
      type: 'transaction/loadSettles',
      payload: {  settleQuery: values, order,},
    });
  }

  render() {
    const { transaction } = this.props;
    const { settlePage, settleList, settleQuery } = transaction;
    const columns = [
      { title: '编号', dataIndex: 'settleNo', key: 'settleNo', width: 100 },
      { title: '时间', dataIndex: 'createTime', key: 'createTime', width: 100},
      { title: '类型',dataIndex: 'settleType',key: 'settleType', width: 50, render: (value) => { 
    	if( 'SP' == value)return '支付';
    	if( 'SR' == value)return '退款';
    	if( 'SC' == value)return '撤销';
    		return value;
      }},
      { title: '机器编号', dataIndex: 'machineCode', key: 'machineCode', width: 60 },
      { title: '机器用户', dataIndex: 'machineUser', key: 'machineUser', width: 60 },
      { title: '支付渠道', dataIndex: 'payChannelCode', key: 'payChannelCode', width: 60 },
      { title: '交易流水', dataIndex: 'tradeNo', key: 'tradeNo', width: 100 },
      { title: '交易状态',  dataIndex: 'tradeStatus',  key: 'tradeStatus', width: 50,render: (value) => {
    	  if( 'A' == value)return '初始化';
    	  if( '0' == value)return '交易成功';
    	  if( '1' == value)return '交易失败';
    	  if( '9' == value)return '交易关闭';
    	  if( 'E' == value)return '交易异常';
    	  return value;
      }},
      { title: '状态',  dataIndex: 'status',  key: 'status', width: 50,render: (value) => {
    	  if( 'A' == value)return '初始化';
    	  if( '0' == value)return '支付成功';
    	  if( '1' == value)return '支付失败';
    	  if( '2' == value)return '支付完成 ';
    	  if( '5' == value)return '正在退款';
    	  if( '4' == value)return '交易完成';
    	  if( '5' == value)return '退款中';
    	  if( '6' == value)return '退款失败';
    	  if( '7' == value)return '退款成功';
    	  if( '8' == value)return '被撤销的';
    	  if( '9' == value)return '已关闭';
    	  if( 'E' == value)return '异常';
    	  if( 'C' == value)return '撤销';
    	return value;
      }},
      { title: '金额', dataIndex: 'amt', key: 'amt', width: 60 , render: value => value.formatMoney()},
    ];

    return (
      <div style={{ paddingLeft: '10px' }} >
        <div style={{ marginBottom: 15 }}>
        </div>
        <CommonTable
          data={settleList}
          page={settlePage}
          columns={columns}
          rowSelection={false}
          pagination={false}
          bordered
        />
      </div>
    );
  }
}
export default connect(({ transaction }) => ({ transaction}))(SettlementList);
