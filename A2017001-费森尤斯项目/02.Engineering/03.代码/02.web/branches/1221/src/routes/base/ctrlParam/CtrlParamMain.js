import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';

import Editor from './CtrlParamEditor';
import List from './CtrlParamList';
import LeftTree from './CtrlParamTree';

const { Sider, Content } = Layout;

class CtrlParamMain extends Component {
  render() {
    const { spin, record } = this.props.ctrlParam;

    const editorProps = {
      record,
    };

    return (
      <Spin spinning={spin} >
        <div >
          <Layout>
            <Sider style={{ backgroundColor: '#ffffff' }} ><LeftTree /></Sider>
            <Content style={{ backgroundColor: '#ffffff' }} >{<List />}</Content>
          </Layout>
        </div>
        <Editor {...editorProps} />
      </Spin>
    );
  }
}
export default connect(({ ctrlParam }) => ({ ctrlParam }))(CtrlParamMain);
