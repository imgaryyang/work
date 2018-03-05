import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import ProcurePlanList from './ProcurePlanList';
import ProcurePlanDetail from './ProcurePlanDetail';
import BuyDetailHis from './BuyDetailHis';
import BizPrintAlert from '../../../components/BizPrintAlert';

const { Sider, Content } = Layout;

class procureAuitdMain extends Component {

  render() {
    const { isSpin } = this.props.procureAuitd;
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
        <BizPrintAlert bizPrintAlertNamespace='procureAuitd' bizPrintAlertParams={this.props.procureAuitd.bizPrintAlertParams} />
      </Spin>
    );
  }
  
}

export default connect(
  ({ procureAuitd }) => ({ procureAuitd }),
)(procureAuitdMain);
