import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import Editor from './HospitalEditor';
import List from './HospitalList';
import LeftTree from './HospitalTree';

const { Sider, Content } = Layout;

class HospitalMain extends Component {

  render() {
    const { spin, record } = this.props.optHospital;

    return (
      <Spin spinning={spin} >
        <div>
          <Layout>
            <Sider style={{ backgroundColor: '#ffffff' }} ><LeftTree /></Sider>
            <Content style={{ backgroundColor: '#ffffff' }} ><List /></Content>
          </Layout>
        </div>
        <Editor data={record} />
      </Spin>
    );
  }
}
export default connect(({ optHospital }) => ({ optHospital }))(HospitalMain);
