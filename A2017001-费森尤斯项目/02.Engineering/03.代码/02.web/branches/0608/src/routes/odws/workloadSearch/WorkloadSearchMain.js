import React from 'react';
import { connect } from 'dva';
import { Spin, Row, Col } from 'antd';

import AppList from './WorkloadDetail';


class WorkloadSearchMain extends React.Component {

  componentWillMount() {
    this.props.dispatch({
      type: 'workloadSearch/load',
    });
  }
  render() {
    const { spin } = this.props.workloadSearch;
    return (
      <Spin spinning={spin} >
        <Row>
          <Col style={{ backgroundColor: '#ffffff' }}><AppList /></Col>
        </Row>
      </Spin>
    );
  }
}
export default connect(({ workloadSearch }) => ({ workloadSearch }))(WorkloadSearchMain);
