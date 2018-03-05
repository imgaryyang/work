import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

import AppList from './OutStockDetail';


class OutputDetailInfoMain extends React.Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'outputDetailInfo/load',
    });
  }
  render() {
    const { spin } = this.props.outputDetailInfo;
    return (
      <Spin spinning={spin} >
        <AppList />
      </Spin>
    );
  }
}
export default connect(({ outputDetailInfo }) => ({ outputDetailInfo }))(OutputDetailInfoMain);
