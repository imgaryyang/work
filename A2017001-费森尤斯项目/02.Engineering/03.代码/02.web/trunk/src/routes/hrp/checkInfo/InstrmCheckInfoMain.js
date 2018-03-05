import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col } from 'antd';
import CheckSearchBar from './CheckSearchBar';
import List from './CheckList';

class CheckInfoMain extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDictTrees',
      payload: ['ASSETS_TYPE'],
    });
    this.props.dispatch({
      type: 'instrmCheckInfo/getBill',
    });
  }
  render() {
    const self = this;
    const { data, page, spin, searchObjs, bill } = this.props.instrmCheckInfo;
    const { dicts } = this.props.utils;

    const searchBarProps = {
      dicts,
      searchObjs,
      bill,
      setSearchObjs(searchObj) {
        self.props.dispatch({
          type: 'instrmCheckInfo/setSearchObjs',
          payload: searchObj,
        });
      },
      onSearch(values) {
        self.props.dispatch({
          type: 'instrmCheckInfo/load',
          payload: { query: values },
        });
      },
      finishCheck() {
        self.props.dispatch({ type: 'instrmCheckInfo/finishCheck' });
      },
      saveCheckInfo() {
        self.props.dispatch({ type: 'instrmCheckInfo/updateCheckInfo' });
      },
      deleteCheckInfo() {
        self.props.dispatch({ type: 'instrmCheckInfo/deleteCheckInfo' });
      },
      addCheckInfo() {
        self.props.dispatch({ type: 'instrmCheckInfo/addCheckInfo' });
      },
      createCheckInfo(instrmCode) {
        self.props.dispatch({ 
          type: 'instrmCheckInfo/createCheckInfo',
          payload: { 
            instrmCode: instrmCode,
            bill: bill,
          }, 
        });
      },
    };

    const listProps = {
      data,
      page,
      dicts,
      dispatch: self.props.dispatch,
      utils: this.props.utils,
    };
    return (
      <Spin spinning={spin}>
        <Row>
          <Col span={24} >
            <CheckSearchBar {...searchBarProps} />
            <List {...listProps} />
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default connect(({ instrmCheckInfo, utils }) => ({ instrmCheckInfo, utils }))(CheckInfoMain);
