import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Tabs } from 'antd';
import CheckInfoSearchBar from './CheckInfoSearchBar';
import CheckSearchBar from './CheckSearchBar';
import ListInfo from './CheckInfoList';
import List from './CheckList';

const TabPane = Tabs.TabPane;
class MatCheckInfoMain extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'matCheckInfo/load',
    });
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['MATERIAL_TYPE', 'CHECK_STATE'],
    });
    this.props.dispatch({
      type: 'matCheckInfo/getBill',
    });
  }
  render() {
    const self = this;
    const { data, page, spin, searchObjs, matCheckInfoSearchObjs, bill, matCheckInfoPage } = this.props.matCheckInfo;
    const { dicts } = this.props.utils;

    const searchBarProps = {
      dicts,
      searchObjs,
      bill,
      setSearchObjs(searchObj) {
        self.props.dispatch({
          type: 'matCheckInfo/setSearchObjs',
          payload: searchObj,
        });
      },
      onSearch(values) {
        self.props.dispatch({
          type: 'matCheckInfo/load',
          payload: { query: values },
        });
      },
      finishCheck() {
        self.props.dispatch({ type: 'matCheckInfo/finishCheck' });
      },
      saveCheckInfo() {
        self.props.dispatch({ type: 'matCheckInfo/updateCheckInfo' });
      },
      deleteCheckInfo() {
        self.props.dispatch({ type: 'matCheckInfo/deleteCheckInfo' });
      },
      addCheckInfo() {
        self.props.dispatch({ type: 'matCheckInfo/addCheckInfo' });
      },
    };

    const searCheckInfoBarProps = {
      dicts,
      matCheckInfoSearchObjs,
      setCheckInfoSearchObjs(searchObj) {
        self.props.dispatch({
          type: 'matCheckInfo/setCheckInfoSearchObjs',
          payload: searchObj,
        });
      },
      onSearch(values) {
        self.props.dispatch({
          type: 'matCheckInfo/loadCheckInfo',
          payload: { query: values },
        });
      },
    };
    const listProps = {
      data,
      page,
      dicts,
      matCheckInfoPage,
      dispatch: self.props.dispatch,
    };
    return (
      <Spin spinning={spin}>
        <Row>
          <Col span={24} >
            <Tabs defaultActiveKey="check" className="compact-tab" >
              <TabPane tab={'盘点'} key={'check'} >
                <CheckSearchBar {...searchBarProps} />
                <List {...listProps} />
              </TabPane>
              <TabPane tab={'盘点记录'} key={'record'} >
                <CheckInfoSearchBar {...searCheckInfoBarProps} />
                <ListInfo {...listProps} />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default connect(({ matCheckInfo, utils }) => ({ matCheckInfo, utils }))(MatCheckInfoMain);
