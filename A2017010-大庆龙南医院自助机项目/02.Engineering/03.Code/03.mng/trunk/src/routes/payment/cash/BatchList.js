import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Row, Col, notification } from 'antd';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './BatchSearchBar';

class BatchList extends Component {

  constructor(props) {
    super(props);
    this.showDetail = this.showDetail.bind(this);
    this.showExport = this.showExport.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.rowSelectChange = this.rowSelectChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }
  
  componentWillMount() {
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'cash/loadBatchs',
      payload: {page,},
    });
  }

  onSearch(values) {
    console.info('list search ', values);
    if (values.batchDay) {
    	values.batchDay = values.batchDay.format('YYYY-MM-DD');
    }
    this.props.dispatch({
      type: 'cash/loadBatchs',
      payload: {  batchQuery: values, },
    });
  }
  
  showExport() {
	  this.props.dispatch({
	      type: 'cash/setState',
	      payload: {
	    	  visible: true,
	      },
	    });
  }
  
  showDetail(record) {
    this.props.dispatch({
      type: 'cash/setState',
      payload: {
        batch:record,
      },
    });
  }
  rowSelectChange(selectedRowKeys /* , selectedRows */) {
    // console.info('rowSelectChange', selectedRowKeys);
  }

  pay(){
	  
	  
  }
  render() {
    const { cash } = this.props;
    const { batchPage, batchList,batchQuery } = cash;
    console.info('batchPage ',batchPage);
    const columns = [
      { title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 120 },
      { title: '总笔数', dataIndex: 'count', key: 'count', width: 120},
      { title: '总金额', dataIndex: 'amt', key: 'amt', width: 120, render: (value) => { 
    	  return value.formatMoney();
      }},
      { title: '机器名称', dataIndex: 'machineName', key: 'machineName', width: 120 },
      { title: '机器MAC', dataIndex: 'machineMac', key: 'machineMac', width: 120 },
      { title: '清钞日期', dataIndex: 'batchDay', key: 'batchDay', width: 80 },
      { title: '清钞时间', dataIndex: 'createTime', key: 'createTime', width: 120 },
      { title: '是否打印',dataIndex: 'status',key: 'status', width: 80, render: (value) => { 
    	if( '0' == value)return '未打印';
    	else if( '1' == value)return '已打印';
    	else return '未知';
      }},
      { title: '操作', key: 'action', render: (text, record) => (
          <span>
            <a style={{ color: 'red' }} onClick={this.showDetail.bind(this, record)} >预存明细</a>
          </span>
        ),
        width: 90,
      },
    ];

    return (
      <div style={{ paddingLeft: '10px' }} >
        <div style={{ marginBottom: 8 }}>
          <Row>
            <Col span={20}> <SearchBar onSearch={this.onSearch} showExport={this.showExport} /></Col>
          </Row>
        </div>
        <CommonTable
          data={batchList}
          page={batchPage}
          columns={columns}
          onPageChange={this.onPageChange}
          owSelection = {false}
          bordered
        />
      </div>
    );
  }
}
export default connect(({ cash }) => ({ cash}))(BatchList);

