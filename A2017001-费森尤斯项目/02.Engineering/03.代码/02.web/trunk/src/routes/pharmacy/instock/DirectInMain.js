import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import InvList from './DirectInventoryList';
import AppList from './DirectInList';
import BizPrintAlert from '../../../components/BizPrintAlert';

const { Sider, Content } = Layout;

class DirectInMain extends Component {
  render() {
    const { spin } = this.props.directIn;
    return (
      <Spin spinning={spin} >
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={290} >
            <InvList />
          </Sider>
          <Content style={{ backgroundColor: '#ffffff' }}>
            <AppList />
          </Content>
        </Layout>
        <BizPrintAlert bizPrintAlertNamespace='directIn' bizPrintAlertParams={this.props.directIn.bizPrintAlertParams} />
      </Spin>
    );
  }
}
export default connect(
  ({ directIn, base }) => ({ directIn, base }),
)(DirectInMain);
