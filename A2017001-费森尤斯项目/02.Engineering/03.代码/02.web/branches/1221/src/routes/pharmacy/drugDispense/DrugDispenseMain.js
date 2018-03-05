/**
 * 药房发药
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col } from 'antd';

import DrugFormulationList from './DrugFormulationList';
import DrugFormulationItemList from './DrugFormulationItemList';

import styles from './DrugDispense.less';

class DrugDispenseMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['SEX', 'FEE_TYPE', 'APPLY_STATE', 'USAGE'],
    });
  }

  render() {
    const { spin } = this.props.drugDispense;
    return (
      <Spin spinning={spin} style={{ width: '100%', height: '100%' }} >
        <Row>
          <Col span={8} className={styles.leftCol} >
            <DrugFormulationList />
          </Col>
          <Col span={16} className={styles.rightCol} >
            <DrugFormulationItemList />
          </Col>
        </Row>
      </Spin>
    );
  }
}
export default connect(
  ({ drugDispense }) => ({ drugDispense }),
)(DrugDispenseMain);

