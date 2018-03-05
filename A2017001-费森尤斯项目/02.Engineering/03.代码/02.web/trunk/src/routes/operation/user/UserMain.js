import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import Editor from './UserEditor';
import List from './UserList';

class User4OptMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['MARRIAGE_STATUS', 'SEX', 'NATION', 'EMP_TYPE', 'POSI_CODE', 'LVL_CODE', 'EDU_CODE', 'OPER_LEVEL'],
    });

    // 查询医院列表数据
    this.props.dispatch({
      type: 'user4Opt/loadHosListData',
      payload: {
        query: {},
      },
    });
  }

  render() {
    const { spin } = this.props.user4Opt;
    // console.info('record : ', record);
    return (
      <Spin spinning={spin} >
        <List />
        <Editor />
      </Spin>
    );
  }
}
export default connect(({ user4Opt }) => ({ user4Opt }))(User4OptMain);

