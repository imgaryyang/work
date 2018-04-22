import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import List from './BatchList';
import Export from './BatchExport';

class BatchMain extends Component {
  componentWillMount() {
  }

  render() {
    const { spin, record } = this.props.cash;
    return (
      <Spin spinning={spin} >
        <List />
        <Export />
      </Spin>
    );
  }
}
export default connect(({ cash }) => ({ cash }))(BatchMain);

