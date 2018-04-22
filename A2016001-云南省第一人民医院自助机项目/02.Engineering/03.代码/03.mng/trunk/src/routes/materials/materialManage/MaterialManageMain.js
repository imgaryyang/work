import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import Editor from './MaterialEditor';
import List from './MaterialList'; 

class MaterialManageMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['MARRIAGE_STATUS', 'SEX', 'NATION'],
    });
  }

  render() {
    const { spin, record } = this.props.material;
    return (
      <Spin spinning={spin} >
        <List />
        <Editor />
      </Spin>
    );
  }
}
export default connect(({ material }) => ({ material }))(MaterialManageMain); 

