import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Layout } from 'antd';
import List from './RegVisitList';
import Editor from './RegVisitEditor';
import SearchTree from './RegVisitTree';
import OperBar from './RegVisitOperBar';

const { Sider, Content } = Layout;

class RegVisitMain extends Component {

  render() {
    const { dispatch } = this.props;
    const {
      data, page, isSpin, record, activeWeek, selectedRowKeys, weekArray,
      activeDay, selectedType, searchObjs, treeData,
    } = this.props.regVisit;
    const { dicts, depts, deptsIdx } = this.props.utils;

    const setSearchObjs = (searchObj) => {
      dispatch({
        type: 'regVisit/setSearchObjs',
        payload: searchObj,
      });
    };

    const listProps = {
      data,
      page,
      dicts,
      depts,
      deptsIdx,
      dispatch,
    };

    const editorProps = {
      record,
      dicts,
      depts,
      deptsIdx,
      activeDay,
      searchObjs,
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
      weekArray,
      selectedRowKeys,
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

export default connect(({ regVisit, utils }) => ({ regVisit, utils }))(RegVisitMain);
