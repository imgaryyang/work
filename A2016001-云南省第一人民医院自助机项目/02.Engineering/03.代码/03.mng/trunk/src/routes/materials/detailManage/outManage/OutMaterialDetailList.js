import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Row, Col, notification } from 'antd';

import CommonTable from '../../../../components/CommonTable';
import SearchBar from './OutMaterialDetailSearchBar';


class OutMaterialDetailList extends Component {

  constructor(props) {
    super(props);
    this.forOut = this.forOut.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.showExport = this.showExport.bind(this);
    this.rowSelectChange = this.rowSelectChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.handleExport = this.handleExport.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'outMaterialDetail/load',
    });
  }
  
  showExport() {
	  this.props.dispatch({
	      type: 'outMaterialDetail/setState',
	      payload: {
	    	  visible: true,
	      },
	    });
  }
  
  onPageChange(page) {
    this.props.dispatch({
      type: 'outMaterialDetail/load',
      payload: {
        page,
      },
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'outMaterialDetail/load',
      payload: {
        query: values,
      },
    });
  }


  onUpdate(record) {
	this.props.dispatch({
	      type: 'outMaterialDetail/setState',
	      payload: {
	        record: record || {},
	        outVisible: true,
	      },
	    });
  }

  onDelete(record) {
	if(confirm("确认删除吗")){
		this.props.dispatch({
		      type: 'outMaterialDetail/delete',
		      record: record,
		 });
	} 
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'outMaterialDetail/setState',
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
	      type: 'outMaterialDetail/setState',
	      payload: {
	        outVisible: true,
	      },
	    });
	  }

  render() {
    const { outMaterialDetail, utils, base } = this.props;
    const { wsHeight } = base;
    const { page, data } = outMaterialDetail;
    const columns = [
      { title: '机器编号', dataIndex: 'machine.code', key: 'machine.code', width: 100 },
      { title: '机器名称', dataIndex: 'machine.name', key: 'machine.name', width: 100 },
      { title: '材料名称', dataIndex: 'material.name', key: 'material.name', width: 100 },
      { title: '出库数量', dataIndex: 'outPutAccount', key: 'outPutAccount', width: 100 },
      { title: '单位', dataIndex: 'material.unit', key: 'material.unit', width: 100 },
      { title: '出库时间', dataIndex: 'outPutTime', key: 'outPutTime', width: 100 },
      { title: '操作人员', dataIndex: 'operator', key: 'operator', width: 100 },
     /* { title: '热敏纸/卷', dataIndex: 'materialName', key: '热敏纸', width: 100 },
      { title: 'A4纸/包', dataIndex: 'materialName', key: 'A4纸', width: 100 },
      { title: '色带/个', dataIndex: 'materialName', key: '色带', width: 100 },
      { title: '就诊卡/盒', dataIndex: 'materialName', key: '就诊卡', width: 100 },
      { title: '废卡/张', dataIndex: 'materialName', key: '废卡', width: 100 },
      { title: '硒鼓/个', dataIndex: 'materialName', key: '硒鼓', width: 100 },
      { title: '清洁卡/张', dataIndex: 'materialName', key: '清洁卡', width: 100 },
      { title: '清洁轴/个', dataIndex: 'materialName', key: '清洁轴', width: 100 },*/
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
          	<Col span={20}> <SearchBar onSearch={this.onSearch} showExport={this.showExport} /></Col>
            <Col span={4} style={{ textAlign: 'right', paddingRight: '10px' }} >
            <Button type="primary" onClick={this.forOut} size="large" icon="plus" >新增出库</Button>
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
export default connect(({ outMaterialDetail, utils, base }) => ({ outMaterialDetail, utils, base }))(OutMaterialDetailList);
