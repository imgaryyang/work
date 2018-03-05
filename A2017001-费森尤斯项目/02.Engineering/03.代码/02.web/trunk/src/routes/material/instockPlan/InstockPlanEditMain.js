import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import LeftList from './InstockPlanEditMatList';
import RightList from './InstockPlanEditList';
import BizPrintAlert from '../../../components/BizPrintAlert';

const { Sider, Content } = Layout;

class InstockPlanEditMain extends Component {
  render() {
    const { isSpin, bizPrintAlertParams } = this.props.instockPlanEdit;
    return (
      <Spin spinning={isSpin} style={{ padding: '0', margin: '0' }} >
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={400} >
            <LeftList />
          </Sider>
          <Content style={{ backgroundColor: '#ffffff' }}>
            <RightList />
          </Content>
        </Layout>
        <BizPrintAlert bizPrintAlertNamespace="instockPlanEdit" bizPrintAlertParams={bizPrintAlertParams} />
      </Spin>
    );
  }
}

export default connect(
  ({ instockPlanEdit }) => ({ instockPlanEdit }),
)(InstockPlanEditMain);
