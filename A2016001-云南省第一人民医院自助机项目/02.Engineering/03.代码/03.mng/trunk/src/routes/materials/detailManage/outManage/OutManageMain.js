import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import OutEditor from './OutMaterialEditor';
import List from './OutMaterialDetailList'; 
import Export from './OutDetailExport'; 
 
class OutManageMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['MARRIAGE_STATUS', 'SEX', 'NATION'],
    });
  }

  render() {
    const { spin, record } = this.props.outMaterialDetail;
    return (
      <Spin spinning={spin} >
        <List />
        <OutEditor />
        <Export />
      </Spin>
    );
  }
}
export default connect(({ outMaterialDetail }) => ({ outMaterialDetail }))(OutManageMain); 

