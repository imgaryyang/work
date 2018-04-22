import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Row, Col } from 'antd';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './CheckSearchBar';

class CheckList extends Component {

  constructor(props) {
    super(props);
    this.showDetail = this.showDetail.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }
  
  componentWillMount() {
	  this.props.dispatch({
	      type: 'check/loadChecks',
	  });
  }

  onPageChange(page) {
	  this.props.dispatch({
		  type: 'check/loadChecks',
		  payload: {page,},
	  });
  }

  onSearch(values) {
	  console.info('list search ', values);
	  if (values.chkDate) {
		  values.chkDate = values.chkDate.format('YYYY-MM-DD');
	  }
	  this.props.dispatch({
		  type: 'check/loadChecks',
		  payload: {  checkQuery: values, page: {pageNo: 1}, },
	  });
  }
  
  showExport() {
	  this.props.dispatch({
	      type: 'check/setState',
	      payload: {
	    	  visible: true,
	      },
	  });
  }
  
  showDetail(record) {
	  this.props.dispatch({
	      type: 'check/setState',
	      payload: {
	    	  detailVisible: true,
	      },
	  });
	  this.props.dispatch({
	      type: 'check/loadDetails',
	      payload: {
	    	  checkRecord: record,
	    	  page: {pageNo: 1}, 
	      },
	  });
  }

  render() {
    const { check } = this.props;
    const { checkPage, checkList, checkQuery } = check;
    console.info('checkPage ', checkPage);
    const columns = [
      { title: '对账日期', dataIndex: 'chkDate', key: 'chkDate', width: 80 },
      { title: '渠道', dataIndex: 'payChannel', key: 'payChannel', width: 80, render: (value) => { 
    	  return value.name;
      }},
      { title: '总笔数', dataIndex: 'total', key: 'total', width: 60},
      { title: '总金额', dataIndex: 'amt', key: 'amt', width: 100, render: (value) => { 
    	  return value?value.formatMoney():'0'.formatMoney();
      }},
      { title: '方式', dataIndex: 'optType', key: 'optType', width: 60, render: (value) => { 
    	  return value=="0"?"自动":"手工";
      }},
      { title: '类型', dataIndex: 'chkType', key: 'chkType', width: 60, render: (value) => { 
    	  if( '0' == value )return '全部';
    	  else if( '1' == value )return '支付';
    	  else if( '2' == value )return '退款';
    	  else if( '3' == value )return '退汇';
    	  else return '未知';
      }},
      { title: '同步方式', dataIndex: 'syncType', key: 'syncType', width: 60 },
      { title: '同步时间', dataIndex: 'syncTime', key: 'syncTime', width: 120 },
      { title: '导入时间', dataIndex: 'impTime', key: 'impTime', width: 120 },
      { title: '对账时间', dataIndex: 'chkTime', key: 'chkTime', width: 120 },
      { title: '对账状态', dataIndex: 'status',key: 'status', width: 100, render: (value) => { 
    	if( 'A' == value )return '初始';
    	else if( '0' == value )return '对账完成';
    	else if( '9' == value )return '对账失败';
    	else if( '1' == value )return '已同步文件';
    	else if( '2' == value )return '同步文件失败';
    	else if( '3' == value )return '已导入数据库';
    	else if( '4' == value )return '导入数据库失败';
    	else return '未知';
      }},
      { title: '操作', key: 'action', render: (text, record) => (
          <span>
            <a style={{ color: 'red' }} onClick={this.showDetail.bind(this, record)} >交易明细</a>
          </span>
        ),
        width: 120,
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
          data={checkList}
          page={checkPage}
          columns={columns}
          onPageChange={this.onPageChange}
          owSelection = {false}
          bordered
        />
      </div>
    );
  }
}
export default connect(({ check }) => ({ check }))(CheckList);

