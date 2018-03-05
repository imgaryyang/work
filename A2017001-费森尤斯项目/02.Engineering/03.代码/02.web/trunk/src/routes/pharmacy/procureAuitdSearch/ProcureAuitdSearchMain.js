import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import ProcurePlanList from './ProcurePlanList';
import ProcurePlanDetail from './ProcurePlanDetail';

const { Sider, Content } = Layout;

class ProcureAuitdSearchMain extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { isSpin } = this.props.procureAuitdSearch;
    return (
      <Spin spinning={isSpin} >
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={350} >
            <ProcurePlanList />
          </Sider>
          <Content style={{ backgroundColor: '#ffffff' }} >
            <ProcurePlanDetail />
          </Content>
        </Layout>
      </Spin>
    );
  }
}
export default connect(
  ({ procureAuitdSearch }) => ({ procureAuitdSearch }),
)(ProcureAuitdSearchMain);

