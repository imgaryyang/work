import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Row, Col, notification } from 'antd';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './MaterialSearchBar';


class MaterialList extends Component {

  constructor(props) {
    super(props);
    this.forAdd = this.forAdd.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.rowSelectChange = this.rowSelectChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'material/load',
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'material/load',
      payload: {
        page,
      },
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'material/load',
      payload: {
        query: values,
      },
    });
  }

  onEdit(record) {
    this.props.dispatch({
      type: 'material/loadUserInfo',
      payload: {
        record,
      },
    });
  }

  onUpdate(record) {
	this.props.dispatch({
	      type: 'material/setState',
	      payload: {
	        record: record || {},
	        visible: true,
	      },
	    });
  }

  onDelete(record) {
	if(confirm("确认删除吗")){
		this.props.dispatch({
		      type: 'material/delete',
		      record: record,
		 });
	} 
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'material/setState',
      payload: {
        selectedRowKeys,
      },
    });
  }

  forAdd() {
    this.props.dispatch({
      type: 'material/setState',
      payload: {
        record: {},
        visible: true,
      },
    });
  }

  render() {
    const { material, utils, base } = this.props;
    const { wsHeight } = base;
    const { page, data } = material;
    const columns = [
      { title: '材料名称', dataIndex: 'name', key: 'name', width: 100 },
      { title: '单位', dataIndex: 'unit', key: 'unit', width: 100 },
      { title: '数量', dataIndex: 'account', key: 'account', width: 100 },
      { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 200 },
      { title: '时间', dataIndex: 'createTime', key: 'createTime', width: 200 },
      { title: '操作人员', dataIndex: 'createUser', key: 'createUser', width: 200 },
      { title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Icon type="edit" className="table-row-edit-btn" onClick={this.onEdit.bind(this, record)} />
            <span className="ant-divider" />
            <span>  
            	<a style={{ color: 'green' }} onClick={()=>this.onUpdate(record)} >修改</a>
                &nbsp;<a style={{ color: 'red' }} onClick={()=>this.onDelete(record)} >删除</a>
            </span>
          </span>
        ),
        width: 200,
      },
    ];

    return (
      <div style={{ paddingLeft: '10px' }} >
        <div style={{ marginBottom: 8 }}>
          <Row>
            <Col span={20}> <SearchBar onSearch={this.onSearch} /></Col>
            <Col span={4} style={{ textAlign: 'right', paddingRight: '10px' }} >
              <Button type="primary" onClick={this.forAdd} size="large" icon="plus" >新增</Button>
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
export default connect(({ material, utils, base }) => ({ material, utils, base }))(MaterialList);
