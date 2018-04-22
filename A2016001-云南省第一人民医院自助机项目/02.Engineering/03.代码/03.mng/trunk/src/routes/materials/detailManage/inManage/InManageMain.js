import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import InEditor from './InMaterialEditor';
import List from './InMaterialDetailList'; 

class OutManageMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['MARRIAGE_STATUS', 'SEX', 'NATION'],
    });
  }

  render() {
    const { spin, record } = this.props.inMaterialDetail;
    return (
      <Spin spinning={spin} >
        <List />
        <InEditor />
      </Spin>
    );
  }
}
export default connect(({ inMaterialDetail }) => ({ inMaterialDetail }))(OutManageMain); 

