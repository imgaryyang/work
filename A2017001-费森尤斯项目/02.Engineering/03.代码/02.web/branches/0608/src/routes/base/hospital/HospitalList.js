import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Row, Col, Badge } from 'antd';
import _ from 'lodash';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';
import DelRowsBtn from '../../../components/TableDeleteRowsButton';
import RowDelBtn from '../../../components/TableRowDeleteButton';
import SearchBar from './HospitalSearchBar';

class HospitalList extends Component {

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
      type: 'hospital/load',
    });
  }

  onEdit(record) {
    this.props.dispatch({
      type: 'hospital/setState',
      payload: { record },
    });
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'hospital/delete',
      id: record.id,
    });
  }

  onSearch(values) {
    this.props.dispatch({
      type: 'hospital/load',
      payload: {
        query: values,
      },
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'hospital/load',
      payload: { page },
    });
  }

  rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'hospital/setState',
      payload: { selectedRowKeys },
    });
  }

  forDeleteSelected() {
    const { selectedRowKeys } = this.props.hospital;
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      this.props.dispatch({
        type: 'hospital/deleteSelected',
      });
    }
  }

  forAdd() {
    this.props.dispatch({
      type: 'hospital/setState',
      payload: { record: {} },
    });
  }

  render() {
    const { hospital, utils, base } = this.props;
    const { page, data, selectedRowKeys } = hospital;
    const { dicts } = utils;
    const { wsHeight } = base;
    const containerHeight = wsHeight - 6;
    const columns = [
      {
        title: '上级机构',
        dataIndex: 'parentId',
        key: 'parentId',
        width: 115,
        render: (value) => {
          return dicts.dis('PARENT_ID', value);
        },
      },
      /* { title: '代码', dataIndex: 'hosId', key: 'hosId', width: 60, className: 'text-align-center' },*/
      {
        title: '院区',
        dataIndex: 'hosArea',
        key: 'hosArea',
        width: 55,
        render: (value) => {
          return utils.dicts.dis('HOS_AREA', value);
        } },
      { title: '医院名称',
        dataIndex: 'hosName',
        key: 'hosName',
        width: 206,
        render: (value, record) => {
          return (
            <div>
              {`${_.trim(record.hosId)} · ${value}`}<br />
              {record.hName ? `简称：${record.hName}` : ''}
            </div>
          );
        },
      },
      { title: '自定义码', dataIndex: 'customCode', key: 'customCode', width: 70, className: 'text-align-center' },
      /* { title: '医院简称', dataIndex: 'hName', key: 'hName' },*/
      {
        title: '医院等级',
        dataIndex: 'hosGrade',
        key: 'hosGrade',
        width: 70,
        className: 'text-align-center',
        render: (value) => {
          return utils.dicts.dis('HOS_GRADE', value);
        } },
      {
        title: '医院类型',
        dataIndex: 'hosType',
        key: 'hosType',
        width: 70,
        className: 'text-align-center',
        render: (value) => {
          return utils.dicts.dis('HOS_TYPE', value);
        } },
      { title: '联系电话', dataIndex: 'linkTel', key: 'linkTel', width: 90 },
      { title: '停用标志',
        dataIndex: 'stopFlag',
        key: 'stopFlag',
        width: 70,
        className: 'text-align-center',
        render: value => (
          <span><Badge status={value ? 'success' : 'error'} />{value ? '正常' : '停用'}</span>
        ),
      },
      { title: '操作',
        key: 'action',
        width: 75,
        className: 'text-align-center',
        render: (text, record) => (
          <span>
            <Icon type="edit" className="table-row-edit-btn" onClick={() => this.onEdit(record)} />
            <span className="ant-divider" />
            <RowDelBtn onOk={() => this.onDelete(record)} />
          </span>
        ),
      }];

    const expandTable = (record) => {
      const expandColumns = [
        /* { title: '拼音', dataIndex: 'spellCode', key: 'spellCode' },
        { title: '五笔', dataIndex: 'wbCode', key: 'wbCode' },*/
        { title: '英文名称', dataIndex: 'eName', key: 'eName', width: 100 },
        { title: '组织机构代码', dataIndex: 'groupId', key: 'groupId', width: 100, className: 'text-align-center' },
        { title: '医院坐标', dataIndex: 'hosLocation', key: 'hosLocation', width: 160 },
        { title: '开业时间', dataIndex: 'busiTime', key: 'busiTime', width: 90, className: 'text-align-center', render: value => (moment(value).format('YYYY-MM-DD')) },
        { title: '地址', dataIndex: 'pAddress', key: 'pAddress', width: 220 },
        { title: '简介', dataIndex: 'introduce', key: 'introduce', width: 170 },
      ];
      return (
        <CommonTable
          data={data.filter(item => item.id === record.id)}
          size="small"
          bordered
          columns={expandColumns}
          pagination={false}
          rowSelection={false}
        />
      );
    };

    return (
      <div style={{ padding: '3px', paddingLeft: '7px', height: `${containerHeight}px`, overflow: 'hidden' }} >
        <div style={{ marginBottom: 8 }} >
          <Row>
            <Col span={19} >{<SearchBar onSearch={this.onSearch} />}</Col>
            <Col span={5} style={{ textAlign: 'right' }} >
              <Button type="primary" size="large" style={{ marginRight: '10px' }} onClick={this.forAdd} icon="plus" >新增</Button>
              <DelRowsBtn onOk={this.forDeleteSelected} selectedRows={selectedRowKeys} icon="delete" />
            </Col>
          </Row>
        </div>
        <CommonTable
          bordered
          data={data} page={page} columns={columns}
          onPageChange={this.onPageChange}
          onSelectChange={this.rowSelectChange}
          expandedRowRender={expandTable}
          scroll={{ y: (wsHeight - 33 - 8 - 33 - 62) }}
        />
      </div>
    );
  }
}
export default connect(
  ({ hospital, utils, base }) => ({ hospital, utils, base }),
)(HospitalList);
