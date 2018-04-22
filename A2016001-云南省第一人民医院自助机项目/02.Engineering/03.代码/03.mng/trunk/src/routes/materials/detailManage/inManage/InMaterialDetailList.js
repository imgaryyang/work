import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Row, Col, notification } from 'antd';

import CommonTable from '../../../../components/CommonTable';
import SearchBar from './InMaterialDetailSearchBar';


class InMaterialDetailList extends Component {

  constructor(props) {
    super(props);
    this.forIn = this.forIn.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.rowSelectChange = this.rowSelectChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  componentWillMount() {
	  this.props.dispatch({
	      type: 'inMaterialDetail/load',
	  });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'inMaterialDetail/load',
      payload: {
        page,
      },
    });
  }

  onSearch(values) {
    console.info('list search ', values);
    this.props.dispatch({
      type: 'inMaterialDetail/load',
      payload: {
        query: values,
      },
    });
  }

  onUpdate(record) {
	this.props.dispatch({
	      type: 'inMaterialDetail/setState',
	      payload: {
	        record: record || {},
	        inVisible: true,
	      },
	});
  }

  onDelete(record) {
	if(confirm("确认删除吗")){
		this.props.dispatch({
		      type: 'inMaterialDetail/delete',
		      record: record,
		});
	} 
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'inMaterialDetail/setState',
      payload: {
        selectedRowKeys,
      },
    });
  }

  forIn() {
	this.props.dispatch({
		type: 'inMaterialDetail/setState',
		payload: {
			inVisible: true,
	    },
	});
  }
  

  render() {
    const { inMaterialDetail, utils, base } = this.props;
    const { wsHeight } = base;
    const { page, data } = inMaterialDetail;
    const columns = [
      { title: '材料编号', dataIndex: 'material.id', key: 'material.id', width: 200 },
      { title: '材料名称', dataIndex: 'material.name', key: 'material.name', width: 100 },
      { title: '入库数量', dataIndex: 'inPutAccount', key: 'inPutAccount', width: 50 },
      { title: '单位', dataIndex: 'material.unit', key: 'material.unit', width: 50 },
      { title: '入库时间', dataIndex: 'inPutTime', key: 'inPutTime', width: 100 },
      { title: '操作人员', dataIndex: 'operator', key: 'operator', width: 100 },
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
        width: 100,
      },
    ];

    return (
      <div style={{ paddingLeft: '10px' }} >
        <div style={{ marginBottom: 8 }}>
          <Row>
            <Col span={20}> <SearchBar onSearch={this.onSearch} /></Col>
            <Col span={4} style={{ textAlign: 'right',paddingRight: '10px'}} >
              <Button type="primary" onClick={this.forIn} size="large" icon="plus" >新增入库</Button>
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
export default connect(({ inMaterialDetail, utils, base }) => ({ inMaterialDetail, utils, base }))(InMaterialDetailList);
