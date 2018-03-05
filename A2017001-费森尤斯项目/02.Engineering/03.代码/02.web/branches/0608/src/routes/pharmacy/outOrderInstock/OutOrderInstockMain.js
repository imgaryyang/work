import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import OutOrderList from './OutOrderList';
import OutOrderDetail from './OutOrderDetail';

const { Sider, Content } = Layout;

class OutOrderInstockMain extends Component {
  componentWillMount() {
    const colNames = ['OUTPUT_STATE'];
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: colNames,
    });
  }

  render() {
    const { spin } = this.props.outOrderInstock;
    return (
      <Spin spinning={spin} >
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={290} >
            <OutOrderList />
          </Sider>
          <Content style={{ backgroundColor: '#ffffff' }}>
            <OutOrderDetail />
          </Content>
        </Layout>
      </Spin>
    );
  }
}
export default connect(({ utils, outOrderInstock }) => ({ utils, outOrderInstock }))(OutOrderInstockMain);
