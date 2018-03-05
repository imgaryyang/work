import React from 'react';
import { connect } from 'dva';
import { Spin, Row, Col } from 'antd';

import AppList from './OutStockDetail';


class OutputSummaryMain extends React.Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'matOutputSummary/load',
    });
  }
  render() {
    const { spin } = this.props.matOutputSummary;
    return (
      <Spin spinning={spin} >
        <Row>
          <Col style={{ backgroundColor: '#ffffff' }}><AppList /></Col>
        </Row>
      </Spin>
    );
  }
}
export default connect(({ matOutputSummary }) => ({ matOutputSummary }))(OutputSummaryMain);
