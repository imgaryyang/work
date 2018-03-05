import React from 'react';
import { connect } from 'dva';
import { Spin, Row, Col } from 'antd';

import AppList from './OutStockDetail';


class OutputDetailInfoMain extends React.Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'hrpOutputDetailInfo/load',
    });
  }
  render() {
    const { spin } = this.props.hrpOutputDetailInfo;
    return (
      <Spin spinning={spin} >
        <Row>
          <Col style={{ backgroundColor: '#ffffff' }}><AppList /></Col>
        </Row>
      </Spin>
    );
  }
}
export default connect(({ hrpOutputDetailInfo }) => ({ hrpOutputDetailInfo }))(OutputDetailInfoMain);
