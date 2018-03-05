import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import InstockAuitdList from './InstockAuitdList';
import InstockAuitdDetail from './InstockAuitdDetail';


const { Sider, Content } = Layout;

class InstockAuitdMain extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { isSpin } = this.props.instockAuitd;
    return (
      <Spin spinning={isSpin} >
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={290} >
            <InstockAuitdList />
          </Sider>
          <Content style={{ backgroundColor: '#ffffff' }} >
            <InstockAuitdDetail />
          </Content>
        </Layout>
      </Spin>
    );
  }
}
export default connect(
  ({ instockAuitd }) => ({ instockAuitd }),
)(InstockAuitdMain);
