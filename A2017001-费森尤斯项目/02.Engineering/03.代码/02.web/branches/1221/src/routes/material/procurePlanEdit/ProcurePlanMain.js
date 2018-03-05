import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import ProcureDrugList from './ProcureMaterialList';
import ProcurePlanList from './ProcurePlanList';

const { Sider, Content } = Layout;

class ProcurePlanEditMain extends Component {

  render() {
    const { isSpin } = this.props.matProcurePlanEdit || {};
    return (
      <Spin spinning={isSpin} >
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={290}>
            <ProcureDrugList />
          </Sider>
          <Content style={{ backgroundColor: '#ffffff' }} >
            <ProcurePlanList />
          </Content>
        </Layout>
      </Spin>
    );
  }
}

export default connect(({ matProcurePlanEdit }) => ({ matProcurePlanEdit }))(ProcurePlanEditMain);
