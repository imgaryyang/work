import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col } from 'antd';

import Editor from './PatientEditor';
import List from './PatientList';
import styles from './Patient.less';

class PatientMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['NATIONALITY', 'NATION', 'LINK_RELATION', 'SEX', 'INFO_SOURCE', 'STOP_FLAG', 'INFECTIOUS_DISEASE', 'LEAVE_CAUSE', 'DIVISIONS'],
    });
  }

  render() {
    const { spin } = this.props.patient;
    return (
      <Spin spinning={spin} style={{ width: '100%', height: '100%' }} >
        <Row>
          <Col span={8} className={styles.leftCol} style={{ paddingRight: '15px' }} >
            <List />
          </Col>
          <Col span={16} className={styles.rightCol} >
            <Editor />
          </Col>
        </Row>
      </Spin>
    );
  }
}
export default connect(({ patient }) => ({ patient }))(PatientMain);

