import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import List from './CheckList';
import Detail from './CheckDetail';
import ImpWin from './CheckRetDetailsImpWin';

class CheckMain extends Component {
  componentWillMount() {
  }

  render() {
    const { spin, checkRecord } = this.props.check;
    return (
      <Spin spinning={spin} >
        <List />
        <Detail />
        <ImpWin />
      </Spin>
    );
  }
}
export default connect(({ check }) => ({ check }))(CheckMain);

