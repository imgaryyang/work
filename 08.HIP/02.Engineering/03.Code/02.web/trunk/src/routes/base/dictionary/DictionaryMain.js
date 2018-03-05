import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import Editor from './DictionaryEditor';
import List from './DictionaryList';
import LeftTree from './DictionaryTree';

const { Sider, Content } = Layout;

class DictionaryMain extends Component {
  render() {
    const { spin, record } = this.props.dict;
    return (
      <Spin spinning={spin} >
        <div >
          <Layout>
            <Sider style={{ backgroundColor: '#ffffff' }} ><LeftTree /></Sider>
            <Content style={{ backgroundColor: '#ffffff' }} >{<List />}</Content>
          </Layout>
        </div>
        <Editor data={record} />
      </Spin>
    );
  }
}
export default connect(({ dict }) => ({ dict }))(DictionaryMain);

