import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Button, Icon, Badge } from 'antd';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';
import DelRowsBtn from '../../../components/TableDeleteRowsButton';
import RowDelBtn from '../../../components/TableRowDeleteButton';
import SearchBar from './SearchBar';
import Editor from './CredentialEditor';

class Credential extends Component {

  constructor(props) {
    super(props);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.forAdd = this.forAdd.bind(this);
    this.forDeleteSelected = this.forDeleteSelected.bind(this);
    this.rowSelectChange = this.rowSelectChange.bind(this);
  } 

  componentWillMount() { 
    const params = this.props.params;
    this.props.dispatch({
      type: 'credential/setState',
      payload: {
        chanel: params.chanel,
      },
    });
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['STOP_FLAG'],
    });
    this.props.dispatch({
      type: 'credential/loadList',
    });
  }

  onEdit(record) {
    this.props.dispatch({
      type: 'credential/setState',
      payload: {
        record,
        visible: true,
      },
    });
  }

  onDelete(record) {
    // console.log('record in onDelete():', record);
    this.props.dispatch({
      type: 'credential/delete',
      id: record.id,
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'credential/loadList',
      payload: {
        query: values,
        onSearch: true,
      },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'credential/loadList',
      payload: {
        page,
      },
    });
  }

  forAdd() {
    this.props.dispatch({
      type: 'credential/setState',
      payload: {
        record: {},
        visible: true,
      },
    });
  }

  forDeleteSelected() {
    const { selectedRowKeys } = this.props.credential;
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      this.props.dispatch({
        type: 'credential/deleteSelected',
      });
    }
  }

  rowSelectChange(selectedRowKeys) {
    // console.info('rowSelectChange', selectedRowKeys);
    this.props.dispatch({
      type: 'credential/setState',
      payload: {
        selectedRowKeys,
      },
    });
  }

  render() {
    const { credential, base } = this.props;
    const { spin, page, data, selectedRowKeys } = credential;
    const { wsHeight } = base;

    const columns = [
      { title: '证书编号', dataIndex: 'regNo', key: 'regNo', width: 100, className: 'text-align-center' },
      { title: '证书名称',
        dataIndex: 'regName',
        key: 'regName',
        width: 200,
        render: (text, record) => {
          return (
            <div>
              {record.regNo}<br />
              {text}
            </div>
          );
        },
      },
      { title: '生产厂商',
        dataIndex: 'producerName',
        key: 'producerName',
        width: 260,
        render: (text, record) => {
          return (
            <div>
              {text}<br />
              {record.tradeName}
            </div>
          );
        },
      },
      /* { title: '证书号', dataIndex: 'regNo', key: 'regNo', width: 100 },*/
      { title: '开始时间', dataIndex: 'regStartDate', key: 'regStartDate', width: 80, className: 'text-align-center', render: text => moment(text).format('YYYY-MM-DD') },
      { title: '结束时间', dataIndex: 'regStopDate', key: 'regStopDate', width: 80, className: 'text-align-center', render: text => moment(text).format('YYYY-MM-DD') },
      { title: '登记时间', dataIndex: 'createTime', key: 'createTime', width: 80, className: 'text-align-center', render: text => moment(text).format('YYYY-MM-DD') },
      { title: '状态',
        dataIndex: 'stopFlag',
        key: 'stopFlag',
        render: value => (
          <span><Badge status={value === '1' ? 'success' : 'error'} />{value === '1' ? '正常' : '禁用'}</span>
        ),
        width: 60,
        className: 'text-align-center text-no-wrap',
      },
      { title: '操作',
        key: 'action',
        width: 70,
        className: 'text-align-center text-no-wrap',
        render: (text, record) => (
          <span style={
            { display: (record.hosId === base.user.hosId ? '' : 'none') }} >
            <Icon type="edit" className="table-row-edit-btn" onClick={() => this.onEdit(record)} />
            <span className="ant-divider" />
            <RowDelBtn onOk={() => this.onDelete(record)} />
          </span>
        ),
      },
    ];

    return (
      <Spin spinning={spin} >
        <div style={{ paddingLeft: '10px' }} >
          <div style={{ marginBottom: 8 }}>
            <Row>
              <Col span={19}> <SearchBar onSearch={this.onSearch} /></Col>
              <Col span={5} style={{ textAlign: 'right' }} >
                <Button type="primary" size="large" style={{ marginRight: '10px' }} onClick={this.forAdd} icon="plus" >新增</Button>
                <DelRowsBtn onOk={this.forDeleteSelected} selectedRows={selectedRowKeys} icon="delete" />
              </Col>
            </Row>
          </div>
          <CommonTable
            data={data}
            page={page}
            columns={columns}
            onPageChange={this.onPageChange}
            onSelectChange={this.rowSelectChange}
            scroll={{ y: (wsHeight - 41 - 33 - 62) }}
            bordered
          />
        </div>
        <Editor />
      </Spin>
    );
  }
}
export default connect(
  ({ credential, base }) => ({ credential, base }),
)(Credential);

