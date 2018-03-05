import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import MaterialList from './MaterialList';
import ProcurePlanList from './ProcurePlanList';

const { Sider, Content } = Layout;

class procurePlanMain extends Component {

  render() {
    const { isSpin } = this.props.materialProcurePlan || {};
    return (
      <Spin spinning={isSpin} >
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={290}>
            <MaterialList />
          </Sider>
          <Content style={{ backgroundColor: '#ffffff' }} >
            <ProcurePlanList />
          </Content>
        </Layout>
      </Spin>
    );
  }
}

export default connect(({ materialProcurePlan }) => ({ materialProcurePlan }))(procurePlanMain);
