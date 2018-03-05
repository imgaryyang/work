import React from 'react';
import { connect } from 'dva';
import { Spin, Row, Col } from 'antd';

import AppList from './OutStockDetail';


class OutputSummaryMain extends React.Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'outputSummary/load',
    });
  }
  render() {
    const { spin } = this.props.outputSummary;
    return (
      <Spin spinning={spin} >
        <Row>
          <Col style={{ backgroundColor: '#ffffff' }}><AppList /></Col>
        </Row>
      </Spin>
    );
  }
}
export default connect(({ outputSummary }) => ({ outputSummary }))(OutputSummaryMain);
