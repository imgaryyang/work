import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import ProcurePlanList from './ProcurePlanList';
import ProcurePlanDetail from './ProcurePlanDetail';
import BuyDetailHis from './BuyDetailHis';

const { Sider, Content } = Layout;

class matProcureAuitdMain extends Component {

  render() {
    const { isSpin } = this.props.matProcureAuitd;
    return (
      <Spin spinning={isSpin} >
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={290} >
            <ProcurePlanList />
          </Sider>
          <Content style={{ backgroundColor: '#ffffff' }}>
            <ProcurePlanDetail />
            <BuyDetailHis />
          </Content>
        </Layout>
      </Spin>
    );
  }
}

export default connect(
  ({ matProcureAuitd }) => ({ matProcureAuitd }),
)(matProcureAuitdMain);
