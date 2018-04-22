import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Col, Popconfirm, Input } from 'antd';

class EditableCell extends Component {

  state = {
    value: this.props.value,
  };

  componentWillReceiveProps(/* nextProps */) {
    /* if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable });
      if (nextProps.editable) {
        this.cacheValue = this.state.value;
      }
    }
    if (nextProps.status && nextProps.status !== this.props.status) {
      if (nextProps.status === 'save') {
        this.props.onChange(this.state.value);
      } else if (nextProps.status === 'cancel') {
        this.setState({ value: this.cacheValue });
        this.props.onChange(this.cacheValue);
      }
    } */
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.value !== this.state.value;
  }

  handleChange(e) {
    const value = e.target.value;
    this.setState({ value }, () => {
      if (this.props.onChange) this.props.onChange(this.state.value);
    });
  }

  render() {
    const { value } = this.state;
    return (
      <div><Input value={value} onChange={e => this.handleChange(e)} /></div>
    );
  }
}

class AccountList extends Component {

  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.renderNewUserName = this.renderNewUserName.bind(this);
    this.handleUserNameChange = this.handleUserNameChange.bind(this);
  }

  state = {
    username: '',
  };

  componentWillMount() {
    this.props.dispatch({
      type: 'user/loadUserAccounts',
    });
  }

  onCancel() {
    const data = this.props.user.accounts;
    const newData = [];
    for (const record of data) {
      if (!record.editable) newData.push(record);
    }
    this.props.dispatch({
      type: 'user/setState',
      payload: { accounts: newData },
    });
  }

  onSave() {
    const data = this.props.user.accounts;
    for (const record of data) {
      if (record.editable) {
        record.username = this.state.username;
        this.props.dispatch({
          type: 'user/saveUserAccount',
          payload: { account: record },
        });
      }
    }
  }

  onDelete(record) {
    this.props.dispatch({
      type: 'user/deleteUserAccount',
      id: record.id,
    });
  }

  restPwd(record) {
    this.props.dispatch({
      type: 'user/resetAccountPwd',
      id: record.id,
    });
  }

  forAdd() {
    const data = this.props.user.accounts;
    const newData = [];
    for (const record of data) {
      if (record.editable) return;
      newData.push(record);
    }
    newData.push({ id: 'temp', password: '', status: '1', type: 'user', username: '', editable: true });
    this.props.dispatch({
      type: 'user/setState',
      payload: { accounts: newData },
    });
  }

  handleUserNameChange(value) {
    this.setState({ username: value });
  }

  renderNewUserName(data, index, key, text) {
    const { editable } = data[index];
    // console.info('renderColumns', data, index, editable);
    if (!editable) return text;
    return (
      <EditableCell value={text} onChange={this.handleUserNameChange} />
    );
  }

  render() {
    const data = this.props.user.accounts;
    // console.info('account : ', data);
    const columns = [
      { title: '用户名',
        dataIndex: 'username',
        key: 'username',
        render: (text, record, index) => this.renderNewUserName(data, index, 'username', text),
      },
       { title: '账户类型', dataIndex: 'type', key: 'type' },
       { title: '用户状态', dataIndex: 'status', key: 'status' },
      { title: '密码',
        dataIndex: 'id',
        key: 'password',
        render: (text, record) => (
             record.editable ? '' : <a style={{ color: 'green' }} onClick={this.restPwd.bind(this, record)}>重置</a>
         ),
      },
      { title: '操作',
        key: 'action',
        render: (text, record) => (
        record.editable ?
          <span>
            <a style={{ color: 'green' }} onClick={this.onSave}>保存</a>
            <span className="ant-divider" />
            <a style={{ color: 'red' }} onClick={this.onCancel}>取消</a>
          </span>
            :
          <span>
            <Popconfirm
              placement="left" title={'您确定要删除此项么?'} cancelText={'否'} okText="是"
              onConfirm={this.onDelete.bind(this, record)}
            >
              <a style={{ color: 'green' }}>删除</a>
            </Popconfirm>
          </span>
          ),
      },
    ];

    return (
      <div>
        <div style={{ marginBottom: 8, textAlign: 'right' }}>
          <Button type="primary" style={{ marginRight: '4px' }} onClick={this.forAdd.bind(this)} size="large" icon="plus" >新增</Button>
        </div>
        <div style={{ marginBottom: 8 }}>
          <Table rowKey="id" pagination={false} bordered dataSource={data} columns={columns} />
        </div>
      </div>
    );
  }
}
export default connect(({ user }) => ({ user }))(AccountList);

