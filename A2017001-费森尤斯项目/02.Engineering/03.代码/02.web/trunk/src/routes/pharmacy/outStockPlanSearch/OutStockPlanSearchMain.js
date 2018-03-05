import React from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import InvList from './InventoryList';
import AppList from './OutStockDetail';

const { Sider, Content } = Layout;

class OutStockPlanSearchMain extends React.Component {
  componentWillMount() {
    // 加载页面
    this.props.dispatch({
      type: 'outStockPlan/loadAppIn',
    });
    // this.props.dispatch({
    //   type: 'outStockPlan/load',
    // });
  }

  render() {
    const { spin } = this.props.outStockPlan;
    return (
      <Spin spinning={spin} >
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={290} >
            <InvList />
          </Sider>
          <Content style={{ backgroundColor: '#ffffff' }}>
            <AppList />
          </Content>
        </Layout>
        {/* <Row gutter={16}>
          <Col className="gutter-row" span={7} style={{ backgroundColor: '#ffffff' }}><InvList /></Col>
          <Col className="gutter-row" span={17} style={{ backgroundColor: '#ffffff' }}><AppList /></Col>
        </Row>*/}
      </Spin>
    );
  }
}
export default connect(
  ({ outStockPlan }) => ({ outStockPlan }),
)(OutStockPlanSearchMain);
