import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Button, Icon, Badge } from 'antd';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './SearchBar';


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
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['STOP_FLAG'],
    });
    this.props.dispatch({
      type: 'credentialWarn/loadList',
    });
    this.props.dispatch({
      type: 'credentialWarn/loadParam',
    });
  }

  onEdit(record) {
    this.props.dispatch({
      type: 'credentialWarn/setState',
      payload: {
        record,
        visible: true,
      },
    });
  }

  onDelete(record) {
    
    this.props.dispatch({
      type: 'credentialWarn/delete',
      id: record.id,
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'credentialWarn/loadList',
      payload: {
        query: values,
        onSearch: true,
      },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'credentialWarn/loadList',
      payload: {
        page,
      },
    });
  }

  forAdd() {
    this.props.dispatch({
      type: 'credentialWarn/setState',
      payload: {
        record: {},
        visible: true,
      },
    });
  }

  forDeleteSelected() {
    const { selectedRowKeys } = this.props.credentialWarn;
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      this.props.dispatch({
        type: 'credentialWarn/deleteSelected',
      });
    }
  }

  rowSelectChange(selectedRowKeys) {
    
    this.props.dispatch({
      type: 'credentialWarn/setState',
      payload: {
        selectedRowKeys,
      },
    });
  }

  render() {
    const { credentialWarn, base } = this.props;
    const { spin, page, data } = credentialWarn;
    const { wsHeight } = base;

    const columns = [
      { title: '证书ID', dataIndex: 'regId', key: 'regId', width: 100, className: 'text-align-center' },
      { title: '证书记录号', dataIndex: 'regNo', key: 'regNo', width: 100, className: 'text-align-center' },
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
      { title: '生产厂商/产品名称',
        dataIndex: 'producerName',
        key: 'producerName',
        width: 300,
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
      { title: '距离失效天数', dataIndex: 'invalidDate', key: 'invalidDate', width: 80, className: 'text-align-center',
        render: (text,record) => {
         const nowDate = new Date();
         const invalidDate = Math.floor((record.regStopDate - nowDate.getTime())/(24 * 60 * 60 * 1000)+1);
         return invalidDate } },
      { title: '状态',
        dataIndex: 'stopFlag',
        key: 'stopFlag',
        render: value => (
          <span><Badge status={value === '1' ? 'success' : 'error'} />{value === '1' ? '正常' : '禁用'}</span>
        ),
        width: 60,
        className: 'text-align-center text-no-wrap',
      },
    ];

    return (
      <Spin spinning={spin} >
        <div style={{ paddingLeft: '10px' }} >
          <div style={{ marginBottom: 8 }}>
            <Row>
              <Col span={19}> <SearchBar onSearch={this.onSearch} /></Col>
            </Row>
          </div>
          <CommonTable
            data={data}
            page={page}
            rowSelection={false}
            columns={columns}
            onPageChange={this.onPageChange}
            scroll={{ y: (wsHeight - 41 - 33 - 62) }}
            bordered
          />
        </div>
      </Spin>
    );
  }
}
export default connect(
  ({ credentialWarn, base }) => ({ credentialWarn, base }),
)(Credential);

