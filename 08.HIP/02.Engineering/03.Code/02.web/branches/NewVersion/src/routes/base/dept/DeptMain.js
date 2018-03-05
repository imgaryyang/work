import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import List from './DeptList';

class DeptMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['DEPT_TYPE'],
    });
    this.props.dispatch({
      type: 'department/initDicts',
    });
  }
  render() {
    const { spin } = this.props.department;
    return (
      <Spin spinning={spin} >
        <List />
      </Spin>
    );
  }
}
export default connect(({ department, utils }) => ({ department, utils }))(DeptMain);

