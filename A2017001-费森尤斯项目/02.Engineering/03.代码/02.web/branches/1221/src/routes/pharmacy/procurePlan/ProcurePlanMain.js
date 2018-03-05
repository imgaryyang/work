import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import ProcureDrugList from './ProcureDrugList';
import ProcurePlanList from './ProcurePlanList';
import SetStockWarnForm from './SetStockWarn';
import BizPrintAlert from '../../../components/BizPrintAlert';

const { Sider, Content } = Layout;

class procurePlanMain extends Component {
	
  render() {
    const { isSpin } = this.props.procurePlan || {};
    
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
        <SetStockWarnForm />
        <BizPrintAlert bizPrintAlertNamespace='procurePlan' bizPrintAlertParams={this.props.procurePlan.bizPrintAlertParams} />
      </Spin>
    );
  }
}

export default connect(({ procurePlan }) => ({ procurePlan }))(procurePlanMain);
