import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Row, Col, notification } from 'antd';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './OrderSearchBar';

// import EditTable from '../../../components/editTable/EditTable'

class UserList extends Component {

  constructor(props) {
    super(props);
    this.showDetail = this.showDetail.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.rowSelectChange = this.rowSelectChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }
  
  componentWillMount() {
    this.props.dispatch({
      type: 'recharge/loadOrders',
    });
  }

  onPageChange(page) {console.info('onPageChange',page);
//	const { orderPage } = this.props.recharge;
//	const newPage = {...orderPage,pageNo:pageNo};
    this.props.dispatch({
      type: 'recharge/loadOrders',
      payload: {page,},
    });
  }

  onSearch(values) {
    console.info('list search ', values);
    this.props.dispatch({
      type: 'recharge/loadOrders',
      payload: {  orderQuery: values, },
    });
  }

  showDetail(record) {
    this.props.dispatch({
      type: 'recharge/setState',
      payload: {
        order:record,
      },
    });
  }
  rowSelectChange(selectedRowKeys /* , selectedRows */) {
    // console.info('rowSelectChange', selectedRowKeys);
    this.props.dispatch({
      type: 'user/setState',
      payload: {
        selectedRowKeys,
      },
    });
  }

  forAdd() {
    this.props.dispatch({
      type: 'user/setState',
      payload: {
        record: {},
        visible: true,
      },
    });
  }
  pay(){
	  
	  
  }
  render() {
    const { recharge } = this.props;
    const { orderPage, orderList,orderQuery } = recharge;
    console.info('orderPage ',orderPage);
    const columns = [
      { title: '编号', dataIndex: 'orderNo', key: 'orderNo', width: 120 },
      { title: '类型',dataIndex: 'orderType',key: 'orderType', width: 50, render: (value) => { 
    	if( 'OP' == value)return '支付';
    	if( 'OR' == value)return '退款';
    	if( 'OC' == value)return '取消';
    		return value;
      }},
      { title: '金额', dataIndex: 'amt', key: 'amt', width: 40 },
      { title: '发生金额', dataIndex: 'realAmt', key: 'realAmt', width: 40 },
      //{ title: '最后一笔充值', dataIndex: 'lastlAmt', key: 'lastlAmt', width: 50 },
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
    	  if( '9' == value)return '已关闭';
    	  if( 'E' == value)return '异常';
    	return value;
      }},
      { title: '患者', dataIndex: 'patientName', key: 'patientName', width: 60 },
      { title: '患者编号', dataIndex: 'patientNo', key: 'patientNo', width: 70 },
      { title: '身份证号', dataIndex: 'patientIdNo', key: 'patientIdNo', width: 90 },
      { title: '机器编号', dataIndex: 'machineCode', key: 'machineCode', width: 60 },
      { title: '时间', dataIndex: 'createTime', key: 'createTime', width: 100},
      { title: '业务类型', dataIndex: 'bizType', width: 70,key: 'bizType', render(value/* , record */) {
    	  if( '00' == value)return '门诊';
    	  if( '01' == value)return '预约';
    	  if( '02' == value)return '挂号';
    	  if( '04' == value)return '住院';
    	  if( '05' == value)return '办卡';
    	  if( '06' == value)return '社保建档';
    	return value;
        },
      },
      { title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
          	<a style={{ color: 'red' }} onClick={this.pay.bind(this, record)} >补录</a>
          	<span className="ant-divider" />
            <a style={{ color: 'red' }} onClick={this.showDetail.bind(this, record)} >明细</a>
          </span>
        ),
        width: 90,
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
        rowSelection = {false}
          bordered
        />
      </div>
    );
  }
}
export default connect(({ recharge }) => ({ recharge}))(UserList);

// expandedRowRender={record => <p>备注：{record.desciption}</p>}
