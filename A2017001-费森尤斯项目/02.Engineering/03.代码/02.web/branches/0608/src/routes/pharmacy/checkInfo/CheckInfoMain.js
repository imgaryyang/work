import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Tabs } from 'antd';
import CheckInfoSearchBar from './CheckInfoSearchBar';
import CheckSearchBar from './CheckSearchBar';
import ListInfo from './CheckInfoList';
import List from './CheckList';

const TabPane = Tabs.TabPane;
class CheckInfoMain extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'checkInfo/load',
    });
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['DRUG_TYPE', 'CHECK_STATE'],
    });
    this.props.dispatch({
      type: 'checkInfo/getBill',
    });
  }
  render() {
    const self = this;
    const { data, page, spin, searchObjs, checkInfoSearchObjs, bill, checkInfoPage } = this.props.checkInfo;
    const { dicts } = this.props.utils;

    const searchBarProps = {
      dicts,
      searchObjs,
      bill,
      setSearchObjs(searchObj) {
        self.props.dispatch({
          type: 'checkInfo/setSearchObjs',
          payload: searchObj,
        });
      },
      onSearch(values) {
        self.props.dispatch({
          type: 'checkInfo/load',
          payload: { query: values },
        });
      },
      finishCheck() {
        self.props.dispatch({ type: 'checkInfo/finishCheck' });
      },
      saveCheckInfo() {
        self.props.dispatch({ type: 'checkInfo/updateCheckInfo' });
      },
      deleteCheckInfo() {
        self.props.dispatch({ type: 'checkInfo/deleteCheckInfo' });
      },
      addCheckInfo() {
        self.props.dispatch({ type: 'checkInfo/addCheckInfo' });
      },
    };

    const searCheckInfoBarProps = {
      dicts,
      checkInfoSearchObjs,
      setCheckInfoSearchObjs(searchObj) {
        self.props.dispatch({
          type: 'checkInfo/setCheckInfoSearchObjs',
          payload: searchObj,
        });
      },
      onSearch(values) {
        self.props.dispatch({
          type: 'checkInfo/loadCheckInfo',
          payload: { query: values },
        });
      },
    };
    const listProps = {
      data,
      page,
      dicts,
      checkInfoPage,
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

export default connect(({ checkInfo, utils }) => ({ checkInfo, utils }))(CheckInfoMain);
