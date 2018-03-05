import React from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import InvList from './InventoryList';
import AppList from './InstockDetail';

const { Sider, Content } = Layout;

class InstockPlanMain extends React.Component {
  componentDidMount() {
    // 加载页面
    this.props.dispatch({
      type: 'instockPlan/loadApplyInPage',
    });
  }

  render() {
    const { isSpin } = this.props.instockPlan;
    return (
      <Spin spinning={isSpin} >
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={290} >
            <InvList />
          </Sider>
          <Content style={{ backgroundColor: '#ffffff' }}>
            <AppList />
          </Content>
        </Layout>
      </Spin>
    );
  }
}
export default connect(
  ({ instockPlan }) => ({ instockPlan }),
)(InstockPlanMain);
