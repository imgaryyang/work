import React from 'react';
import { connect } from 'dva';
import { Spin, Row, Col } from 'antd';

import AppList from './InputInfoDetail';


class InputSummaryMain extends React.Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'matinputsummary/load',
    });
  }
  render() {
    const { spin } = this.props.matinputsummary;
    return (
      <Spin spinning={spin} >
        <Row>
          <Col style={{ backgroundColor: '#ffffff' }}><AppList /></Col>
        </Row>
      </Spin>
    );
  }
}
export default connect(({ matinputsummary }) => ({ matinputsummary }))(InputSummaryMain);
