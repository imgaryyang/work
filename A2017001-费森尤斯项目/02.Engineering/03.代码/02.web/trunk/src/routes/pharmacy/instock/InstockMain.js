import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import InvList from './InstockInventoryList';
import AppList from './InstockApplyList';
import BizPrintAlert from '../../../components/BizPrintAlert';

const { Sider, Content } = Layout;

class InstockMain extends Component {
  render() {
    const { spin } = this.props.instock;
    return (
      <Spin spinning={spin} style={{ padding: '0', margin: '0' }} >
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={400} >
            <InvList />
          </Sider>
          <Content style={{ backgroundColor: '#ffffff' }}>
            <AppList />
          </Content>
        </Layout>
        <BizPrintAlert bizPrintAlertNamespace="instock" bizPrintAlertParams={this.props.instock.bizPrintAlertParams} />
      </Spin>
    );
  }
}

export default connect(
  ({ instock }) => ({ instock }),
)(InstockMain);
