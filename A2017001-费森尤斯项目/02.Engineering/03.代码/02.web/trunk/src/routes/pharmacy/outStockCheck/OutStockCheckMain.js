import React from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import InvList from './InventoryList';
import AppList from './OutStockDetail';
import BizPrintAlert from '../../../components/BizPrintAlert';

const { Sider, Content } = Layout;

class OutStockCheckMain extends React.Component {
  componentWillMount() {
    // 加载页面
    this.props.dispatch({
      type: 'outStockCheck/loadAppIn',
    });
  }

  render() {
    const { spin } = this.props.outStockCheck;
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
        <BizPrintAlert bizPrintAlertNamespace='outStockCheck' bizPrintAlertParams={this.props.outStockCheck.bizPrintAlertParams} />
      </Spin>
    );
  }
}
export default connect(
  ({ outStockCheck }) => ({ outStockCheck }),
)(OutStockCheckMain);
