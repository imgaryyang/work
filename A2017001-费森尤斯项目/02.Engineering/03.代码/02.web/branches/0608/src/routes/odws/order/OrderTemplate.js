/**
 * 电子病历模板
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import AsyncChargePkgTree from '../../../components/AsyncChargePkgTree';

import styles from './Order.less';

class OrderTemplate extends Component {

  constructor(props) {
    super(props);
    this.chooseTemplate = this.chooseTemplate.bind(this);
  }

  chooseTemplate(tmpl) {
    console.log(tmpl);
    this.props.dispatch({
      type: 'odwsOrder/saveItemsByTmpl',
      payload: tmpl.id,
    });
  }

  render() {
    const { odws } = this.props;
    const { odwsWsHeight } = odws;

    return (
      <Card style={{ height: `${odwsWsHeight - 6}px` }} className={styles.tmpCard} >
        <AsyncChargePkgTree
          height={odwsWsHeight - 20}
          onSelect={this.chooseTemplate}
          busiClass="2"
        />
      </Card>
    );
  }
}

export default connect(
  ({ odws, odwsOrder, base }) => ({ odws, odwsOrder, base }),
)(OrderTemplate);

