import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import InvList from './InventoryList';
import AppList from './OutStockDetail';

const { Sider, Content } = Layout;

class OutStockMain extends Component {
  componentWillMount() {
    // 加载页面
    this.props.dispatch({
      type: 'hrpOutputStock/load',
    });
  }
  render() {
    const { spin } = this.props.hrpOutputStock;
    return (
      <Spin spinning={spin} >
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={500} >
            <InvList />
          </Sider>
          <Content style={{ backgroundColor: '#ffffff' }}>
            <AppList />
          </Content>
        </Layout>
      </Spin>
    );
  }
}

export default connect(
  ({ hrpOutputStock }) => ({ hrpOutputStock }))(OutStockMain);
