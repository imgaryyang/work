import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';

import CommonTable from '../../../components/CommonTable';

class UserList extends Component {

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'auth/loadUsers',
    });
  }
  componentWillReceiveProps(props) {
    if (props.auth.roleId == this.props.auth.roleId) return;
    if (props.auth.roleId != null) {
      this.props.dispatch({
        type: 'auth/loadUserKeys',
      });
    } else {
      this.props.dispatch({
        type: 'auth/loadUserKeys',
      });
    }
  }

  /* onPageSizeChange(current, pageSize) {
    const { page } = this.props.auth.user;
    const newPage = { ...page, pageSize, pageNo: 1 };
    this.props.dispatch({
      type: 'auth/loadUsers',
      page: newPage,
    });
  }*/

  onPageChange(page) {
    this.props.dispatch({
      type: 'auth/loadUsers',
      payload: {
        page,
      },
    });
  }

  onSelect(record, selected) {
    const type = selected ? 'assignUser' : 'unAssignUser';
    this.props.dispatch({
      type: `auth/${type}`,
      userId: record.id,
    });
  }

  render() {
    const { user, roleId } = this.props.auth;
    const { data, selectedRowKeys, page } = user;
    const disable = !roleId;
    const columns = [
      { title: '中文名', dataIndex: 'name', key: 'name', width: 100 },
      { title: '英文名', dataIndex: 'enName', key: 'enName', width: 100 },
      { title: '简称', dataIndex: 'shortName', key: 'shortName', width: 80 },
      { title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        width: 65,
        render: (value) => {
          if (value === '2') return '女';
          else if (value === '1') return '男';
          else return '';
        },
      },
      /* { title: '身份证号', dataIndex: 'idNo', key: 'idNo' },*/
      { title: '手机', dataIndex: 'mobile', key: 'mobile', width: 100 },
      /* { title: '民族', dataIndex: 'folk', key: 'folk' },*/
      { title: '邮箱', dataIndex: 'email', key: 'email', width: 120 },
      { title: '出生日期', dataIndex: 'bornDate', key: 'bornDate', width: 75 },
      { title: '状态',
        dataIndex: 'active',
        key: 'active',
        width: 65,
        className: 'text-align-center',
        render(value) {
          if (value) {
            return <a style={{ color: 'green' }}>正常</a>;
          } else {
            return <a style={{ color: 'red' }}>已禁用</a>;
          }
        },
      },
    ];
    /* const rowSelection = disable ? null : { selectedRowKeys, onSelect: this.onSelect };
    const pageSize = page.pageSize || 10;
    const pagination = {
      total: page.total || 0,
      pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal(total, range) {
        return `第${range[0]}-${range[1]}条  共 ${total} 条`;
      },
      onShowSizeChange: this.onPageSizeChange.bind(this),
      onChange: this.onPageChange.bind(this),
    };*/
    return (
      <div style={{ paddingLeft: '10px' }} >
        <CommonTable
          rowKey="id"
          page={page}
          columns={columns}
          dataSource={data}
          onPageChange={this.onPageChange}
          rowSelection={{
            onSelect: this.onSelect,
            selectedRowKeys,
          }}
          bordered
          size="middle"
          scroll={{ y: (this.props.tabHeight - 33 - 65) }}
        />
      </div>
    );
  }
}
export default connect(
  ({ auth }) => ({ auth }),
)(UserList);
