import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import TroubleEditor from './TroubleDetailEditor';
import List from './TroubleDetailList'; 
import Export from './TroubleDetailExport'; 
import Export2 from './TroubleDetailExport2';
 
class TroubleDetailMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['MARRIAGE_STATUS', 'SEX', 'NATION'],
    });
  }

  render() {
    const { spin, record } = this.props.troubleDetail;
    return (
      <Spin spinning={spin} >
        <List />
        <TroubleEditor />
        <Export />
        <Export2 />
      </Spin>
    );
  }
}
export default connect(({ troubleDetail }) => ({ troubleDetail }))(TroubleDetailMain); 

