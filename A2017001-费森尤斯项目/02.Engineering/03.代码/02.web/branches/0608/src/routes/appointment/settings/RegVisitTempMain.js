import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';
import List from './RegVisitTempList';
import Editor from './RegVisitTempEditor';
import OperBar from './RegVisitTempOperBar';
import SearchTree from './RegVisitTempTree';

const { Sider, Content } = Layout;

class RegvisitTempMain extends Component {

  render() {
    const { dispatch, base, utils } = this.props;
    const {
      data, page, isSpin, selectedRowKeys, namespace, formCache,
      visible, selectedType, searchObjs, treeData, activeWeek, controlParam,
    } = this.props.regVisitTemp;
    const { dicts, record } = utils;

    const setSearchObjs = (searchObj) => {
      dispatch({
        type: 'regVisitTemp/setSearchObjs',
        payload: searchObj,
      });
    };

    const listProps = {
      data,
      page,
      controlParam,
      base,
      utils,
      dispatch,
    };

    const editorProps = {
      record,
      dicts,
      activeWeek,
      isSpin,
      namespace,
      formCache,
      visible,
      controlParam,
      dispatch,
    };

    const searchTreeProps = {
      treeData,
      selectedType,
      searchObjs,
      setSearchObjs,
      dispatch,
    };

    const operBarProps = {
      activeWeek,
      searchObjs,
      selectedRowKeys,
      controlParam,
      setSearchObjs,
      dispatch,
    };

    return (
      <Spin spinning={isSpin}>
        <Layout style={{ overflow: 'hidden' }}>
          <Sider style={{ backgroundColor: '#fff' }}>
            <SearchTree {...searchTreeProps} />
          </Sider>
          <Content style={{ backgroundColor: '#fff', paddingLeft: 15 }}>
            <OperBar {...operBarProps} />
            <List {...listProps} />
          </Content>
          <Editor {...editorProps} />
        </Layout>
      </Spin>
    );
  }
}

export default connect(({ regVisitTemp, base, utils }) => ({ regVisitTemp, base, utils }))(RegvisitTempMain);
