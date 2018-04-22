import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Row, Col, notification } from 'antd';

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
    this.rowSelectChange = this.rowSelectChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'user/load',
    });
  }

  onPageChange(page) {
    this.props.dispatch({
      type: 'user/load',
      payload: {
        page,
      },
    });
  }

  onSearch(values) {
    console.info('list search ', values);
    this.props.dispatch({
      type: 'user/load',
      payload: {
        query: values,
      },
    });
  }

  onEdit(record) {
    /* console.info('onEdit', record);
    this.props.dispatch({
      type: 'user/setState',
      payload: {
        record,
        visible: true,
      },
    }); */

    this.props.dispatch({
      type: 'user/loadUserInfo',
      payload: {
        record,
      },
    });
  }

  onDisable(record) {
    this.props.dispatch({
      type: 'user/disable',
      id: record.id,
    });
  }

  onEnable(record) {
    this.props.dispatch({
      type: 'user/enable',
      id: record.id,
    });
  }

  forDeleteAll() {
    console.info('deleteAll', this.props);
    const { selectedRowKeys } = this.props.user;
    //   是跨页的，selectedRows不是
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      this.props.dispatch({
        type: 'user/deleteSelected',
      });
    } else {
      notification.warning({
        message: '警告!',
        description: '您目前没有选择任何数据！',
      });
    }
  }

  rowSelectChange(selectedRowKeys /* , selectedRows */) {
    // console.info('rowSelectChange', selectedRowKeys);
    this.props.dispatch({
      type: 'user/setState',
      payload: {
        selectedRowKeys,
      },
    });
  }

  forAdd() {
    this.props.dispatch({
      type: 'user/setState',
      payload: {
        record: {},
        visible: true,
      },
    });
  }

  render() {
    const { user, utils, base } = this.props;
    const { wsHeight } = base;
    const { page, data } = user;
    const columns = [
      { title: '中文名', dataIndex: 'name', key: 'name', width: 100 },
      { title: '身份证号', dataIndex: 'idNo', key: 'idNo', width: 200 },
      { title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        render: (value) => {
          return value;
        },
        width: 50,
      },
      { title: '生日', dataIndex: 'bornDate', key: 'bornDate', width: 100 },
      { title: '手机号', dataIndex: 'mobile', key: 'mobile', width: 120 },
      { title: '民族',
        dataIndex: 'folk',
        key: 'folk',
        render: (value) => {
          return value;
        },
        width: 90,
      },
      { title: '邮箱', dataIndex: 'email', key: 'email', width: 160 },
      { title: '地址', dataIndex: 'address', key: 'address', width: 260 },
      { title: '状态',
        dataIndex: 'active',
        key: 'active',
        render(value/* , record */) {
          if (value) {
            return <a style={{ color: 'green' }}>正常</a>;
          } else {
            return <a style={{ color: 'red' }}>已禁用</a>;
          }
        },
        width: 70,
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
        width: 90,
      },
    ];

    const expandedRowRender = (record) => {
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
    };

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
          expandedRowRender={expandedRowRender}
          scroll={{ y: (wsHeight - 41 - 36 - 62) }}
          bordered
        />
      </div>
    );
  }
}
export default connect(({ user, utils, base }) => ({ user, utils, base }))(UserList);

// expandedRowRender={record => <p>备注：{record.desciption}</p>}
