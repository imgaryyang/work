import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import Editor from './ItemInfoEditor';
import List from './ItemInfoList';
import OperBar from './ItemInfoOperBar';

class ItemInfoMain extends React.Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['CLASS_CODE', 'FEE_CODE', 'UNIT'],
    });

    this.props.dispatch({
      type: 'utils/initDepts',
    });

    this.props.dispatch({
      type: 'itemInfo/load',
    });
  }

  render() {
    const { spin } = this.props.itemInfo;

    return (
      <Spin spinning={spin} >
        <OperBar />
        <List />
        <Editor />
      </Spin>
    );
  }
}
export default connect(({ itemInfo }) => ({ itemInfo }))(ItemInfoMain);
