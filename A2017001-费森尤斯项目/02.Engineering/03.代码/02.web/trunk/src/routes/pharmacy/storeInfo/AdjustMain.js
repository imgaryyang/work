import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col } from 'antd';
import RightSearchBar from './AdjustRightSearchBar';
import List from './AdjustList';

class AdjustMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['DRUG_TYPE', 'DRUG_QUALITY'],
    });
    this.props.dispatch({
      type: 'utils/initDepts',
      payload: ['004', '005'],
    });
  }
  render() {
    const self = this;
    const { isSpin, adjustSearchObjs, data, page, record } = this.props.adjust;
    const { dicts } = this.props.utils;
    const rightSearchBarProps = {
      dicts,
      adjustSearchObjs,
      record,
      setSearchObjs(adjustSearchObj) {
        self.props.dispatch({
          type: 'adjust/setSearchObjs',
          payload: adjustSearchObj,
        });
      },
      onSearch(values) {
        self.props.dispatch({
          type: 'adjust/load',
          payload: { query: values },
        });
      },

      saveAdjust() {
        self.props.dispatch({
          type: 'adjust/save',
        });
      },
      setTag(tag) {
        self.props.dispatch({
          type: 'adjust/setState',
          payload: { selectedTag: tag },
        });
      },
    };

    const listProps = {
      dicts,
      data,
      page,
      dispatch: self.props.dispatch,
    };
    return (
      <Spin spinning={isSpin}>
        <Row>
          <Col span={24} >
            <RightSearchBar {...rightSearchBarProps} />
            <List {...listProps} />
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default connect(({ adjust, utils }) => ({ adjust, utils }))(AdjustMain);
