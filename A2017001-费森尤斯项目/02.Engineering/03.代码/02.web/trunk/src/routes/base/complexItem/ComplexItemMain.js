import React, { Component } from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';

import LeftList from './ComplexItemLeftList';
import RightList from './ComplexItemList';

const { Sider, Content } = Layout;

class ComplexItemMain extends Component {
  render() {
    return (
      <Layout>
        <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={400} >
          <LeftList />
        </Sider>
        <Content style={{ backgroundColor: '#ffffff' }}>
          <RightList />
        </Content>
      </Layout>
    );
  }
}

export default connect(
  ({ complexItem }) => ({ complexItem }),
)(ComplexItemMain);
