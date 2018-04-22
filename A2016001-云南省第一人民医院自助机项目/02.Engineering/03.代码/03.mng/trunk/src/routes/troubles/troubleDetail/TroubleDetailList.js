import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Row, Col, notification } from 'antd';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './TroubleDetailSearchBar';


class TroubleDetailList extends Component {

  constructor(props) {
    super(props);
    this.forOut = this.forOut.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.showExport = this.showExport.bind(this);
    this.showExport2 = this.showExport2.bind(this);
    this.rowSelectChange = this.rowSelectChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.handleExport = this.handleExport.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'troubleDetail/load',
    });
  }
  
  showExport() {
	  this.props.dispatch({
	      type: 'troubleDetail/setState',
	      payload: {
	    	  visible: true,
	      },
	    });
  }
  
  showExport2() {
	  this.props.dispatch({
	      type: 'troubleDetail/setState',
	      payload: {
	    	  visible2: true,
	      },
	    });
  }
  
  onPageChange(page) {
    this.props.dispatch({
      type: 'troubleDetail/load',
      payload: {
        page,
      },
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'troubleDetail/load',
      payload: {
        query: values,
      },
    });
  }


  onUpdate(record) {
	this.props.dispatch({
	      type: 'troubleDetail/setState',
	      payload: {
	        record: record || {},
	        outVisible: true,
	      },
	    });
  }

  onDelete(record) {
	if(confirm("确认删除吗")){
		this.props.dispatch({
		      type: 'troubleDetail/delete',
		      record: record,
		 });
	} 
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'troubleDetail/setState',
      payload: {
        selectedRowKeys,
      },
    });
  }
  
  handleExport() {
	  const showExport = this.props.showExport;
	  if(showExport) showExport();
  }
  
  forOut() {
	    this.props.dispatch({
	      type: 'troubleDetail/setState',
	      payload: {
	        outVisible: true,
	      },
	    });
	  }

  render() {
    const { troubleDetail, utils, base } = this.props;
    const { wsHeight } = base;
    const { page, data } = troubleDetail;
    const columns = [
      { title: '机器编号', dataIndex: 'machine.code', key: 'machine.code', width: 50 },
      { title: '机器名称', dataIndex: 'machine.name', key: 'machine.name', width: 70 },
      { title: '故障类型', dataIndex: 'trouble.name', key: 'trouble.name', width: 100 },
      { title: '故障描述', dataIndex: 'description', key: 'description', width: 200 },
      { title: '处理方式', dataIndex: 'dealWay', key: 'dealWay', width: 200 },
      { title: '登记时间', dataIndex: 'createTime', key: 'createTime', width: 100 },
      { title: '操作人员', dataIndex: 'operator', key: 'operator', width: 50 },
      { title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <span className="ant-divider" />
            <span>  
            	<a style={{ color: 'green' }} onClick={()=>this.onUpdate(record)} >修改</a>
                &nbsp;<a style={{ color: 'red' }} onClick={()=>this.onDelete(record)} >删除</a>
            </span>
          </span>
        ),
        width: 60,
      },
    ];

    return (
      <div style={{ paddingLeft: '10px' }} >
        <div style={{ marginBottom: 8 }}>
          <Row>
          	<Col span={20}> <SearchBar onSearch={this.onSearch} showExport={this.showExport} showExport2={this.showExport2} /></Col>
            <Col span={4} style={{ textAlign: 'right', paddingRight: '10px' }} >
            <Button type="primary" onClick={this.forOut} size="large" icon="plus" >新增故障信息</Button>
            </Col>
          </Row>
        </div>
        <CommonTable
          data={data}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange}
          onSelectChange={this.rowSelectChange}
          scroll={{ y: (wsHeight - 41 - 36 - 62) }}
          bordered
        />
      </div>
    );
  }
}
export default connect(({ troubleDetail, utils, base }) => ({ troubleDetail, utils, base }))(TroubleDetailList);
