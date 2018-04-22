import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import Editor from './UserEditor';
import List from './UserList';

class UserMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['MARRIAGE_STATUS', 'SEX', 'NATION'],
    });
  }

  render() {
    const { spin, record } = this.props.user;
    // console.info('record : ', record);
    return (
      <Spin spinning={spin} >
        <List />
        <Editor />
      </Spin>
    );
  }
}
export default connect(({ user }) => ({ user }))(UserMain);

