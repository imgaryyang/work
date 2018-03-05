
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';

import SearchBar from './MatConsumSearchBar';
import List from './MatConsumList';

class MatConsumMain extends Component {

  componentWillMount() {
    const params = this.props.params;
    this.props.dispatch({
      type: 'financeStatistics/loadMatConsum',
      payload: {
        query: { dateRange: [moment(), moment()], chanel: params ? params.chanel : '' },
      },
    });
  }

  render() {
    const { matConsumSpin } = this.props.financeStatistics;
    const { wsHeight } = this.props.base;
    return (
      <Spin spinning={matConsumSpin}>
        <div style={{ height: `${wsHeight - 2}px`, overflow: 'hidden' }} >
          <SearchBar />
          <List />
        </div>
      </Spin>
    );
  }
}

export default connect(
  ({ financeStatistics, base }) => ({ financeStatistics, base }),
)(MatConsumMain);
