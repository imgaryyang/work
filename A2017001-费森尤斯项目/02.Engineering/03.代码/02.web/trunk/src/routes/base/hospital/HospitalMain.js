import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import Editor from './HospitalEditor';
import List from './HospitalList';

const { Sider, Content } = Layout;

class HospitalMain extends Component {

  render() {
    const { spin, record } = this.props.hospital;

    return (
      <Spin spinning={spin} >
        <div>
          <Layout>
            <Content style={{ backgroundColor: '#ffffff' }} ><List /></Content>
          </Layout>
        </div>
        <Editor data={record} />
      </Spin>
    );
  }
}
export default connect(({ hospital }) => ({ hospital }))(HospitalMain);
