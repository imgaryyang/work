import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import List from './MenuList';

class MenuMain extends Component {

  render() {
    const { spin } = this.props.mngMenu;

    return (
      <Spin spinning={spin} >
        <div >
          <List />
        </div>
      </Spin>
    );
  }
}
export default connect(
  ({ mngMenu }) => ({ mngMenu }),
)(MenuMain);

