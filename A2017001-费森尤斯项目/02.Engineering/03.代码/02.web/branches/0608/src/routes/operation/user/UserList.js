import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Row, Col, notification, Badge } from 'antd';
import moment from 'moment';

import CommonTable from '../../../components/CommonTable';
import SearchBar from './UserSearchBar';

// import EditTable from '../../../components/editTable/EditTable'

class UserList extends Component {

  constructor(props) {
    super(props);
    this.forAdd = this.forAdd.bind(this);
    this.forDeleteAll = this.forDeleteAll.bind(this);
    this.onEnable = this.onEnable.bind(this);
    this.onDisable = this.onDisable.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onSearch = this.onSearch.bind(this);
    // this.rowSelectChange = this.rowSelectChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);

    this.getHosName = this.getHosName.bind(this);
  }

  componentWillMount() {
    

    this.props.dispatch({
      type: 'user4Opt/load',
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'user4Opt/load',
      payload: {
        page,
      },
    });
  }

  onSearch(values) {
    console.log('2-');
    this.props.dispatch({
      type: 'user4Opt/load',
      payload: {
        query: values,
      },
    });
  }

  onEdit(record) {
    this.props.dispatch({
      type: 'user4Opt/loadUserInfo',
      payload: {
        record,
      },
    });
  }

  onDisable(record) {
    this.props.dispatch({
      type: 'user4Opt/disable',
      id: record.id,
    });
  }

  onEnable(record) {
    this.props.dispatch({
      type: 'user4Opt/enable',
      id: record.id,
    });
  }

  forDeleteAll() {
    const { selectedRowKeys } = this.props.user4Opt;
    //   是跨页的，selectedRows不是
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      this.props.dispatch({
        type: 'user4Opt/deleteSelected',
      });
    } else {
      notification.warning({
        message: '警告!',
        description: '您目前没有选择任何数据！',
      });
    }
  }

  /* rowSelectChange(selectedRowKeys) {
    this.props.dispatch({
      type: 'user/setState',
      payload: {
        selectedRowKeys,
      },
    });
  }*/

  forAdd() {
    this.props.dispatch({
      type: 'user4Opt/setState',
      payload: {
        record: {},
        visible: true,
      },
    });
  }


  getHosName(hosId){
    const { hosListData } = this.props.user4Opt;
    for (var index in hosListData) {
      if(hosListData[index].hosId == hosId){
        return hosListData[index].hosName;
      }else{
        return '';
      }
    }
  }

  render() {
    const { user4Opt, utils, base } = this.props;
    const { wsHeight } = base;
    const { page, data, loginDepts } = user4Opt;
    const { dicts } = utils;
    const columns = [
      { title: '员工编号', dataIndex: 'userId', key: 'userId', width: 70, className: 'text-align-center text-no-wrap' },
      { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
      { title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        render: (value) => {
          return dicts.dis('SEX', value);
        },
        width: 50,
        className: 'text-align-center text-no-wrap',
      },
      { title: '年龄',
        dataIndex: 'bornDate',
        key: 'bornDate',
        width: 50,
        render: (value) => { return value ? moment().diff(moment(value), 'years') : ''; },
        className: 'text-align-center text-no-wrap',
      },
      { 
        title: '所属医院', dataIndex: 'hosId', key: 'hosId', width: 120, 
        render: value => this.getHosName(value) 
      },
      { title: '服务科室',
        dataIndex: 'id',
        key: 'loginDepts',
        render: (value) => {
          let rtn = '';
          loginDepts[value].forEach((loginDept, idx) => {
            if (idx > 0) rtn += ',';
            rtn += loginDept.deptName;
          });
          return rtn;
        },
        width: 200,
      },
      { title: '员工类型',
        dataIndex: 'userType',
        key: 'userType',
        render: (value) => {
          return dicts.dis('EMP_TYPE', value);
        },
        width: 100,
      },
      { title: '职务',
        dataIndex: 'posiCode',
        key: 'posiCode',
        render: (value) => {
          return dicts.dis('POSI_CODE', value);
        },
        width: 118,
      },
      { title: '职级',
        dataIndex: 'lvlCode',
        key: 'lvlCode',
        render: (value) => {
          return dicts.dis('LVL_CODE', value);
        },
        width: 80,
      },
      { title: '手机号', dataIndex: 'mobile', key: 'mobile', width: 100, className: 'text-align-center text-no-wrap' },
      { title: '状态',
        dataIndex: 'active',
        key: 'active',
        render: value => (
          <span><Badge status={value ? 'success' : 'error'} />{value ? '正常' : '禁用'}</span>
        ),
        width: 60,
        className: 'text-align-center text-no-wrap',
      },
      { title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Icon type="edit" className="table-row-edit-btn" onClick={this.onEdit.bind(this, record)} />
            <span className="ant-divider" />
            {
              record.active ? (
                <a style={{ color: 'red' }} onClick={this.onDisable.bind(this, record)} >禁用</a>
              ) : (
                <a style={{ color: 'green' }} onClick={this.onEnable.bind(this, record)} >启用</a>
              )
            }
          </span>
        ),
        width: 70,
        className: 'text-align-center text-no-wrap',
      },
    ];

    /* const expandedRowRender = (record) => {
      return (
        <div>
          <Row>
            <Col span={2} style={{ textAlign: 'right' }} >英文名：</Col>
            <Col span={2} >{record.enName}</Col>
            <Col span={2} style={{ textAlign: 'right' }} >简称：</Col>
            <Col span={2} >{record.shortName}</Col>
            <Col span={2} style={{ textAlign: 'right' }} >拼音：</Col>
            <Col span={2} >{record.pinyin}</Col>
            <Col span={2} style={{ textAlign: 'right' }} >婚姻状况：</Col>
            <Col span={2} >{dicts.dis('MARRIAGE_STATUS', record.marrStatus)}</Col>
          </Row>
        </div>
      );
    };*/

    return (
      <div style={{ paddingLeft: '10px' }} >
        <div style={{ marginBottom: 8 }}>
          <Row>
            <Col span={20}> <SearchBar onSearch={this.onSearch} /></Col>
            <Col span={4} style={{ textAlign: 'right' }} >
              <Button type="primary" onClick={this.forAdd} size="large" icon="plus" >新增</Button>
            </Col>
          </Row>
        </div>
        <CommonTable
          rowSelection={false}
          data={data}
          page={page}
          columns={columns}
          onPageChange={this.onPageChange}
          scroll={{ y: (wsHeight - 41 - 33 - 62) }}
          bordered
        />
      </div>
    );
  }
}
export default connect(({ user4Opt, utils, base }) => ({ user4Opt, utils, base }))(UserList);

// expandedRowRender={record => <p>备注：{record.desciption}</p>}
