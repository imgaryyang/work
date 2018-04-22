import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Row, Col, notification } from 'antd';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './OrderSearchBar';

// import EditTable from '../../../components/editTable/EditTable'

class OrderList extends Component {

  constructor(props) {
    super(props);
    this.showDetail = this.showDetail.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }
  
  componentWillMount() {
    this.props.dispatch({
      type: 'transaction/loadOrders',
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'transaction/loadOrders',
      payload: { page, },
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'transaction/loadOrders',
      payload: { orderQuery: values, },
    });
  }

  showDetail(record) {
    this.props.dispatch({
      type: 'transaction/loadSettles',
      payload: {
        order: record,
      },
    });
  }

  render() {
    const { transaction } = this.props;
    const { orderPage, orderList, orderQuery } = transaction;
    const columns = [
      { title: '编号', dataIndex: 'orderNo', key: 'orderNo', width: 100 },
      { title: '时间', dataIndex: 'createTime', key: 'createTime', width: 100},
      { title: '类型',dataIndex: 'orderType',key: 'orderType', width: 30, render: (value) => { 
    	if( 'OP' == value)return '支付';
    	if( 'OR' == value)return '退款';
    	if( 'OC' == value)return '取消';
    	if( 'BP' == value)return '补录';
		return value;
      }},
      { title: '业务类型', dataIndex: 'bizType', width: 50,key: 'bizType', render(value/* , record */) {
    	  if( '00' == value)return '门诊预存';
    	  if( '01' == value)return '预约';
    	  if( '02' == value)return '挂号';
    	  if( '03' == value)return '门诊缴费';
    	  if( '04' == value)return '住院预缴';
    	  if( '05' == value)return '办卡';
    	  if( '06' == value)return '社保建档';
    	return value;
        },
      },
      { title: '患者', dataIndex: 'patientName', key: 'patientName', width: 50 },
      { title: '患者编号', dataIndex: 'patientNo', key: 'patientNo', width: 60 },
      { title: '身份证号', dataIndex: 'patientIdNo', key: 'patientIdNo', width: 90 },
      { title: '机器编号', dataIndex: 'machineCode', key: 'machineCode', width: 50 },
      { title: '机器用户', dataIndex: 'machineUser', key: 'machineUser', width: 50 },
      { title: '状态',  dataIndex: 'status',  key: 'status', width: 50,render: (value) => {
    	  if( 'A' == value)return '创建';
    	  if( '0' == value)return '成功';
    	  if( '1' == value)return '支付完成';
    	  if( '2' == value)return '支付失败';
    	  if( '3' == value)return '交易失败';
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
      { title: '金额', dataIndex: 'amt', key: 'amt', width: 50, render: value => value.formatMoney()},
      { title: '发生金额', dataIndex: 'realAmt', key: 'realAmt', width: 50, render: value => value.formatMoney() },
      { title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a style={{ color: 'red' }} onClick={this.showDetail.bind(this, record)} >明细查询</a>
          </span>
        ),
        width: 50,
      },
    ];

    return (
      <div style={{ paddingLeft: '10px' }} >
        <div style={{ marginBottom: 8 }}>
          <Row>
            <Col span={20}> <SearchBar onSearch={this.onSearch} /></Col>
          </Row>
        </div>
        <CommonTable
          data={orderList}
          page={orderPage}
          columns={columns}
          onPageChange={this.onPageChange}
          rowSelection={false}
          bordered
        />
      </div>
    );
  }
}
export default connect(({ transaction }) => ({ transaction}))(OrderList);
