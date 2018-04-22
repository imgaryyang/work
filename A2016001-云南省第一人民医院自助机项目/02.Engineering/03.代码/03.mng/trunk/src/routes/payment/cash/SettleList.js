import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Row, Col, notification } from 'antd';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './OrderSearchBar';

// import EditTable from '../../../components/editTable/EditTable'

class SettleList extends Component {

  constructor(props) {
    super(props);
    this.onSearch = this.onSearch.bind(this);
    this.rowSelectChange = this.rowSelectChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }
  
  componentWillMount() {
    this.props.dispatch({
      type: 'recharge/loadSettles',
    });
  }

  onPageChange(page) {console.info('onPageChange',page);
//	const { settlePage } = this.props.recharge;
//	const newPage = {...settlePage,pageNo:pageNo};
    this.props.dispatch({
      type: 'recharge/loadSettles',
      payload: {page,},
    });
  }

  onSearch(values) {
    console.info('list search ', values);
    this.props.dispatch({
      type: 'recharge/loadSettles',
      payload: {  settleQuery: values, },
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

  render() {
    const { recharge } = this.props;
    const { settlePage, settleList, settleQuery } = recharge;
    console.info('settlePage ',settlePage);
    const columns = [
      { title: '编号', dataIndex: 'settleNo', key: 'settleNo', width: 120 },
      { title: '类型',dataIndex: 'settleType',key: 'settleType', width: 50, render: (value) => { 
    	if( 'SP' == value)return '支付';
    	if( 'SR' == value)return '退款';
    	if( 'SC' == value)return '撤销';
    		return value;
      }},
      { title: '金额', dataIndex: 'amt', key: 'amt', width: 40 },
      { title: '发生金额', dataIndex: 'realAmt', key: 'realAmt', width: 40 },
      //{ title: '最后一笔充值', dataIndex: 'lastlAmt', key: 'lastlAmt', width: 50 },
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
    ];

    return (
      <div style={{ paddingLeft: '10px' }} >
        <div style={{ marginBottom: 8 }}>
          <Row>
            <Col span={20}> <SearchBar onSearch={this.onSearch} /></Col>
          </Row>
        </div>
        <CommonTable
          data={settleList}
          page={settlePage}
          columns={columns}
          onPageChange={this.onPageChange}
        rowSelection = {false}
          bordered
        />
      </div>
    );
  }
}
export default connect(({ recharge }) => ({ recharge}))(SettleList);
