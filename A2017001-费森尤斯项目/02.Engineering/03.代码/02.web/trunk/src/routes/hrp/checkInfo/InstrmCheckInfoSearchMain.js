import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col } from 'antd';
import CheckInfoSearchBar from './CheckInfoSearchBar';
import ListInfo from './CheckInfoList';

class CheckInfoMain extends Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDictTrees',
      payload: ['ASSETS_TYPE'],
    });
  }
  render() {
    const self = this;
    const { checkInfoData, page, spin, checkInfoSearchObjs, checkInfoPage } = this.props.instrmCheckInfo;
    const { dicts } = this.props.utils;

    const searCheckInfoBarProps = {
      dicts,
      checkInfoSearchObjs,
      setCheckInfoSearchObjs(searchObj) {
        self.props.dispatch({
          type: 'instrmCheckInfo/setCheckInfoSearchObjs',
          payload: searchObj,
        });
      },
      onSearch(values) {
        self.props.dispatch({
          type: 'instrmCheckInfo/loadCheckInfo',
          payload: { query: values },
        });
      },
    };
    const listProps = {
      checkInfoData,
      page,
      dicts,
      checkInfoPage,
      utils: this.props.utils,
      dispatch: self.props.dispatch,
    };
    return (
      <Spin spinning={spin}>
        <Row>
          <Col span={24} >
            <CheckInfoSearchBar {...searCheckInfoBarProps} />
            <ListInfo {...listProps} />
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default connect(({ instrmCheckInfo, utils }) => ({ instrmCheckInfo, utils }))(CheckInfoMain);
