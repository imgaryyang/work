import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import ProcureInstockList from './ProcureInstockList';
import ProcureInstockDetail from './ProcureInstockDetail';

const { Sider, Content } = Layout;

class procureDeptInstock extends Component {
  render() {
	const { isSpin } = this.props.procureDeptInstock;
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
      </Spin>
    );
  }
} 
export default connect(({ procureDeptInstock }) => ({ procureDeptInstock }))(procureDeptInstock);
