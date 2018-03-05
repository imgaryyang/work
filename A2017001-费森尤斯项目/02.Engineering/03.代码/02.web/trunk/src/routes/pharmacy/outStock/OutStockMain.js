import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import InvList from './InventoryList';
import AppList from './OutStockDetail';
import BizPrintAlert from '../../../components/BizPrintAlert';

const { Sider, Content } = Layout;

class OutStockMain extends Component {
  componentWillMount() {
    // 加载页面
    this.props.dispatch({
      type: 'outStock/load',
    });
  }

  render() {
    const { spin } = this.props.outStock;
    return (
      <Spin spinning={spin} >
        <Layout>
          <Sider style={{ backgroundColor: '#ffffff', paddingRight: '4px' }} width={500} >
            <InvList />
          </Sider>
          <Content style={{ backgroundColor: '#ffffff' }}>
            <AppList />
          </Content>
        </Layout>
        {/* <Row>
          <Col span={10} style={{ backgroundColor: '#ffffff' }}><InvList /></Col>
          <Col span={14} style={{ backgroundColor: '#ffffff' }}><AppList /></Col>
        </Row>*/}
        <BizPrintAlert bizPrintAlertNamespace='outStock' bizPrintAlertParams={this.props.outStock.bizPrintAlertParams} />
      </Spin>
    );
  }
}

export default connect(
  ({ outStock }) => ({ outStock }),
)(OutStockMain);
