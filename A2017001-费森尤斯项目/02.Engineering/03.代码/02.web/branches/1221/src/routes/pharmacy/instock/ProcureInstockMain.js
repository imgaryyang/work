import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import ProcureInstockList from './ProcureInstockList';
import ProcureInstockDetail from './ProcureInstockDetail';
import BizPrintAlert from '../../../components/BizPrintAlert';

const { Sider, Content } = Layout;

class procureInstockMain extends Component {
  render() {
    const { isSpin } = this.props.procureInstock;
    return (
      <Spin spinning={isSpin} >
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={290} >
            <ProcureInstockList />
          </Sider>
          <Content style={{ backgroundColor: '#ffffff' }}>
            <ProcureInstockDetail />
          </Content>
        </Layout>
        <BizPrintAlert bizPrintAlertNamespace="procureInstock" bizPrintAlertParams={this.props.procureInstock.bizPrintAlertParams} />
      </Spin>
    );
  }
}
export default connect(({ procureInstock }) => ({ procureInstock }))(procureInstockMain);
