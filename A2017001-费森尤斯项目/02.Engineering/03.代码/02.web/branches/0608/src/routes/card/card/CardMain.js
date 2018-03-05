import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

import List from './CardList';

class CardMain extends Component {
  componentWillMount() {
    this.props.dispatch({
      type: 'utils/initDicts',
      payload: ['CARD_FLAG', 'CARD_TYPE'],
    });
  }

  render() {
    const { spin } = this.props.card;
    return (
      <Spin spinning={spin} style={{ width: '100%', height: '100%' }} >
        <List />
      </Spin>
    );
  }
}
export default connect(({ card }) => ({ card }))(CardMain);

